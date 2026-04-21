import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  const expected = process.env.DEMO_PASSWORD

  // Debug: log lengths to catch whitespace/encoding issues
  console.log('[auth] submitted length:', password?.length, 'expected length:', expected?.length)

  if (!expected) {
    // No password gate configured — grant access
    const res = NextResponse.json({ ok: true })
    res.cookies.set('demo-auth', 'open', { path: '/', maxAge: 86400 * 7, sameSite: 'lax', httpOnly: true })
    return res
  }

  if (password?.trim() === expected.trim()) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set('demo-auth', expected, { path: '/', maxAge: 86400 * 7, sameSite: 'lax', httpOnly: true })
    return res
  }

  return NextResponse.json({ ok: false, error: 'Incorrect password' }, { status: 401 })
}
