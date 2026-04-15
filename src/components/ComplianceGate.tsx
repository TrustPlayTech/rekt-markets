'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, Shield } from 'lucide-react'
import Link from 'next/link'
import { type GeoTier, fetchGeoTier, hasAcknowledged, storeAcknowledgment, logAcknowledgment } from '@/lib/compliance'

interface ComplianceGateProps {
  /** Called when compliance is cleared and the user can proceed */
  onProceed: () => void
  /** Called when the modal is dismissed without proceeding */
  onCancel?: () => void
  /** If a wallet address is known, check per-wallet acknowledgment */
  walletAddress?: string
  /** Whether to show the gate immediately */
  show: boolean
}

export default function ComplianceGate({ onProceed, onCancel, walletAddress, show }: ComplianceGateProps) {
  const [geoTier, setGeoTier] = useState<GeoTier | null>(null)
  const [loading, setLoading] = useState(true)
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(false)
  const [check3, setCheck3] = useState(false)
  const portalRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    portalRef.current = document.body
  }, [])

  useEffect(() => {
    if (!show) return
    setLoading(true)
    fetchGeoTier().then((result) => {
      setGeoTier(result.tier)
      setLoading(false)
    })
  }, [show])

  const handleProceed = useCallback(() => {
    if (walletAddress) {
      storeAcknowledgment(walletAddress)
      logAcknowledgment(walletAddress)
    }
    onProceed()
  }, [walletAddress, onProceed])

  const handleClose = useCallback(() => {
    onCancel?.()
  }, [onCancel])

  if (!show) return null

  // If wallet is already acknowledged, skip the modal
  if (walletAddress && hasAcknowledged(walletAddress)) {
    // Fire onProceed async to avoid render loop
    setTimeout(onProceed, 0)
    return null
  }

  if (typeof window === 'undefined') return null

  const allChecked = check1 && check2 && check3

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleClose}
      style={{ isolation: 'isolate' }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-rekt-border bg-rekt-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {onCancel && (
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-rekt-muted hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-rekt-blue border-t-transparent" />
          </div>
        ) : geoTier === 'blocked' ? (
          /* Tier 1: Hard block message */
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20">
              <Shield className="h-7 w-7 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Trading Unavailable</h2>
            <p className="text-sm text-rekt-muted mb-4">
              Trading on Rekt Markets is not available in your jurisdiction due to regulatory restrictions.
            </p>
            <p className="text-xs text-rekt-muted">
              You may continue to browse market data and informational content.
            </p>
            {onCancel && (
              <button
                onClick={handleClose}
                className="mt-6 w-full rounded-xl border border-rekt-border py-3 text-sm font-medium text-rekt-muted hover:text-white hover:border-rekt-blue/50 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        ) : (
          /* Tier 2 + Open: Risk acknowledgment */
          <div>
            <div className="text-center mb-5">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-rekt-blue/20">
                <Shield className="h-6 w-6 text-rekt-blue" />
              </div>
              <h2 className="text-lg font-bold text-white">Risk Acknowledgment</h2>
            </div>

            {geoTier === 'restricted' && (
              <div className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
                <p className="text-xs text-yellow-200">
                  Trading may not be authorized in your jurisdiction. You are solely responsible for compliance with your local laws.
                </p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={check1}
                  onChange={(e) => setCheck1(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-rekt-border bg-rekt-dark text-rekt-blue focus:ring-rekt-blue/50 accent-rekt-blue flex-shrink-0"
                />
                <span className="text-sm text-rekt-muted group-hover:text-white transition-colors">
                  I confirm that I am not located in, and am not a citizen or resident of, the United States of America or any other restricted jurisdiction as listed in the{' '}
                  <Link href="/terms" className="text-rekt-blue hover:underline" target="_blank">Terms of Use</Link>.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={check2}
                  onChange={(e) => setCheck2(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-rekt-border bg-rekt-dark text-rekt-blue focus:ring-rekt-blue/50 accent-rekt-blue flex-shrink-0"
                />
                <span className="text-sm text-rekt-muted group-hover:text-white transition-colors">
                  I understand that prediction market trading involves substantial risk of loss. I have read and agree to the{' '}
                  <Link href="/terms" className="text-rekt-blue hover:underline" target="_blank">Terms of Use</Link>,{' '}
                  <Link href="/privacy" className="text-rekt-blue hover:underline" target="_blank">Privacy Policy</Link>, and{' '}
                  <Link href="/risks" className="text-rekt-blue hover:underline" target="_blank">Risk Disclosures</Link>.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={check3}
                  onChange={(e) => setCheck3(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-rekt-border bg-rekt-dark text-rekt-blue focus:ring-rekt-blue/50 accent-rekt-blue flex-shrink-0"
                />
                <span className="text-sm text-rekt-muted group-hover:text-white transition-colors">
                  I confirm that I am at least 18 years of age.
                </span>
              </label>
            </div>

            <button
              onClick={handleProceed}
              disabled={!allChecked}
              className="w-full rounded-xl bg-rekt-blue py-3 text-sm font-semibold text-white transition-all hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              I Agree &amp; Continue
            </button>

            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-3 text-xs text-rekt-muted">
                <Link href="/terms" className="hover:text-white transition-colors" target="_blank">Terms of Use</Link>
                <span>&middot;</span>
                <Link href="/privacy" className="hover:text-white transition-colors" target="_blank">Privacy Policy</Link>
                <span>&middot;</span>
                <Link href="/risks" className="hover:text-white transition-colors" target="_blank">Risk Disclosures</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modal, portalRef.current || document.body)
}
