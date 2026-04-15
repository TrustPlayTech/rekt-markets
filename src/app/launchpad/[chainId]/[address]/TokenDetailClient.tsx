'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, ExternalLink, Check, Rocket } from 'lucide-react'
import PriceChart from '@/components/PriceChart'
import { DexPair } from '@/lib/types'
import { formatUsd, shortenAddress } from '@/lib/api'

export default function TokenDetailClient({
  chainId,
  address,
  pairs,
}: {
  chainId: string
  address: string
  pairs: DexPair[]
}) {
  const pair = pairs[0]
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tokenName = pair?.baseToken?.name || 'Unknown Token'
  const tokenSymbol = pair?.baseToken?.symbol || '???'
  const priceUsd = pair?.priceUsd ? `$${parseFloat(pair.priceUsd).toFixed(6)}` : 'N/A'
  const priceChange = pair?.priceChange?.h24 ?? 0
  const volume = pair?.volume?.h24 ?? 0
  const liquidity = pair?.liquidity?.usd ?? 0
  const fdv = pair?.fdv ?? 0
  const marketCap = pair?.marketCap ?? 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link href="/launchpad" className="mb-6 inline-flex items-center gap-2 text-sm text-rekt-muted hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Launchpad
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="rounded-xl border border-rekt-border bg-rekt-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rekt-blue/30 to-rekt-frost/30 text-xl overflow-hidden">
                {pair?.info?.imageUrl ? (
                  <img src={pair.info.imageUrl} alt="" className="h-full w-full rounded-full object-cover" />
                ) : '🪙'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl font-bold text-white">{tokenName}</h1>
                  <span className="rounded-md bg-rekt-blue/10 px-2 py-0.5 text-xs text-rekt-blue">{tokenSymbol}</span>
                  <span className="rounded-md bg-rekt-card px-2 py-0.5 text-xs text-rekt-muted border border-rekt-border">
                    {chainId.toUpperCase()}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <span className="font-display text-3xl font-bold text-white">{priceUsd}</span>
                  <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-rekt-green' : 'text-rekt-red'}`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-rekt-border bg-rekt-card p-4">
            <h3 className="mb-2 text-sm font-semibold text-white">Price Chart</h3>
            <PriceChart type="candlestick" days={60} startPrice={0.0001 + Math.random() * 0.001} height={320} accentColor="#6EC8FF" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: 'Market Cap', value: marketCap > 0 ? formatUsd(marketCap) : 'N/A' },
              { label: 'FDV', value: fdv > 0 ? formatUsd(fdv) : 'N/A' },
              { label: '24h Volume', value: volume > 0 ? formatUsd(volume) : 'N/A' },
              { label: 'Liquidity', value: liquidity > 0 ? formatUsd(liquidity) : 'N/A' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-rekt-border bg-rekt-card p-4">
                <div className="text-xs text-rekt-muted">{s.label}</div>
                <div className="mt-1 text-lg font-bold text-white">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Token Info */}
          <div className="rounded-xl border border-rekt-border bg-rekt-card p-6">
            <h3 className="mb-4 text-sm font-semibold text-white">Token Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-rekt-muted">Contract Address</span>
                <button onClick={handleCopy} className="flex items-center gap-2 text-white hover:text-rekt-blue transition-colors">
                  {shortenAddress(address)}
                  {copied ? <Check className="h-3 w-3 text-rekt-green" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-rekt-muted">Chain</span>
                <span className="text-white">{chainId}</span>
              </div>
              {pair?.dexId && (
                <div className="flex items-center justify-between">
                  <span className="text-rekt-muted">DEX</span>
                  <span className="text-white">{pair.dexId}</span>
                </div>
              )}
              {pair?.txns?.h24 && (
                <div className="flex items-center justify-between">
                  <span className="text-rekt-muted">24h Transactions</span>
                  <span className="text-white">
                    {pair.txns.h24.buys + pair.txns.h24.sells} ({pair.txns.h24.buys} buys / {pair.txns.h24.sells} sells)
                  </span>
                </div>
              )}
              {pair?.url && (
                <div className="flex items-center justify-between">
                  <span className="text-rekt-muted">DexScreener</span>
                  <a href={pair.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-rekt-blue hover:underline">
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Launch CTA Panel */}
        <div>
          <div className="sticky top-24">
            <div className="rounded-xl border border-rekt-border bg-rekt-card p-6">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-rekt-gold/20">
                  <Rocket className="h-6 w-6 text-rekt-gold" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Launch Your Token</h3>
                <p className="text-sm text-rekt-muted mb-4">
                  Create your own token with a bonding curve on Base. Fair launch, instant liquidity.
                </p>
                <a
                  href="/launchpad/create"
                  className="inline-block rounded-xl bg-rekt-gold px-6 py-3 text-sm font-semibold text-rekt-dark hover:opacity-80 transition-opacity"
                >
                  Create Token
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
