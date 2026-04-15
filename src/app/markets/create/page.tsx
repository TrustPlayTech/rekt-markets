'use client'

import { TRADING_ENABLED } from '@/lib/trading'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Calendar, Globe, BarChart3 } from 'lucide-react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useComplianceConnect, useComplianceGuard } from '@/hooks/useComplianceConnect'
import { decodeEventLog, type Address } from 'viem'
import { MARKET_FACTORY_ADDRESS, MarketFactoryABI } from '@/lib/contracts'

const CATEGORIES = ['Politics', 'Crypto', 'Sports', 'Entertainment', 'Science', 'Other']

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

function CreateMarketForm() {
  const { isConnected } = useAccount()
  const { connect, modal: connectModal } = useComplianceConnect()
  const { guardedAction, modal: guardModal } = useComplianceGuard()
  const searchParams = useSearchParams()
  const prefill = searchParams.get('question') || ''
  const [question, setQuestion] = useState(prefill)
  const [category, setCategory] = useState('Crypto')
  const [resolutionDate, setResolutionDate] = useState('')
  const [resolutionSource, setResolutionSource] = useState('')
  const [criteria, setCriteria] = useState('')
  const [newMarketAddress, setNewMarketAddress] = useState<string | null>(null)

  const { writeContract, data: txHash, isPending: creating, reset } = useWriteContract()
  const { isLoading: confirming, isSuccess: confirmed, data: receipt } = useWaitForTransactionReceipt({ hash: txHash })

  const canCreate = question.trim() && resolutionDate && resolutionSource.trim() && criteria.trim()

  // Extract market address from event logs
  const createdMarketAddress = (() => {
    if (!receipt?.logs) return newMarketAddress
    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: MarketFactoryABI,
          data: log.data,
          topics: log.topics,
        })
        if (decoded.eventName === 'MarketCreated') {
  return (decoded.args as { market: Address }).market
        }
      } catch {
        // Not our event
      }
    }
    return newMarketAddress
  })()

  const handleCreate = () => {
    if (!canCreate) return
    guardedAction(() => {
      const resolutionTimestamp = BigInt(Math.floor(new Date(resolutionDate).getTime() / 1000))
      writeContract({
        address: MARKET_FACTORY_ADDRESS,
        abi: MarketFactoryABI,
        functionName: 'createMarket',
        args: [question, resolutionTimestamp],
      })
    })
  }

  const formatDate = (d: string) => {
    if (!d) return 'TBD'
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {guardModal}
      <Link
        href="/markets"
        className="mb-6 inline-flex items-center gap-2 text-sm text-rekt-muted hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Markets
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-rekt-blue" />
          Create Market
        </h1>
        <p className="mt-2 text-rekt-muted">
          Create a prediction market on Base Sepolia. Deploys a real smart contract.
        </p>
      </div>

      {confirmed ? (
        <div className="rounded-xl border border-rekt-green/30 bg-rekt-green/5 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rekt-green/20">
            <BarChart3 className="h-8 w-8 text-rekt-green" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">Market Created!</h2>
          <p className="text-rekt-muted mb-1 max-w-md mx-auto">
            &ldquo;{question}&rdquo;
          </p>
          {createdMarketAddress && (
            <div className="mt-3 mb-4">
              <p className="text-xs text-rekt-muted mb-1">Market Address:</p>
              <a
                href={`https://sepolia.basescan.org/address/${createdMarketAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-rekt-blue hover:underline font-mono"
              >
                {createdMarketAddress}
              </a>
            </div>
          )}
          {txHash && (
            <p className="text-xs text-rekt-muted mb-4">
              Tx:{' '}
              <a
                href={`https://sepolia.basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rekt-blue hover:underline font-mono"
              >
                {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </a>
            </p>
          )}
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              href="/trade"
              className="rounded-lg bg-rekt-gold px-6 py-2.5 text-sm font-medium text-rekt-dark hover:opacity-80 transition-opacity"
            >
              Trade Now
            </Link>
            <Link
              href="/markets"
              className="rounded-lg bg-rekt-card border border-rekt-border px-6 py-2.5 text-sm font-medium text-white hover:border-rekt-blue/50 transition-colors"
            >
              Browse Markets
            </Link>
            <button
              onClick={() => {
                reset()
                setQuestion('')
                setResolutionDate('')
                setResolutionSource('')
                setCriteria('')
                setNewMarketAddress(null)
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
                <label className="mb-1.5 block text-sm font-medium text-white">Question *</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Will Bitcoin reach $200,000 by end of 2026?"
                  rows={3}
                  maxLength={200}
                  className="w-full resize-none rounded-lg border border-rekt-border bg-rekt-dark px-4 py-3 text-sm text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50 transition-colors"
                />
                <p className="mt-1 text-xs text-rekt-muted">{question.length}/200</p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-rekt-border bg-rekt-dark px-4 py-3 text-sm text-white outline-none focus:border-rekt-blue/50 transition-colors"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-rekt-muted" />
                  Resolution Date *
                </label>
                <input
                  type="date"
                  value={resolutionDate}
                  onChange={(e) => setResolutionDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-rekt-border bg-rekt-dark px-4 py-3 text-sm text-white outline-none focus:border-rekt-blue/50 transition-colors"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white flex items-center gap-2">
                  <Globe className="h-4 w-4 text-rekt-muted" />
                  Resolution Source / Oracle <span className="text-rekt-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={resolutionSource}
                  onChange={(e) => setResolutionSource(e.target.value)}
                  placeholder="e.g. CoinGecko, Associated Press, Official Announcement"
                  className="w-full rounded-lg border border-rekt-border bg-rekt-dark px-4 py-3 text-sm text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50 transition-colors"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">
                  Resolution Criteria <span className="text-rekt-red">*</span>
                </label>
                <textarea
                  required
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  placeholder="Describe exactly how this market will be resolved. Include the data source, specific conditions for YES/NO, and edge case rules..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-rekt-border bg-rekt-dark px-4 py-3 text-sm text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50 transition-colors"
                />
              </div>
            </div>

            {/* Create Button */}
            <div>
              {isConnected ? (
                <button
                  onClick={handleCreate}
                  disabled={!canCreate || creating || confirming}
                  className="w-full rounded-xl bg-rekt-gold py-4 text-sm font-semibold text-rekt-dark transition-all hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creating || confirming ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {confirming ? 'Confirming...' : 'Deploying Market...'}
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Market (On-Chain)
                    </>
                  )}
                </button>
              ) : (
                <div className="rounded-xl border border-rekt-border bg-rekt-card p-4 text-center">
                  <p className="mb-3 text-sm text-rekt-muted">Connect your wallet to create a market</p>
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
              <div className="rounded-xl border border-rekt-border bg-rekt-dark p-5">
                <div className="mb-3 flex items-start justify-between">
                  <span className="inline-block rounded-md bg-rekt-blue/10 px-2 py-0.5 text-xs text-rekt-blue">
                    {category}
                  </span>
                  <span className="text-xs text-rekt-muted">$0 vol</span>
                </div>
                <h3 className="mb-4 text-sm font-semibold text-white line-clamp-3">
                  {question || 'Your question will appear here...'}
                </h3>
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 rounded-lg bg-rekt-green/10 px-3 py-2 text-center">
                    <div className="text-xs text-rekt-muted">Yes</div>
                    <div className="text-lg font-bold text-rekt-green">50¢</div>
                  </div>
                  <div className="flex-1 rounded-lg bg-rekt-red/10 px-3 py-2 text-center">
                    <div className="text-xs text-rekt-muted">No</div>
                    <div className="text-lg font-bold text-rekt-red">50¢</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-rekt-border space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-rekt-muted">Resolves</span>
                    <span className="text-white">{formatDate(resolutionDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rekt-muted">Contract</span>
                    <span className="text-rekt-blue">Base Sepolia</span>
                  </div>
                  {resolutionSource && (
                    <div className="flex justify-between">
                      <span className="text-rekt-muted">Source</span>
                      <span className="text-white truncate ml-4">{resolutionSource}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { Suspense } from 'react'

export default function CreateMarketPage() {
  if (!TRADING_ENABLED) return <TradingDisabledMessage />
  return (
    <Suspense fallback={<div className="flex justify-center py-20 text-rekt-muted">Loading...</div>}>
      <CreateMarketForm />
    </Suspense>
  )
}
