import { NextResponse } from 'next/server'
import { SPORTS_MARKETS, getMarketForGame } from '@/lib/sports-registry'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const gameId = searchParams.get('gameId')

  if (gameId) {
    const market = getMarketForGame(gameId)
    if (market) {
      return NextResponse.json(market)
    }
    return NextResponse.json({ error: 'No market for this game' }, { status: 404 })
  }

  // Return all markets
  return NextResponse.json({ markets: SPORTS_MARKETS })
}
