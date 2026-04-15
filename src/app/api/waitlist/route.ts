import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY not set')
  return new Resend(key)
}

export async function POST(req: Request) {
  // Rate limit: 5 submissions per minute per IP
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const { allowed } = rateLimit(`waitlist:${ip}`, 5, 60_000)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const { email, inviteCode } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Send notification to team
    await getResend().emails.send({
      from: 'Rekt Markets <waitlist@markets.rektpalace.com>',
      to: ['waitlist@markets.rektpalace.com', 'chris.steele@tangiamo.com'],
      subject: `New Founders List Signup: ${email}${inviteCode ? ` [${inviteCode}]` : ''}`,
      html: `
        <h2>New Founders List Signup</h2>
        <p><strong>Email:</strong> ${email}</p>
        ${inviteCode ? `<p><strong>Invite Code:</strong> ${inviteCode}</p>` : '<p><em>No invite code</em></p>'}
        <p><em>Submitted at ${new Date().toISOString()}</em></p>
      `,
    })

    // Send confirmation to user
    await getResend().emails.send({
      from: 'Rekt Markets <waitlist@markets.rektpalace.com>',
      to: email,
      subject: 'Welcome to the Rekt Markets Founders List',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #6EC8FF;">You're on the Founders List! ⚡</h2>
          <p>Thanks for signing up for early access to Rekt Markets.</p>
          ${inviteCode ? `<p>Your invite code: <strong>${inviteCode}</strong></p>` : ''}
          <p>We're building the next generation of prediction markets and token launches on Base. You'll be one of the first to access the platform, and we'll let you know as soon as it's your turn.</p>
          <p>Stay tuned!</p>
          <p style="color: #888; font-size: 12px; margin-top: 30px;">Rekt Markets - Predict. Launch. Play.</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
