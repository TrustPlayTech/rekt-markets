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
  const { allowed } = rateLimit(`support:${ip}`, 3, 60_000)
  if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const { name, email, message } = await req.json()
  if (!name || !email || !message) return NextResponse.json({ error: 'All fields required' }, { status: 400 })

  await getResend().emails.send({
    from: 'Rekt Markets <support@markets.rektpalace.com>',
    to: 'support@markets.rektpalace.com',
    replyTo: email,
    subject: `Support Request from ${name}`,
    html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Message:</strong></p><p>${message}</p>`,
  })

  return NextResponse.json({ ok: true })
}
