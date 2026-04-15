import Link from 'next/link'

export const metadata = { title: 'Market Resolution - Rekt Markets' }

export default function ResolutionPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-white mb-2">Market Resolution</h1>
      <p className="text-sm text-rekt-muted mb-8">How prediction markets are resolved on Rekt Markets</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-6">

        {/* How Resolution Works */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">How Resolution Works</h2>
        <p className="text-rekt-muted leading-relaxed">
          Each prediction market on Rekt Markets has a defined resolution time and clear resolution criteria.
          When the resolution time is reached, the market owner (or an authorized resolver contract) submits
          the outcome -- YES or NO -- based on the pre-defined criteria.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          Resolution is supported by two mechanisms:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-rekt-muted">
          <li><strong className="text-white">UMA Optimistic Oracle:</strong> For markets that use the UMA integration, proposed resolutions are subject to a dispute window. Anyone can challenge a proposed outcome by posting a bond.</li>
          <li><strong className="text-white">Owner / Multisig Override:</strong> The platform operator (via a Gnosis Safe multisig) can resolve markets directly. This acts as a backstop for oracle failures or ambiguous outcomes.</li>
        </ul>

        {/* Resolution Criteria */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">Resolution Criteria</h2>
        <p className="text-rekt-muted leading-relaxed">
          Every market must have clear, unambiguous resolution criteria visible before trading begins. The market
          question and resolution source are defined at creation time and cannot be changed after the market is seeded.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          Traders should review the market question carefully before taking a position. If the resolution criteria
          are ambiguous, the market may be voided and an emergency refund issued.
        </p>

        {/* Resolution Timeline */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">Resolution Timeline</h2>
        <div className="rounded-lg border border-rekt-border bg-rekt-card p-4 space-y-2">
          <p className="text-rekt-muted leading-relaxed">
            <strong className="text-white">1. Resolution Time:</strong> Markets become eligible for resolution after the specified resolution time.
          </p>
          <p className="text-rekt-muted leading-relaxed">
            <strong className="text-white">2. Resolution Submission:</strong> The market owner or resolver submits the outcome on-chain.
          </p>
          <p className="text-rekt-muted leading-relaxed">
            <strong className="text-white">3. Redemption:</strong> Winning token holders can redeem their tokens for USDC proportional to their share of the pool.
          </p>
          <p className="text-rekt-muted leading-relaxed">
            <strong className="text-white">4. Emergency Refund:</strong> If the market is not resolved within 30 days after the resolution time, any user can activate emergency mode. In emergency mode, all token holders (YES and NO) can claim a pro-rata refund of the remaining collateral.
          </p>
        </div>

        {/* Sports Markets */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">Sports Markets</h2>
        <p className="text-rekt-muted leading-relaxed">
          Sports prediction markets are resolved automatically using official game scores sourced from{' '}
          <a href="https://the-odds-api.com" target="_blank" rel="noopener noreferrer" className="text-rekt-blue hover:underline">The Odds API</a>.
          A server-side cron job checks completed games and submits resolutions on-chain without manual intervention.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          If a game is cancelled, postponed, or the API data is unavailable, the market will remain unresolved
          until manual intervention or the emergency refund period activates.
        </p>

        {/* Dispute Process */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">Dispute Process</h2>
        <p className="text-rekt-muted leading-relaxed">
          For markets using the UMA Optimistic Oracle, anyone can dispute a proposed resolution by posting a bond
          during the dispute window. Disputes are escalated to UMA&apos;s decentralized verification mechanism (DVM),
          where UMA token holders vote on the correct outcome.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          For markets resolved by the platform operator, disputes can be submitted by email. The platform
          reserves the right to void a market and issue emergency refunds if a resolution error is identified.
        </p>

        {/* Contact */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">Contact</h2>
        <p className="text-rekt-muted leading-relaxed">
          If you believe a market has been resolved incorrectly, or have questions about resolution criteria,
          please contact us at{' '}
          <a href="mailto:legal@markets.rektpalace.com" className="text-rekt-blue hover:underline">legal@markets.rektpalace.com</a>.
        </p>

      </div>

      <div className="mt-8 pt-6 border-t border-rekt-border">
        <Link href="/" className="text-sm text-rekt-blue hover:underline">&larr; Back to Home</Link>
      </div>
    </div>
  )
}
