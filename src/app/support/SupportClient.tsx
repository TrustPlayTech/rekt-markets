'use client'

import { useState } from 'react'

export default function SupportClient() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send')
      }
      setSubmitted(true)
      setName('')
      setEmail('')
      setMessage('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-rekt-border bg-rekt-card p-8 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Contact Support</h2>
      <input
        type="text"
        required
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-xl border border-rekt-border bg-rekt-dark px-4 py-3 text-sm text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50"
      />
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email"
        className="w-full rounded-xl border border-rekt-border bg-rekt-dark px-4 py-3 text-sm text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50"
      />
      <textarea
        required
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="How can we help?"
        rows={4}
        className="w-full rounded-xl border border-rekt-border bg-rekt-dark px-4 py-3 text-sm text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50 resize-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-rekt-blue py-3 text-sm font-medium text-white hover:bg-rekt-blue/80 disabled:opacity-50"
      >
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
      {submitted && <p className="text-sm text-rekt-green">Message sent! We&apos;ll get back to you soon.</p>}
      {error && <p className="text-sm text-rekt-red">{error}</p>}
    </form>
  )
}
