'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Copy, CheckCircle, Check, Clock, Zap } from 'lucide-react'
import { useComplianceConnect } from '@/hooks/useComplianceConnect'

export default function ReferralsPage() {
  const { address, isConnected } = useAccount()
  const { connect, modal } = useComplianceConnect()
  const [copied, setCopied] = useState(false)

  const referralLink = address
    ? `https://markets.rektpalace.com?ref=${address}`
    : null

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      {modal}

      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Invite Friends. Earn 25% of Their Fees. Forever.
        </h1>
        <p className="text-lg text-rekt-muted max-w-2xl mx-auto">
          Every trade your referrals make, you earn. No tokens. No vesting. Just USDC paid to your wallet.
        </p>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: '1',
              title: 'Share your link.',
              desc: 'Every connected wallet gets a unique referral link.',
            },
            {
              step: '2',
              title: 'Friends trade.',
              desc: 'When they place predictions, you earn 25% of the platform fees.',
            },
            {
              step: '3',
              title: 'Get paid.',
              desc: 'USDC payouts weekly to your wallet. No minimums. No hoops.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-rekt-border bg-rekt-card p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-rekt-blue/20 text-sm font-bold text-rekt-blue">
                {item.step}
              </div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-rekt-muted">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-rekt-muted mt-6 max-w-xl mx-auto">
          Your referrals get 10% off trading fees for their first 90 days. They save money, you make money.
        </p>
      </div>

      {/* Your Dashboard */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Dashboard</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Earned', value: '--', subtitle: 'All-time USDC paid to your wallet' },
            { label: 'This Week', value: '--', subtitle: 'Earnings since last payout' },
            { label: 'Active Referrals', value: '--', subtitle: 'Friends who traded this month' },
            { label: 'Total Referrals', value: '--', subtitle: 'Everyone who signed up with your link' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-rekt-border bg-rekt-card p-5 text-center"
            >
              <p className="text-xs text-rekt-muted uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-rekt-muted">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Referral Link / CTA */}
        {isConnected && referralLink ? (
          <div className="rounded-2xl border border-rekt-border bg-rekt-card p-6">
            <label className="block text-sm font-medium text-white mb-2">Your Referral Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 rounded-xl border border-rekt-border bg-rekt-dark px-4 py-3 text-sm text-white font-mono outline-none"
              />
              <button
                onClick={handleCopy}
                className="rounded-xl bg-rekt-blue px-4 py-3 text-sm font-medium text-white hover:bg-rekt-blue/80 flex items-center gap-2 transition-colors"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={connect}
              className="rounded-xl bg-rekt-blue px-8 py-3.5 text-sm font-medium text-white hover:bg-rekt-blue/80 transition-colors"
            >
              Connect Wallet to Get Your Link
            </button>
          </div>
        )}
      </div>

      {/* Why This Beats Token Farming */}
      <div className="mb-16">
        <div className="rounded-2xl border border-rekt-border bg-rekt-card p-8">
          <h2 className="text-xl font-bold text-white mb-6">Why This Beats Token Farming</h2>
          <div className="space-y-4">
            {[
              'No native token to dump on you.',
              'Earnings are in USDC, not some governance token worth nothing in 6 months.',
              'You earn as long as your referrals trade. Not 30 days. Not a season. Forever.',
              'Binary prediction markets generate high-frequency trading. More trades = more fees = more for you.',
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <Check className="h-5 w-5 text-rekt-blue shrink-0 mt-0.5" />
                <p className="text-sm text-rekt-muted">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="mb-16">
        <div className="rounded-2xl border border-rekt-gold/20 bg-rekt-card p-8">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-5 w-5 text-rekt-gold" />
            <h2 className="text-xl font-bold text-white">Coming Soon</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              '30% rev share for power referrers (10+ active referrals)',
              'Real-time earnings display',
              'Sub-affiliate tracking (earn from your referrals\u2019 referrals)',
              'On-chain instant settlement',
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <Clock className="h-4 w-4 text-rekt-gold shrink-0 mt-0.5" />
                <p className="text-sm text-rekt-muted">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">FAQ</h2>
        <div className="space-y-6 max-w-2xl mx-auto">
          {[
            {
              q: 'When do I get paid?',
              a: 'Weekly in USDC to your connected wallet.',
            },
            {
              q: 'Is there a minimum?',
              a: "No minimum. Whatever you've earned that week gets sent.",
            },
            {
              q: 'Do my referrals know I earn from their trades?',
              a: 'The program is transparent. They know, and they benefit too with a 10% fee discount.',
            },
            {
              q: 'How long do I earn from a referral?',
              a: 'Forever. As long as they trade on Rekt Markets, you earn.',
            },
          ].map((faq, i) => (
            <div key={i} className="rounded-xl border border-rekt-border bg-rekt-card p-5">
              <h3 className="text-sm font-semibold text-white mb-2">{faq.q}</h3>
              <p className="text-sm text-rekt-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        {isConnected && referralLink ? (
          <div className="rounded-2xl border border-rekt-border bg-rekt-card p-6 inline-block">
            <p className="text-sm text-rekt-muted mb-3">Your referral link</p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="rounded-xl border border-rekt-border bg-rekt-dark px-4 py-3 text-sm text-white font-mono outline-none w-80"
              />
              <button
                onClick={handleCopy}
                className="rounded-xl bg-rekt-blue px-4 py-3 text-sm font-medium text-white hover:bg-rekt-blue/80 flex items-center gap-2 transition-colors"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={connect}
            className="rounded-xl bg-rekt-blue px-8 py-3.5 text-sm font-medium text-white hover:bg-rekt-blue/80 transition-colors"
          >
            Connect Wallet to Get Your Link
          </button>
        )}
      </div>
    </div>
  )
}
