import Image from 'next/image'
import Link from 'next/link'

const productLinks = [
  { label: 'Predictions', href: '/markets' },
  { label: 'Sports', href: '/sports' },
  { label: 'Launchpad', href: '/launchpad' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Casino', href: 'https://rektpalace.com' },
]

const resourceLinks = [
  { label: 'Support', href: '/support' },
  { label: 'Referrals', href: '/referrals' },
  { label: 'Liquidity Founders', href: '/market-makers' },
  { label: 'Resolution', href: '/resolution' },
  { label: 'Risk Notice', href: '/risk-notice' },
]

const legalLinks = [
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'AML/KYC Policy', href: '/aml' },
  { label: 'Risk Disclosures', href: '/risks' },
]

export default function Footer() {
  return (
    <footer className="pl-0 md:pl-56 bg-footer border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="mb-3">
              <Image
                src="/rekt-logo-transparent.png"
                alt="Rekt Palace"
                width={108}
                height={48}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Rekt Palace Prediction Markets, built with the same visual language as the casino. Predict, trade, and launch in one ecosystem.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/80 mb-4">
              Products
            </h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/80 mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/80 mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>&copy; 2026 Rekt Palace Prediction Markets. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>On-chain market access</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Separate balances from casino wallet</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
