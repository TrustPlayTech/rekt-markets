'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { ChevronDown, ChevronRight, Zap, Loader2, CheckCircle, ExternalLink, Search } from 'lucide-react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseUnits, formatUnits, type Address } from 'viem'
import {
  SportsEvent,
  SPORT_CATEGORIES,
  SportCategory,
  getSportEmoji,
  getSportCategory,
  getSportLabel,
  decimalOddsToCents,
} from '@/lib/sports'
import { TRADING_ENABLED } from '@/lib/trading'
import { useConnectOrWaitlist } from '@/components/ConnectOrWaitlist'
import {
  USDC_ADDRESS,
  BinaryMarketABI,
  ERC20ABI,
} from '@/lib/contracts'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SportsMarketEntry {
  gameId: string
  sportKey: string
  homeTeam: string
  awayTeam: string
  commenceTime: string
  marketAddress: string
  marketType: string
  resolved: boolean
  seeded: boolean
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatCommenceTime(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()

  if (diffMs < 0 && diffMs > -3 * 60 * 60 * 1000) return 'LIVE'

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()

  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  if (isToday) return `Today ${time}`
  if (isTomorrow) return `Tomorrow ${time}`
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ` ${time}`
}

/* ------------------------------------------------------------------ */
/*  OddsButton                                                         */
/* ------------------------------------------------------------------ */

function OddsButton({ label, cents, onClick, isActive }: { label: string; cents: number; onClick: () => void; isActive?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-lg border px-3 py-2.5 text-center transition-all ${
        isActive
          ? 'bg-rekt-green/20 border-rekt-green text-white'
          : TRADING_ENABLED
            ? 'border-rekt-border bg-rekt-dark hover:border-rekt-blue/50 hover:bg-rekt-blue/10 cursor-pointer'
            : 'border-rekt-border/50 bg-rekt-dark/50 hover:border-rekt-gold/30 hover:bg-rekt-gold/5 cursor-pointer'
      }`}
    >
      <div className={`text-xs truncate ${isActive ? 'text-white' : 'text-rekt-muted'}`}>{label}</div>
      <div className={`text-sm font-semibold mt-0.5 ${isActive ? 'text-white' : TRADING_ENABLED ? 'text-white' : 'text-rekt-muted'}`}>
        {cents}¢
      </div>
    </button>
  )
}


/* ------------------------------------------------------------------ */
/*  MarketSection                                                      */
/* ------------------------------------------------------------------ */

function MarketSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs font-medium text-rekt-muted hover:text-white transition-colors mb-1.5"
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {title}
      </button>
      {open && <div className="flex gap-2">{children}</div>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  TradePanel - handles on-chain trading                              */
/* ------------------------------------------------------------------ */

function TradePanel({
  activeTrade,
  onClose,
  marketEntry,
  event,
  hasStarted,
}: {
  activeTrade: { side: 'home' | 'away'; label: string; cents: number }
  onClose: () => void
  marketEntry: SportsMarketEntry | null
  event: SportsEvent
  hasStarted: boolean
}) {
  const [amount, setAmount] = useState(0)
  const { address: userAddress, isConnected } = useAccount()
  const { connect, modal } = useConnectOrWaitlist()

  // On-chain trade state
  const [txStep, setTxStep] = useState<'idle' | 'approving' | 'buying' | 'done'>('idle')

  const buyYes = activeTrade.side === 'home'
  const usdcAmount = parseUnits(amount.toString(), 6)
  const marketAddress = marketEntry?.marketAddress as Address | undefined

  // Check USDC allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20ABI,
    functionName: 'allowance',
    args: userAddress && marketAddress ? [userAddress, marketAddress] : undefined,
    query: { enabled: !!userAddress && !!marketAddress },
  })

  // Check USDC balance
  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  })

  // Approve tx
  const { writeContract: doApprove, data: approveTxHash, isPending: approving, reset: resetApprove } = useWriteContract()
  const { isLoading: waitingApprove, isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveTxHash })

  // Buy tx
  const { writeContract: doBuy, data: buyTxHash, isPending: buying, reset: resetBuy } = useWriteContract()
  const { isLoading: waitingBuy, isSuccess: buySuccess } = useWaitForTransactionReceipt({ hash: buyTxHash })

  // After approve, do buy
  useEffect(() => {
    if (approveSuccess && txStep === 'approving') {
      refetchAllowance()
      setTxStep('buying')
      if (marketAddress) {
        doBuy({
          address: marketAddress,
          abi: BinaryMarketABI,
          functionName: buyYes ? 'buyYes' : 'buyNo',
          args: [usdcAmount, BigInt(0)], // minTokensOut = 0 (no slippage protection for demo)
        })
      }
    }
  }, [approveSuccess, txStep, marketAddress, buyYes, usdcAmount, doBuy, refetchAllowance])

  // After buy complete
  useEffect(() => {
    if (buySuccess && txStep === 'buying') {
      setTxStep('done')
    }
  }, [buySuccess, txStep])

  const needsApproval = allowance !== undefined && usdcAmount > BigInt(0) && allowance < usdcAmount
  const potentialWin = amount > 0 ? (amount / (activeTrade.cents / 100)).toFixed(2) : '0.00'
  const hasBalance = usdcBalance !== undefined && usdcBalance >= usdcAmount

  const handleTrade = () => {
    if (!TRADING_ENABLED || !isConnected) {
      connect()
      return
    }

    if (!marketEntry || !marketAddress) {
      return
    }

    if (amount === 0) return

    // Reset previous tx state
    resetApprove()
    resetBuy()

    if (needsApproval) {
      setTxStep('approving')
      doApprove({
        address: USDC_ADDRESS,
        abi: ERC20ABI,
        functionName: 'approve',
        args: [marketAddress, usdcAmount],
      })
    } else {
      setTxStep('buying')
      doBuy({
        address: marketAddress,
        abi: BinaryMarketABI,
        functionName: buyYes ? 'buyYes' : 'buyNo',
        args: [usdcAmount, BigInt(0)],
      })
    }
  }

  const isProcessing = txStep === 'approving' || txStep === 'buying' || approving || buying || waitingApprove || waitingBuy

  return (
    <div className="mt-4 border-t border-rekt-border pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-rekt-muted">Your pick</div>
          <div className="text-sm font-bold text-white">{activeTrade.label} <span className="text-rekt-blue">{activeTrade.cents}¢</span></div>
        </div>
        <button onClick={onClose} className="text-xs text-rekt-muted hover:text-white">✕ Close</button>
      </div>

      {/* On-chain market info - only show on demo/preview site */}
      {TRADING_ENABLED && marketEntry && (
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-green-500/20 text-green-400 px-2 py-0.5 font-medium">On-Chain</span>
          <a
            href={`https://sepolia.basescan.org/address/${marketEntry.marketAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rekt-blue hover:underline flex items-center gap-1"
          >
            {marketEntry.marketAddress.slice(0, 6)}...{marketEntry.marketAddress.slice(-4)}
            <ExternalLink className="h-3 w-3" />
          </a>
          {!marketEntry.seeded && (
            <span className="text-yellow-500 text-[10px]">Unseeded</span>
          )}
        </div>
      )}

      {TRADING_ENABLED && !marketEntry && (
        <div className="text-xs text-yellow-500 bg-yellow-500/10 rounded-lg px-3 py-2">
          No on-chain market yet. Market will be available soon.
        </div>
      )}

      <div className="text-center">
        <div className="text-xs text-rekt-muted mb-1">Amount (USDC)</div>
        <div className="flex items-center justify-center">
          <span className="text-3xl font-bold text-white mr-1">$</span>
          <input
            type="number"
            min="0"
            step="1"
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            placeholder="0"
            className="text-3xl font-bold text-white bg-transparent border-none outline-none w-24 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        {userAddress && usdcBalance !== undefined && (
          <div className="text-xs text-rekt-muted mt-1">
            Balance: ${formatUnits(usdcBalance, 6)} USDC
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-center">
        {[1, 5, 10, 100].map(v => (
          <button
            key={v}
            onClick={() => setAmount(prev => prev + v)}
            className="rounded-lg border border-rekt-border px-3 py-1.5 text-xs text-rekt-muted hover:text-white hover:border-rekt-blue/50 transition-colors"
          >
            +${v}
          </button>
        ))}
        <button
          onClick={() => setAmount(0)}
          className="rounded-lg border border-rekt-border px-3 py-1.5 text-xs text-rekt-muted hover:text-white hover:border-rekt-blue/50 transition-colors"
        >
          Clear
        </button>
      </div>

      {amount > 0 && (
        <div className="text-xs text-rekt-muted space-y-1 px-1">
          <div className="flex justify-between">
            <span>Platform fee (1%)</span>
            <span>${(amount * 0.02).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Position size</span>
            <span>${(amount * 0.98).toFixed(2)}</span>
          </div>
        </div>
      )}

      {amount > 0 && (
        <div className="text-center">
          <div className="text-xs text-rekt-muted">Potential payout</div>
          <div className="text-2xl font-bold text-rekt-green">${potentialWin}</div>
        </div>
      )}

      {/* Transaction status */}
      {txStep === 'done' && (
        <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 rounded-lg px-3 py-2">
          <CheckCircle className="h-4 w-4" />
          Trade successful!
          {buyTxHash && (
            <a
              href={`https://sepolia.basescan.org/tx/${buyTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rekt-blue hover:underline ml-auto text-xs"
            >
              View tx
            </a>
          )}
        </div>
      )}

      <button
        onClick={handleTrade}
        disabled={TRADING_ENABLED && (hasStarted || amount === 0 || isProcessing || !marketEntry || txStep === 'done' || (amount > 0 && !hasBalance))}
        className={`w-full rounded-xl py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
          !TRADING_ENABLED 
            ? 'bg-rekt-blue/10 border border-rekt-blue/30 text-rekt-blue hover:bg-rekt-blue/20 cursor-pointer' 
            : 'bg-rekt-blue text-white hover:bg-rekt-blue/80 disabled:opacity-40 disabled:cursor-not-allowed'
        }`}
      >
        {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
        {!TRADING_ENABLED ? 'Connect Wallet to Trade' :
         !isConnected ? 'Connect Wallet' :
         hasStarted ? 'Trading Closed (Live)' :
         !marketEntry ? 'Market Coming Soon' :
         txStep === 'done' ? 'Trade Complete' :
         txStep === 'approving' ? 'Approving USDC...' :
         txStep === 'buying' ? 'Placing Trade...' :
         amount === 0 ? 'Enter Amount' :
         !hasBalance ? 'Insufficient USDC' :
         needsApproval ? 'Approve & Trade' :
         'Trade'}
      </button>

      <p className="text-[10px] text-rekt-muted text-center">
        By trading, you agree to the <a href="/terms" className="text-rekt-blue hover:underline">Terms of Use</a>.
        {' '}Trades on Base Sepolia testnet.
      </p>
      {modal}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  GameCard                                                           */
/* ------------------------------------------------------------------ */

function GameCard({
  event,
  registry,
}: {
  event: SportsEvent
  registry: Map<string, SportsMarketEntry>
}) {
  const [activeTrade, setActiveTrade] = useState<{ side: 'home' | 'away'; label: string; cents: number } | null>(null)

  const timeStr = formatCommenceTime(event.commence_time)
  const isLive = timeStr === 'LIVE'
  const hasStarted = new Date(event.commence_time).getTime() <= Date.now()
  const emoji = getSportEmoji(event.sport_key)
  const sportLabel = getSportLabel(event.sport_key)
  const marketEntry = registry.get(event.id) || null

  const bookmaker = event.bookmakers[0]
  const h2h = bookmaker?.markets.find((m) => m.key === 'h2h')
  const spreads = bookmaker?.markets.find((m) => m.key === 'spreads')
  const totals = bookmaker?.markets.find((m) => m.key === 'totals')

  const handleOddsClick = (side: 'home' | 'away', label: string, cents: number) => {
    if (activeTrade?.label === label) {
      setActiveTrade(null)
    } else {
      setActiveTrade({ side, label, cents })
    }
  }

  return (
    <div className={`rounded-xl border bg-rekt-card p-4 transition-all ${activeTrade ? 'border-rekt-blue/50' : 'border-rekt-border hover:border-rekt-blue/30'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">{emoji}</span>
          <span className="rounded-md bg-rekt-blue/10 px-2 py-0.5 text-[11px] font-medium text-rekt-blue">
            {sportLabel}
          </span>
          {TRADING_ENABLED && marketEntry && (
            <span className="rounded-md bg-green-500/10 px-1.5 py-0.5 text-[10px] font-medium text-green-400">
              On-Chain
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1 rounded-full bg-rekt-red/20 px-2 py-0.5 text-[11px] font-semibold text-rekt-red">
              <Zap className="h-3 w-3" />
              LIVE
            </span>
          )}
          <span className="text-xs text-rekt-muted">{isLive ? 'In Progress' : timeStr}</span>
        </div>
      </div>

      {/* Teams */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">{event.home_team}</span>
          <span className="text-xs text-rekt-muted">vs</span>
          <span className="text-sm font-semibold text-white text-right">{event.away_team}</span>
        </div>
      </div>

      {/* Markets */}
      {h2h && (
        <MarketSection title="Moneyline (Winner)">
          <OddsButton
            label={h2h.outcomes[0].name}
            cents={decimalOddsToCents(h2h.outcomes[0].price)}
            onClick={() => handleOddsClick('home', h2h.outcomes[0].name, decimalOddsToCents(h2h.outcomes[0].price))}
            isActive={activeTrade?.label === h2h.outcomes[0].name}
          />
          <OddsButton
            label={h2h.outcomes[1].name}
            cents={decimalOddsToCents(h2h.outcomes[1].price)}
            onClick={() => handleOddsClick('away', h2h.outcomes[1].name, decimalOddsToCents(h2h.outcomes[1].price))}
            isActive={activeTrade?.label === h2h.outcomes[1].name}
          />
        </MarketSection>
      )}

      {spreads && (() => {
        const s0Label = `${spreads.outcomes[0].name} ${(spreads.outcomes[0].point ?? 0) > 0 ? '+' : ''}${spreads.outcomes[0].point}`
        const s1Label = `${spreads.outcomes[1].name} ${(spreads.outcomes[1].point ?? 0) > 0 ? '+' : ''}${spreads.outcomes[1].point}`
        return (
          <MarketSection title="Spread" defaultOpen={false}>
            <OddsButton
              label={s0Label}
              cents={decimalOddsToCents(spreads.outcomes[0].price)}
              onClick={() => handleOddsClick('home', s0Label, decimalOddsToCents(spreads.outcomes[0].price))}
              isActive={activeTrade?.label === s0Label}
            />
            <OddsButton
              label={s1Label}
              cents={decimalOddsToCents(spreads.outcomes[1].price)}
              onClick={() => handleOddsClick('away', s1Label, decimalOddsToCents(spreads.outcomes[1].price))}
              isActive={activeTrade?.label === s1Label}
            />
          </MarketSection>
        )
      })()}

      {totals && (() => {
        const t0Label = `Over ${totals.outcomes[0].point}`
        const t1Label = `Under ${totals.outcomes[1].point}`
        return (
          <MarketSection title="Totals (Over/Under)" defaultOpen={false}>
            <OddsButton
              label={t0Label}
              cents={decimalOddsToCents(totals.outcomes[0].price)}
              onClick={() => handleOddsClick('home', t0Label, decimalOddsToCents(totals.outcomes[0].price))}
              isActive={activeTrade?.label === t0Label}
            />
            <OddsButton
              label={t1Label}
              cents={decimalOddsToCents(totals.outcomes[1].price)}
              onClick={() => handleOddsClick('away', t1Label, decimalOddsToCents(totals.outcomes[1].price))}
              isActive={activeTrade?.label === t1Label}
            />
          </MarketSection>
        )
      })()}

      {/* Inline Trade Panel */}
      {activeTrade && (
        <TradePanel
          activeTrade={activeTrade}
          onClose={() => setActiveTrade(null)}
          marketEntry={marketEntry}
          event={event}
          hasStarted={new Date(event.commence_time).getTime() <= Date.now()}
        />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SportGroup                                                         */
/* ------------------------------------------------------------------ */

function SportGroup({
  sportKey,
  events,
  registry,
  defaultOpen = true,
}: {
  sportKey: string
  events: SportsEvent[]
  registry: Map<string, SportsMarketEntry>
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const emoji = getSportEmoji(sportKey)
  const label = getSportLabel(sportKey)

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 mb-3 group"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 text-rekt-muted" />
        ) : (
          <ChevronRight className="h-4 w-4 text-rekt-muted" />
        )}
        <span className="text-lg">{emoji}</span>
        <h2 className="text-lg font-display font-bold text-white group-hover:text-rekt-blue transition-colors">
          {label}
        </h2>
        <span className="text-xs text-rekt-muted">({events.length})</span>
      </button>
      {open && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <GameCard key={event.id} event={event} registry={registry} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SportsClient (main export)                                         */
/* ------------------------------------------------------------------ */

export default function SportsClient({ events }: { events: SportsEvent[] }) {
  const [category, setCategory] = useState<SportCategory>('all')
  const [search, setSearch] = useState('')
  const [registry, setRegistry] = useState<Map<string, SportsMarketEntry>>(new Map())

  // Load sports registry
  useEffect(() => {
    fetch('/api/sports/registry')
      .then(r => r.json())
      .then(data => {
        const map = new Map<string, SportsMarketEntry>()
        if (data.markets) {
          for (const m of data.markets) {
            map.set(m.gameId, m)
          }
        }
        setRegistry(map)
      })
      .catch(() => {}) // Silent fail
  }, [])

  const filtered = useMemo(() => {
    const now = Date.now()
    let base: SportsEvent[]
    if (category === 'live') {
      base = events.filter((e) => {
        const commence = new Date(e.commence_time).getTime()
        return commence < now && commence > now - 4 * 60 * 60 * 1000
      })
    } else if (category === 'all') {
      base = events
    } else {
      base = events.filter((e) => getSportCategory(e.sport_key) === category)
    }
    // Apply search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      base = base.filter((e) =>
        e.home_team.toLowerCase().includes(q) ||
        e.away_team.toLowerCase().includes(q) ||
        e.sport_title.toLowerCase().includes(q) ||
        e.sport_key.toLowerCase().includes(q)
      )
    }
    // Sort: games with on-chain markets first, then by time
    return [...base].sort((a, b) => {
      const aHasMarket = registry.has(a.id) ? 0 : 1
      const bHasMarket = registry.has(b.id) ? 0 : 1
      if (aHasMarket !== bHasMarket) return aHasMarket - bHasMarket
      const aLive = new Date(a.commence_time).getTime() < now ? 0 : 1
      const bLive = new Date(b.commence_time).getTime() < now ? 0 : 1
      if (aLive !== bLive) return aLive - bLive
      return new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime()
    })
  }, [events, category, search, registry])

  const grouped = useMemo(() => {
    const map = new Map<string, SportsEvent[]>()
    filtered.forEach((e) => {
      const arr = map.get(e.sport_key) || []
      arr.push(e)
      map.set(e.sport_key, arr)
    })
    return Array.from(map.entries())
  }, [filtered])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Sports Markets</h1>
        <p className="mt-2 text-rekt-muted">Trade on live and upcoming sporting events</p>
        {TRADING_ENABLED && registry.size > 0 && (
          <p className="mt-1 text-xs text-green-400">
            {registry.size} on-chain markets available for trading
          </p>
        )}
      </div>

      {/* Search bar */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rekt-muted" />
        <input
          type="text"
          placeholder="Search teams, leagues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-rekt-border bg-rekt-card py-3 pl-10 pr-4 text-sm text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50"
        />
      </div>

      {/* Sport filter tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {SPORT_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              category === cat.key
                ? 'bg-rekt-blue text-white'
                : 'bg-rekt-card text-rekt-muted hover:text-white border border-rekt-border'
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Events grouped by sport */}
      {grouped.length === 0 ? (
        <div className="rounded-xl border border-rekt-border bg-rekt-card p-12 text-center">
          <p className="text-rekt-muted">No events found for this category</p>
        </div>
      ) : (
        grouped.map(([sportKey, sportEvents]) => (
          <SportGroup
            key={sportKey}
            sportKey={sportKey}
            events={sportEvents}
            registry={registry}
            defaultOpen={category !== 'all'}
          />
        ))
      )}
    </div>
  )
}
