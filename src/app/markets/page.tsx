import { fetchPolymarketEvents } from '@/lib/api'
import MarketsClient from './MarketsClient'

export const metadata = {
  title: 'Prediction Markets - Rekt Markets',
}

export default async function MarketsPage() {
  const events = await fetchPolymarketEvents()
  return <MarketsClient events={events} />
}
