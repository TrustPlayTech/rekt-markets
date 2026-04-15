'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Rocket, Flame, Plus, ExternalLink } from 'lucide-react'
import { DexToken } from '@/lib/types'
import OnChainTokens from '@/components/OnChainTokens'
import { TRADING_ENABLED } from '@/lib/trading'

function TokenCard({ token, index }: { token: DexToken; index: number }) {
  const chainLabels: Record<string, string> = {
    solana: 'SOL',
    ethereum: 'ETH',
    bsc: 'BSC',
    base: 'BASE',
    arbitrum: 'ARB',
    polygon: 'MATIC',
    avalanche: 'AVAX',
  }
  const chainLabel = chainLabels[token.chainId] || token.chainId?.toUpperCase()?.slice(0, 5) || '???'

  return (
    <Link
      href={`/launchpad/${token.chainId}/${token.tokenAddress}`}
      className="group flex items-center gap-4 rounded-xl border border-rekt-border bg-rekt-card p-4 transition-all hover:border-rekt-blue/50 hover:shadow-lg hover:shadow-rekt-blue/5"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white font-bold text-sm overflow-hidden">
        {token.icon ? (
          <img src={token.icon.startsWith("http") ? token.icon : `https://cdn.dexscreener.com/cms/images/${token.icon}?width=64&height=64&fit=crop`} alt="" className="h-full w-full rounded-full object-cover" />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ backgroundColor: `hsl(${parseInt((token.tokenAddress || '0x00').slice(2, 8), 16) % 360}, 70%, 50%)` }}
          >
            {(token.tokenAddress || '??').slice(2, 4).toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-white truncate group-hover:text-rekt-blue transition-colors">
            {token.description?.slice(0, 30) || `Token #${index + 1}`}
          </h3>
          <span className="rounded bg-rekt-blue/10 px-1.5 py-0.5 text-[10px] text-rekt-blue">{chainLabel}</span>
        </div>
        <p className="text-xs text-rekt-muted truncate">
          {token.tokenAddress ? `${token.tokenAddress.slice(0, 8)}...${token.tokenAddress.slice(-6)}` : ''}
        </p>
      </div>
      <div className="flex-shrink-0 text-right">
        {token.totalAmount && token.totalAmount > 0 ? (
          <div className="text-xs text-rekt-blue font-medium flex items-center gap-1">
            <Flame className="h-3 w-3" /> {token.totalAmount} boosts
          </div>
        ) : (
          <ExternalLink className="h-4 w-4 text-rekt-muted group-hover:text-rekt-blue transition-colors" />
        )}
      </div>
    </Link>
  )
}

export default function LaunchpadClient({ boosted, profiles }: { boosted: DexToken[]; profiles: DexToken[] }) {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'trending' | 'new'>('trending')
  const displayTokens = tab === 'trending' ? boosted : profiles

  // Dedupe by tokenAddress
  const deduped = useMemo(() => {
    const seen = new Set<string>()
    return displayTokens.filter((t) => {
      const key = `${t.chainId}-${t.tokenAddress}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [displayTokens])

  const filtered = useMemo(() => {
    if (!search) return deduped.slice(0, 50)
    return deduped.filter((t) => {
      const s = search.toLowerCase()
      return (
        t.tokenAddress?.toLowerCase().includes(s) ||
        t.description?.toLowerCase().includes(s) ||
        t.chainId?.toLowerCase().includes(s)
      )
    }).slice(0, 50)
  }, [deduped, search])

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
      <div className="rounded-[28px] border border-border bg-card/68 p-6 md:p-8 shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold text-white">Token Launchpad</h1>
          <p className="mt-2 text-rekt-muted">Discover trending tokens and launch your own in a layout that now sits much closer to the casino shell.</p>
        </div>
        <Link
          href={TRADING_ENABLED ? "/launchpad/create" : "/waitlist"}
          className="flex items-center gap-2 rounded-xl bg-rekt-gold px-6 py-3 text-sm font-medium text-rekt-dark transition-all hover:opacity-80"
        >
          <Plus className="h-4 w-4" />
          Create Token
        </Link>
      </div>
      </div>

      {/* Search + Tabs */}
      <div className="rounded-2xl border border-border bg-card/58 p-4 shadow-[0_14px_34px_rgba(0,0,0,0.14)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rekt-muted" />
          <input
            type="text"
            placeholder="Search tokens by name, address, or chain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-rekt-border bg-rekt-card py-3 pl-10 pr-4 text-sm text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab('trending')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'trending' ? 'bg-rekt-blue text-white' : 'bg-rekt-card text-rekt-muted border border-rekt-border hover:text-white'
            }`}
          >
            <Flame className="h-4 w-4" /> Trending
          </button>
          <button
            onClick={() => setTab('new')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'new' ? 'bg-rekt-blue text-white' : 'bg-rekt-card text-rekt-muted border border-rekt-border hover:text-white'
            }`}
          >
            <Rocket className="h-4 w-4" /> New
          </button>
        </div>
        </div>
      </div>

      {/* On-Chain Tokens */}
      <OnChainTokens />

      {/* Token Feed */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-rekt-muted">
          <Rocket className="h-10 w-10 mb-4 opacity-30" />
          <p className="text-sm mb-2">No trending tokens on Base right now</p>
          <p className="text-xs text-rekt-muted/70">Check back soon or launch your own token</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl bg-rekt-card/50 border border-rekt-border px-4 py-3">
            <p className="text-[11px] text-rekt-muted">
              Third-party tokens on Base.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((token, i) => (
              <TokenCard key={`${token.chainId}-${token.tokenAddress}-${i}`} token={token} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
