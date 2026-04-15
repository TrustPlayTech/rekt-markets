import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liquidity Founders Group (LFG)',
  description:
    'Provide liquidity to Rekt Markets prediction pools and earn real yield from trading fees.',
}

export default function LFGLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
