import { Metadata } from 'next'
import SupportClient from './SupportClient'

export const metadata: Metadata = {
  title: 'Help & Support | Rekt Markets',
  description: 'Frequently asked questions and support for Rekt Markets prediction platform.',
}

// FAQ data used for both rendering and structured data
const faqs = [
  {
    q: 'What are prediction markets?',
    a: 'Prediction markets let you trade on the outcome of real-world events. You buy shares that pay out if your prediction is correct. Prices reflect the crowd\'s estimated probability of each outcome.',
  },
  {
    q: 'How do I start trading?',
    a: 'Join the Founders List, connect your wallet when trading goes live, deposit USDC on Base, and start placing trades on any available market.',
  },
  {
    q: 'What is USDC?',
    a: 'USDC is a stablecoin pegged 1:1 to the US dollar. It\'s issued by Circle and used as the collateral currency for all trades on Rekt Markets.',
  },
  {
    q: 'What blockchain does Rekt Markets use?',
    a: 'Rekt Markets is built on Base, a secure and low-cost Ethereum Layer 2 network incubated by Coinbase. Transactions are fast and gas fees are minimal.',
  },
  {
    q: 'How are markets resolved?',
    a: 'Markets are resolved using the UMA Optimistic Oracle, a decentralized truth machine. A multisig override exists as a safety mechanism for edge cases.',
  },
  {
    q: 'What happens if a market isn\'t resolved?',
    a: 'If a market remains unresolved beyond 30 days past its expected resolution date, an emergency refund mechanism returns collateral to all participants.',
  },
  {
    q: 'Is Rekt Markets provably fair?',
    a: 'Yes. All transactions, market creation, and resolutions happen on-chain and are fully verifiable. Anyone can audit the smart contracts and transaction history.',
  },
  {
    q: 'What are the fees?',
    a: 'Rekt Markets charges a 1% platform fee on prediction market buy transactions, deducted before your position is created. For Bonding Curve Tokens on the launchpad, a 2% sell fee is charged on sell transactions -- 1% goes to the token creator and 1% goes to the platform treasury. Creating a prediction market costs 5 USDC, and creating a token on the launchpad costs 10 USDC. These one-time creation fees go to the platform treasury. There are no fees on market seeding or redemption.',
  },
  {
    q: 'Which countries are restricted?',
    a: 'Rekt Markets is not available in the United States and sanctioned countries (Iran, Syria, Cuba, North Korea, and others). Users are responsible for compliance with their local laws.',
  },
  {
    q: 'How do I contact support?',
    a: 'Email us at support@markets.rektpalace.com or use the contact form below. We typically respond within 24 hours.',
  },
]

// FAQPage structured data for AI/search engines
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a,
    },
  })),
}

export default function SupportPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Help & Support</h1>
        <p className="text-rekt-muted mb-8">
          Have a question? Check the FAQ below or use the contact form.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-rekt-border bg-rekt-card p-5">
              <h3 className="text-sm font-semibold text-white mb-2">{faq.q}</h3>
              <p className="text-sm text-rekt-muted leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <SupportClient />
        </div>
      </div>
    </>
  )
}
