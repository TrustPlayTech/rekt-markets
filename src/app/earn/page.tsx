'use client'

import { useEffect, useState } from 'react'
import { Vault, TrendingUp, RefreshCw } from 'lucide-react'

interface Pool {
  pool: string
  chain: string
  project: string
  symbol: string
  tvlUsd: number
  apy: number
}

export default function EarnPage() {
  const [pools, setPools] = useState<Pool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const res = await fetch('https://yields.llama.fi/pools')
        const json = await res.json()
        const data: Pool[] = json.data || []
        const filtered = data
          .filter((p) => {
            const sym = p.symbol?.toUpperCase() || ''
            return (sym === 'USDC' || sym === 'ETH' || sym === 'WETH')
              && p.apy > 3
              && p.tvlUsd > 10_000_000
          })
          .sort((a, b) => b.apy - a.apy)
          .slice(0, 10)
        setPools(filtered)
      } catch {
        setError('Failed to fetch yield data')
      } finally {
        setLoading(false)
      }
    }
    fetchPools()
  }, [])

  const formatTvl = (n: number) => {
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
    if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
    return `$${(n / 1e3).toFixed(0)}K`
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          <Vault className="h-8 w-8 text-rekt-blue" />
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Earn</h1>
            <p className="text-rekt-muted">Deposit assets and earn yield from top DeFi protocols</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-rekt-muted">
          <RefreshCw className="h-3 w-3" />
          Live data from DeFiLlama
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 text-rekt-blue animate-spin" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rekt-red/30 bg-rekt-red/10 p-6 text-center text-rekt-red">
          {error}
        </div>
      ) : pools.length === 0 ? (
        <div className="text-center py-20 text-rekt-muted">No pools matching criteria found</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pools.map((pool) => {
            const displaySymbol = pool.symbol?.toUpperCase() === 'WETH' ? 'ETH' : pool.symbol?.toUpperCase()
            return (
              <div
                key={pool.pool}
                className="rounded-xl border border-rekt-border bg-rekt-card p-5 transition-all hover:border-rekt-blue/50 hover:shadow-lg hover:shadow-rekt-blue/5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-rekt-muted capitalize">{pool.project}</p>
                    <p className="text-sm font-medium text-white capitalize">{pool.chain}</p>
                  </div>
                  <span className={`rounded-lg px-3 py-1 text-sm font-bold ${
                    displaySymbol === 'USDC' ? 'bg-rekt-blue/10 text-rekt-blue' : 'bg-rekt-gold/10 text-rekt-gold'
                  }`}>
                    {displaySymbol}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <TrendingUp className="h-4 w-4 text-rekt-green" />
                    <span className="text-2xl font-bold text-rekt-green">{pool.apy.toFixed(2)}%</span>
                    <span className="text-xs text-rekt-muted">APY</span>
                  </div>
                </div>

                <div className="mb-4 flex justify-between text-sm">
                  <span className="text-rekt-muted">TVL</span>
                  <span className="text-white font-medium">{formatTvl(pool.tvlUsd)}</span>
                </div>

                <button className="w-full rounded-lg bg-rekt-gold py-2.5 text-sm font-medium text-rekt-dark hover:opacity-80 transition-opacity">
                  Deposit
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
