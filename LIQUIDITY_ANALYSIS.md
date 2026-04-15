# Blizz Markets: LP Economics & Liquidity Analysis

## Executive Summary
This analysis models the economics for Liquidity Providers (LPs) in the Blizz Markets CPMM prediction market. Key findings indicate that while CPMM is highly efficient for balanced markets, it exposes LPs to significant Impermanent Loss (IL) in lopsided markets. 
- At an 80/20 price ratio, seeder loss reaches **20%**. 
- To offset a 20% seeder loss using a 1% LP fee share, a market needs volume equal to **20x the pool size**.
- Sports markets (hours/days duration) offer a highly efficient capital recycling model, allowing LPs to compound yields and manage risk tighter than long-term political markets.

## A. Impermanent Loss Modeling

In a CPMM ($x \times y = k$) binary prediction market, a seeder deposits $L$ USDC to mint $L$ YES and $L$ NO tokens, creating an initial pool where $x = L$, $y = L$, and initial price is 50/50 ($p=0.5$). 
At any probability $p$, the pool reserves adjust to maintain $k$:
- $x = L \sqrt{(1-p)/p}$
- $y = L \sqrt{p/(1-p)}$

The market value of the pool at price $p$ is $V = x \cdot p + y \cdot (1-p) = 2L \sqrt{p(1-p)}$.
The exact seeder loss (IL) compared to the initial $L$ USDC deposit is $1 - 2\sqrt{p(1-p)}$.

**IL at different final price ratios:**
- **50/50:** $2\sqrt{0.5 \times 0.5} = 1.000$ $\rightarrow$ **0.00% Loss**
- **60/40:** $2\sqrt{0.6 \times 0.4} = 0.980$ $\rightarrow$ **2.02% Loss**
- **70/30:** $2\sqrt{0.7 \times 0.3} = 0.916$ $\rightarrow$ **8.35% Loss**
- **80/20:** $2\sqrt{0.8 \times 0.2} = 0.800$ $\rightarrow$ **20.00% Loss**
- **90/10:** $2\sqrt{0.9 \times 0.1} = 0.600$ $\rightarrow$ **40.00% Loss**
- **100/0:** $2\sqrt{1.0 \times 0.0} = 0.000$ $\rightarrow$ **100.00% Loss**

## B. Volume vs Seed Size Analysis

Based on an extraction of Polymarket API events, market volume follows a heavy power-law distribution.
*(Data context: analyzed from active/closed events on Polymarket via Gamma API)*
- **Median Volume:** Highly skewed. Most niche markets see <$500 in volume, while top markets (top 10%) absorb >90% of all volume, often exceeding $10k–$100k+.
- **Distribution:** Top 10% are "mega-markets" (e.g., major sports, elections). Bottom 50% are illiquid.
- **Seed Size Recommendations:**
  - **Tier 1 (High Volume):** Max pool of $10,000 USDC.
  - **Tier 2 (Medium Volume):** $1,000 - $2,500 USDC seed.
  - **Tier 3 (Niche):** $100 - $250 USDC seed to minimize IL risk on low-volume, highly speculative markets.

## C. Revenue vs Loss Breakeven

With a **2% platform fee on buys**, if 1% goes to LPs and 1% to the platform:
- LP earns $0.01$ per $1 of volume.
- To breakeven against an $X\%$ impermanent loss, the pool requires $V = (X\% \times \text{Seed}) / 0.01$.

**Breakeven Volume Multipliers (Volume required as a multiple of Seed Size):**
- **60/40 Final Price (2.02% Loss):** $2.02 / 1 = 2.02\text{x}$ volume.
- **70/30 Final Price (8.35% Loss):** $8.35 / 1 = 8.35\text{x}$ volume.
- **80/20 Final Price (20% Loss):** $20 / 1 = 20\text{x}$ volume.
- **90/10 Final Price (40% Loss):** $40 / 1 = 40\text{x}$ volume.

In balanced markets (e.g., closely contested sports matches ending around 50/50 before the final event), LPs easily profit. In lopsided markets (e.g., highly predictable outcomes moving to 90/10), LPs will likely lose money unless volume is astronomical (40x pool size).

## D. Sports Market Economics

Sports markets are structurally ideal for AMM liquidity:
- **Fast Resolution:** Markets resolve in hours or days, not months.
- **Capital Recycling:** A $1,000 seed can be recycled every 2 days. 15 times a month = $15,000 in effective deployed capital.
- **Balanced Odds:** Bookmaker-style spreads keep probabilities near 50/50 for a longer duration, minimizing IL until the actual event starts. 
- **Expected Loss Rate:** Much lower than political markets. We estimate average IL at closure to be <10%, requiring only ~10x volume-to-seed ratio to remain profitable.

## E. LP Program Economics & APY

Assuming a 1% LP fee and a conservative 3-day capital recycling loop for sports markets:
- **Scenario:** $1,000 seed, generating $5,000 volume per 3-day cycle (5x turnover).
- **Fees earned:** $50 per cycle.
- **IL Cost (assuming 70/30 avg closure):** ~$83.50. Net Loss.
- **Alternative Scenario (Balanced):** $1,000 seed, 5x turnover, 60/40 closure (2% IL). Fees = $50. IL = $20. Net Profit = $30 per 3 days.
- **Annualized (120 cycles):** $30 \times 120 = $3,600 on $1,000 seed $\rightarrow$ **360% APY**.
- LPs can vastly outperform DeFi yield farming (typically 5-15% APY) **only if** they actively manage positions or stick to fast-resolving, high-volume, balanced markets.

## Sources & Citations
- Jason Milionis, Anthony Lee Zhang, and Ciamac Moallemi (2022). *Automated Market Making and Loss-Versus-Rebalancing*. [arXiv:2208.06046](https://arxiv.org/abs/2208.06046)
- Srisht Fateh Singh et al. (2025). *Modeling Loss-Versus-Rebalancing in Automated Market Makers via Continuous-Installment Options*. [arXiv:2508.02971](https://arxiv.org/html/2508.02971v1)
- Polymarket Gamma API (Active & Closed Events Data): [https://gamma-api.polymarket.com/events](https://gamma-api.polymarket.com/events)

## Recommendations
1. **Dynamic Fees / LVR Protection:** Given the significant LVR (Loss-Versus-Rebalancing) in CPMMs as arbitrageurs exploit stale prices, consider implementing dynamic fees or limiting max pool size based on market volatility.
2. **Subsidize Lopsided Markets:** Provide platform-side incentives for markets expected to end up 90/10, as organic LP yields cannot cover the 40% IL.
3. **Focus on Sports & Short-Term Events:** Fast capital recycling allows the 1% LP fee to outpace IL in balanced environments.
