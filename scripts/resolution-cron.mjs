#!/usr/bin/env node
/**
 * Resolution Cron Service
 * 
 * Runs continuously, checking for markets to resolve every 15 minutes.
 * - Sports markets: auto-resolves from The Odds API scores
 * - Prediction markets: flags for manual resolution via Safe
 * 
 * Usage: node scripts/resolution-cron.mjs
 * 
 * Required env vars:
 *   DEPLOYER_PRIVATE_KEY - wallet key authorized to resolve markets
 *   ODDS_API_KEY - The Odds API key for scores
 *   RPC_URL - Base RPC endpoint (defaults to Base Sepolia)
 */

import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia, base } from 'viem/chains'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REGISTRY_PATH = join(__dirname, '..', 'src', 'lib', 'sports-registry.json')
const LOG_PATH = join(__dirname, '..', 'resolution-cron.log')

// Config
const INTERVAL_MS = 15 * 60 * 1000 // 15 minutes
const RPC = process.env.RPC_URL || 'https://base-sepolia.g.alchemy.com/v2/qHJU5KP9m1kmtzADnJSdT'
const DEPLOYER_KEY = process.env.DEPLOYER_PRIVATE_KEY
const ODDS_API_KEY = process.env.ODDS_API_KEY || '4a5b20e39b6b8012dd7586a4bfc0bae2'
const IS_MAINNET = RPC.includes('mainnet')
const CHAIN = IS_MAINNET ? base : baseSepolia

if (!DEPLOYER_KEY) {
  console.error('DEPLOYER_PRIVATE_KEY env var required')
  process.exit(1)
}

const account = privateKeyToAccount(DEPLOYER_KEY)
const publicClient = createPublicClient({ chain: CHAIN, transport: http(RPC) })
const walletClient = createWalletClient({ account, chain: CHAIN, transport: http(RPC) })

const BinaryMarketABI = [
  { type: 'function', name: 'resolve', inputs: [{ name: '_yesWins', type: 'bool' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'resolved', inputs: [], outputs: [{ type: 'bool' }], stateMutability: 'view' },
  { type: 'function', name: 'resolutionTime', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'question', inputs: [], outputs: [{ type: 'string' }], stateMutability: 'view' },
]

function log(msg) {
  const ts = new Date().toISOString()
  const line = `[${ts}] ${msg}`
  console.log(line)
  try {
    writeFileSync(LOG_PATH, line + '\n', { flag: 'a' })
  } catch {}
}

function heartbeat() {
  const ts = new Date().toISOString()
  try {
    writeFileSync(join(__dirname, '..', '.resolution-heartbeat'), ts)
  } catch {}
}

// Fetch game scores from The Odds API
async function fetchScores(sportKey) {
  try {
    const url = `https://api.the-odds-api.com/v4/sports/${sportKey}/scores/?apiKey=${ODDS_API_KEY}&daysFrom=3`
    const res = await fetch(url)
    if (!res.ok) return []
    return await res.json()
  } catch (err) {
    log(`ERROR fetching scores for ${sportKey}: ${err.message}`)
    return []
  }
}

// Determine winner from scores
function determineWinner(scores, homeTeam) {
  if (!scores || scores.length < 2) return null
  
  const home = scores.find(s => s.name === homeTeam)
  const away = scores.find(s => s.name !== homeTeam)
  
  if (!home || !away || home.score === null || away.score === null) return null
  
  const homeScore = parseInt(home.score)
  const awayScore = parseInt(away.score)
  
  if (isNaN(homeScore) || isNaN(awayScore)) return null
  
  // For moneyline: YES = home wins
  return homeScore > awayScore // true = home wins (YES), false = away wins (NO)
}

// Resolve a single sports market
async function resolveSportsMarket(entry) {
  const { gameId, sportKey, homeTeam, awayTeam, marketAddress, resolved: registryResolved } = entry
  
  if (registryResolved) return false
  
  // Check if already resolved on-chain
  try {
    const isResolved = await publicClient.readContract({
      address: marketAddress,
      abi: BinaryMarketABI,
      functionName: 'resolved',
    })
    if (isResolved) {
      log(`Market ${marketAddress.slice(0, 10)}... already resolved on-chain`)
      return true // Mark as resolved in registry
    }
  } catch (err) {
    log(`ERROR reading resolved state for ${marketAddress.slice(0, 10)}...: ${err.message}`)
    return false
  }
  
  // Check if resolution time has passed
  try {
    const resTime = await publicClient.readContract({
      address: marketAddress,
      abi: BinaryMarketABI,
      functionName: 'resolutionTime',
    })
    const now = BigInt(Math.floor(Date.now() / 1000))
    if (now < resTime) {
      // Not time yet
      return false
    }
  } catch (err) {
    log(`ERROR reading resolutionTime for ${marketAddress.slice(0, 10)}...: ${err.message}`)
    return false
  }
  
  // Fetch scores
  const allScores = await fetchScores(sportKey)
  const game = allScores.find(g => g.id === gameId)
  
  if (!game) {
    log(`Game ${gameId} not found in scores API`)
    return false
  }
  
  if (!game.completed) {
    log(`Game ${homeTeam} vs ${awayTeam} not yet completed`)
    return false
  }
  
  const yesWins = determineWinner(game.scores, homeTeam)
  if (yesWins === null) {
    log(`Could not determine winner for ${homeTeam} vs ${awayTeam}`)
    return false
  }
  
  // Resolve on-chain
  log(`RESOLVING: ${homeTeam} vs ${awayTeam} → ${yesWins ? 'HOME WINS (YES)' : 'AWAY WINS (NO)'}`)
  
  try {
    const hash = await walletClient.writeContract({
      address: marketAddress,
      abi: BinaryMarketABI,
      functionName: 'resolve',
      args: [yesWins],
    })
    
    log(`TX submitted: ${hash}`)
    
    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    log(`TX confirmed: ${hash} (block ${receipt.blockNumber}, status ${receipt.status})`)
    
    return true // Mark as resolved
  } catch (err) {
    log(`ERROR resolving ${marketAddress.slice(0, 10)}...: ${err.message}`)
    return false
  }
}

// Main resolution loop
async function runResolutionCycle() {
  log('--- Resolution cycle starting ---')
  heartbeat()
  
  // Load sports registry
  let registry = { markets: [] }
  if (existsSync(REGISTRY_PATH)) {
    try {
      registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8'))
    } catch (err) {
      log(`ERROR reading registry: ${err.message}`)
    }
  }
  
  let updatedCount = 0
  
  for (const entry of registry.markets) {
    if (entry.resolved) continue
    
    const wasResolved = await resolveSportsMarket(entry)
    if (wasResolved) {
      entry.resolved = true
      updatedCount++
    }
  }
  
  // Save updated registry
  if (updatedCount > 0) {
    try {
      writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2))
      log(`Updated registry: ${updatedCount} markets resolved`)
    } catch (err) {
      log(`ERROR writing registry: ${err.message}`)
    }
  }
  
  const unresolved = registry.markets.filter(m => !m.resolved).length
  log(`--- Cycle complete. ${updatedCount} resolved this cycle, ${unresolved} still pending ---`)
}

// Start the cron loop
async function main() {
  log(`=== Resolution Cron Started ===`)
  log(`RPC: ${RPC.slice(0, 50)}...`)
  log(`Chain: ${IS_MAINNET ? 'Base Mainnet' : 'Base Sepolia'}`)
  log(`Resolver: ${account.address}`)
  log(`Interval: ${INTERVAL_MS / 1000}s`)
  log(`Registry: ${REGISTRY_PATH}`)
  
  // Run immediately
  await runResolutionCycle()
  
  // Then every 15 minutes
  setInterval(async () => {
    try {
      await runResolutionCycle()
    } catch (err) {
      log(`FATAL ERROR in resolution cycle: ${err.message}`)
    }
  }, INTERVAL_MS)
}

main().catch(err => {
  log(`FATAL: ${err.message}`)
  process.exit(1)
})
