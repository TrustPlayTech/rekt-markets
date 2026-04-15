// Force dynamic rendering - data must be fresh, not pre-rendered at build time
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { Rocket, BarChart3, Users, DollarSign, ArrowRight, Dice5, Crosshair, Flame, ExternalLink } from 'lucide-react'
import { fetchPolymarketEvents, fetchBoostedTokens } from '@/lib/api'
import { parseOutcomePrices, formatUsd, formatNumber, getBestMarket, cleanMarketTitle } from '@/lib/api'
import { getSportsEvents, decimalOddsToCents } from '@/lib/sports'

export default async function HomePage() {
  const [events, boostedTokens, sportsEvents] = await Promise.all([
    fetchPolymarketEvents(),
    fetchBoostedTokens(),
    getSportsEvents().catch(() => []),
  ])

  const trendingMarkets = events.slice(0, 10)

  // Global prediction market industry stats (sourced from public data: Forbes, The Block, Kalshi, Polymarket)
  const stats = [
    { label: 'Industry Volume (2025)', value: '$63B+', icon: DollarSign },
    { label: 'Active Traders Globally', value: '5.1M+', icon: Users },
    { label: 'Markets Created', value: '500K+', icon: BarChart3 },
    { label: 'Projected 2026 Volume', value: '$325B+', icon: Rocket },
  ]

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-8 md:px-6 space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[28px] border border-border bg-gradient-to-r from-primary/20 via-background to-background shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
        <div className="absolute inset-0 bg-gradient-to-b from-rekt-blue/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-rekt-blue/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-8 py-16 md:px-12 md:py-20">
          <div className="flex flex-col items-center md:flex-row md:justify-between md:gap-12">
            <div className="text-center md:text-left md:flex-1">

              <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                <span className="text-rekt-blue">Predict.</span>{' '}
                <span className="bg-gradient-to-r from-rekt-blue to-rekt-gold bg-clip-text text-transparent">Launch.</span>{' '}
                <span className="text-rekt-gold">Play.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-rekt-muted md:mx-0 md:text-xl">
                The all-in-one platform for prediction markets and token launches. 
                Trade on real-world events or launch the next viral token.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
                <Link
                  href="/markets"
                  className="flex items-center gap-2 rounded-xl bg-rekt-blue px-8 py-3 text-sm font-medium text-white transition-all hover:bg-rekt-blue/80 hover:scale-105"
                >
                  Explore Markets <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/launchpad"
                  className="flex items-center gap-2 rounded-xl border border-rekt-border bg-rekt-card px-8 py-3 text-sm font-medium text-white transition-all hover:border-rekt-blue/50 hover:scale-105"
                >
                  Launch a Token <Rocket className="h-4 w-4" />
                </Link>
              </div>
            </div>
</div>
        </div>
      </section>

      {/* Stats */}
      <section className="rounded-[28px] border border-border bg-card/72 shadow-[0_18px_44px_rgba(0,0,0,0.22)]">
        <div className="mx-auto max-w-7xl px-6 pt-4 pb-1">
          <p className="text-[10px] text-rekt-muted/60 text-center uppercase tracking-widest">Global Prediction Market Stats</p>
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 pb-6 pt-2 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3 px-4">
              <s.icon className="h-5 w-5 text-rekt-blue" />
              <div>
                <div className="text-lg font-bold text-white md:text-xl">{s.value}</div>
                <div className="text-xs text-rekt-muted">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* Rekt Ecosystem */}
      <section className="rounded-[28px] border border-border bg-card/55 shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">The Rekt Ecosystem</h2>
            <p className="mx-auto mt-3 max-w-xl text-rekt-muted">One ecosystem. Infinite possibilities. Casino, markets, and launchpad -- all connected.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/markets"
              className="group rounded-2xl border border-rekt-border bg-rekt-card p-8 transition-all hover:border-rekt-green/50 hover:shadow-lg hover:shadow-rekt-green/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rekt-green/10">
                <Crosshair className="h-6 w-6 text-rekt-green" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Rekt Markets</h3>
              <p className="mt-2 text-sm text-rekt-muted">
                Prediction markets and trading. Trade on real-world outcomes with on-chain settlement.
              </p>
            </Link>

            <Link
              href="/launchpad"
              className="group rounded-2xl border border-rekt-border bg-rekt-card p-8 transition-all hover:border-rekt-red/50 hover:shadow-lg hover:shadow-rekt-red/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rekt-red/10">
                <Flame className="h-6 w-6 text-rekt-red" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Rekt Launchpad</h3>
              <p className="mt-2 text-sm text-rekt-muted">
                Token launchpad with fair launch mechanics. Create and launch tokens in minutes.
              </p>
            </Link>

            <a
              href="https://rektpalace.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-rekt-border bg-rekt-card p-8 transition-all hover:border-rekt-gold/50 hover:shadow-lg hover:shadow-rekt-gold/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rekt-gold/10">
                <Dice5 className="h-6 w-6 text-rekt-gold" />
              </div>
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                Rekt.io Casino <ExternalLink className="h-3.5 w-3.5 text-rekt-muted" />
              </h3>
              <p className="mt-2 text-sm text-rekt-muted">
                Crypto casino with provably fair games. Slots, table games, live dealers, and sports trading.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Trending Ticker */}
      {trendingMarkets.length > 0 && (() => {
        // Build sports ticker items
        const sportsTickerItems = sportsEvents.slice(0, 8).map((se) => {
          const h2h = se.bookmakers[0]?.markets.find((m) => m.key === 'h2h')
          if (!h2h || h2h.outcomes.length < 2) return null
          const homeCents = decimalOddsToCents(h2h.outcomes[0].price)
          const awayCents = decimalOddsToCents(h2h.outcomes[1].price)
          return {
            id: se.id,
            label: `${se.home_team} vs ${se.away_team}`,
            odds: `${homeCents}¢ / ${awayCents}¢`,
          }
        }).filter(Boolean)

        return (
          <section className="rounded-[28px] border border-border bg-card/55 py-4 overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.18)]">
            <div className="flex animate-slide-left whitespace-nowrap" style={{ width: '200%' }}>
              {[...trendingMarkets, ...trendingMarkets].map((event, i) => {
                const market = getBestMarket(event)
                if (!market) return null
                const [yesPrice] = parseOutcomePrices(market)
                return (
                  <Link
                    key={`${event.id}-${i}`}
                    href={`/markets/${event.id}`}
                    className="mx-4 inline-flex items-center gap-3 rounded-lg border border-rekt-border bg-rekt-card px-4 py-2 transition-colors hover:border-rekt-blue/50"
                  >
                    <span className="text-sm text-rekt-muted truncate max-w-[200px]">{cleanMarketTitle(event.title)}</span>
                    <span className={`text-sm font-bold ${yesPrice > 0.5 ? 'text-rekt-green' : 'text-rekt-red'}`}>
                      {(yesPrice * 100).toFixed(0)}%
                    </span>
                    <span className="text-xs text-rekt-muted">{formatUsd(event.volume || 0)} vol</span>
                  </Link>
                )
              })}
              {[...sportsTickerItems, ...sportsTickerItems].map((item, i) => item && (
                <Link
                  key={`sport-${item.id}-${i}`}
                  href="/sports"
                  className="mx-4 inline-flex items-center gap-3 rounded-lg border border-rekt-border bg-rekt-card px-4 py-2 transition-colors hover:border-rekt-green/50"
                >
                  <span className="text-sm text-rekt-muted truncate max-w-[200px]">{item.label}</span>
                  <span className="text-sm font-bold text-rekt-green">{item.odds}</span>
                  <span className="text-[10px] text-rekt-muted bg-rekt-green/10 px-1.5 py-0.5 rounded">ML</span>
                </Link>
              ))}
            </div>
          </section>
        )
      })()}

      {/* CTA */}
      <section className="mx-auto max-w-7xl rounded-[28px] border border-border bg-card/62 px-6 py-16 text-center shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
        <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Ready to start trading?</h2>
        <p className="mx-auto mt-4 max-w-xl text-rekt-muted">
          Join thousands of traders making predictions and launching tokens on Rekt Markets.
        </p>
        <div className="mt-8">
          <Link
            href="/markets"
            className="inline-flex items-center gap-2 rounded-xl bg-rekt-blue px-8 py-3 text-sm font-medium text-white transition-all hover:bg-rekt-blue/80"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
