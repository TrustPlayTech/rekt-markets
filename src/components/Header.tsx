'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ExternalLink } from 'lucide-react'
import WalletButton from './WalletButton'
import BrandMark from './BrandMark'

const navItems = [
  { href: '/sports', label: 'Sports' },
  { href: '/markets', label: 'Markets' },
  { href: '/launchpad', label: 'Launchpad' },
  { href: 'https://rektpalace.com', label: 'Casino', external: true },
  { href: '/portfolio', label: 'Portfolio' },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-rekt-border bg-rekt-dark/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <BrandMark />

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-rekt-muted hover:text-white transition-colors"
              >
                {item.label}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  pathname?.startsWith(item.href)
                    ? 'bg-rekt-blue/10 text-rekt-blue'
                    : 'text-rekt-muted hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/waitlist"
            className="hidden rounded-lg bg-rekt-gold px-4 py-2 text-sm font-medium text-rekt-dark hover:opacity-80 transition-opacity md:block"
          >
            Founders List
          </Link>
          <div className="hidden md:block">
            <WalletButton />
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-rekt-muted hover:text-white md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-rekt-border bg-rekt-dark px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-1 rounded-lg px-4 py-3 text-sm font-medium text-rekt-muted hover:text-white transition-colors"
                >
                  {item.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    pathname?.startsWith(item.href)
                      ? 'bg-rekt-blue/10 text-rekt-blue'
                      : 'text-rekt-muted hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
          <div className="mt-4">
            <WalletButton />
          </div>
        </div>
      )}
    </header>
  )
}
