'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Zap, CheckCircle, Users, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function WaitlistPage() {
  return (
    <Suspense>
      <WaitlistForm />
    </Suspense>
  )
}

function WaitlistForm() {
  const searchParams = useSearchParams()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [inviteCode, setInviteCode] = useState(searchParams.get('ref') || '')
  const [ageTerritory, setAgeTerritory] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const canSubmit = email && ageTerritory && termsAccepted && !submitting

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, inviteCode: inviteCode.trim() || undefined }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to submit')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="text-center mb-10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rekt-gold">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-display text-4xl font-bold text-white mb-3">Join the Founders List</h1>
        <p className="text-rekt-muted text-lg">
          Be among the first to trade on Rekt Markets
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-rekt-muted">
          <Users className="h-4 w-4" />
          <span>Limited to the first 200 founders</span>
        </div>
      </div>

      {submitted ? (
        <div className="rounded-2xl border border-rekt-green/30 bg-rekt-green/5 p-8 text-center">
          <CheckCircle className="h-12 w-12 text-rekt-green mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-white mb-2">You&apos;re on the list!</h2>
          <p className="text-rekt-muted mb-4">
            We&apos;ll notify you at <span className="text-white font-bold">{email}</span> when it&apos;s your turn.
          </p>
          <p className="text-sm text-rekt-muted">Check your inbox for a confirmation email.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-rekt-border bg-rekt-card p-8">
          <div className="mb-5">
            <label className="block text-sm font-medium text-white mb-2">
              Email <span className="text-rekt-red">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-rekt-border bg-rekt-dark px-4 py-3 text-sm text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Invite Code <span className="text-rekt-muted">(optional)</span>
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="e.g. BLIZZ100"
              className="w-full rounded-xl border border-rekt-border bg-rekt-dark px-4 py-3 text-sm text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50"
            />
          </div>

          {/* Required checkboxes */}
          <div className="mb-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={ageTerritory}
                onChange={(e) => setAgeTerritory(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-rekt-border bg-rekt-dark accent-rekt-blue flex-shrink-0"
              />
              <span className="text-sm text-rekt-muted group-hover:text-white transition-colors">
                I declare that I am 18 years or older, located in a permitted territory, and have no active self-exclusions. <span className="text-rekt-red">*</span>
              </span>
            </label>
          </div>

          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-rekt-border bg-rekt-dark accent-rekt-blue flex-shrink-0"
              />
              <span className="text-sm text-rekt-muted group-hover:text-white transition-colors">
                I have read and accept the{' '}
                <Link href="/terms" className="text-rekt-blue hover:underline" target="_blank">Terms of Service</Link>,{' '}
                <Link href="/privacy" className="text-rekt-blue hover:underline" target="_blank">Privacy Policy</Link>, and{' '}
                <Link href="/aml" className="text-rekt-blue hover:underline" target="_blank">AML Policy</Link>. <span className="text-rekt-red">*</span>
              </span>
            </label>
          </div>

          {error && (
            <p className="text-sm text-rekt-red mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-xl bg-rekt-gold py-3.5 text-sm font-medium text-rekt-dark hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Join the Founders List'
            )}
          </button>
        </form>
      )}
    </div>
  )
}
