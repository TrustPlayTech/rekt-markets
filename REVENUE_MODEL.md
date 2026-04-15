# Blizz Markets - Revenue Model

## Revenue Streams

### 1. Trading Fee (Primary)
**2% platform fee on every prediction market buy transaction**

| Monthly Volume | Monthly Revenue | Annual Revenue |
|---------------|----------------|----------------|
| $100K | $2,000 | $24,000 |
| $500K | $10,000 | $120,000 |
| $1M | $20,000 | $240,000 |
| $5M | $100,000 | $1,200,000 |
| $10M | $200,000 | $2,400,000 |
| $50M | $1,000,000 | $12,000,000 |

Collected automatically by smart contract. Sent directly to company treasury (Gnosis Safe multisig). No manual invoicing, no payment processing, no chargebacks.

For context: Polymarket averaged ~$7B/month in early 2026. Kalshi did $24B in 2025. Even capturing 0.1% of Polymarket's volume ($7M/month) yields $140K/month.

### 2. Creator Fee (Token Launchpad)
**1% fee on every bonding curve token sell transaction**

Paid to the token creator's wallet. The platform earns indirectly through token creation fees (see below) and increased platform activity.

### 3. Market Creation Fee
**$5 USDC per prediction market created**

| Markets Created/Month | Monthly Revenue |
|----------------------|----------------|
| 50 | $250 |
| 200 | $1,000 |
| 1,000 | $5,000 |

Prevents spam. Covers contract deployment gas. Pure margin.

### 4. Token Listing Fee
**$10 USDC per bonding curve token launched**

| Tokens Created/Month | Monthly Revenue |
|---------------------|----------------|
| 20 | $200 |
| 100 | $1,000 |
| 500 | $5,000 |

Comparable: pump.fun charges ~0.02 SOL ($3) per token. We're at $10 with more features (bonding curve, graduation to DEX).

### 5. Referral Program
**10% of platform fee shared with referrers**

This is a cost, not revenue. But it drives volume. Net platform take after referral: 1.8% on referred trades (2% minus 10% of 2%).

### 6. Sports Market Fees
**Same 2% platform fee on sports betting trades**

Sports is the highest-volume category in prediction markets. Kalshi's sports volume exceeded all other categories combined in late 2025.

Sports markets resolve in hours (not months), meaning:
- Capital recycles faster
- More trades per dollar of liquidity
- Higher annualized fee generation per dollar deployed

## Revenue Projections

### Conservative (Year 1)
| Stream | Monthly | Annual |
|--------|---------|--------|
| Trading fees ($500K vol) | $10,000 | $120,000 |
| Sports trading fees ($300K vol) | $6,000 | $72,000 |
| Market creation (100/mo) | $500 | $6,000 |
| Token listings (30/mo) | $300 | $3,600 |
| **Total** | **$16,800** | **$201,600** |

### Base Case (Year 1)
| Stream | Monthly | Annual |
|--------|---------|--------|
| Trading fees ($2M vol) | $40,000 | $480,000 |
| Sports trading fees ($1M vol) | $20,000 | $240,000 |
| Market creation (300/mo) | $1,500 | $18,000 |
| Token listings (100/mo) | $1,000 | $12,000 |
| **Total** | **$62,500** | **$750,000** |

### Aggressive (Year 1)
| Stream | Monthly | Annual |
|--------|---------|--------|
| Trading fees ($10M vol) | $200,000 | $2,400,000 |
| Sports trading fees ($5M vol) | $100,000 | $1,200,000 |
| Market creation (1000/mo) | $5,000 | $60,000 |
| Token listings (500/mo) | $5,000 | $60,000 |
| **Total** | **$310,000** | **$3,720,000** |

## Cost Structure

### Fixed Costs (Monthly)
| Item | Cost |
|------|------|
| Hetzner servers (2x) | $30 |
| Vercel Pro | $20 |
| The Odds API | $30 |
| Resend email | $0 (free tier) |
| Chainalysis | $0 (free tier) |
| PostHog analytics | $0 (free tier) |
| Domain/DNS | $2 |
| **Total fixed** | **~$82/month** |

### Variable Costs
| Item | Cost |
|------|------|
| Base mainnet gas (contract deployments, resolution) | ~$5-50/month |
| AI/LLM API costs (agent operations) | ~$200-500/month |
| Referral payouts (10% of trading fees) | Variable |
| **Total variable** | **~$250-600/month** |

### Gross Margin
At base case ($62.5K/month revenue): **99%+ gross margin**

Infrastructure costs are negligible. The smart contracts run themselves. Revenue is collected automatically. There are no payment processors, no physical inventory, no COGS.

## Unit Economics

### Per Trade
- Average trade size (assumed): $50
- Platform fee: $1.00 (2%)
- Gas cost to platform: ~$0.001 (Base L2)
- Net per trade: $0.999
- Margin per trade: 99.9%

### Per User (Monthly)
- Assumed trades per active user: 20/month
- Revenue per active user: $20/month
- Customer acquisition cost (referral): $0 upfront, $2/month (10% of fees)
- LTV at 6-month retention: $120
- CAC:LTV ratio: 1:60

### Per Market
- Creation fee: $5
- Seed capital required: $100-500
- Average volume per market: $2,000-10,000
- Revenue per market: $40-200 (2% of volume)
- ROI on seed: 8-40x (fees vs seed, excluding seed return)

## Competitive Positioning

| Metric | Blizz Markets | Polymarket | Kalshi |
|--------|--------------|------------|--------|
| Trading fee | 2% on buys | 0% (free) | 0-3% variable |
| Settlement | USDC on Base | USDC on Polygon | USD (centralized) |
| Market creation | $5, permissionless | Curated only | Curated only |
| Token launchpad | Yes | No | No |
| Sports betting | Yes | Yes (new) | Yes |
| Casino integration | Yes (blizz.io) | No | No |
| Regulatory status | Curacao licensed | SEC settled ($1.4M) | CFTC regulated |
| Chain | Base (Coinbase L2) | Polygon | N/A (centralized) |

## The Ecosystem Advantage

Blizz Markets is not a standalone prediction market. It's part of a closed-loop crypto entertainment ecosystem:

```
blizz.io (Casino) ←→ blizzmarkets.com (Prediction Markets + Sports + Tokens)
                   ↕
            BLIZZ Token (utility + incentives)
                   ↕
          Trustplay PAM (unified accounts, KYC, fiat on/off ramps)
```

User acquisition for any product benefits all products. A casino player who discovers prediction markets trades more. A sports bettor who discovers the token launchpad creates tokens. Every interaction generates fees somewhere in the ecosystem.

This cross-sell dynamic is why the aggressive projections are achievable: we're not competing for users in one vertical, we're capturing them across multiple verticals simultaneously.

## Key Metrics to Track

| Metric | Definition | Target (Month 3) |
|--------|-----------|------------------|
| Total Volume | Sum of all trades | $1M |
| Monthly Active Wallets | Unique wallets that traded | 500 |
| Markets Created | New markets per month | 100 |
| Tokens Launched | New tokens per month | 50 |
| Fee Revenue | Total fees collected | $20K |
| Treasury Balance | USDC in Gnosis Safe | $50K |
| Waitlist Signups | Total email captures | 5,000 |
| Referral Rate | % of trades from referrals | 20% |

## Capital Requirements

### Launch Capital: $5,000
- Market seeding: $2,500 (50 users x $50 airdrop)
- Platform seeding: $2,000 (company-created flagship markets)
- Gas reserves: $500

### Runway to Profitability
At $82/month fixed costs and >99% gross margin, the platform is profitable from the first month of meaningful trading volume. Break-even at ~$4,100/month volume ($82 in costs / 2% = $4,100).

The platform reaches profitability at approximately $4,100 in monthly trading volume. Everything above that is pure margin.
