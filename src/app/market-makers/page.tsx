'use client'

import { useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'

const positionSizes = ['<$10K', '$10-50K', '$50-250K', '$250K+']

export default function LFGPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [wallet, setWallet] = useState('')
  const [positionSize, setPositionSize] = useState('')
  const [protocols, setProtocols] = useState('')
  const [telegram, setTelegram] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/lfg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet, positionSize, protocols, telegram, notes }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* ── HERO ── */}
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
          Power the Market.
          <br />
          <span className="text-rekt-blue">Earn Real Yield.</span>
        </h1>
        <p className="text-rekt-muted text-lg max-w-xl mx-auto mb-6">
          Join the Liquidity Founders Group and provide liquidity to Rekt Markets prediction pools. Earn a direct cut of every trade. No token farming. No emissions. Just fees.
        </p>
        <p className="text-rekt-gold font-display text-2xl font-bold drop-shadow-[0_0_12px_rgba(234,179,8,0.3)]">
          LFG. 🚀
        </p>
      </div>

      {/* ── WHY BLIZZ MARKETS ── */}
      <div className="mb-16">
        <p className="text-rekt-blue text-[0.7rem] font-semibold uppercase tracking-widest mb-1">Why Rekt Markets</p>
        <h2 className="font-display text-2xl font-bold text-white tracking-tight mb-6">Three reasons to LP with us</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px rounded-xl overflow-hidden bg-rekt-border">
          {[
            {
              title: 'Real fees, not token rewards',
              desc: 'You earn from trading volume in USDC. No native token to dump. No vesting schedule. Just yield from real market activity.',
            },
            {
              title: 'Binary markets = high volume',
              desc: 'YES/NO prediction markets generate constant two-way flow as news breaks and probabilities shift. More volume per dollar of TVL than most DeFi pools.',
            },
            {
              title: 'LFG founding member status',
              desc: 'Early LPs get priority access, direct team communication, and first look at V2 concentrated liquidity.',
            },
          ].map((card) => (
            <div key={card.title} className="bg-rekt-card p-6 hover:bg-rekt-card/80 transition-colors">
              <h3 className="text-sm font-semibold text-white mb-2">{card.title}</h3>
              <p className="text-xs text-rekt-muted leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── V2 ── */}
      <div className="mb-16">
        <p className="text-rekt-blue text-[0.7rem] font-semibold uppercase tracking-widest mb-1">Roadmap</p>
        <h2 className="font-display text-2xl font-bold text-white tracking-tight mb-1">What&apos;s Coming in V2</h2>
        <p className="text-rekt-muted text-sm max-w-xl mb-6">
          V1 launches with standard CPMM pools. V2 upgrades to concentrated liquidity:
        </p>

        <div className="rounded-xl border border-rekt-border bg-rekt-card p-6 space-y-3">
          {[
            {
              label: 'Custom ranges',
              desc: 'Deploy capital where the action is instead of funding the full 0-100% curve.',
            },
            {
              label: 'Better capital efficiency',
              desc: 'Same fees, less capital.',
            },
            {
              label: 'Capped exposure',
              desc: 'Inactive liquidity sits safely when markets resolve to extremes.',
            },
          ].map((item) => (
            <div key={item.label} className="flex gap-3 items-start">
              <span className="text-rekt-green shrink-0 mt-0.5">✓</span>
              <div>
                <span className="text-sm font-semibold text-white">{item.label}.</span>{' '}
                <span className="text-sm text-rekt-muted">{item.desc}</span>
              </div>
            </div>
          ))}
          <p className="text-xs text-rekt-gold font-medium pt-2 border-t border-rekt-border/60">
            LFG members will shape the V2 architecture directly with the dev team.
          </p>
        </div>
      </div>

      {/* ── WHO THIS IS FOR ── */}
      <div className="mb-16">
        <p className="text-rekt-blue text-[0.7rem] font-semibold uppercase tracking-widest mb-1">Who This is For</p>
        <h2 className="font-display text-2xl font-bold text-white tracking-tight mb-6">You should apply if&hellip;</h2>

        <div className="space-y-3">
          {[
            "You've provided liquidity on Uniswap, Curve, or similar",
            'You understand impermanent loss and accept the risk',
            'You want sustainable fee yield, not a farm-and-dump',
            'You want to be early to a new vertical',
          ].map((item) => (
            <div key={item} className="flex gap-3 items-start text-sm">
              <span className="text-rekt-blue shrink-0 mt-0.5">→</span>
              <span className="text-rekt-muted">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── APPLICATION FORM ── */}
      <div className="rounded-xl border border-rekt-border bg-rekt-card p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold text-white tracking-tight mb-1">Apply to Join LFG</h2>
        <p className="text-rekt-muted text-sm mb-8">Limited spots. We&apos;re onboarding selectively.</p>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="h-10 w-10 text-rekt-green mb-4" />
            <p className="text-lg font-semibold text-white mb-1">Application received!</p>
            <p className="text-sm text-rekt-muted">We&apos;ll be in touch.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Wallet */}
            <div>
              <label htmlFor="wallet" className="block text-xs font-medium text-rekt-muted mb-1.5">
                Wallet address <span className="text-red-400">*</span>
              </label>
              <input
                id="wallet"
                type="text"
                required
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="0x..."
                className="w-full rounded-lg border border-rekt-border bg-rekt-dark px-4 py-2.5 text-sm text-white placeholder:text-rekt-muted/50 focus:border-rekt-blue focus:outline-none focus:ring-1 focus:ring-rekt-blue"
              />
            </div>

            {/* Position size */}
            <div>
              <label htmlFor="positionSize" className="block text-xs font-medium text-rekt-muted mb-1.5">
                Typical LP position size <span className="text-red-400">*</span>
              </label>
              <select
                id="positionSize"
                required
                value={positionSize}
                onChange={(e) => setPositionSize(e.target.value)}
                className="w-full rounded-lg border border-rekt-border bg-rekt-dark px-4 py-2.5 text-sm text-white focus:border-rekt-blue focus:outline-none focus:ring-1 focus:ring-rekt-blue"
              >
                <option value="" disabled>Select a range</option>
                {positionSizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Protocols */}
            <div>
              <label htmlFor="protocols" className="block text-xs font-medium text-rekt-muted mb-1.5">
                Which protocols have you LP&apos;d on before? <span className="text-red-400">*</span>
              </label>
              <input
                id="protocols"
                type="text"
                required
                value={protocols}
                onChange={(e) => setProtocols(e.target.value)}
                placeholder="Uniswap V3, Curve, Balancer..."
                className="w-full rounded-lg border border-rekt-border bg-rekt-dark px-4 py-2.5 text-sm text-white placeholder:text-rekt-muted/50 focus:border-rekt-blue focus:outline-none focus:ring-1 focus:ring-rekt-blue"
              />
            </div>

            {/* Telegram */}
            <div>
              <label htmlFor="telegram" className="block text-xs font-medium text-rekt-muted mb-1.5">
                Telegram handle <span className="text-rekt-muted/50">(optional)</span>
              </label>
              <input
                id="telegram"
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="@yourhandle"
                className="w-full rounded-lg border border-rekt-border bg-rekt-dark px-4 py-2.5 text-sm text-white placeholder:text-rekt-muted/50 focus:border-rekt-blue focus:outline-none focus:ring-1 focus:ring-rekt-blue"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-xs font-medium text-rekt-muted mb-1.5">
                Anything else we should know? <span className="text-rekt-muted/50">(optional)</span>
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Strategy, experience, questions..."
                className="w-full rounded-lg border border-rekt-border bg-rekt-dark px-4 py-2.5 text-sm text-white placeholder:text-rekt-muted/50 focus:border-rekt-blue focus:outline-none focus:ring-1 focus:ring-rekt-blue resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-rekt-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Apply to Join LFG'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
