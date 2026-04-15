'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Search, TrendingUp, Plus, Clock, BarChart3, Zap } from 'lucide-react'
import { PolymarketEvent } from '@/lib/types'
import { parseOutcomePrices, formatUsd, getBestMarket, getEventCategory, cleanMarketTitle } from '@/lib/api'
import { TRADING_ENABLED } from '@/lib/trading'
import { FEATURED_MARKETS } from '@/lib/featured'
import { useConnectOrWaitlist } from '@/components/ConnectOrWaitlist'

const OnChainMarkets = dynamic(() => import('@/components/OnChainMarkets'), { ssr: false })

type Tab = 'polymarket' | 'onchain'

function WaitlistTradeButton() {
  const { connect, modal } = useConnectOrWaitlist()
  return (
    <div className="mt-6 text-center">
      <button
        onClick={connect}
        className="inline-flex items-center gap-2 rounded-xl bg-rekt-blue/10 border border-rekt-blue/30 px-6 py-3 text-sm font-medium text-rekt-blue hover:bg-rekt-blue/20 transition-colors"
      >
        Connect Wallet to Trade
      </button>
      {modal}
    </div>
  )
}

export default function MarketsClient({ events }: { events: PolymarketEvent[] }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [tab, setTab] = useState<Tab>('polymarket')

  // Enrich events with derived category
  const enrichedEvents = useMemo(() => {
    return events.map((e) => ({
      ...e,
      _category: getEventCategory(e),
    }))
  }, [events])

  const categories = useMemo(() => {
    const cats = new Set(enrichedEvents.map((e) => e._category))
    return ['All', ...Array.from(cats).sort()]
  }, [enrichedEvents])

  const filtered = useMemo(() => {
    return enrichedEvents.filter((e) => {
      const matchSearch = e.title.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'All' || e._category === category
      return matchSearch && matchCat
    })
  }, [enrichedEvents, search, category])

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
      <div className="rounded-[28px] border border-border bg-card/68 p-6 md:p-8 shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold text-white">Prediction Markets</h1>
          <p className="mt-2 text-rekt-muted">Trade on the outcome of real-world events in a Rekt Palace native shell.</p>
        </div>
        <Link
          href={TRADING_ENABLED ? "/markets/create" : "/waitlist"}
          className="flex items-center gap-2 rounded-xl bg-rekt-gold px-6 py-3 text-sm font-medium text-rekt-dark transition-all hover:opacity-80"
        >
          <Plus className="h-4 w-4" />
          Create Market
        </Link>
      </div>
      </div>

      {/* Featured Markets */}
      {FEATURED_MARKETS.length > 0 && (
        <div className="rounded-[28px] border border-border bg-card/58 p-6 shadow-[0_16px_38px_rgba(0,0,0,0.16)]">
          <h2 className="font-display text-2xl font-bold text-white mb-4">Featured</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {FEATURED_MARKETS.map((fm, i) => (
              <Link
                key={i}
                href={fm.link}
                className="group relative rounded-2xl border border-rekt-border bg-rekt-card p-6 transition-all hover:border-rekt-blue/50 hover:shadow-lg hover:shadow-rekt-blue/5"
              >
                {fm.badge && (
                  <span className="absolute top-4 right-4 rounded-full bg-rekt-gold px-3 py-1 text-xs font-bold text-rekt-dark">
                    {fm.badge}
                  </span>
                )}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-rekt-blue transition-colors">
                  {fm.title}
                </h3>
                <p className="text-sm text-rekt-muted">{fm.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tab switcher */}
      <div className="rounded-2xl border border-border bg-card/58 p-2 shadow-[0_14px_34px_rgba(0,0,0,0.14)]">
        <div className="flex gap-2 border-b border-rekt-border px-2">
        <button
          onClick={() => setTab('polymarket')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'polymarket'
              ? 'border-rekt-blue text-rekt-blue'
              : 'border-transparent text-rekt-muted hover:text-white'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Polymarket Feed
        </button>
        <button
          onClick={() => setTab('onchain')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'onchain'
              ? 'border-rekt-gold text-rekt-gold'
              : 'border-transparent text-rekt-muted hover:text-white'
          }`}
        >
          <Zap className="h-4 w-4" />
          On-Chain Markets
        </button>
        </div>
      </div>

      {tab === 'onchain' ? (
        <>
          <OnChainMarkets />
          {!TRADING_ENABLED && <WaitlistTradeButton />}
        </>
      ) : (
        <>
          {/* Search */}
          <div className="rounded-2xl border border-border bg-card/58 p-4 shadow-[0_14px_34px_rgba(0,0,0,0.14)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rekt-muted" />
              <input
                type="text"
                placeholder="Search markets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-rekt-border bg-rekt-card py-3 pl-10 pr-4 text-sm text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50"
              />
            </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-rekt-blue text-white'
                    : 'bg-rekt-card text-rekt-muted hover:text-white border border-rekt-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Markets Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-rekt-muted">
              <TrendingUp className="h-12 w-12 mb-4 opacity-30" />
              <p>No markets found</p>
            </div>
          ) : (
            <>
            {/* Desktop Grid */}
            <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((event) => {
                const market = getBestMarket(event)
                if (!market) return null
                const [yesPrice, noPrice] = parseOutcomePrices(market)
                const isResolved = (yesPrice <= 0.01 && noPrice >= 0.99) || (yesPrice >= 0.99 && noPrice <= 0.01)
                return (
                  <Link
                    key={event.id}
                    href={`/markets/${event.id}`}
                    className="group rounded-xl border border-rekt-border bg-rekt-card p-5 transition-all hover:border-rekt-blue/50 hover:shadow-lg hover:shadow-rekt-blue/5"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <span className="inline-block rounded-md bg-rekt-blue/10 px-2 py-0.5 text-xs text-rekt-blue">
                        {event._category}
                      </span>
                      <div className="flex items-center gap-2">
                        {isResolved && (
                          <span className="rounded-md bg-rekt-muted/20 px-2 py-0.5 text-[10px] text-rekt-muted">Resolved</span>
                        )}
                        {event.volume > 0 && (
                          <span className="text-xs text-rekt-muted">{formatUsd(event.volume)} vol</span>
                        )}
                      </div>
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-white line-clamp-2 group-hover:text-rekt-blue transition-colors">
                      {cleanMarketTitle(event.title, market)}
                    </h3>
                    {market.groupItemTitle && (
                      <p className="mb-3 text-xs text-rekt-muted">{market.groupItemTitle}</p>
                    )}
                    <div className="flex gap-2">
                      <div className="flex-1 rounded-lg bg-rekt-green/10 px-3 py-2 text-center">
                        <div className="text-xs text-rekt-muted">Yes</div>
                        <div className="text-lg font-bold text-rekt-green">{(yesPrice * 100).toFixed(0)}¢</div>
                      </div>
                      <div className="flex-1 rounded-lg bg-rekt-red/10 px-3 py-2 text-center">
                        <div className="text-xs text-rekt-muted">No</div>
                        <div className="text-lg font-bold text-rekt-red">{(noPrice * 100).toFixed(0)}¢</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Mobile Card List */}
            <div className="flex flex-col gap-3 md:hidden">
              {filtered.map((event) => {
                const market = getBestMarket(event)
                if (!market) return null
                const [yesPrice, noPrice] = parseOutcomePrices(market)
                const yesPct = Math.round(yesPrice * 100)
                const noPct = Math.round(noPrice * 100)
                return (
                  <Link
                    key={event.id}
                    href={`/markets/${event.id}`}
                    className="rounded-xl border border-rekt-border bg-rekt-card p-4 active:bg-rekt-card/80 transition-colors"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rekt-blue/10">
                        <BarChart3 className="h-5 w-5 text-rekt-blue" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-white line-clamp-2 mb-2">
                          {cleanMarketTitle(event.title, market)}
                        </h3>
                        <div className="flex gap-2 mb-3">
                          <button className="flex-1 flex items-center justify-between rounded-lg bg-rekt-green/10 border border-rekt-green/20 px-3 py-2">
                            <span className="text-xs font-medium text-rekt-green">Yes</span>
                            <span className="text-sm font-bold text-rekt-green">{yesPct}%</span>
                          </button>
                          <button className="flex-1 flex items-center justify-between rounded-lg bg-rekt-red/10 border border-rekt-red/20 px-3 py-2">
                            <span className="text-xs font-medium text-rekt-red">No</span>
                            <span className="text-sm font-bold text-rekt-red">{noPct}%</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-rekt-muted">
                          {event.volume > 0 && (
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {formatUsd(event.volume)}
                            </span>
                          )}
                          {event.endDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(event.endDate) > new Date() ? 'Ends ' + new Date(event.endDate).toLocaleDateString() : 'Ended'}
                            </span>
                          )}
                          <span className="rounded bg-rekt-blue/10 px-1.5 py-0.5 text-rekt-blue">{event._category}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
