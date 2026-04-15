// Sports Market Registry
// Maps Odds API game IDs to on-chain BinaryMarket addresses
// Populated by scripts/create-sports-markets.mjs

import registryData from './sports-registry.json'

export interface SportsMarketEntry {
  gameId: string          // The Odds API event ID
  sportKey: string        // e.g. 'basketball_nba'
  homeTeam: string
  awayTeam: string
  commenceTime: string    // ISO timestamp
  marketAddress: string   // On-chain BinaryMarket address
  marketType: 'h2h'       // moneyline for now
  resolved: boolean
  seeded: boolean
  createdAt: string
}

// Load from JSON (populated by create-sports-markets script)
export const SPORTS_MARKETS: SportsMarketEntry[] = registryData.markets as SportsMarketEntry[]

// Look up market address by Odds API game ID
export function getMarketForGame(gameId: string): SportsMarketEntry | undefined {
  return SPORTS_MARKETS.find(m => m.gameId === gameId)
}

// Get all unresolved markets
export function getUnresolvedMarkets(): SportsMarketEntry[] {
  return SPORTS_MARKETS.filter(m => !m.resolved)
}

// Check if a market exists for a game
export function hasMarketForGame(gameId: string): boolean {
  return SPORTS_MARKETS.some(m => m.gameId === gameId)
}
