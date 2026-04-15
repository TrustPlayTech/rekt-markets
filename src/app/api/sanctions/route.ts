import { NextResponse } from 'next/server'
import { isSanctioned } from '@/lib/sanctions'
import { rateLimit } from '@/lib/rate-limit'

const CHAINALYSIS_API_KEY = process.env.CHAINALYSIS_API_KEY

export async function GET(req: Request) {
  // Rate limit: 30 checks per minute per IP
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const { allowed } = rateLimit(`sanctions:${ip}`, 30, 60_000)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 })
  }

  // Check static OFAC list first (instant, no API call)
  if (isSanctioned(address)) {
    return NextResponse.json({
      address,
      sanctioned: true,
      source: 'OFAC SDN List (static)',
    })
  }

  // Check Chainalysis API if key is available
  if (CHAINALYSIS_API_KEY) {
    try {
      // First register the address for monitoring
      await fetch(`https://public.chainalysis.com/api/v1/address/${address}`, {
        method: 'POST',
        headers: {
          'X-API-Key': CHAINALYSIS_API_KEY,
          'Accept': 'application/json',
        },
      }).catch(() => {}) // Ignore registration errors

      // Then check screening result
      const res = await fetch(`https://public.chainalysis.com/api/v1/address/${address}`, {
        headers: {
          'X-API-Key': CHAINALYSIS_API_KEY,
          'Accept': 'application/json',
        },
      })

      if (res.ok) {
        const data = await res.json()
        const identifications = data.identifications || []
        if (identifications.length > 0) {
          return NextResponse.json({
            address,
            sanctioned: true,
            source: 'Chainalysis Sanctions API',
            details: identifications.map((id: { name?: string; category?: string; description?: string }) => ({
              name: id.name,
              category: id.category,
              description: id.description,
            })),
          })
        }
      }
    } catch (error) {
      console.error('Chainalysis API error:', error)
      // Fall through to non-sanctioned if API fails
    }
  }

  return NextResponse.json({
    address,
    sanctioned: false,
    source: CHAINALYSIS_API_KEY ? 'Chainalysis + OFAC SDN' : 'OFAC SDN List (static)',
  })
}
