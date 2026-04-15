import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import CookieBanner from '@/components/CookieBanner'
import SanctionsCheck from '@/components/SanctionsCheck'
import TawkTo from '@/components/TawkTo'
import { Analytics } from '@vercel/analytics/next'
import PostHogProvider from '@/components/PostHogProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
  title: {
    default: 'Rekt Markets - Prediction Markets & Token Launchpad',
    template: '%s | Rekt Markets',
  },
  description: 'Trade on real-world events, trade on sports, and launch tokens on Base. The all-in-one platform for prediction markets, sports trading, and token launches.',
  keywords: ['prediction markets', 'sports trading', 'token launchpad', 'crypto trading', 'Base blockchain', 'DeFi', 'USDC', 'on-chain trading'],
  authors: [{ name: 'Rekt Markets' }],
  creator: 'Meta Bliss Group B.V.',
  metadataBase: new URL('https://markets.rektpalace.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://markets.rektpalace.com',
    siteName: 'Rekt Markets',
    title: 'Rekt Markets - Predict. Launch. Play.',
    description: 'Prediction markets, sports trading, and token launches on Base. On-chain settlement with USDC.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Rekt Markets - Predict. Launch. Play.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rekt Markets - Predict. Launch. Play.',
    description: 'Prediction markets, sports trading, and token launches on Base.',
    images: ['/og-image.png'],
    creator: '@rektcasino',
  },
  robots: { index: true, follow: true },
  icons: { icon: '/logo.svg', apple: '/logo.svg' },
}

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Rekt Markets',
      legalName: 'Meta Bliss Group B.V.',
      url: 'https://markets.rektpalace.com',
      logo: 'https://markets.rektpalace.com/logo.svg',
      parentOrganization: {
        '@type': 'Organization',
        name: '36 Group AB',
        url: 'https://36.group',
      },
      sameAs: [
        'https://x.com/rektcasino',
        'https://discord.gg/dK6UMvNf',
        'https://t.me/rektcrypto',
      ],
    },
    {
      '@type': 'WebApplication',
      name: 'Rekt Markets',
      url: 'https://markets.rektpalace.com',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      description: 'Prediction market and token launchpad platform built on Base blockchain. Trade on real-world events, trade on sports, and launch tokens with bonding curve mechanics.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-rekt-dark font-sans antialiased">
        <Providers><PostHogProvider>
          <Header />
          <main className="min-h-[calc(100vh-4rem)] pb-16 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
          <CookieBanner />
          <SanctionsCheck />
          <TawkTo />
        </PostHogProvider></Providers>
        <Analytics />
      </body>
    </html>
  )
}
