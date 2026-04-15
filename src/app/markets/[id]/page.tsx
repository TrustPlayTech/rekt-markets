import { fetchPolymarketEventById } from '@/lib/api'
import { notFound } from 'next/navigation'
import MarketDetailClient from './MarketDetailClient'

export default async function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await fetchPolymarketEventById(id)
  if (!event) return notFound()
  return <MarketDetailClient event={event} />
}
