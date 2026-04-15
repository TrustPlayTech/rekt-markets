'use client'

import { X } from 'lucide-react'
import { useWallet } from '@/lib/wallet-context'

const wallets = [
  { name: 'MetaMask', icon: '🦊', color: 'from-orange-500/20 to-orange-600/10' },
  { name: 'Phantom', icon: '👻', color: 'from-purple-500/20 to-purple-600/10' },
  { name: 'WalletConnect', icon: '🔗', color: 'from-blue-500/20 to-blue-600/10' },
  { name: 'Coinbase Wallet', icon: '🔵', color: 'from-blue-400/20 to-blue-500/10' },
]

export default function WalletModal() {
  const { showModal, setShowModal, connect } = useWallet()

  if (!showModal) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
      <div className="relative w-full max-w-sm rounded-2xl border border-rekt-border bg-rekt-card p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">Connect Wallet</h2>
          <button
            onClick={() => setShowModal(false)}
            className="rounded-lg p-1 text-rekt-muted hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {wallets.map((w) => (
            <button
              key={w.name}
              onClick={() => connect(w.name)}
              className={`flex items-center gap-3 rounded-xl border border-rekt-border bg-gradient-to-r ${w.color} px-4 py-3 text-left transition-all hover:border-rekt-blue/50 hover:scale-[1.02]`}
            >
              <span className="text-2xl">{w.icon}</span>
              <span className="text-sm font-medium text-white">{w.name}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-rekt-muted">
          By connecting, you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}
