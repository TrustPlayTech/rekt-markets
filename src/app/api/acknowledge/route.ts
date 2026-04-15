import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { wallet, version } = await request.json()

    if (!wallet || !version) {
      return NextResponse.json({ error: 'Missing wallet or version' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for') || ''
    const country = request.headers.get('x-vercel-ip-country') || ''

    // Log to structured JSON (captured by Vercel Logs in production)
    console.log(JSON.stringify({
      event: 'risk_acknowledgment',
      wallet,
      ip,
      country,
      touVersion: version,
      timestamp: new Date().toISOString(),
    }))

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
