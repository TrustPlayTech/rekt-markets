'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart3, Trophy, Rocket, User } from 'lucide-react'

const items = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/markets', icon: BarChart3, label: 'Markets' },
  { href: '/sports', icon: Trophy, label: 'Sports', center: true },
  { href: '/launchpad', icon: Rocket, label: 'Launchpad' },
  { href: '/portfolio', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-rekt-border bg-rekt-dark/95 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href)
          const Icon = item.icon
          if (item.center) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rekt-gold shadow-lg shadow-rekt-blue/30">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="mt-1 text-[10px] text-rekt-blue font-medium">{item.label}</span>
              </Link>
            )
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 py-1 px-3"
            >
              <Icon className={`h-5 w-5 ${active ? 'text-rekt-blue' : 'text-rekt-muted'}`} />
              <span className={`text-[10px] ${active ? 'text-rekt-blue font-medium' : 'text-rekt-muted'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
