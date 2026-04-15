import { NextResponse } from 'next/server'
import { createPublicClient, createWalletClient, http, type Address } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import { SPORTS_MARKETS, type SportsMarketEntry } from '@/lib/sports-registry'
import { BinaryMarketABI } from '@/lib/contracts'

const ODDS_API_KEY = process.env.ODDS_API_KEY
const DEPLOYER_KEY = process.env.DEPLOYER_PRIVATE_KEY
const RPC = process.env.RPC_URL || 'https://base-sepolia.g.alchemy.com/v2/qHJU5KP9m1kmtzADnJSdT'

interface ScoreEntry {
  name: string
  score: string
}

interface GameScore {
  id: string
  completed: boolean
  scores: ScoreEntry[] | null
}

export async function GET(request: Request) {
  // Auth check (simple bearer token or cron secret)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!ODDS_API_KEY || !DEPLOYER_KEY) {
    return NextResponse.json({ error: 'Missing env vars' }, { status: 500 })
  }

  const account = privateKeyToAccount(DEPLOYER_KEY as `0x${string}`)
  const transport = http(RPC)
  const publicClient = createPublicClient({ chain: baseSepolia, transport })
  const walletClient = createWalletClient({ account, chain: baseSepolia, transport })

  const unresolved = SPORTS_MARKETS.filter(m => !m.resolved)
  if (unresolved.length === 0) {
    return NextResponse.json({ message: 'No unresolved markets', resolved: 0 })
  }

  // Group by sport
  const bySport: Record<string, SportsMarketEntry[]> = {}
  for (const m of unresolved) {
    if (!bySport[m.sportKey]) bySport[m.sportKey] = []
    bySport[m.sportKey].push(m)
  }

  const results: { game: string; result: string }[] = []

  for (const [sportKey, markets] of Object.entries(bySport)) {
    // Fetch scores
    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/${sportKey}/scores/?apiKey=${ODDS_API_KEY}&daysFrom=3`
    )
    if (!res.ok) continue

    const scores: GameScore[] = await res.json()
    const completed = scores.filter(g => g.completed)

    for (const market of markets) {
      const game = completed.find(g => g.id === market.gameId)
      if (!game || !game.scores) continue

      const homeScore = game.scores.find(s => s.name === market.homeTeam)
      const awayScore = game.scores.find(s => s.name === market.awayTeam)
      if (!homeScore || !awayScore) continue

      const homeWins = parseInt(homeScore.score) > parseInt(awayScore.score)
      const marketAddr = market.marketAddress as Address

      // Check if already resolved on-chain
      const alreadyResolved = await publicClient.readContract({
        address: marketAddr,
        abi: BinaryMarketABI,
        functionName: 'resolved',
      })
      if (alreadyResolved) {
        market.resolved = true
        results.push({ game: `${market.homeTeam} vs ${market.awayTeam}`, result: 'already resolved' })
        continue
      }

      // Check resolution time
      const resolutionTime = await publicClient.readContract({
        address: marketAddr,
        abi: BinaryMarketABI,
        functionName: 'resolutionTime',
      })
      if (Date.now() / 1000 < Number(resolutionTime)) {
        results.push({ game: `${market.homeTeam} vs ${market.awayTeam}`, result: 'too early' })
        continue
      }

      // Resolve
      try {
        const hash = await walletClient.writeContract({
          address: marketAddr,
          abi: BinaryMarketABI,
          functionName: 'resolve',
          args: [homeWins],
        })
        await publicClient.waitForTransactionReceipt({ hash })
        market.resolved = true
        results.push({
          game: `${market.homeTeam} vs ${market.awayTeam}`,
          result: `resolved: ${homeWins ? 'home wins' : 'away wins'} (tx: ${hash})`
        })
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        results.push({ game: `${market.homeTeam} vs ${market.awayTeam}`, result: `error: ${msg}` })
      }
    }
  }

  return NextResponse.json({
    checked: unresolved.length,
    results,
  })
}
