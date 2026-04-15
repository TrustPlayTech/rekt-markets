export interface PolymarketTag {
  id: string
  label: string
  slug: string
}

export interface PolymarketEvent {
  id: string
  slug: string
  title: string
  description: string
  category: string | null
  tags?: PolymarketTag[]
  startDate: string
  endDate: string
  image: string
  icon: string
  active: boolean
  closed: boolean
  liquidity: number
  volume: number
  markets: PolymarketMarket[]
}

export interface PolymarketMarket {
  id: string
  question: string
  slug: string
  description: string
  outcomePrices: string // JSON string like "[\"0.65\",\"0.35\"]"
  outcomes: string // JSON string like "[\"Yes\",\"No\"]"
  volume: number
  liquidity: number
  active: boolean
  closed: boolean
  groupItemTitle?: string
}

export interface DexToken {
  url: string
  chainId: string
  tokenAddress: string
  icon?: string
  header?: string
  description?: string
  links?: { label?: string; type?: string; url: string }[]
  // From boosts
  amount?: number
  totalAmount?: number
}

export interface DexPair {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  baseToken: {
    address: string
    name: string
    symbol: string
  }
  quoteToken: {
    address: string
    name: string
    symbol: string
  }
  priceNative: string
  priceUsd: string
  txns: {
    h24: { buys: number; sells: number }
  }
  volume: {
    h24: number
  }
  priceChange: {
    h24: number
  }
  liquidity: {
    usd: number
  }
  fdv: number
  marketCap: number
  info?: {
    imageUrl?: string
  }
}
