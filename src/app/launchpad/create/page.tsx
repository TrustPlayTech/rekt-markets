'use client'

import { TRADING_ENABLED } from '@/lib/trading'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Rocket, Sparkles, ImageIcon } from 'lucide-react'
import { useAccount } from 'wagmi'
import { useComplianceConnect } from '@/hooks/useComplianceConnect'

function TradingDisabledMessage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="rounded-2xl border border-rekt-gold/20 bg-rekt-gold/5 p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rekt-gold/20">
          <svg className="h-7 w-7 text-rekt-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Founders List is Open</h1>
        <p className="text-sm text-rekt-gold font-medium mb-3">Limited to the first 200</p>
        <p className="text-rekt-muted mb-6">Get priority access to Rekt Markets before public launch. Founders will be rewarded.</p>
        <a href="/waitlist" className="inline-block rounded-xl bg-rekt-gold px-8 py-3.5 text-sm font-semibold text-rekt-dark hover:opacity-80 transition-opacity">
          Join the Founders List
        </a>
      </div>
    </div>
  )
}

function CreateTokenForm() {
  const { isConnected } = useAccount()
  const { connect, modal: connectModal } = useComplianceConnect()
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [launched, setLaunched] = useState(false)
  const [launching, setLaunching] = useState(false)

  const canLaunch = name.trim() && symbol.trim()

  const handleLaunch = async () => {
    if (!canLaunch) return
    setLaunching(true)
    // Simulate deployment delay
    await new Promise((r) => setTimeout(r, 2000))
    setLaunching(false)
    setLaunched(true)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/launchpad"
        className="mb-6 inline-flex items-center gap-2 text-sm text-rekt-muted hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Launchpad
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-rekt-blue" />
          Create Token
        </h1>
        <p className="mt-2 text-rekt-muted">
          Launch your token on a bonding curve. No seed funding required.
        </p>
      </div>

      {launched ? (
        <div className="rounded-xl border border-rekt-green/30 bg-rekt-green/5 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rekt-green/20">
            <Rocket className="h-8 w-8 text-rekt-green" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">Token Launched!</h2>
          <p className="text-rekt-muted mb-1">
            <span className="text-white font-semibold">{name}</span> ({symbol.toUpperCase()}) is now live on the bonding curve.
          </p>
          <p className="text-xs text-rekt-muted mb-6">
            Contract deployment will be available when the platform goes live on-chain.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/launchpad"
              className="rounded-lg bg-rekt-card border border-rekt-border px-6 py-2.5 text-sm font-medium text-white hover:border-rekt-blue/50 transition-colors"
            >
              Back to Launchpad
            </Link>
            <button
              onClick={() => {
                setLaunched(false)
                setName('')
                setSymbol('')
                setImageUrl('')
                setDescription('')
              }}
              className="rounded-lg bg-rekt-blue px-6 py-2.5 text-sm font-medium text-white hover:bg-rekt-blue/80 transition-colors"
            >
              Create Another
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3 space-y-5">
            <div className="rounded-xl border border-rekt-border bg-rekt-card p-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">Token Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rekt Meme Coin"
                  maxLength={50}
                  className="w-full rounded-lg border border-rekt-border bg-rekt-dark px-4 py-3 text-sm text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50 transition-colors"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">Token Symbol *</label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  placeholder="e.g. BLZM"
                  maxLength={10}
                  className="w-full rounded-lg border border-rekt-border bg-rekt-dark px-4 py-3 text-sm text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50 transition-colors"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/token-logo.png"
                  className="w-full rounded-lg border border-rekt-border bg-rekt-dark px-4 py-3 text-sm text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50 transition-colors"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell the community about your token..."
                  rows={4}
                  maxLength={500}
                  className="w-full resize-none rounded-lg border border-rekt-border bg-rekt-dark px-4 py-3 text-sm text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50 transition-colors"
                />
                <p className="mt-1 text-xs text-rekt-muted">{description.length}/500</p>
              </div>
            </div>

            {/* Launch Button */}
            <div>
              {isConnected ? (
                <button
                  onClick={handleLaunch}
                  disabled={!canLaunch || launching}
                  className="w-full rounded-xl bg-rekt-gold py-4 text-sm font-semibold text-rekt-dark transition-all hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {launching ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Deploying Contract...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4" />
                      Launch Token
                    </>
                  )}
                </button>
              ) : (
                <div className="rounded-xl border border-rekt-border bg-rekt-card p-4 text-center">
                  <p className="mb-3 text-sm text-rekt-muted">Connect your wallet to launch</p>
                  <button
                    onClick={() => connect()}
                    className="rounded-lg bg-rekt-blue px-6 py-3 text-sm font-medium text-white hover:bg-rekt-blue/80 transition-colors"
                  >
                    Connect Wallet
                  </button>
                  {connectModal}
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-xl border border-rekt-border bg-rekt-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-rekt-muted uppercase tracking-wider">Preview</h3>
              <div className="rounded-xl border border-rekt-border bg-rekt-dark p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rekt-blue/30 to-rekt-frost/30 overflow-hidden">
                    {imageUrl ? (
                      <img src={imageUrl} alt="" className="h-full w-full rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-rekt-muted" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {name || 'Token Name'}
                      </span>
                      <span className="rounded bg-rekt-blue/10 px-1.5 py-0.5 text-[10px] text-rekt-blue">
                        {symbol || 'TICK'}
                      </span>
                    </div>
                    <p className="text-xs text-rekt-muted">BASE</p>
                  </div>
                </div>
                <p className="text-xs text-rekt-muted line-clamp-3">
                  {description || 'Your token description will appear here...'}
                </p>
                <div className="mt-3 pt-3 border-t border-rekt-border flex justify-between text-xs">
                  <span className="text-rekt-muted">Price</span>
                  <span className="text-white font-medium">$0.000001</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-rekt-muted">Market Cap</span>
                  <span className="text-white font-medium">$1,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CreateTokenPage() {
  if (!TRADING_ENABLED) return <TradingDisabledMessage />
  return <CreateTokenForm />
}
