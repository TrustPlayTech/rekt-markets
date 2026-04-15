/**
 * The Odds API client with aggressive in-memory caching.
 * Adapted from Henry's working implementation.
 *
 * Budget: 20,000 credits/month
 * Strategy:
 * - /sports: free, cache 24h
 * - /odds (per sport): 1 credit per region per market, cache 2h, on-demand
 * - /scores (for resolution): 1 credit, targeted near game end, cache 15min
 * - Track remaining credits via response headers
 */

export interface Sport {
  key: string
  group: string
  title: string
  description: string
  active: boolean
  has_outrights: boolean
}

export interface Outcome {
  name: string
  price: number
  point?: number
}

export interface Market {
  key: string
  outcomes: Outcome[]
}

export interface Bookmaker {
  key: string
  title: string
  markets: Market[]
}

export interface OddsEvent {
  id: string
  sport_key: string
  sport_title: string
  commence_time: string
  home_team: string
  away_team: string
  bookmakers: Bookmaker[]
}

export interface Score {
  id: string
  sport_key: string
  commence_time: string
  home_team: string
  away_team: string
  completed: boolean
  scores: { name: string; score: string }[] | null
}

interface CacheEntry<T> {
  data: T
  fetchedAt: number
  ttl: number
}

// Excluded sport key patterns (outrights, winners, politics)
const EXCLUDED_PATTERNS = [
  '_winner', '_championship', 'super_bowl', 'world_series',
  '_cup_winner', 'political', 'politics',
]

function shouldExclude(key: string): boolean {
  return EXCLUDED_PATTERNS.some(p => key.includes(p))
}

class OddsClient {
  private baseUrl = 'https://api.the-odds-api.com/v4'
  private apiKey: string
  private cache = new Map<string, CacheEntry<unknown>>()
  private creditsRemaining: number = 20000
  private creditsUsed: number = 0

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /** Get all in-season sports. FREE (no credits). Cache: 24 hours. */
  async getSports(): Promise<Sport[]> {
    return this.cachedFetch<Sport[]>(
      'sports',
      `${this.baseUrl}/sports?apiKey=${this.apiKey}`,
      24 * 60 * 60 * 1000, // 24h
    )
  }

  /** Get active sports (filtered). FREE. */
  async getActiveSports(): Promise<Sport[]> {
    const all = await this.getSports()
    return all.filter(s => s.active && !s.has_outrights && !shouldExclude(s.key))
  }

  /** Get odds for a specific sport. 1 credit per region per market. Cache: 2 hours. */
  async getSportOdds(sportKey: string, region: string = 'us'): Promise<OddsEvent[]> {
    return this.cachedFetch<OddsEvent[]>(
      `sport:${sportKey}:${region}`,
      `${this.baseUrl}/sports/${sportKey}/odds?apiKey=${this.apiKey}&regions=${region}&markets=h2h,spreads,totals&dateFormat=iso`,
      2 * 60 * 60 * 1000, // 2h
    )
  }

  /** Get scores for a specific sport. 1 credit. Cache: 15 minutes. */
  async getScores(sportKey: string, daysFrom: number = 1): Promise<Score[]> {
    return this.cachedFetch<Score[]>(
      `scores:${sportKey}:${daysFrom}`,
      `${this.baseUrl}/sports/${sportKey}/scores?apiKey=${this.apiKey}&daysFrom=${daysFrom}&dateFormat=iso`,
      15 * 60 * 1000, // 15min
    )
  }

  /** Get credit usage stats. */
  getCredits(): { remaining: number; used: number } {
    return { remaining: this.creditsRemaining, used: this.creditsUsed }
  }

  /** Fetch all sports odds (for homepage). Discovers active sports, then fetches each. */
  async getAllSportsOdds(): Promise<OddsEvent[]> {
    const activeSports = await this.getActiveSports()
    console.log(`[OddsAPI] ${activeSports.length} active sports:`, activeSports.map(s => s.key).join(', '))

    // With 100K plan: all active sports fit comfortably
    // 80 sports * 3 credits * 12 updates/day * 30 days = ~86,400 credits/month
    const sportsToFetch = activeSports

    const results = await Promise.allSettled(
      sportsToFetch.map(sport => this.getSportOdds(sport.key))
    )

    const allEvents: OddsEvent[] = []
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (result.status === 'fulfilled' && result.value.length > 0) {
        // Ensure sport_title is set
        const sport = sportsToFetch[i]
        allEvents.push(...result.value.map(e => ({
          ...e,
          sport_title: e.sport_title || sport.title,
        })))
      }
    }

    console.log(`[OddsAPI] ${allEvents.length} total events across ${sportsToFetch.length} sports`)
    return allEvents
  }

  // ==========================================
  // INTERNAL
  // ==========================================

  private async cachedFetch<T>(cacheKey: string, url: string, ttl: number): Promise<T> {
    // Check cache
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.fetchedAt < cached.ttl) {
      return cached.data as T
    }

    // Fetch
    const res = await fetch(url)

    // Track credits from response headers
    const remaining = res.headers.get('x-requests-remaining')
    const used = res.headers.get('x-requests-used')
    if (remaining) this.creditsRemaining = parseInt(remaining)
    if (used) this.creditsUsed = parseInt(used)

    if (!res.ok) {
      // If rate limited or error, return stale cache if available
      if (cached) {
        console.warn(`[OddsAPI] Error ${res.status} for ${cacheKey}, returning stale cache`)
        return cached.data as T
      }
      throw new Error(`Odds API error: ${res.status} ${res.statusText}`)
    }

    const data = await res.json() as T

    // Store in cache
    this.cache.set(cacheKey, { data, fetchedAt: Date.now(), ttl })

    console.log(`[OddsAPI] ${cacheKey}: fetched, credits remaining: ${this.creditsRemaining}`)

    return data
  }
}

// Module-level singleton: survives across requests in the same serverless instance
let _client: OddsClient | null = null

export function getOddsClient(): OddsClient | null {
  const apiKey = process.env.ODDS_API_KEY
  if (!apiKey) return null

  if (!_client) {
    _client = new OddsClient(apiKey)
    console.log('[OddsAPI] Client initialized')
  }
  return _client
}
