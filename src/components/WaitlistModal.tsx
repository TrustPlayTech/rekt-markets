'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { X, Zap } from 'lucide-react'

export default function WaitlistModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const portalRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    portalRef.current = document.body
  }, [])

  if (typeof window === 'undefined') return null

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
      style={{ isolation: 'isolate' }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-rekt-border bg-rekt-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-rekt-muted hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-rekt-gold/20">
            <Zap className="h-6 w-6 text-rekt-gold" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Founders List is Open</h3>
          <p className="text-xs text-rekt-gold font-medium mb-2">Limited to the first 200</p>
          <p className="text-sm text-rekt-muted">
            Get priority access to Rekt Markets before public launch. Founders will be rewarded.
          </p>
        </div>

        <button
          onClick={() => {
            onClose()
            router.push('/waitlist')
          }}
          className="w-full rounded-xl bg-rekt-gold py-3 text-sm font-semibold text-rekt-dark hover:opacity-80 transition-opacity mb-3"
        >
          Join the Founders List
        </button>

        <button
          onClick={onClose}
          className="w-full rounded-xl border border-rekt-border py-3 text-sm font-medium text-rekt-muted hover:text-white hover:border-rekt-blue/50 transition-colors"
        >
          Keep Browsing
        </button>
      </div>
    </div>
  )

  return createPortal(modal, portalRef.current || document.body)
}
