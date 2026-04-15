#!/usr/bin/env node
/**
 * Deploy a new MarketFactory with treasury support to Base Sepolia.
 * Usage: node scripts/deploy-factory.mjs
 */
import { createPublicClient, createWalletClient, http, encodeDeployData } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const RPC = 'https://base-sepolia.g.alchemy.com/v2/qHJU5KP9m1kmtzADnJSdT'
const DEPLOYER_KEY = ''
const USDC = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
const TREASURY = '0xBeA133eBCa0F66d1eB68fE5485edc419096A5b72'

const account = privateKeyToAccount(DEPLOYER_KEY)
const transport = http(RPC)

const publicClient = createPublicClient({ chain: baseSepolia, transport })
const walletClient = createWalletClient({ account, chain: baseSepolia, transport })

async function main() {
  console.log('Deployer:', account.address)
  
  // Compile with forge first, then read artifact
  console.log('Reading compiled artifact...')
  const artifactPath = join(__dirname, '..', 'contracts', 'out', 'MarketFactory.sol', 'MarketFactory.json')
  const artifact = JSON.parse(readFileSync(artifactPath, 'utf-8'))
  const bytecode = artifact.bytecode.object
  const abi = artifact.abi
  
  console.log('Deploying MarketFactory...')
  const hash = await walletClient.deployContract({
    abi,
    bytecode,
    args: [USDC, TREASURY],
  })
  
  console.log('Tx hash:', hash)
  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  console.log('MarketFactory deployed at:', receipt.contractAddress)
  console.log('Status:', receipt.status)
}

main().catch(console.error)
