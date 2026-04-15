#!/usr/bin/env node
/**
 * Auto-resolve sports markets by checking game scores via The Odds API.
 * 
 * Usage: node scripts/resolve-sports-markets.mjs [--dry-run]
 */

import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REGISTRY_PATH = join(__dirname, '..', 'src', 'lib', 'sports-registry.json')

const RPC = process.env.RPC_URL || 'https://base-sepolia.g.alchemy.com/v2/qHJU5KP9m1kmtzADnJSdT'
const DEPLOYER_KEY = process.env.DEPLOYER_PRIVATE_KEY
if (!DEPLOYER_KEY) { console.error('Error: DEPLOYER_PRIVATE_KEY env var required'); process.exit(1) }
const ODDS_API_KEY = process.env.ODDS_API_KEY || '4a5b20e39b6b8012dd7586a4bfc0bae2'

const dryRun = process.argv.includes('--dry-run')

const BinaryMarketABI = [
  { type: 'function', name: 'resolve', inputs: [{ name: '_yesWins', type: 'bool' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'resolved', inputs: [], outputs: [{ type: 'bool' }], stateMutability: 'view' },
  { type: 'function', name: 'resolutionTime', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
]

const account = privateKeyToAccount(DEPLOYER_KEY)
const transport = http(RPC)
const publicClient = createPublicClient({ chain: baseSepolia, transport })
const walletClient = createWalletClient({ account, chain: baseSepolia, transport })

async function fetchScores(sportKey) {
  const url = `https://api.the-odds-api.com/v4/sports/${sportKey}/scores/?apiKey=${ODDS_API_KEY}&daysFrom=3`
  const res = await fetch(url)
  if (!res.ok) {
    console.error(`Failed to fetch scores for ${sportKey}: ${res.status}`)
    return []
  }
  return res.json()
}

async function main() {
  console.log('=== Sports Market Resolver ===')
  if (dryRun) console.log('DRY RUN MODE')
  console.log('')

  const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8'))
  const unresolved = registry.markets.filter(m => !m.resolved)
  
  if (unresolved.length === 0) {
    console.log('No unresolved markets')
    return
  }
  
  console.log(`${unresolved.length} unresolved markets`)
  
  // Group by sport
  const bySport = {}
  for (const m of unresolved) {
    if (!bySport[m.sportKey]) bySport[m.sportKey] = []
    bySport[m.sportKey].push(m)
  }
  
  for (const [sportKey, markets] of Object.entries(bySport)) {
    console.log(`\nChecking ${sportKey} (${markets.length} markets)...`)
    const scores = await fetchScores(sportKey)
    const completedGames = scores.filter(g => g.completed)
    console.log(`  ${completedGames.length} completed games`)
    
    for (const market of markets) {
      const game = completedGames.find(g => g.id === market.gameId)
      if (!game) {
        console.log(`  ${market.homeTeam} vs ${market.awayTeam}: game not completed yet`)
        continue
      }
      
      // Determine winner
      const homeScore = game.scores?.find(s => s.name === market.homeTeam)
      const awayScore = game.scores?.find(s => s.name === market.awayTeam)
      
      if (!homeScore || !awayScore) {
        console.log(`  ${market.homeTeam} vs ${market.awayTeam}: scores not found in API response`)
        continue
      }
      
      const homeWins = parseInt(homeScore.score) > parseInt(awayScore.score)
      console.log(`  ${market.homeTeam} ${homeScore.score} - ${awayScore.score} ${market.awayTeam} => ${homeWins ? 'HOME WINS (YES)' : 'AWAY WINS (NO)'}`)
      
      // Check on-chain state
      const alreadyResolved = await publicClient.readContract({
        address: market.marketAddress,
        abi: BinaryMarketABI,
        functionName: 'resolved',
      })
      
      if (alreadyResolved) {
        console.log(`    Already resolved on-chain, updating registry`)
        market.resolved = true
        continue
      }
      
      // Check if resolution time has passed
      const resolutionTime = await publicClient.readContract({
        address: market.marketAddress,
        abi: BinaryMarketABI,
        functionName: 'resolutionTime',
      })
      
      const now = Math.floor(Date.now() / 1000)
      if (now < Number(resolutionTime)) {
        console.log(`    Resolution time not reached yet (${new Date(Number(resolutionTime) * 1000).toISOString()})`)
        continue
      }
      
      if (dryRun) {
        console.log(`    DRY RUN: Would resolve with yesWins=${homeWins}`)
        continue
      }
      
      // Resolve
      try {
        console.log(`    Resolving with yesWins=${homeWins}...`)
        const hash = await walletClient.writeContract({
          address: market.marketAddress,
          abi: BinaryMarketABI,
          functionName: 'resolve',
          args: [homeWins],
        })
        await publicClient.waitForTransactionReceipt({ hash })
        console.log(`    Resolved! Tx: ${hash}`)
        market.resolved = true
      } catch (e) {
        console.error(`    Resolution failed: ${e.message}`)
      }
    }
  }
  
  // Save updated registry
  writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2))
  console.log('\nRegistry updated')
}

main().catch(console.error)
