import Link from 'next/link'
import Image from 'next/image'
import { Zap, BarChart3, Rocket, Shield } from 'lucide-react'

export const metadata = { title: 'About - Rekt Markets' }

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center gap-3 mb-4">
        <Image src="/logo.svg" alt="Rekt Markets" width={40} height={40} />
        <h1 className="font-display text-3xl font-bold text-white">About Rekt Markets</h1>
      </div>
      <p className="text-rekt-muted mb-10 text-lg">
        The next generation prediction markets and token launchpad platform, built for speed and transparency.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 mb-10">
        {[
          {
            icon: <BarChart3 className="h-6 w-6 text-rekt-blue" />,
            title: 'Prediction Markets',
            desc: 'Trade on the outcomes of real-world events with binary markets. Simple yes/no positions with transparent on-chain settlement.',
          },
          {
            icon: <Rocket className="h-6 w-6 text-rekt-blue" />,
            title: 'Token Launchpad',
            desc: 'Launch tokens on bonding curves with zero seed funding. Fair, permissionless, and instant liquidity from day one.',
          },
          {
            icon: <Zap className="h-6 w-6 text-yellow-400" />,
            title: 'Lightning Fast',
            desc: 'Built on Base for sub-second transactions and minimal gas fees. Trade at the speed of thought.',
          },
          {
            icon: <Shield className="h-6 w-6 text-rekt-green" />,
            title: 'Non-Custodial',
            desc: 'Your funds, your keys. All trades settle through audited smart contracts. No intermediaries.',
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-rekt-border bg-rekt-card p-5">
            <div className="mb-3">{item.icon}</div>
            <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-xs text-rekt-muted">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-rekt-border bg-rekt-card p-6 mb-10">
        <h2 className="text-lg font-semibold text-white mb-3">Our Mission</h2>
        <p className="text-sm text-rekt-muted">
          Rekt Markets exists to democratize access to prediction markets and fair token launches. We believe that open, transparent markets produce the best information and the fairest outcomes. By building on decentralized infrastructure, we remove gatekeepers and put power in the hands of traders.
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-rekt-border">
        <Link href="/" className="text-sm text-rekt-blue hover:underline">&larr; Back to Home</Link>
      </div>
    </div>
  )
}
