import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = (body.email as string)?.trim().toLowerCase()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      // Fire-and-forget — notification failures never block the user response
      sendNotifications(resendApiKey, email).catch((err) =>
        console.error('[waitlist] Notification error:', err)
      )
    } else {
      console.log('[waitlist] No RESEND_API_KEY set. Signup:', email)
    }

    // Always return success if the email address is valid
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[waitlist] Error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

async function sendNotifications(apiKey: string, email: string) {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }

  const year = new Date().getFullYear()
  const ts   = new Date().toISOString()

  // Admin notification — send to both addresses so nothing is missed
  // waitlist@rektpalace.com may not be active yet; gideon.frost@36.group is the backup
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      from: 'Rekt Palace <noreply@rektpalace.com>',
      to: ['waitlist@rektpalace.com', 'gideon.frost@36.group'],
      subject: `New waitlist signup: ${email}`,
      html: `
        <div style="font-family:sans-serif;padding:24px;color:#333;">
          <h2 style="color:#6c5ce7;">New Rekt Palace Waitlist Signup</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Time:</strong> ${ts}</p>
        </div>
      `,
    }),
  })

  // User confirmation
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      from: 'Rekt Palace <noreply@rektpalace.com>',
      to: [email],
      subject: "You're on the list. 👑",
      html: `
        <div style="background:#0a0a0f;color:#e8e8f0;font-family:sans-serif;padding:40px;max-width:480px;margin:0 auto;border-radius:12px;">
          <h1 style="color:#6c5ce7;font-size:28px;margin-bottom:8px;">You're in.</h1>
          <p style="color:#9090b8;font-size:16px;line-height:1.6;margin-bottom:8px;">
            We'll notify you the moment Rekt Palace goes live.
          </p>
          <p style="color:#9090b8;font-size:15px;line-height:1.6;margin-bottom:24px;">
            Casino. Prediction Markets. Token Launchpad.
          </p>
          <p style="color:#00d4ff;font-weight:bold;font-size:14px;letter-spacing:0.05em;">
            #RekTheHouse
          </p>
          <p style="color:#4a4a6a;font-size:12px;margin-top:32px;">
            © ${year} Rekt Palace. All rights reserved.
          </p>
        </div>
      `,
    }),
  })
}
