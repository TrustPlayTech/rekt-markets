import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Geo-Compliance Middleware - Three-tier jurisdiction handling
 *
 * Tier 1: Hard Block (no trading access, API endpoints blocked server-side)
 *   US, GU, AS, VI, PR, MP (US + territories)
 *   NL (Netherlands - KSA enforcement)
 *   TR (Turkey - criminal prohibition)
 *   IR, KP, SY, CU (sanctioned states)
 *
 * Tier 2: Soft Block (risk acknowledgment required before trading, handled client-side)
 *   GB, FR, IT, ES, DE, AU
 *
 * All other jurisdictions: Standard risk acknowledgment (client-side)
 *
 * NOTE: Crimea, Donetsk, and Luhansk regions do not have distinct ISO country codes
 * (they resolve as UA/Ukraine). IP geoblocking cannot reliably distinguish these regions.
 * Wallet-level screening (Chainalysis + OFAC) provides coverage for sanctioned entities
 * in these areas.
 *
 * Marketing/informational pages are accessible to ALL jurisdictions.
 * Only trading actions (API endpoints, wallet connect) are gated.
 */

const TIER1_COUNTRIES = [
  'US', 'GU', 'AS', 'VI', 'PR', 'MP', // US + territories
  'NL',                                  // Netherlands (KSA enforcement)
  'TR',                                  // Turkey (criminal prohibition)
  'IR', 'KP', 'SY', 'CU',             // Sanctioned states
]

const DEMO_PASSWORD = process.env.DEMO_PASSWORD

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow static assets
  if (
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.txt') ||
    pathname.endsWith('.xml') ||
    pathname.endsWith('.json')
  ) {
    return NextResponse.next()
  }

  // Allow compliance API endpoints (geo check, acknowledge) through always
  if (
    pathname === '/api/geo' ||
    pathname === '/api/acknowledge'
  ) {
    return NextResponse.next()
  }

  // Password gate — active when DEMO_PASSWORD env var is set
  if (DEMO_PASSWORD) {
    // Always public: coming-soon page, waitlist API, login
    if (
      pathname === '/coming-soon' ||
      pathname === '/login' ||
      pathname.startsWith('/api/waitlist') ||
      pathname.startsWith('/api/auth')
    ) return NextResponse.next()

    const authed = request.cookies.get('demo-auth')
    if (authed?.value === DEMO_PASSWORD || authed?.value === 'open') {
      // Cookie valid — let through
    } else {
      return NextResponse.rewrite(new URL('/coming-soon', request.url))
    }
  }

  // Tier 1: Block trading API endpoints for restricted jurisdictions
  const country = request.headers.get('x-vercel-ip-country') || ''
  if (TIER1_COUNTRIES.includes(country)) {
    // Block contract interaction APIs
    if (
      pathname.startsWith('/api/trade') ||
      pathname.startsWith('/api/approve') ||
      pathname.startsWith('/api/sports/resolve')
    ) {
      return NextResponse.json(
        { error: 'Service not available in your jurisdiction' },
        { status: 403 }
      )
    }
  }

  // All pages (including marketing, trading UI) are accessible to browse.
  // Trading actions are gated client-side via ComplianceGate.
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
