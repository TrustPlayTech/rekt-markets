'use client'

import { useState } from 'react'
import { Wallet } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'
import { TRADING_ENABLED } from '@/lib/trading'
import { useComplianceConnect } from '@/hooks/useComplianceConnect'
import WaitlistModal from './WaitlistModal'

export default function WalletButton() {
  const { authenticated, user, logout } = usePrivy()
  const { connect, modal } = useComplianceConnect()
  const [showWaitlist, setShowWaitlist] = useState(false)

  if (TRADING_ENABLED && authenticated) {
    const displayAddress = user?.wallet?.address
    return (
      <>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/30 transition-colors"
        >
          {displayAddress ? `${displayAddress.slice(0, 6)}...${displayAddress.slice(-4)}` : 'Connected'}
        </button>
        {modal}
      </>
    )
  }

  return (
    <>
      <button
        onClick={() => {
          if (TRADING_ENABLED) {
            connect()
          } else {
            setShowWaitlist(true)
          }
        }}
        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition-colors"
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </button>
      {modal}
      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} />}
    </>
  )
}
