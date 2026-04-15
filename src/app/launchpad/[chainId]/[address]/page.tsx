import { fetchTokenPairs } from '@/lib/api'
import TokenDetailClient from './TokenDetailClient'

export default async function TokenDetailPage({ params }: { params: Promise<{ chainId: string; address: string }> }) {
  const { chainId, address } = await params
  const pairs = await fetchTokenPairs(chainId, address)
  return <TokenDetailClient chainId={chainId} address={address} pairs={pairs} />
}
