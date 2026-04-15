# Blizz Markets - Liquidity & Market Creation Strategy

## The Economics

### Revenue
- 2% platform fee on every buy transaction
- At $100K monthly volume: $2K/month revenue
- At $1M monthly volume: $20K/month revenue
- At $10M monthly volume: $200K/month revenue

### Cost of Seeding
- Seed capital is NOT an expense. It's working capital deployed into pools.
- Seed returns to the seeder when markets resolve (minus what winners extract).
- In a balanced market (50/50 trading), the seeder loses ~0% of capital.
- In a lopsided market (everyone bets one side), the seeder loses up to 100% of seed.
- Expected loss across a diversified portfolio of markets: 10-20% of seed capital.

### Unit Economics Per Market
- Seed: $500
- Expected loss on seed: $50-100 (10-20%)
- Revenue at $5K volume per market: $100 (2% of $5K)
- Net: breakeven at ~$2.5K-5K volume per market
- Anything above that is profit

## Phased Approach

### Phase 1: Bootstrapped Launch ($1K-2K capital)
- 5-10 hand-curated prediction markets, $100-200 seed each
- Focus: crypto, politics, tech (topics our audience cares about)
- Sports: 10-20 auto-created from The Odds API, $50 seed each
- Total capital deployed: $1K-2K
- Goal: prove the system works, get first real trades, first real revenue

### Phase 2: Permissionless Growth ($0 additional capital)
- Enable permissionless market creation
- Users create and seed their own markets with their own USDC
- We earn 2% on all trades regardless of who created the market
- Our role shifts from seeder to platform operator
- Sports auto-creation runs on cron, funded by rolling profits

### Phase 3: LP Program ($0 company capital)
- Build LP token mechanism into BinaryMarket
- External liquidity providers deposit USDC to earn trading fees
- LPs earn a share of the 2% fee proportional to their liquidity contribution
- Company no longer needs to seed at all
- LPs take the market risk, we take zero risk, everyone earns

### Phase 4: Market Maker Partnerships
- Onboard professional market makers (crypto-native firms)
- They provide deep liquidity across all markets
- They earn from bid-ask spread + LP fees
- Requires API for programmatic market making (build later)

## Risk Management

### Capital at Risk
| Phase | Company Capital at Risk | Maximum Loss |
|-------|------------------------|--------------|
| Phase 1 | $1K-2K | $2K (entire seed) |
| Phase 2 | $0 (user-funded) | $0 |
| Phase 3 | $0 (LP-funded) | $0 |
| Phase 4 | $0 (MM-funded) | $0 |

### Mitigation
- $100 max per trade (smart contract enforced)
- $10,000 max per market pool (smart contract enforced)
- Pause button (circuit breaker, instant)
- Diversify across market types (crypto + sports + politics)
- Don't seed lopsided markets (e.g., "Will the sun rise tomorrow?")
- Start small, scale with revenue

### Smart Contract Risk
- 6 independent security audits completed
- All CRITICAL/HIGH bugs fixed
- Safety caps enforced at contract level
- Gnosis Safe 2-of-2 multisig for resolution
- UMA Oracle for decentralized resolution

## Market Selection Criteria

### Good Markets (high volume potential, balanced trading)
- Controversial outcomes (crypto price targets, election results)
- Time-bound with clear resolution (specific date, verifiable outcome)
- High public interest (trending topics)
- Roughly 50/50 split in public opinion

### Bad Markets (avoid)
- Obvious outcomes (>90% probability one way)
- Unverifiable resolution ("Will AI become sentient?")
- No public interest (obscure topics)
- Legal/regulatory risk (anything involving specific individuals' health, etc.)

## Sports Strategy

### Economics
- Auto-created from The Odds API (66+ active leagues)
- Each game = 1 BinaryMarket contract (moneyline: home wins YES/NO)
- Seed: $50-100 per game
- Volume per game: varies wildly ($0 for obscure games, $1K+ for NBA/EPL)
- Auto-resolved from scores API (no manual intervention)

### Scaling
- Week 1: 20-30 games (NBA, EPL, top sports)
- Week 2-4: 50-100 games across all leagues
- Month 2+: all games auto-created, funded by rolling revenue

### Capital Recycling
- Sports markets resolve in hours/days (not months like prediction markets)
- Seed capital comes back quickly and can be re-deployed
- $1K in sports seed capital can service $10K+ in weekly markets through recycling

## Summary

The path from "we need capital" to "capital finds us" is:

$1K-2K bootstraps → First trades generate revenue → Revenue funds more markets → Permissionless creation brings user-funded markets → LP program brings external capital → Market makers bring deep liquidity

Each phase reduces company risk to zero while increasing platform value.

The only real capital risk is Phase 1: $1K-2K for 2-4 weeks until revenue starts cycling.
