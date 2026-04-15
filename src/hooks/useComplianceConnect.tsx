'use client'

import { useState, useCallback } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useAccount } from 'wagmi'
import { TRADING_ENABLED } from '@/lib/trading'
import { hasAcknowledged, storeAcknowledgment, logAcknowledgment } from '@/lib/compliance'
import ComplianceGate from '@/components/ComplianceGate'
import WaitlistModal from '@/components/WaitlistModal'

/**
 * Hook that wraps wallet connect with compliance gating.
 *
 * Returns:
 * - connect(): call this instead of showing waitlist
 * - modal: render this in your component's JSX
 */
export function useComplianceConnect() {
  const { login } = usePrivy()
  const { address } = useAccount()
  const [showCompliance, setShowCompliance] = useState(false)
  const [showWaitlist, setShowWaitlist] = useState(false)

  const connect = useCallback(() => {
    if (!TRADING_ENABLED) {
      setShowWaitlist(true)
      return
    }

    // If wallet is connected and already acknowledged, skip modal
    if (address && hasAcknowledged(address)) {
      login()
      return
    }

    // Show compliance gate
    setShowCompliance(true)
  }, [address, login])

  const handleComplianceProceed = useCallback(() => {
    setShowCompliance(false)
    // If we already have a wallet address, store ack
    if (address) {
      storeAcknowledgment(address)
      logAcknowledgment(address)
    }
    login()
  }, [address, login])

  const modal = (
    <>
      <ComplianceGate
        show={showCompliance}
        onProceed={handleComplianceProceed}
        onCancel={() => setShowCompliance(false)}
        walletAddress={address}
      />
      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} />}
    </>
  )

  return { connect, modal }
}

/**
 * Hook for gating trading actions (buy, approve, seed) for already-connected wallets.
 *
 * Returns:
 * - guardedAction(fn): wraps a trading action with compliance check
 * - modal: render this in your component's JSX
 */
export function useComplianceGuard() {
  const { address } = useAccount()
  const [showCompliance, setShowCompliance] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  const guardedAction = useCallback((action: () => void) => {
    if (address && hasAcknowledged(address)) {
      action()
      return
    }
    // Need acknowledgment first
    setPendingAction(() => action)
    setShowCompliance(true)
  }, [address])

  const handleProceed = useCallback(() => {
    setShowCompliance(false)
    if (address) {
      storeAcknowledgment(address)
      logAcknowledgment(address)
    }
    if (pendingAction) {
      pendingAction()
      setPendingAction(null)
    }
  }, [address, pendingAction])

  const modal = (
    <ComplianceGate
      show={showCompliance}
      onProceed={handleProceed}
      onCancel={() => { setShowCompliance(false); setPendingAction(null) }}
      walletAddress={address}
    />
  )

  return { guardedAction, modal }
}
