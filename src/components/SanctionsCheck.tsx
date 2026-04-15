'use client'

import { useEffect, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'

export default function SanctionsCheck() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    if (!isConnected || !address) {
      setBlocked(false)
      return
    }

    // Check against our sanctions API (static OFAC list + Chainalysis)
    fetch(`/api/sanctions?address=${address}`)
      .then(res => res.json())
      .then(data => {
        if (data.sanctioned) {
          setBlocked(true)
          disconnect()
        }
      })
      .catch(() => {
        // If API fails, don't block (fail open for availability)
      })
  }, [address, isConnected, disconnect])

  if (!blocked) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="max-w-md rounded-2xl border border-rekt-red/30 bg-rekt-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rekt-red/20">
          <svg className="h-7 w-7 text-rekt-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-sm text-rekt-muted mb-4">
          This wallet address has been identified on a sanctions list and cannot access the Rekt Markets platform.
        </p>
        <p className="text-xs text-rekt-muted">
          If you believe this is an error, contact{' '}
          <a href="mailto:legal@markets.rektpalace.com" className="text-rekt-blue hover:underline">legal@markets.rektpalace.com</a>.
        </p>
      </div>
    </div>
  )
}
