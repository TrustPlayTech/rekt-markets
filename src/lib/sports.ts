// Sports data - uses OddsClient singleton for caching
// Re-exports types and helpers for the frontend

import { getOddsClient, type OddsEvent, type Bookmaker, type Market, type Outcome } from './odds-client'

// Re-export as the types the frontend expects
export type SportsEvent = OddsEvent & {
  completed?: boolean
  scores?: { name: string; score: string }[] | null
}
export type { Bookmaker as OddsBookmaker, Market as OddsMarket, Outcome as OddsOutcome }

export interface Sport {
  key: string
  group: string
  title: string
  description: string
  active: boolean
  has_outrights: boolean
}

export type SportCategory = 'all' | 'live' | 'basketball' | 'soccer' | 'mma' | 'baseball' | 'icehockey' | 'americanfootball' | 'tennis' | 'boxing' | 'cricket' | 'golf' | 'rugbyleague' | 'aussierules'

export const SPORT_CATEGORIES: { key: SportCategory; label: string; emoji: string }[] = [
  { key: 'all', label: 'All', emoji: '🔥' },
  { key: 'live' as SportCategory, label: 'Live', emoji: '🔴' },
  { key: 'basketball', label: 'Basketball', emoji: '🏀' },
  { key: 'soccer', label: 'Football', emoji: '⚽' },
  { key: 'mma', label: 'MMA', emoji: '🥊' },
  { key: 'baseball', label: 'Baseball', emoji: '⚾' },
  { key: 'icehockey', label: 'Ice Hockey', emoji: '🏒' },
  { key: 'americanfootball', label: 'American Football', emoji: '🏈' },
  { key: 'tennis', label: 'Tennis', emoji: '🎾' },
  { key: 'boxing', label: 'Boxing', emoji: '🥊' },
  { key: 'cricket', label: 'Cricket', emoji: '🏏' },
  { key: 'golf', label: 'Golf', emoji: '⛳' },
  { key: 'rugbyleague', label: 'Rugby', emoji: '🏉' },
  { key: 'aussierules', label: 'Aussie Rules', emoji: '🏉' },
]

export function getSportEmoji(sportKey: string): string {
  if (sportKey.includes('basketball')) return '🏀'
  if (sportKey.includes('soccer') || (sportKey.includes('football') && !sportKey.includes('american'))) return '⚽'
  if (sportKey.includes('mma')) return '🥊'
  if (sportKey.includes('boxing')) return '🥊'
  if (sportKey.includes('baseball')) return '⚾'
  if (sportKey.includes('icehockey')) return '🏒'
  if (sportKey.includes('americanfootball')) return '🏈'
  if (sportKey.includes('tennis')) return '🎾'
  if (sportKey.includes('cricket')) return '🏏'
  if (sportKey.includes('golf')) return '⛳'
  if (sportKey.includes('rugby')) return '🏉'
  if (sportKey.includes('aussierules')) return '🏉'
  return '🏆'
}

export function getSportCategory(sportKey: string): SportCategory {
  if (sportKey.includes('basketball')) return 'basketball'
  if (sportKey.includes('soccer') || (sportKey.includes('football') && !sportKey.includes('american'))) return 'soccer'
  if (sportKey.includes('mma')) return 'mma'
  if (sportKey.includes('baseball')) return 'baseball'
  if (sportKey.includes('icehockey')) return 'icehockey'
  if (sportKey.includes('americanfootball')) return 'americanfootball'
  if (sportKey.includes('tennis')) return 'tennis'
  if (sportKey.includes('boxing')) return 'boxing'
  if (sportKey.includes('cricket')) return 'cricket'
  if (sportKey.includes('golf')) return 'golf'
  if (sportKey.includes('rugby')) return 'rugbyleague'
  if (sportKey.includes('aussierules')) return 'aussierules'
  return 'all'
}

export function getSportLabel(sportKey: string): string {
  const map: Record<string, string> = {
    'basketball_nba': 'NBA',
    'basketball_ncaab': 'NCAAB',
    'basketball_wncaab': 'WNCAAB',
    'basketball_nba_preseason': 'NBA Pre',
    'basketball_wnba': 'WNBA',
    'basketball_euroleague': 'Euroleague',
    'basketball_nbl': 'NBL',
    'soccer_epl': 'EPL',
    'soccer_spain_la_liga': 'La Liga',
    'soccer_germany_bundesliga': 'Bundesliga',
    'soccer_italy_serie_a': 'Serie A',
    'soccer_france_ligue_one': 'Ligue 1',
    'soccer_uefa_champs_league': 'UCL',
    'soccer_uefa_europa_league': 'Europa League',
    'soccer_uefa_europa_conference_league': 'Conference League',
    'soccer_usa_mls': 'MLS',
    'soccer_sweden_allsvenskan': 'Allsvenskan',
    'soccer_efl_champ': 'Championship',
    'soccer_brazil_campeonato': 'Brasileirao',
    'soccer_netherlands_eredivisie': 'Eredivisie',
    'soccer_portugal_primeira_liga': 'Primeira Liga',
    'soccer_turkey_super_league': 'Super Lig',
    'soccer_australia_aleague': 'A-League',
    'soccer_argentina_primera_division': 'Argentina Primera',
    'soccer_belgium_first_div': 'Belgian First Div',
    'soccer_denmark_superliga': 'Superliga',
    'soccer_norway_eliteserien': 'Eliteserien',
    'soccer_switzerland_superleague': 'Swiss Super League',
    'soccer_austria_bundesliga': 'Austrian Bundesliga',
    'soccer_poland_ekstraklasa': 'Ekstraklasa',
    'soccer_greece_super_league': 'Super League Greece',
    'soccer_spl': 'Scottish Premiership',
    'soccer_fifa_club_world_cup': 'Club World Cup',
    'mma_mixed_martial_arts': 'MMA',
    'baseball_mlb': 'MLB',
    'baseball_mlb_preseason': 'MLB Pre',
    'baseball_ncaa': 'NCAA Baseball',
    'icehockey_nhl': 'NHL',
    'icehockey_sweden_hockey_league': 'SHL',
    'icehockey_sweden_allsvenskan': 'HockeyAllsvenskan',
    'icehockey_liiga': 'Liiga',
    'americanfootball_nfl': 'NFL',
    'americanfootball_ncaaf': 'NCAAF',
    'americanfootball_ufl': 'UFL',
    'americanfootball_cfl': 'CFL',
    'tennis_atp_miami_open': 'ATP Miami',
    'tennis_wta_miami_open': 'WTA Miami',
    'tennis_atp_indian_wells': 'ATP Indian Wells',
    'tennis_wta_indian_wells': 'WTA Indian Wells',
    'tennis_atp_aus_open_singles': 'ATP Australian Open',
    'tennis_wta_aus_open_singles': 'WTA Australian Open',
    'tennis_atp_french_open': 'ATP French Open',
    'tennis_wta_french_open': 'WTA French Open',
    'tennis_atp_wimbledon': 'ATP Wimbledon',
    'tennis_wta_wimbledon': 'WTA Wimbledon',
    'tennis_atp_us_open': 'ATP US Open',
    'tennis_wta_us_open': 'WTA US Open',
    'tennis_atp_italian_open': 'ATP Italian Open',
    'tennis_wta_italian_open': 'WTA Italian Open',
    'tennis_atp_madrid_open': 'ATP Madrid Open',
    'tennis_wta_madrid_open': 'WTA Madrid Open',
    'tennis_atp_monte_carlo_masters': 'ATP Monte Carlo',
    'boxing_boxing': 'Boxing',
    'cricket_ipl': 'IPL',
    'cricket_international_t20': 'T20',
    'cricket_test_match': 'Test Matches',
    'cricket_odi': 'ODI',
    'cricket_big_bash': 'Big Bash',
    'rugbyleague_nrl': 'NRL',
    'aussierules_afl': 'AFL',
    'golf_masters_tournament_winner': 'Masters',
    'golf_pga_championship_winner': 'PGA Championship',
    'handball_germany_bundesliga': 'Handball Bundesliga',
  }
  return map[sportKey] || sportKey.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
}

export function decimalOddsToCents(odds: number): number {
  if (odds <= 1) return 50
  return Math.round(100 / odds)
}

// Mock data fallback
function generateMockData(): SportsEvent[] {
  const now = new Date()
  const today = (h: number, m: number) => {
    const d = new Date(now)
    d.setHours(h, m, 0, 0)
    return d.toISOString()
  }
  const tomorrow = (h: number, m: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() + 1)
    d.setHours(h, m, 0, 0)
    return d.toISOString()
  }
  const dayAfter = (h: number, m: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() + 2)
    d.setHours(h, m, 0, 0)
    return d.toISOString()
  }

  const mkBookmaker = (h2h: [number, number], spreads?: { points: [number, number]; prices: [number, number] }, totals?: { point: number; prices: [number, number] }): Bookmaker[] => {
    const markets: Market[] = [
      { key: 'h2h', outcomes: [{ name: 'HOME', price: h2h[0] }, { name: 'AWAY', price: h2h[1] }] },
    ]
    if (spreads) {
      markets.push({
        key: 'spreads',
        outcomes: [
          { name: 'HOME', price: spreads.prices[0], point: spreads.points[0] },
          { name: 'AWAY', price: spreads.prices[1], point: spreads.points[1] },
        ],
      })
    }
    if (totals) {
      markets.push({
        key: 'totals',
        outcomes: [
          { name: 'Over', price: totals.prices[0], point: totals.point },
          { name: 'Under', price: totals.prices[1], point: totals.point },
        ],
      })
    }
    return [{ key: 'fanduel', title: 'FanDuel', markets }]
  }

  return [
    {
      id: 'nba-1', sport_key: 'basketball_nba', sport_title: 'NBA',
      commence_time: today(23, 30), home_team: 'Boston Celtics', away_team: 'Milwaukee Bucks',
      bookmakers: mkBookmaker([1.65, 2.30], { points: [-4.5, 4.5], prices: [1.91, 1.91] }, { point: 224.5, prices: [1.87, 1.95] }),
    },
    {
      id: 'nba-2', sport_key: 'basketball_nba', sport_title: 'NBA',
      commence_time: tomorrow(0, 0), home_team: 'Los Angeles Lakers', away_team: 'Golden State Warriors',
      bookmakers: mkBookmaker([2.10, 1.75], { points: [3.5, -3.5], prices: [1.93, 1.89] }, { point: 231.5, prices: [1.91, 1.91] }),
    },
    {
      id: 'epl-1', sport_key: 'soccer_epl', sport_title: 'EPL',
      commence_time: tomorrow(15, 0), home_team: 'Arsenal', away_team: 'Manchester City',
      bookmakers: mkBookmaker([2.40, 2.90], undefined, { point: 2.5, prices: [1.80, 2.05] }),
    },
    {
      id: 'ufc-1', sport_key: 'mma_mixed_martial_arts', sport_title: 'UFC',
      commence_time: dayAfter(22, 0), home_team: 'Islam Makhachev', away_team: 'Charles Oliveira',
      bookmakers: mkBookmaker([1.45, 2.80]),
    },
  ].map(e => {
    const bm = e.bookmakers[0]
    bm.markets.forEach(m => {
      if (m.key === 'h2h' || m.key === 'spreads') {
        m.outcomes[0].name = e.home_team
        m.outcomes[1].name = e.away_team
      }
    })
    return e
  })
}

// Main entry point - used by the sports page server component
export async function getSportsEvents(): Promise<SportsEvent[]> {
  const client = getOddsClient()

  if (client) {
    try {
      const events = await client.getAllSportsOdds()
      console.log(`[Sports] Fetched ${events.length} events from Odds API`)
      if (events.length > 0) return events
    } catch (err) {
      console.error('[Sports] API fetch failed:', err)
    }
  }

  return generateMockData()
}

// Export for use by individual sport page routes
export async function getSportEvents(sportKey: string): Promise<SportsEvent[]> {
  const client = getOddsClient()
  if (!client) return []
  return client.getSportOdds(sportKey)
}
