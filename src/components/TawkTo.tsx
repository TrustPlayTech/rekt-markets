'use client'

import { useEffect } from 'react'

export default function TawkTo() {
  useEffect(() => {
    const s1 = document.createElement('script')
    s1.async = true
    s1.src = 'https://embed.tawk.to/69c5a723f00bc41c3bc91b10/1jkm19ovg'
    s1.charset = 'UTF-8'
    s1.setAttribute('crossorigin', '*')
    document.head.appendChild(s1)
    return () => {
      try { document.head.removeChild(s1) } catch {}
    }
  }, [])
  return null
}
