#!/usr/bin/env node
/**
 * Create on-chain BinaryMarket contracts for upcoming sports games.
 * Fetches games from The Odds API, creates markets via MarketFactory,
 * and writes the mapping to src/lib/sports-registry.json.
 *
 * Usage: node scripts/create-sports-markets.mjs [--sport basketball_nba] [--limit 10] [--seed 5]
 *
 * Env vars (or hardcoded for testnet):
 *   ODDS_API_KEY, DEPLOYER_PRIVATE_KEY, RPC_URL
 */

import { createPublicClient, createWalletClient, http, parseUnits, formatUnits } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REGISTRY_PATH = join(__dirname, '..', 'src', 'lib', 'sports-registry.json')

// Config
const RPC = process.env.RPC_URL || 'https://base-sepolia.g.alchemy.com/v2/qHJU5KP9m1kmtzADnJSdT'
const DEPLOYER_KEY = process.env.DEPLOYER_PRIVATE_KEY
if (!DEPLOYER_KEY) { console.error('Error: DEPLOYER_PRIVATE_KEY env var required'); process.exit(1) }
const ODDS_API_KEY = process.env.ODDS_API_KEY || '4a5b20e39b6b8012dd7586a4bfc0bae2'
const MARKET_FACTORY = '0x830c877c59EDfFFBBfdeaAbfd7936C3970c3f8E5'
const USDC = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'

// Parse args
const args = process.argv.slice(2)
const getArg = (name) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : null
}
const sportFilter = getArg('sport') // e.g. 'basketball_nba'
const limit = parseInt(getArg('limit') || '10')
const seedAmount = parseInt(getArg('seed') || '0') // USDC to seed each market (0 = no seed)

// ABIs
const MarketFactoryABI = [
  {
    type: 'function', name: 'createMarket',
    inputs: [{ name: 'question', type: 'string' }, { name: 'resolutionTime', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'nonpayable'
  },
  { type: 'function', name: 'getMarketCount', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  {
    type: 'event', name: 'MarketCreated',
    inputs: [
      { name: 'market', type: 'address', indexed: true },
      { name: 'question', type: 'string', indexed: false },
      { name: 'creator', type: 'address', indexed: true }
    ]
  },
]

const ERC20ABI = [
  { type: 'function', name: 'approve', inputs: [{name: 'spender', type: 'address'}, {name: 'amount', type: 'uint256'}], outputs: [{type: 'bool'}], stateMutability: 'nonpayable' },
  { type: 'function', name: 'balanceOf', inputs: [{name: 'account', type: 'address'}], outputs: [{type: 'uint256'}], stateMutability: 'view' },
]

const BinaryMarketABI = [
  { type: 'function', name: 'seed', inputs: [{ name: 'amount', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
]

// Setup
const account = privateKeyToAccount(DEPLOYER_KEY)
const transport = http(RPC)
const publicClient = createPublicClient({ chain: baseSepolia, transport })
const walletClient = createWalletClient({ account, chain: baseSepolia, transport })

async function fetchUpcomingGames(sports) {
  const allGames = []
  
  for (const sport of sports) {
    console.log(`Fetching ${sport}...`)
    const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=h2h&oddsFormat=decimal`
    const res = await fetch(url)
    if (!res.ok) {
      console.error(`  Failed: ${res.status} ${res.statusText}`)
      continue
    }
    const games = await res.json()
    console.log(`  Found ${games.length} games`)
    
    // Filter to upcoming games (commence_time in future)
    const now = Date.now()
    const upcoming = games.filter(g => new Date(g.commence_time).getTime() > now)
    console.log(`  ${upcoming.length} upcoming`)
    allGames.push(...upcoming)
  }
  
  return allGames
}

async function createMarket(game) {
  const question = `[${game.id}] Will ${game.home_team} win vs ${game.away_team}?`
  // Resolution time: game start + 6 hours (covers OT, delays)
  const commenceTs = Math.floor(new Date(game.commence_time).getTime() / 1000)
  const resolutionTime = BigInt(commenceTs + 6 * 3600)
  
  console.log(`Creating market: ${question}`)
  console.log(`  Resolution time: ${new Date(Number(resolutionTime) * 1000).toISOString()}`)
  
  const { request } = await publicClient.simulateContract({
    account,
    address: MARKET_FACTORY,
    abi: MarketFactoryABI,
    functionName: 'createMarket',
    args: [question, resolutionTime],
  })
  
  const hash = await walletClient.writeContract(request)
  console.log(`  Tx: ${hash}`)
  
  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  
  // Parse MarketCreated event to get market address
  const event = receipt.logs.find(log => {
    try {
      return log.address.toLowerCase() === MARKET_FACTORY.toLowerCase()
    } catch { return false }
  })
  
  // The market address is in the first indexed topic (after event sig)
  const marketAddress = event ? '0x' + event.topics[1].slice(26) : null
  
  if (!marketAddress) {
    console.error('  Could not parse market address from logs')
    return null
  }
  
  console.log(`  Market deployed: ${marketAddress}`)
  return marketAddress
}

async function seedMarket(marketAddress, amount) {
  const usdcAmount = parseUnits(amount.toString(), 6)
  
  // Approve USDC
  console.log(`  Approving ${amount} USDC for ${marketAddress}...`)
  const approveHash = await walletClient.writeContract({
    address: USDC,
    abi: ERC20ABI,
    functionName: 'approve',
    args: [marketAddress, usdcAmount],
  })
  await publicClient.waitForTransactionReceipt({ hash: approveHash })
  
  // Seed
  console.log(`  Seeding ${amount} USDC...`)
  const seedHash = await walletClient.writeContract({
    address: marketAddress,
    abi: BinaryMarketABI,
    functionName: 'seed',
    args: [usdcAmount],
  })
  await publicClient.waitForTransactionReceipt({ hash: seedHash })
  console.log(`  Seeded!`)
}

async function main() {
  console.log('=== Sports Market Creator ===')
  console.log(`Deployer: ${account.address}`)
  console.log(`Factory: ${MARKET_FACTORY}`)
  console.log(`Limit: ${limit} markets`)
  console.log(`Seed: ${seedAmount} USDC per market`)
  console.log('')
  
  // Check balances
  const ethBalance = await publicClient.getBalance({ address: account.address })
  console.log(`ETH balance: ${formatUnits(ethBalance, 18)}`)
  
  if (seedAmount > 0) {
    const usdcBalance = await publicClient.readContract({
      address: USDC,
      abi: ERC20ABI,
      functionName: 'balanceOf',
      args: [account.address],
    })
    console.log(`USDC balance: ${formatUnits(usdcBalance, 6)}`)
    if (usdcBalance < parseUnits((seedAmount * limit).toString(), 6)) {
      console.warn('WARNING: May not have enough USDC to seed all markets')
    }
  }
  console.log('')
  
  // Determine which sports to fetch
  const defaultSports = ['basketball_nba', 'icehockey_nhl', 'soccer_epl', 'baseball_mlb']
  const sports = sportFilter ? [sportFilter] : defaultSports
  
  // Fetch games
  const games = await fetchUpcomingGames(sports)
  if (games.length === 0) {
    console.log('No upcoming games found')
    return
  }
  
  // Load existing registry
  let registry
  try {
    registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8'))
  } catch {
    registry = { factoryAddress: MARKET_FACTORY, markets: [] }
  }
  
  // Filter out games that already have markets
  const existingGameIds = new Set(registry.markets.map(m => m.gameId))
  const newGames = games.filter(g => !existingGameIds.has(g.id))
  console.log(`${newGames.length} new games (${existingGameIds.size} already have markets)`)
  
  // Create markets
  const toCreate = newGames.slice(0, limit)
  console.log(`Creating ${toCreate.length} markets...\n`)
  
  for (const game of toCreate) {
    try {
      const marketAddress = await createMarket(game)
      if (!marketAddress) continue
      
      const entry = {
        gameId: game.id,
        sportKey: game.sport_key,
        homeTeam: game.home_team,
        awayTeam: game.away_team,
        commenceTime: game.commence_time,
        marketAddress,
        marketType: 'h2h',
        resolved: false,
        seeded: false,
        createdAt: new Date().toISOString(),
      }
      
      // Seed if requested
      if (seedAmount > 0) {
        try {
          await seedMarket(marketAddress, seedAmount)
          entry.seeded = true
        } catch (e) {
          console.error(`  Seed failed: ${e.message}`)
        }
      }
      
      registry.markets.push(entry)
      
      // Write after each market (in case script crashes)
      writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2))
      console.log('')
    } catch (e) {
      console.error(`Failed to create market for ${game.home_team} vs ${game.away_team}: ${e.message}`)
      console.log('')
    }
  }
  
  console.log(`\n=== Done! Created ${toCreate.length} markets ===`)
  console.log(`Registry: ${REGISTRY_PATH}`)
  console.log(`Markets:`)
  registry.markets.forEach(m => {
    console.log(`  ${m.homeTeam} vs ${m.awayTeam}: ${m.marketAddress}`)
  })
}

main().catch(console.error)
