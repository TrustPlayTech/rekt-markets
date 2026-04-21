'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || 'Something went wrong. Try again.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div
      style={{ background: '#0a0a0f' }}
      className="fixed inset-0 z-[9999] flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-end px-6 pt-5">
        <Link
          href="/login"
          style={{ color: '#e8e8f0', borderColor: '#2a2a3d' }}
          className="text-sm font-semibold border rounded-lg px-4 py-2 hover:border-purple-500 hover:text-white transition-colors"
        >
          Login
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">

        {/* Crown + Logo */}
        <div className="flex flex-col items-center mb-8 gap-2">
          <Image
            src="/apple-touch-icon.png"
            alt="Crown"
            width={90}
            height={90}
            className="object-contain"
            priority
          />
          <Image
            src="/rekt-palace-logo.png"
            alt="Rekt Palace"
            width={260}
            height={130}
            className="object-contain"
            priority
          />
        </div>

        {/* Coming Soon */}
        <h1
          style={{ color: '#6c5ce7' }}
          className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-5 leading-none"
        >
          Coming Soon
        </h1>

        {/* Subtext */}
        <p className="text-gray-400 text-base md:text-lg max-w-md mb-2 leading-relaxed">
          The first degen super-venue.
        </p>
        <p className="text-gray-400 text-sm md:text-base max-w-md mb-1">
          Casino.&nbsp; Prediction Markets.&nbsp; Token Launchpad.
        </p>
        <p
          style={{ color: '#00d4ff' }}
          className="text-sm md:text-base font-bold tracking-wide mb-10"
        >
          #RekTheHouse
        </p>

        {/* Email signup */}
        {status === 'success' ? (
          <div
            style={{ background: '#12121a', borderColor: '#46a758' }}
            className="flex items-center gap-3 border rounded-xl px-6 py-4 text-sm max-w-sm w-full"
          >
            <span className="text-2xl">🎰</span>
            <p style={{ color: '#46a758' }} className="font-medium">
              You&apos;re on the list. We&apos;ll notify you when we launch.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === 'error') setStatus('idle')
              }}
              placeholder="Enter your email to stay informed"
              required
              style={{
                background: '#12121a',
                border: `1px solid ${status === 'error' ? '#ff5f7a' : '#2a2a3d'}`,
                color: '#e8e8f0',
              }}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 transition-colors placeholder-gray-600"
            />
            {status === 'error' && (
              <p className="text-xs text-left" style={{ color: '#ff5f7a' }}>
                {errorMsg}
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{ background: '#6c5ce7' }}
              className="w-full rounded-xl px-6 py-3 text-sm font-bold text-white hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {status === 'loading' ? 'Signing up...' : 'Notify Me'}
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-700 pb-6">
        © {new Date().getFullYear()} Rekt Palace. All rights reserved.
      </p>
    </div>
  )
}
