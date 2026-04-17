import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = (body.email as string)?.trim().toLowerCase()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const resendApiKey = process.env.RESEND_API_KEY
    const notifyEmail = process.env.WAITLIST_NOTIFY_EMAIL || 'gideon.frost@36.group'

    if (resendApiKey) {
      // Send admin notification via Resend
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Rekt Palace <noreply@rektpalace.com>',
          to: [notifyEmail],
          subject: `New waitlist signup: ${email}`,
          html: `
            <h2>New Rekt Palace Waitlist Signup</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          `,
        }),
      })

      // Also send confirmation to the user
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Rekt Palace <noreply@rektpalace.com>',
          to: [email],
          subject: "You're on the list. 👑",
          html: `
            <div style="background:#0a0a0f;color:#e8e8f0;font-family:sans-serif;padding:40px;max-width:480px;margin:0 auto;border-radius:12px;">
              <h1 style="color:#6c5ce7;font-size:28px;margin-bottom:8px;">You're in.</h1>
              <p style="color:#9090b8;font-size:16px;line-height:1.6;margin-bottom:24px;">
                We'll notify you the moment Rekt Palace goes live.<br>
                The first degen super-venue is almost ready.
              </p>
              <p style="color:#00d4ff;font-weight:bold;font-size:14px;letter-spacing:0.05em;">
                #RekTheHouse
              </p>
              <p style="color:#4a4a6a;font-size:12px;margin-top:32px;">
                © ${new Date().getFullYear()} Rekt Palace. All rights reserved.
              </p>
            </div>
          `,
        }),
      })
    } else {
      // No Resend key — log to console (dev/test mode)
      console.log('[waitlist] New signup:', email)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[waitlist] Error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
