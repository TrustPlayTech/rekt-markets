/**
 * Geo-compliance constants and utilities
 *
 * TOU_VERSION: Increment on Terms of Use update to force re-acknowledgment
 */

export const TOU_VERSION = '2026-03-24'

export type GeoTier = 'blocked' | 'restricted' | 'open'

export interface GeoResult {
  country: string
  tier: GeoTier
}

/** Check if a wallet has acknowledged the current TOU version */
export function hasAcknowledged(wallet: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const key = `rekt_ack_${wallet.toLowerCase()}`
    const stored = localStorage.getItem(key)
    if (!stored) return false
    const parsed = JSON.parse(stored)
    return parsed.version === TOU_VERSION
  } catch {
    return false
  }
}

/** Store acknowledgment for a wallet */
export function storeAcknowledgment(wallet: string): void {
  if (typeof window === 'undefined') return
  const key = `rekt_ack_${wallet.toLowerCase()}`
  localStorage.setItem(key, JSON.stringify({
    version: TOU_VERSION,
    timestamp: new Date().toISOString(),
  }))
}

/** POST acknowledgment to server for audit trail */
export async function logAcknowledgment(wallet: string): Promise<void> {
  try {
    await fetch('/api/acknowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, version: TOU_VERSION }),
    })
  } catch {
    // Non-blocking; don't fail the UI if logging fails
  }
}

/** Fetch geo tier from server */
export async function fetchGeoTier(): Promise<GeoResult> {
  try {
    const res = await fetch('/api/geo')
    if (!res.ok) return { country: '', tier: 'open' }
    return await res.json()
  } catch {
    // Fail open for availability
    return { country: '', tier: 'open' }
  }
}
