import { getSportsEvents } from '@/lib/sports'
import SportsClient from './SportsClient'

// Force dynamic rendering - sports data must be fresh, not pre-rendered at build time
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Sports Markets - Rekt Markets',
  description: 'Trade on live and upcoming sporting events with Rekt Markets',
}

export default async function SportsPage() {
  const events = await getSportsEvents()
  return <SportsClient events={events} />
}
