import { fetchBoostedTokens, fetchTokenProfiles } from '@/lib/api'
import LaunchpadClient from './LaunchpadClient'

export const metadata = {
  title: 'Token Launchpad - Rekt Markets',
}

export default async function LaunchpadPage() {
  const [boosted, profiles] = await Promise.all([
    fetchBoostedTokens(),
    fetchTokenProfiles(),
  ])

  // Build a lookup map from profiles: chainId-tokenAddress -> icon
  const iconMap = new Map<string, string>()
  for (const p of profiles) {
    if (p.icon && p.chainId && p.tokenAddress) {
      iconMap.set(`${p.chainId}-${p.tokenAddress}`, p.icon)
    }
  }

  // Enrich boosted tokens with icons from profiles
  const enrichedBoosted = boosted.map((t) => {
    if (!t.icon && t.chainId && t.tokenAddress) {
      const icon = iconMap.get(`${t.chainId}-${t.tokenAddress}`)
      if (icon) return { ...t, icon }
    }
    return t
  })

  return <LaunchpadClient boosted={enrichedBoosted} profiles={profiles} />
}
