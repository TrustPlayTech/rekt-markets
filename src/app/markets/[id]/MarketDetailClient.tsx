'use client'

import Link from 'next/link'
import { ArrowLeft, Clock, BarChart3, Zap } from 'lucide-react'
import PriceChart from '@/components/PriceChart'
import { PolymarketEvent } from '@/lib/types'
import { parseOutcomePrices, formatUsd, getBestMarket, getEventCategory, cleanMarketTitle } from '@/lib/api'


function MockOrderBook() {
  const bids = Array.from({ length: 6 }, (_, i) => ({
    price: (0.62 - i * 0.02).toFixed(2),
    size: Math.floor(Math.random() * 5000 + 1000),
  }))
  const asks = Array.from({ length: 6 }, (_, i) => ({
    price: (0.64 + i * 0.02).toFixed(2),
    size: Math.floor(Math.random() * 5000 + 1000),
  }))
  const maxSize = Math.max(...bids.map(b => b.size), ...asks.map(a => a.size))

  return (
    <div className="rounded-xl border border-rekt-border bg-rekt-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-white">Order Book</h3>
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="mb-2 flex justify-between text-rekt-muted">
            <span>Price</span><span>Size</span>
          </div>
          {bids.map((b, i) => (
            <div key={i} className="relative flex justify-between py-1">
              <div className="absolute inset-y-0 right-0 bg-rekt-green/10 rounded" style={{ width: `${(b.size / maxSize) * 100}%` }} />
              <span className="relative text-rekt-green">{b.price}¢</span>
              <span className="relative text-rekt-muted">{b.size.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="mb-2 flex justify-between text-rekt-muted">
            <span>Price</span><span>Size</span>
          </div>
          {asks.map((a, i) => (
            <div key={i} className="relative flex justify-between py-1">
              <div className="absolute inset-y-0 right-0 bg-rekt-red/10 rounded" style={{ width: `${(a.size / maxSize) * 100}%` }} />
              <span className="relative text-rekt-red">{a.price}¢</span>
              <span className="relative text-rekt-muted">{a.size.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MarketDetailClient({ event }: { event: PolymarketEvent }) {
  const market = getBestMarket(event) || event.markets?.[0]
  const [yesPrice, noPrice] = market ? parseOutcomePrices(market) : [0.5, 0.5]
  const eventCategory = getEventCategory(event)
  const marketTitle = cleanMarketTitle(event.title)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link href="/markets" className="mb-6 inline-flex items-center gap-2 text-sm text-rekt-muted hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Markets
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-rekt-border bg-rekt-card p-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-md bg-rekt-blue/10 px-2 py-0.5 text-xs text-rekt-blue">
                {eventCategory}
              </span>
              <span className="flex items-center gap-1 text-xs text-rekt-muted">
                <Clock className="h-3 w-3" /> Active
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white md:text-3xl">{marketTitle}</h1>
            <div className="mt-4 flex items-center gap-4 text-sm text-rekt-muted">
              <span className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" /> {formatUsd(event.volume || 0)} volume
              </span>
            </div>
          </div>

          {/* Price Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-rekt-green/30 bg-rekt-green/5 p-4 text-center">
              <div className="text-sm text-rekt-muted">Yes</div>
              <div className="font-display text-3xl font-bold text-rekt-green">{(yesPrice * 100).toFixed(1)}¢</div>
              <div className="text-xs text-rekt-muted">{(yesPrice * 100).toFixed(1)}% chance</div>
            </div>
            <div className="rounded-xl border border-rekt-red/30 bg-rekt-red/5 p-4 text-center">
              <div className="text-sm text-rekt-muted">No</div>
              <div className="font-display text-3xl font-bold text-rekt-red">{(noPrice * 100).toFixed(1)}¢</div>
              <div className="text-xs text-rekt-muted">{(noPrice * 100).toFixed(1)}% chance</div>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-rekt-border bg-rekt-card p-4">
            <h3 className="mb-2 text-sm font-semibold text-white">Price History</h3>
            <PriceChart type="area" days={90} startPrice={0.3 + Math.random() * 0.4} height={280} accentColor="#6EC8FF" />
          </div>

          {/* Order Book */}
          <MockOrderBook />

          {/* Description */}
          {event.description && (
            <div className="rounded-xl border border-rekt-border bg-rekt-card p-6">
              <h3 className="mb-3 text-sm font-semibold text-white">About This Market</h3>
              <p className="text-sm text-rekt-muted whitespace-pre-wrap">{event.description}</p>
            </div>
          )}
        </div>

        {/* Create This Market Panel */}
        <div className="space-y-4">
          <div className="sticky top-24">
            <div className="rounded-xl border border-rekt-border bg-rekt-card p-6">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-rekt-blue/20">
                  <Zap className="h-6 w-6 text-rekt-blue" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Create This Market</h3>
                <p className="text-sm text-rekt-muted mb-4">
                  Want to trade this? Create it on Rekt Markets and trade on-chain.
                </p>
                <a
                  href={`/markets/create?question=${encodeURIComponent(marketTitle || '')}`}
                  className="inline-block rounded-xl bg-rekt-blue px-6 py-3 text-sm font-semibold text-white hover:opacity-80 transition-opacity"
                >
                  Create Market
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
