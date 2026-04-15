import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const TIER1_COUNTRIES = [
  'US', 'GU', 'AS', 'VI', 'PR', 'MP', // US + territories
  'NL',                                  // Netherlands
  'TR',                                  // Turkey
  'IR', 'KP', 'SY', 'CU',             // Sanctioned states
]

const TIER2_COUNTRIES = [
  'GB', // UK
  'FR', // France
  'IT', // Italy
  'ES', // Spain
  'DE', // Germany
  'AU', // Australia
]

export async function GET(request: NextRequest) {
  const country = request.headers.get('x-vercel-ip-country') || ''

  let tier: 'blocked' | 'restricted' | 'open' = 'open'
  if (TIER1_COUNTRIES.includes(country)) tier = 'blocked'
  else if (TIER2_COUNTRIES.includes(country)) tier = 'restricted'

  return NextResponse.json({ country, tier })
}
