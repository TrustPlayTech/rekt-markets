'use client'

import { Wallet } from 'lucide-react'
import { useComplianceConnect } from '@/hooks/useComplianceConnect'

// Hook: returns a connect function that either opens compliance gate or waitlist
export function useConnectOrWaitlist() {
  const { connect, modal } = useComplianceConnect()
  return { connect, modal }
}

// Button component: drop-in replacement for any "Connect Wallet" button
export default function ConnectOrWaitlist({ className, children }: { className?: string; children?: React.ReactNode }) {
  const { connect, modal } = useComplianceConnect()

  return (
    <>
      <button onClick={connect} className={className}>
        {children || (
          <>
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </>
        )}
      </button>
      {modal}
    </>
  )
}
