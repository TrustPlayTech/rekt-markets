'use client'

import { useState } from 'react'
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatUnits, parseUnits, type Address } from 'viem'
import { useConnectOrWaitlist } from '@/components/ConnectOrWaitlist'
import { Loader2, CheckCircle, ChevronDown, ChevronUp, Coins } from 'lucide-react'
import {
  TOKEN_FACTORY_ADDRESS,
  TokenFactoryABI,
  BondingCurveTokenABI,
} from '@/lib/contracts'
import { TRADING_ENABLED } from '@/lib/trading'

function TokenCard({ address, index }: { address: Address; index: number }) {
  const { isConnected } = useAccount()
  const { connect, modal } = useConnectOrWaitlist()
  const [expanded, setExpanded] = useState(false)
  const [buyAmount, setBuyAmount] = useState('')
  const [sellAmount, setSellAmount] = useState('')

  const { data: tokenData, isLoading, refetch } = useReadContracts({
    contracts: [
      { address, abi: BondingCurveTokenABI, functionName: 'name' },
      { address, abi: BondingCurveTokenABI, functionName: 'symbol' },
      { address, abi: BondingCurveTokenABI, functionName: 'getPrice' },
      { address, abi: BondingCurveTokenABI, functionName: 'getMarketCap' },
      { address, abi: BondingCurveTokenABI, functionName: 'totalSupply' },
      { address, abi: BondingCurveTokenABI, functionName: 'graduated' },
      { address, abi: BondingCurveTokenABI, functionName: 'imageURI' },
    ],
  })

  const { writeContract: buyToken, data: buyTxHash, isPending: buying } = useWriteContract()
  const { writeContract: sellToken, data: sellTxHash, isPending: selling } = useWriteContract()

  const { isLoading: waitingBuy, isSuccess: buySuccess } = useWaitForTransactionReceipt({ hash: buyTxHash })
  const { isLoading: waitingSell, isSuccess: sellSuccess } = useWaitForTransactionReceipt({ hash: sellTxHash })

  const name = tokenData?.[0]?.result as string | undefined
  const symbol = tokenData?.[1]?.result as string | undefined
  const price = tokenData?.[2]?.result as bigint | undefined
  const marketCap = tokenData?.[3]?.result as bigint | undefined
  const totalSupply = tokenData?.[4]?.result as bigint | undefined
  const graduated = tokenData?.[5]?.result as boolean | undefined
  const imageURI = tokenData?.[6]?.result as string | undefined

  const handleBuy = () => {
    if (!buyAmount) return
    buyToken({
      address,
      abi: BondingCurveTokenABI,
      functionName: 'buy',
      args: [parseUnits(buyAmount, 6), 0n],
    })
  }

  const handleSell = () => {
    if (!sellAmount) return
    sellToken({
      address,
      abi: BondingCurveTokenABI,
      functionName: 'sell',
      args: [parseUnits(sellAmount, 6), 0n],
    })
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-rekt-border bg-rekt-card p-4 animate-pulse">
        <div className="h-4 bg-rekt-border rounded w-1/2 mb-2" />
        <div className="h-6 bg-rekt-border rounded w-1/3" />
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-rekt-border bg-rekt-card overflow-hidden hover:border-rekt-blue/30 transition-all">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {(() => {
            // Use local icon for known tokens, fallback to on-chain imageURI
            const resolvedImage = symbol === 'BLIZZ' ? '/rekt-token.svg' : imageURI
            return resolvedImage ? (
              <img src={resolvedImage} alt="" className="h-10 w-10 rounded-full object-cover" />
            ) : (
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: `hsl(${parseInt(address.slice(2, 8), 16) % 360}, 70%, 50%)` }}
            >
              {(symbol || '??').slice(0, 2)}
            </div>
          )})()}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white truncate">{name || 'Unknown'}</h3>
              <span className="text-xs text-rekt-muted">${symbol || '???'}</span>
              {graduated && (
                <span className="rounded-full bg-rekt-green/20 px-2 py-0.5 text-[10px] text-rekt-green font-medium">
                  Graduated
                </span>
              )}
            </div>
            <p className="text-xs text-rekt-muted font-mono">{address.slice(0, 8)}...{address.slice(-6)}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center mb-3">
          <div className="rounded-lg bg-rekt-dark p-2">
            <div className="text-[10px] text-rekt-muted">Price</div>
            <div className="text-sm font-bold text-white">{price ? Number(formatUnits(price, 18)).toFixed(6) : '0'} USDC</div>
          </div>
          <div className="rounded-lg bg-rekt-dark p-2">
            <div className="text-[10px] text-rekt-muted">Market Cap</div>
            <div className="text-sm font-bold text-white">{marketCap ? Number(formatUnits(marketCap, 18)).toFixed(4) : '0'} USDC</div>
          </div>
          <div className="rounded-lg bg-rekt-dark p-2">
            <div className="text-[10px] text-rekt-muted">Supply</div>
            <div className="text-sm font-bold text-white">{totalSupply ? Number(formatUnits(totalSupply, 18)).toFixed(0) : '0'}</div>
          </div>
        </div>

        <button
          onClick={() => TRADING_ENABLED && setExpanded(!expanded)}
          className={`w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-colors ${
            TRADING_ENABLED
              ? 'bg-rekt-blue/10 border border-rekt-blue/20 text-rekt-blue hover:bg-rekt-blue/20 cursor-pointer'
              : 'bg-rekt-border/30 border border-rekt-border text-rekt-muted cursor-default'
          }`}
        >
          <Coins className="h-3 w-3" />
          {TRADING_ENABLED ? 'Buy / Sell' : 'Connect Wallet to Trade'}
          {TRADING_ENABLED && (expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-rekt-border bg-rekt-dark/50 p-4 space-y-3">
          {!isConnected ? (
            <div className="text-center">
              <p className="text-xs text-rekt-muted mb-2">Connect wallet to trade</p>
              <>
                <button onClick={connect} className="rounded-lg bg-rekt-blue px-4 py-2 text-xs font-medium text-white">
                  Connect Wallet
                </button>
                {modal}
              </>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="USDC to spend"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  className="flex-1 rounded-lg border border-rekt-border bg-rekt-dark px-3 py-2 text-xs text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50"
                />
                <button
                  onClick={handleBuy}
                  disabled={buying || waitingBuy || !buyAmount}
                  className="rounded-lg bg-rekt-green px-4 py-2 text-xs font-medium text-white hover:opacity-80 disabled:opacity-40 flex items-center gap-1"
                >
                  {buying || waitingBuy ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                  Buy
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="1"
                  min="0"
                  placeholder="Tokens to sell"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  className="flex-1 rounded-lg border border-rekt-border bg-rekt-dark px-3 py-2 text-xs text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50"
                />
                <button
                  onClick={handleSell}
                  disabled={selling || waitingSell || !sellAmount}
                  className="rounded-lg bg-rekt-red px-4 py-2 text-xs font-medium text-white hover:opacity-80 disabled:opacity-40 flex items-center gap-1"
                >
                  {selling || waitingSell ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                  Sell
                </button>
              </div>
              {buySuccess && <p className="flex items-center gap-1 text-xs text-rekt-green"><CheckCircle className="h-3 w-3" /> Bought!</p>}
              {sellSuccess && <p className="flex items-center gap-1 text-xs text-rekt-green"><CheckCircle className="h-3 w-3" /> Sold!</p>}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function OnChainTokens() {
  const { data: tokens, isLoading, isError } = useReadContract({
    address: TOKEN_FACTORY_ADDRESS,
    abi: TokenFactoryABI,
    functionName: 'getTokens',
  })

  const { data: tokenCount } = useReadContract({
    address: TOKEN_FACTORY_ADDRESS,
    abi: TokenFactoryABI,
    functionName: 'getTokenCount',
  })

  // Filter out deprecated/test tokens
  const HIDDEN_TOKENS = [
    '0x02dC9C77fc5d081a0317a5CC446524dF464e026d'.toLowerCase(), // PEPE2
    '0x0b914208543c01b9d0C60B40daFF682c58d4051A'.toLowerCase(), // BLIZZ (hide until token announcement)
  ]
  const tokenAddresses = ((tokens as Address[]) || []).filter(
    (addr) => !HIDDEN_TOKENS.includes(addr.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-rekt-muted">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading on-chain tokens...
      </div>
    )
  }

  if (!TRADING_ENABLED) {
    // Public site: show a clean CTA
    return (
      <div className="mb-8">
        <div className="flex flex-col items-center justify-center py-12 text-rekt-muted">
          <Coins className="h-10 w-10 mb-4 text-rekt-gold opacity-50" />
          <p className="text-sm mb-2">Token launchpad powered by Base</p>
          <p className="text-xs text-rekt-muted/70 mb-4">Launch tokens with bonding curve pricing. Fair launch, instant liquidity.</p>
        </div>
      </div>
    )
  }

  if (isError || tokenAddresses.length === 0) {
    return null // Don't show section if no on-chain tokens
  }

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Coins className="h-5 w-5 text-rekt-gold" />
            On-Chain Tokens
          </h2>
          <p className="text-xs text-rekt-muted mt-1">
            {Number(tokenCount ?? 0)} token{Number(tokenCount ?? 0) !== 1 ? 's' : ''} deployed on Base Sepolia
          </p>
        </div>
        <a
          href={`https://sepolia.basescan.org/address/${TOKEN_FACTORY_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-rekt-blue hover:underline"
        >
          Factory
        </a>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {tokenAddresses.map((addr, i) => (
          <TokenCard key={addr} address={addr} index={i} />
        ))}
      </div>
    </div>
  )
}
