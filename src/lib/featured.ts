export interface FeaturedMarket {
  title: string
  description: string
  imageUrl?: string
  link: string
  badge?: string
}

// Manually curated featured markets
export const FEATURED_MARKETS: FeaturedMarket[] = [
  // Empty for now - populated when we have markets to feature
]
