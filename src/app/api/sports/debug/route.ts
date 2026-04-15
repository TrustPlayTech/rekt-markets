import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.ODDS_API_KEY
  const results: Record<string, unknown> = {
    hasApiKey: !!apiKey,
    keyPrefix: apiKey ? apiKey.substring(0, 8) + '...' : null,
    timestamp: new Date().toISOString(),
  }

  if (!apiKey) {
    return NextResponse.json({ ...results, error: 'ODDS_API_KEY not set' })
  }

  // Test 1: Free /sports endpoint
  try {
    const sportsRes = await fetch(`https://api.the-odds-api.com/v4/sports?apiKey=${apiKey}`)
    const remaining = sportsRes.headers.get('x-requests-remaining')
    const used = sportsRes.headers.get('x-requests-used')
    
    if (!sportsRes.ok) {
      results.sportsError = `${sportsRes.status} ${sportsRes.statusText}`
      const body = await sportsRes.text()
      results.sportsBody = body.substring(0, 500)
    } else {
      const sports = await sportsRes.json()
      const active = sports.filter((s: { active: boolean; has_outrights: boolean }) => s.active && !s.has_outrights)
      results.totalSports = sports.length
      results.activeSports = active.length
      results.activeSportKeys = active.map((s: { key: string }) => s.key)
      results.creditsRemaining = remaining
      results.creditsUsed = used
    }
  } catch (err) {
    results.sportsException = String(err)
  }

  // Test 2: One sport odds (basketball_nba)
  try {
    const oddsRes = await fetch(`https://api.the-odds-api.com/v4/sports/basketball_nba/odds?apiKey=${apiKey}&regions=us&markets=h2h&dateFormat=iso`)
    const remaining = oddsRes.headers.get('x-requests-remaining')
    
    if (!oddsRes.ok) {
      results.oddsError = `${oddsRes.status} ${oddsRes.statusText}`
      const body = await oddsRes.text()
      results.oddsBody = body.substring(0, 500)
    } else {
      const events = await oddsRes.json()
      results.nbaEventCount = events.length
      results.nbaFirstEvent = events[0] ? { id: events[0].id, home: events[0].home_team, away: events[0].away_team } : null
      results.creditsRemainingAfterOdds = remaining
    }
  } catch (err) {
    results.oddsException = String(err)
  }

  return NextResponse.json(results)
}
