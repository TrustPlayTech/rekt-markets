'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WalletState {
  connected: boolean
  address: string | null
  walletType: string | null
  connect: (type: string) => void
  disconnect: () => void
  showModal: boolean
  setShowModal: (v: boolean) => void
}

const WalletContext = createContext<WalletState>({
  connected: false,
  address: null,
  walletType: null,
  connect: () => {},
  disconnect: () => {},
  showModal: false,
  setShowModal: () => {},
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('rekt_wallet')
    if (saved) {
      const data = JSON.parse(saved)
      setConnected(true)
      setAddress(data.address)
      setWalletType(data.walletType)
    }
  }, [])

  const connect = (type: string) => {
    const fakeAddr = '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
    setConnected(true)
    setAddress(fakeAddr)
    setWalletType(type)
    localStorage.setItem('rekt_wallet', JSON.stringify({ address: fakeAddr, walletType: type }))
    setShowModal(false)
  }

  const disconnect = () => {
    setConnected(false)
    setAddress(null)
    setWalletType(null)
    localStorage.removeItem('rekt_wallet')
  }

  return (
    <WalletContext.Provider value={{ connected, address, walletType, connect, disconnect, showModal, setShowModal }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)
