import { PolymarketEvent, PolymarketMarket, DexToken, DexPair } from './types'

export async function fetchPolymarketEvents(): Promise<PolymarketEvent[]> {
  try {
    const res = await fetch(
      'https://gamma-api.polymarket.com/events?active=true&closed=false&limit=30',
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error('Failed to fetch events')
    return await res.json()
  } catch {
    return []
  }
}

export async function fetchPolymarketEvent(slug: string): Promise<PolymarketEvent | null> {
  try {
    const res = await fetch(
      `https://gamma-api.polymarket.com/events?slug=${slug}&limit=1`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error('Failed to fetch event')
    const data = await res.json()
    return data[0] ?? null
  } catch {
    return null
  }
}

export async function fetchPolymarketEventById(id: string): Promise<PolymarketEvent | null> {
  try {
    const res = await fetch(
      `https://gamma-api.polymarket.com/events?id=${id}&limit=1`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error('Failed to fetch event')
    const data = await res.json()
    return data[0] ?? null
  } catch {
    return null
  }
}

export async function fetchBoostedTokens(): Promise<DexToken[]> {
  try {
    const res = await fetch(
      'https://api.dexscreener.com/token-boosts/latest/v1',
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error('Failed to fetch tokens')
    const tokens: DexToken[] = await res.json()
    // Filter to Base chain only
    return tokens.filter(t => t.chainId === 'base')
  } catch {
    return []
  }
}

export async function fetchTokenProfiles(): Promise<DexToken[]> {
  try {
    const res = await fetch(
      'https://api.dexscreener.com/token-profiles/latest/v1',
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error('Failed to fetch profiles')
    const tokens: DexToken[] = await res.json()
    // Filter to Base chain only
    return tokens.filter(t => t.chainId === 'base')
  } catch {
    return []
  }
}

export async function fetchTokenPairs(chainId: string, address: string): Promise<DexPair[]> {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/tokens/v1/${chainId}/${address}`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error('Failed to fetch token pairs')
    return await res.json()
  } catch {
    return []
  }
}

export function formatUsd(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  return `$${n.toFixed(2)}`
}

export function formatNumber(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return n.toFixed(0)
}

export function parseOutcomePrices(market: { outcomePrices?: string }): [number, number] {
  try {
    const prices = JSON.parse(market.outcomePrices || '["0.5","0.5"]')
    return [parseFloat(prices[0]), parseFloat(prices[1])]
  } catch {
    return [0.5, 0.5]
  }
}

export function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

/**
 * Get the best market from an event - prefer first open market with real prices,
 * fall back to first market with non-resolved prices, then any market.
 */
export function getBestMarket(event: PolymarketEvent): PolymarketMarket | null {
  if (!event.markets?.length) return null

  // Prefer open markets with actual prices (not 0/1 resolved)
  const openWithPrices = event.markets.find((m) => {
    if (m.closed) return false
    const [yes, no] = parseOutcomePrices(m)
    return yes > 0.01 && no > 0.01 && yes < 0.99 && no < 0.99
  })
  if (openWithPrices) return openWithPrices

  // Fall back to any open market
  const anyOpen = event.markets.find((m) => !m.closed)
  if (anyOpen) return anyOpen

  // Fall back to first market with non-resolved prices
  const withPrices = event.markets.find((m) => {
    const [yes, no] = parseOutcomePrices(m)
    return yes > 0.01 && no > 0.01 && yes < 0.99 && no < 0.99
  })
  if (withPrices) return withPrices

  return event.markets[0]
}

/** Priority tags to use as categories */
const CATEGORY_TAGS = [
  'Politics', 'Crypto', 'Finance', 'Sports', 'Tech', 'Science',
  'Business', 'Culture', 'Economy', 'World', 'Entertainment',
  'AI', 'Climate', 'Health', 'Elections', 'Stocks', 'IPOs',
]

/**
 * Derive a category from event tags or title keywords
 */
export function getEventCategory(event: PolymarketEvent): string {
  // Try tags first
  if (event.tags?.length) {
    // Find a priority tag
    for (const cat of CATEGORY_TAGS) {
      const match = event.tags.find((t) => t.label.toLowerCase() === cat.toLowerCase())
      if (match) return match.label
    }
    // Use first tag label
    return event.tags[0].label
  }

  // Keyword fallback
  const t = event.title.toLowerCase()
  if (t.includes('bitcoin') || t.includes('crypto') || t.includes('ethereum') || t.includes('btc')) return 'Crypto'
  if (t.includes('election') || t.includes('president') || t.includes('trump') || t.includes('congress')) return 'Politics'
  if (t.includes('stock') || t.includes('ipo') || t.includes('market')) return 'Finance'
  if (t.includes('sport') || t.includes('nfl') || t.includes('nba') || t.includes('soccer')) return 'Sports'
  if (t.includes('ai') || t.includes('openai') || t.includes('google')) return 'Tech'
  return 'Other'
}

/**
 * Check if an event has at least one non-resolved market
 */
export function isActiveEvent(event: PolymarketEvent): boolean {
  return event.markets?.some((m) => {
    if (m.closed) return false
    const [yes, no] = parseOutcomePrices(m)
    // Filter out fully resolved (0/100 or 100/0)
    return !(yes <= 0.01 && no >= 0.99) && !(yes >= 0.99 && no <= 0.01)
  }) ?? false
}

export function cleanMarketTitle(title: string, market?: { question?: string; groupItemTitle?: string }): string {
  // If we have a specific market question that's better, use it
  if (market?.question && !market.question.includes('___') && !market.question.endsWith('by...?')) {
    return market.question
  }
  
  // Clean up the event title
  let cleaned = title
    .replace(/\s+by\s+___\s*\??\s*$/i, '?')
    .replace(/\s+by\.\.\.\??\s*$/i, '?')
    .replace(/\s+___\s*\??\s*$/i, '?')
    .replace(/\?\?/g, '?')
  
  // If still has weird endings, clean more
  if (cleaned.endsWith(' ?')) {
    cleaned = cleaned.replace(/ \?$/, '?')
  }
  
  return cleaned
}
