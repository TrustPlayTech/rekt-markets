'use client'

import { useState, FormEvent, Suspense } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

function LoginForm() {
  const [password, setPassword] = useState('')
  const searchParams = useSearchParams()
  const [error, setError] = useState(searchParams.get('error') === '1')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!password.trim() || loading) return
    setLoading(true)
    setError(false)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      })

      if (res.ok) {
        // Cookie set by API route — hard reload to apply it
        window.location.href = '/'
      } else {
        setError(true)
        setLoading(false)
      }
    } catch {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3">
      <input
        type="password"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setError(false) }}
        placeholder="Enter access password"
        autoFocus
        required
        style={{
          background: '#12121a',
          border: `1px solid ${error ? '#ff5f7a' : '#2a2a3d'}`,
          color: '#e8e8f0',
        }}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 transition-colors placeholder-gray-600"
      />
      {error && (
        <p className="text-xs text-left" style={{ color: '#ff5f7a' }}>
          Incorrect password. Try again.
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        style={{ background: '#6c5ce7' }}
        className="w-full rounded-xl px-6 py-3 text-sm font-bold text-white hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {loading ? 'Checking...' : 'Enter'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-4"
      style={{ background: '#0a0a0f' }}
    >
      <div className="flex flex-col items-center mb-8 gap-2">
        <Image src="/apple-touch-icon.png" alt="Crown" width={72} height={72} className="object-contain" />
        <Image src="/rekt-palace-logo.png" alt="Rekt Palace" width={220} height={110} className="object-contain" />
      </div>

      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>

      <p className="mt-8 text-xs text-gray-700">© 2026 Rekt Palace. All rights reserved.</p>
    </div>
  )
}
