'use client'

import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookies-accepted')
    if (!accepted) setVisible(true)
  }, [])

  if (!visible) return null

  const handleAccept = () => {
    localStorage.setItem('cookies-accepted', 'true')
    setVisible(false)
  }

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-50 border-t border-rekt-border bg-rekt-dark/95 backdrop-blur-xl px-4 py-3">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-rekt-muted text-center sm:text-left">
          We use essential cookies for site functionality. By continuing, you accept our{' '}
          <a href="/cookies" className="text-rekt-blue hover:underline">cookie policy</a>.
        </p>
        <button
          onClick={handleAccept}
          className="shrink-0 rounded-lg bg-rekt-blue px-5 py-1.5 text-xs font-medium text-white hover:bg-rekt-blue/80 transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
