'use client'

import { Wallet } from 'lucide-react'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { formatUnits } from 'viem'
import { useConnectOrWaitlist } from '@/components/ConnectOrWaitlist'
import {
  MARKET_FACTORY_ADDRESS, MarketFactoryABI,
  TOKEN_FACTORY_ADDRESS, TokenFactoryABI,
  BinaryMarketABI, BondingCurveTokenABI,
  USDC_ADDRESS, ERC20ABI,
} from '@/lib/contracts'

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-rekt-border ${className}`} />
}

export default function PortfolioPage() {
  const { isConnected, address } = useAccount()
  const { connect, modal } = useConnectOrWaitlist()

  // ---------- USDC balance ----------
  const { data: usdcBalanceRaw, isLoading: usdcLoading } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  // ---------- Markets ----------
  const { data: marketAddresses, isLoading: marketsListLoading } = useReadContract({
    address: MARKET_FACTORY_ADDRESS,
    abi: MarketFactoryABI,
    functionName: 'getMarkets',
    query: { enabled: isConnected },
  })

  // Batch read market details: question, yesToken, noToken, resolved, yesWins, getYesPrice, getNoPrice
  const marketDetailCalls = (marketAddresses ?? []).flatMap((addr) => [
    { address: addr, abi: BinaryMarketABI, functionName: 'question' as const },
    { address: addr, abi: BinaryMarketABI, functionName: 'yesToken' as const },
    { address: addr, abi: BinaryMarketABI, functionName: 'noToken' as const },
    { address: addr, abi: BinaryMarketABI, functionName: 'resolved' as const },
    { address: addr, abi: BinaryMarketABI, functionName: 'yesWins' as const },
    { address: addr, abi: BinaryMarketABI, functionName: 'getYesPrice' as const },
    { address: addr, abi: BinaryMarketABI, functionName: 'getNoPrice' as const },
  ])

  const { data: marketDetails, isLoading: marketDetailsLoading } = useReadContracts({
    contracts: marketDetailCalls,
    query: { enabled: (marketAddresses ?? []).length > 0 },
  })

  // Parse market details into structured data
  type MarketInfo = {
    address: `0x${string}`
    question: string
    yesToken: `0x${string}`
    noToken: `0x${string}`
    resolved: boolean
    yesWins: boolean
    yesPrice: bigint
    noPrice: bigint
  }

  const markets: MarketInfo[] = []
  if (marketDetails && marketAddresses) {
    for (let i = 0; i < marketAddresses.length; i++) {
      const base = i * 7
      const q = marketDetails[base]?.result as string | undefined
      const yt = marketDetails[base + 1]?.result as `0x${string}` | undefined
      const nt = marketDetails[base + 2]?.result as `0x${string}` | undefined
      const res = marketDetails[base + 3]?.result as boolean | undefined
      const yw = marketDetails[base + 4]?.result as boolean | undefined
      const yp = marketDetails[base + 5]?.result as bigint | undefined
      const np = marketDetails[base + 6]?.result as bigint | undefined
      if (q && yt && nt) {
        markets.push({
          address: marketAddresses[i],
          question: q,
          yesToken: yt,
          noToken: nt,
          resolved: res ?? false,
          yesWins: yw ?? false,
          yesPrice: yp ?? 0n,
          noPrice: np ?? 0n,
        })
      }
    }
  }

  // Batch read user balances for YES and NO tokens of each market
  const balanceCalls = markets.flatMap((m) => [
    { address: m.yesToken, abi: ERC20ABI, functionName: 'balanceOf' as const, args: [address!] },
    { address: m.noToken, abi: ERC20ABI, functionName: 'balanceOf' as const, args: [address!] },
  ])

  const { data: marketBalances, isLoading: marketBalancesLoading } = useReadContracts({
    contracts: balanceCalls,
    query: { enabled: markets.length > 0 && !!address },
  })

  type Position = {
    question: string
    side: 'YES' | 'NO'
    shares: bigint
    price: bigint // in cents (0-100)
    resolved: boolean
    yesWins: boolean
  }

  const positions: Position[] = []
  if (marketBalances) {
    for (let i = 0; i < markets.length; i++) {
      const yesBal = (marketBalances[i * 2]?.result as bigint) ?? 0n
      const noBal = (marketBalances[i * 2 + 1]?.result as bigint) ?? 0n
      if (yesBal > 0n) {
        positions.push({
          question: markets[i].question,
          side: 'YES',
          shares: yesBal,
          price: markets[i].yesPrice,
          resolved: markets[i].resolved,
          yesWins: markets[i].yesWins,
        })
      }
      if (noBal > 0n) {
        positions.push({
          question: markets[i].question,
          side: 'NO',
          shares: noBal,
          price: markets[i].noPrice,
          resolved: markets[i].resolved,
          yesWins: markets[i].yesWins,
        })
      }
    }
  }

  // ---------- Tokens ----------
  const { data: tokenAddresses, isLoading: tokensListLoading } = useReadContract({
    address: TOKEN_FACTORY_ADDRESS,
    abi: TokenFactoryABI,
    functionName: 'getTokens',
    query: { enabled: isConnected },
  })

  const tokenDetailCalls = (tokenAddresses ?? []).flatMap((addr) => [
    { address: addr, abi: BondingCurveTokenABI, functionName: 'name' as const },
    { address: addr, abi: BondingCurveTokenABI, functionName: 'symbol' as const },
    { address: addr, abi: BondingCurveTokenABI, functionName: 'balanceOf' as const, args: [address!] },
    { address: addr, abi: BondingCurveTokenABI, functionName: 'getPrice' as const },
  ])

  const { data: tokenDetails, isLoading: tokenDetailsLoading } = useReadContracts({
    contracts: tokenDetailCalls,
    query: { enabled: (tokenAddresses ?? []).length > 0 && !!address },
  })

  type TokenHolding = {
    name: string
    symbol: string
    balance: bigint
    price: bigint // raw from contract (USDC with 6 decimals)
  }

  const holdings: TokenHolding[] = []
  if (tokenDetails && tokenAddresses) {
    for (let i = 0; i < tokenAddresses.length; i++) {
      const base = i * 4
      const n = tokenDetails[base]?.result as string | undefined
      const s = tokenDetails[base + 1]?.result as string | undefined
      const b = (tokenDetails[base + 2]?.result as bigint) ?? 0n
      const p = (tokenDetails[base + 3]?.result as bigint) ?? 0n
      if (n && s && b > 0n) {
        holdings.push({ name: n, symbol: s, balance: b, price: p })
      }
    }
  }

  // ---------- Computed values ----------
  const usdcBalance = usdcBalanceRaw ? Number(formatUnits(usdcBalanceRaw as bigint, 6)) : 0

  // Position values: shares (18 dec) * price (cents 0-100) / 100 = USDC value
  const positionValues = positions.map((p) => {
    const shares = Number(formatUnits(p.shares, 18))
    const priceUsd = Number(p.price) / 100
    return shares * priceUsd
  })
  const totalPositionValue = positionValues.reduce((a, v) => a + v, 0)

  // Token values: balance (18 dec) * price (6 dec USDC raw)
  const holdingValues = holdings.map((h) => {
    const bal = Number(formatUnits(h.balance, 18))
    const price = Number(formatUnits(h.price, 6))
    return bal * price
  })
  const totalTokenValue = holdingValues.reduce((a, v) => a + v, 0)

  const totalPortfolioValue = usdcBalance + totalPositionValue + totalTokenValue

  const isLoading = marketsListLoading || marketDetailsLoading || marketBalancesLoading ||
    tokensListLoading || tokenDetailsLoading || usdcLoading

  // ---------- Not connected ----------
  if (!isConnected) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rekt-card border border-rekt-border">
          <Wallet className="h-10 w-10 text-rekt-muted" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white mb-2">Connect Your Wallet</h1>
        <p className="text-rekt-muted text-sm mb-6 text-center max-w-md">
          Connect your wallet to view your portfolio, track positions, and monitor your holdings across prediction markets and tokens.
        </p>
        <button
          onClick={connect}
          className="rounded-lg bg-rekt-blue px-6 py-3 text-sm font-medium text-white hover:bg-rekt-blue/80 transition-colors"
        >
          Connect Wallet
        </button>
        {modal}
      </div>
    )
  }

  const hasAnyHoldings = positions.length > 0 || holdings.length > 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Portfolio</h1>
        <p className="mt-1 text-sm text-rekt-muted">{address}</p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-rekt-border bg-rekt-card p-6">
          <div className="text-sm text-rekt-muted">Total Portfolio Value</div>
          {isLoading ? (
            <Skeleton className="mt-2 h-9 w-32" />
          ) : (
            <div className="font-display text-3xl font-bold text-white">
              {totalPortfolioValue.toFixed(2)} USDC
            </div>
          )}
        </div>
        <div className="rounded-xl border border-rekt-border bg-rekt-card p-6">
          <div className="text-sm text-rekt-muted">Markets</div>
          {isLoading ? (
            <Skeleton className="mt-2 h-7 w-24" />
          ) : (
            <>
              <div className="font-display text-2xl font-bold text-white">
                {totalPositionValue.toFixed(2)} USDC
              </div>
              <div className="text-xs text-rekt-muted mt-1">{positions.length} position{positions.length !== 1 ? 's' : ''}</div>
            </>
          )}
        </div>
        <div className="rounded-xl border border-rekt-border bg-rekt-card p-6">
          <div className="text-sm text-rekt-muted">Tokens</div>
          {isLoading ? (
            <Skeleton className="mt-2 h-7 w-24" />
          ) : (
            <>
              <div className="font-display text-2xl font-bold text-white">
                {totalTokenValue.toFixed(2)} USDC
              </div>
              <div className="text-xs text-rekt-muted mt-1">{holdings.length} holding{holdings.length !== 1 ? 's' : ''}</div>
            </>
          )}
        </div>
      </div>

      {/* USDC Balance Card */}
      <div className="mb-8 rounded-xl border border-rekt-border bg-rekt-card p-6 inline-block">
        <div className="text-sm text-rekt-muted">USDC Balance</div>
        {usdcLoading ? (
          <Skeleton className="mt-2 h-7 w-24" />
        ) : (
          <div className="font-display text-2xl font-bold text-white">
            {usdcBalance.toFixed(2)} USDC
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !hasAnyHoldings ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-rekt-muted text-sm">
            No positions yet. Start trading to build your portfolio.
          </p>
        </div>
      ) : (
        <>
          {/* Market Positions */}
          {positions.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 font-display text-xl font-bold text-white">Market Positions</h2>
              <div className="rounded-xl border border-rekt-border overflow-hidden">
                <div className="hidden md:grid grid-cols-5 gap-4 bg-rekt-card/50 px-6 py-3 text-xs text-rekt-muted font-medium">
                  <span className="col-span-2">Market</span>
                  <span>Side</span>
                  <span>Shares</span>
                  <span>Value</span>
                </div>
                {positions.map((pos, i) => {
                  const shares = Number(formatUnits(pos.shares, 18))
                  const priceNum = Number(pos.price)
                  const value = positionValues[i]
                  return (
                    <div key={i} className="grid md:grid-cols-5 gap-2 md:gap-4 border-t border-rekt-border bg-rekt-card px-6 py-4 items-center">
                      <span className="md:col-span-2 text-sm text-white font-medium truncate" title={pos.question}>
                        {pos.question}
                        {pos.resolved && (
                          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${pos.yesWins ? 'bg-rekt-green/20 text-rekt-green' : 'bg-rekt-red/20 text-rekt-red'}`}>
                            {pos.yesWins ? 'YES won' : 'NO won'}
                          </span>
                        )}
                      </span>
                      <span className={`text-sm font-medium ${pos.side === 'YES' ? 'text-rekt-green' : 'text-rekt-red'}`}>
                        {pos.side}
                      </span>
                      <span className="text-sm text-rekt-muted">
                        {Math.floor(shares).toLocaleString()} @ {priceNum}¢
                      </span>
                      <span className="text-sm text-white font-medium">
                        {value.toFixed(2)} USDC
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Token Holdings */}
          {holdings.length > 0 && (
            <div>
              <h2 className="mb-4 font-display text-xl font-bold text-white">Token Holdings</h2>
              <div className="rounded-xl border border-rekt-border overflow-hidden">
                <div className="hidden md:grid grid-cols-4 gap-4 bg-rekt-card/50 px-6 py-3 text-xs text-rekt-muted font-medium">
                  <span>Token</span>
                  <span>Balance</span>
                  <span>Price</span>
                  <span>Value</span>
                </div>
                {holdings.map((token, i) => {
                  const bal = Number(formatUnits(token.balance, 18))
                  const price = Number(formatUnits(token.price, 6))
                  const value = holdingValues[i]
                  return (
                    <div key={i} className="grid md:grid-cols-4 gap-2 md:gap-4 border-t border-rekt-border bg-rekt-card px-6 py-4 items-center">
                      <span className="text-sm text-white font-medium">{token.name} ({token.symbol})</span>
                      <span className="text-sm text-rekt-muted">{bal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      <span className="text-sm text-rekt-muted">{price.toFixed(6)} USDC</span>
                      <span className="text-sm text-white font-medium">{value.toFixed(2)} USDC</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
