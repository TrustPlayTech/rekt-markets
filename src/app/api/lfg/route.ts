import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/rate-limit'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY not set')
  return new Resend(key)
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const { allowed } = rateLimit(`lfg:${ip}`, 3, 60_000)
  if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const { wallet, positionSize, protocols, telegram, notes } = await req.json()
  if (!wallet || !positionSize || !protocols) {
    return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
  }

  await getResend().emails.send({
    from: 'Rekt Markets <partners@markets.rektpalace.com>',
    to: 'partners@markets.rektpalace.com',
    subject: `LFG Application: ${wallet.slice(0, 10)}...`,
    html: `
      <h2>New LFG Application</h2>
      <p><strong>Wallet:</strong> ${wallet}</p>
      <p><strong>Position Size:</strong> ${positionSize}</p>
      <p><strong>Protocols:</strong> ${protocols}</p>
      ${telegram ? `<p><strong>Telegram:</strong> ${telegram}</p>` : ''}
      ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
      <p><em>${new Date().toISOString()}</em></p>
    `,
  })

  return NextResponse.json({ ok: true })
}
