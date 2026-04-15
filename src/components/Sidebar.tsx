'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ComponentType } from 'react'
import {
  BarChart3,
  Trophy,
  Rocket,
  Wallet,
  Gift,
  Users,
  MessageCircle,
  type LucideProps,
} from 'lucide-react'

type NavItem = {
  href: string
  label: string
  icon: ComponentType<LucideProps>
}

const primaryItems: NavItem[] = [
  { href: '/markets', label: 'Markets', icon: BarChart3 },
  { href: '/sports', label: 'Sports', icon: Trophy },
  { href: '/launchpad', label: 'Launchpad', icon: Rocket },
  { href: '/portfolio', label: 'Portfolio', icon: Wallet },
]

const moreItems: NavItem[] = [
  { href: '/referrals', label: 'Referrals', icon: Gift },
  { href: '/market-makers', label: 'Liquidity Founders', icon: Users },
  { href: '/support', label: 'Support', icon: MessageCircle },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  const renderItem = (item: NavItem) => {
    const active = isActive(item.href)
    const Icon = item.icon

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
          active
            ? 'bg-primary/14 text-white border border-primary/35 shadow-[0_0_20px_rgba(108,92,231,0.12)]'
            : 'text-foreground/78 hover:text-white hover:bg-card-hover border border-transparent'
        }`}
      >
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            active ? 'bg-primary/18 text-primary' : 'bg-background/60 text-foreground/65 group-hover:text-white'
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span>{item.label}</span>
      </Link>
    )
  }

  const sidebarContent = (
    <>
      <div className="px-3 pt-3">
        <div className="rounded-2xl border border-border bg-background/75 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <div className="grid grid-cols-2 gap-1.5">
            <a
              href="https://rektpalace.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground/82 hover:bg-card-hover hover:text-white transition-colors"
            >
              Casino
            </a>
            <Link
              href="/markets"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_20px_rgba(108,92,231,0.28)] transition-colors hover:bg-primary-hover"
            >
              Predictions
            </Link>
          </div>
        </div>
      </div>

      <nav className="py-4 px-2">
        <div className="px-2 pb-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary/85">
            Prediction Products
          </span>
        </div>
        <div className="space-y-1.5">
          {primaryItems.map(renderItem)}
        </div>

        <div className="my-5 mx-2 border-t border-border" />

        <div className="px-2 pb-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/58">
            More
          </span>
        </div>
        <div className="space-y-1.5">
          {moreItems.map(renderItem)}
        </div>
      </nav>
    </>
  )

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg bg-card border border-border text-foreground hover:bg-card-hover transition-colors"
        style={{ top: '72px' }}
        aria-label={mobileOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`md:hidden fixed left-0 top-14 bottom-0 z-50 bg-card border-r border-border w-56 sidebar-transition overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      <aside className="hidden md:block fixed left-0 top-14 bottom-0 z-40 w-56 bg-card border-r border-border overflow-y-auto">
        {sidebarContent}
      </aside>
    </>
  )
}
