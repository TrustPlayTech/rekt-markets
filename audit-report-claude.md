# Smart Contract Security Audit Report

**Scope**: BinaryMarket, MarketFactory, BondingCurveToken, TokenFactory, OutcomeToken  
**Solidity**: ^0.8.20 (overflow/underflow protected by default)  
**Framework**: OpenZeppelin Contracts (ERC20, Ownable, ReentrancyGuard)  
**Auditor**: Claude (AI-assisted audit)  
**Date**: 2026-03-23

---

## Executive Summary

Five contracts forming a prediction market system and a bonding-curve meme-token launchpad were reviewed across six audit passes. The codebase is compact and mostly well-structured, but contains **2 Critical**, **4 High**, **5 Medium**, **4 Low**, and **4 Informational** findings. The most severe issues involve an arithmetic underflow in the sell path that can permanently freeze market funds, and a redemption mechanism that allows early redeemers to extract more than their fair share.

---

## 1. BinaryMarket — Audit Findings

**Summary**: Constant-product AMM prediction market collateralised with ERC-20. Users buy/sell YES/NO outcome tokens, and redeem winning tokens after resolution. Contains the most critical issues in the codebase.

| # | Severity | Title | Location | Description | Recommendation |
|---|----------|-------|----------|-------------|----------------|
| 1 | **CRITICAL** | Arithmetic underflow in `_sell` — double subtraction of `otherOut` from reserves | `_sell()` lines ~118-130 | After the CPMM swap, `otherOut` is subtracted from the counterpart reserve (e.g. `noReserve -= otherOut`). Then the "burn complete sets" block subtracts `otherOut` from **both** `yesReserve` and `noReserve` again. The selling side's reserve gets `amount` added then `otherOut` subtracted — which is fine. But the other side's reserve gets `otherOut` subtracted **twice**: once in the swap and once in the burn block. This will cause a revert (Solidity 0.8 underflow) for any non-trivial sell once reserves are imbalanced, potentially locking funds permanently. | Remove the second reserve subtraction block (`yesReserve -= otherOut; noReserve -= otherOut;`) or restructure so each reserve is adjusted exactly once with the net effect. |
| 2 | **CRITICAL** | Redemption pro-rata math is exploitable — early redeemers drain the pool | `redeem()` | `usdcOut = (balance * poolBalance) / totalWinning` uses current `poolBalance` and `totalWinning` at time of call. After each redemption, tokens are burned (reducing `totalWinning`) and USDC is sent out (reducing `poolBalance`). The ratio should stay constant, but any rounding always favors the early redeemer. More critically, if the contract holds **excess** collateral beyond what was deposited (e.g. from direct transfers, or from the sell-path accounting bug), early redeemers extract a disproportionate share. With the double-subtraction bug above, the accounting is already broken — meaning `poolBalance` and reserve tracking diverge, and redemption amounts become unpredictable. | Fix the underlying reserve accounting first. Then either (a) snapshot the pool balance at resolution time and use a fixed denominator, or (b) track total collateral deposits explicitly rather than relying on `balanceOf`. |
| 3 | **HIGH** | No slippage protection on buy/sell | `_buy()`, `_sell()` | Neither `_buy` nor `_sell` accept a `minOut` parameter. Users are fully exposed to sandwich attacks — a frontrunner can move the reserves before the user's tx lands, extracting value via worse execution. On-chain prediction markets are prime targets for MEV bots. | Add `uint256 minTokensOut` to buy and `uint256 minUsdcOut` to sell. Revert if output < minimum. |
| 4 | **HIGH** | Resolution has no time enforcement | `resolve()` | The `resolutionTime` field is stored but never checked. The owner can resolve the market at any time — including immediately after creation, before users can react. This is a rug vector: create market, buy one side cheaply, resolve instantly, redeem. | Add `require(block.timestamp >= resolutionTime)` to `resolve()`. |
| 5 | **MEDIUM** | No deadline/expiry on unresolved markets | Contract-wide | If the owner never calls `resolve()`, user funds are permanently locked. There is no timeout mechanism, no community resolution fallback, and no emergency withdrawal. | Add either (a) an expiry after which anyone can trigger resolution or refund, or (b) an emergency refund function callable after `resolutionTime + gracePeriod`. |
| 6 | **MEDIUM** | `_sell` burn/mint pattern is wasteful and inflates totalSupply temporarily | `_sell()` lines ~108-113 | Instead of transferring tokens from user to contract, `_sell` burns from user then mints to contract. This momentarily changes `totalSupply()`, which could break any external protocol reading supply mid-transaction. More importantly, it requires the market contract to have mint authority — if mint were ever restricted, sells would break. | Use `transferFrom(msg.sender, address(this), amount)` since OutcomeToken is a standard ERC-20. This requires the user to approve the market, but is cleaner. Alternatively, keep the current pattern but document the totalSupply flash clearly. |
| 7 | **LOW** | `seed()` does not verify `resolutionTime` is in the future | `seed()` | A market can be seeded and traded on even if `resolutionTime` is in the past, creating confusion about when it should resolve. | Check `block.timestamp < resolutionTime` in `seed()`. |
| 8 | **LOW** | No fee mechanism | Contract-wide | The AMM charges zero fees. While intentional for simplicity, this means the liquidity provider (seeder) has no economic incentive and will always lose value to informed traders (adverse selection). | Consider adding a swap fee (even 0.3%) to the CPMM formula. |
| 9 | **INFO** | Events don't log `swapOut` separately | `_buy()`, `_sell()` | The `SharesBought` and `SharesSold` events only log `tokensOut` and `usdcOut` total. For off-chain analytics and price tracking, logging the swap component separately would be valuable. | Add `swapOut` to event params or emit a separate `Swap` event. |
| 10 | **INFO** | `getYesPrice` / `getNoPrice` don't sum to exactly 1e18 | View functions | Due to integer division, `getYesPrice() + getNoPrice()` can be off by 1 wei. Not exploitable but could confuse frontends. | Document this or compute `noPrice = 1e18 - yesPrice`. |

---

## 2. MarketFactory — Audit Findings

**Summary**: Minimal factory deploying BinaryMarket instances. Low complexity, low risk.

| # | Severity | Title | Location | Description | Recommendation |
|---|----------|-------|----------|-------------|----------------|
| 11 | **MEDIUM** | No input validation on `createMarket` | `createMarket()` | Accepts empty `question`, zero `resolutionTime`, or past `resolutionTime` without any checks. Malformed markets pollute the `markets` array and waste gas for indexers. | Validate `bytes(question).length > 0` and `resolutionTime > block.timestamp`. |
| 12 | **LOW** | No access control on market creation | `createMarket()` | Anyone can create markets. While this may be intentional (permissionless design), it allows spam/griefing of the `markets` array and event logs. | If permissionless is intended, document it. Otherwise, add an allowlist or creation fee. |
| 13 | **LOW** | `collateralToken` is immutable in practice but not declared `immutable` | State variable | `collateralToken` is set once in the constructor and never changed, but is stored as a regular storage variable. Costs extra gas on every read. | Declare as `immutable`. |
| 14 | **INFO** | `getMarkets()` returns unbounded array | `getMarkets()` | If thousands of markets are created, this view call will hit gas limits when called from other contracts (fine for off-chain reads). | Add a paginated `getMarkets(uint offset, uint limit)` for on-chain consumers, or document as off-chain only. |

---

## 3. BondingCurveToken — Audit Findings

**Summary**: Linear bonding curve meme token with USDC collateral and 1% creator fee. Contains the second-most complex math in the codebase. Has a meaningful economic exploit vector.

| # | Severity | Title | Location | Description | Recommendation |
|---|----------|-------|----------|-------------|----------------|
| 15 | **HIGH** | Buy/sell asymmetry — creator fee creates a permanent deficit in the reserve | `buy()` | On each buy, 1% of USDC goes to the creator before calculating tokens. The tokens minted correspond to `usdcForTokens` (99% of input), but the reserve only receives 99%. When those tokens are later sold, `_calculateSellReturn` computes the area under the bonding curve for the full token amount — which expects 100% of the original USDC to be in the reserve. Result: the contract will eventually have insufficient USDC to honor all sells. Last sellers get reverted with `InsufficientUSDC`. | Either (a) deduct the fee on sell instead of buy, (b) track a separate `reserveBalance` that only counts post-fee deposits, or (c) apply the fee to the output of `_calculateSellReturn` instead. Option (c) is simplest: `usdcOut = _calculateSellReturn(...) * 9900 / 10000`. |
| 16 | **HIGH** | No sell fee — asymmetric fee structure enables MEV extraction | `sell()` | Buys pay 1% fee, sells pay 0%. A sophisticated actor can: (1) buy a large amount (paying 1%), (2) create buying pressure that raises the price, (3) sell immediately at no fee. In a thin market, the 1% cost is easily recovered via price impact on subsequent buyers. Also, the absence of a sell fee accelerates the reserve drain from finding #15. | Add a matching sell fee. |
| 17 | **MEDIUM** | `graduate()` is callable by anyone and does nothing useful | `graduate()` | Sets `graduated = true` and emits an event, but no logic in the contract checks the `graduated` flag. It doesn't pause trading, migrate liquidity, or trigger any state change. Anyone can call it, and it has no access control. This suggests incomplete implementation — if graduation is supposed to transition to a DEX, that logic is missing. | Either implement graduation logic (pause bonding curve, migrate liquidity to Uniswap) or remove the function. If it's a placeholder, add a TODO and restrict access. |
| 18 | **MEDIUM** | Precision loss in `_curveIntegral` quadratic term | `_curveIntegral()` | The expression `SLOPE * nWad / WAD` truncates before multiplication. With `SLOPE = 1`, this effectively becomes `nWad / WAD` which truncates to whole tokens. For purchases smaller than 1 full token (1e18), the quadratic term rounds to zero, meaning the buyer pays only the linear (base price) component. This allows buying fractional amounts at a discount. | Reorder: `(SLOPE * nWad * (nWad + 2 * s0Wad)) / (2 * WAD * WAD)`. This keeps precision longer. With `SLOPE = 1`, it simplifies to `nWad * (nWad + 2 * s0Wad) / (2 * WAD * WAD)`. |
| 19 | **LOW** | `_sqrt` Babylonian method — no risk but suboptimal gas | `_sqrt()` | The hand-rolled Babylonian sqrt is correct but uses more gas than alternatives. Since Solidity 0.8.20+ is specified, OpenZeppelin's `Math.sqrt()` is available and better optimized. | Use `import "@openzeppelin/contracts/utils/math/Math.sol"` and `Math.sqrt(disc)`. |
| 20 | **INFO** | `imageURI` stored on-chain — gas expensive for long URIs | Constructor | Storing a full image URI on-chain costs significant deployment gas. If URIs are IPFS hashes, this is fine (~46 bytes). If they're full HTTPS URLs, it's wasteful. | Consider storing only an IPFS hash or emitting the URI in the `TokenCreated` event only. |

---

## 4. TokenFactory — Audit Findings

**Summary**: Minimal factory deploying BondingCurveToken instances. Same structural pattern as MarketFactory.

| # | Severity | Title | Location | Description | Recommendation |
|---|----------|-------|----------|-------------|----------------|
| 21 | **MEDIUM** | No duplicate symbol/name prevention | `createToken()` | Multiple tokens can be created with identical names and symbols, enabling impersonation/phishing. An attacker creates a token with the same name as a popular one to confuse users. | Maintain a `mapping(bytes32 => bool)` of used symbol hashes and reject duplicates, or document that frontends must disambiguate by address. |
| 22 | **LOW** | Same structural issues as MarketFactory | All | Missing `immutable` on `collateralToken`, unbounded `getTokens()` array return, no input validation (empty name/symbol accepted). | See MarketFactory findings #13 and #14. |
| 23 | **INFO** | No `collateralToken` validation in constructor | `constructor()` | Accepts `address(0)` as collateral token. Every subsequent `createToken` would deploy a broken BondingCurveToken. | Add `require(_collateralToken != address(0))`. |

---

## 5. OutcomeToken — Audit Findings

**Summary**: Minimal ERC-20 with market-only mint/burn. Clean implementation with one design observation.

| # | Severity | Title | Location | Description | Recommendation |
|---|----------|-------|----------|-------------|----------------|
| 24 | **INFO** | `burn` does not require allowance — market can burn any holder's tokens | `burn()` | `_burn(from, amount)` is called directly without checking allowance. This is by design (the market must burn user tokens on sell/redeem), but means the market contract has unilateral power to burn any user's balance. If the market contract has a vulnerability, this becomes a fund-loss amplifier. | This is acceptable given the architecture. Document clearly that the market has full burn authority. |

---

## Cross-Contract Interaction Map

```
                    ┌──────────────────┐
                    │   MarketFactory   │
                    │  (deploys markets)│
                    └────────┬─────────┘
                             │ creates
                             ▼
┌───────────┐       ┌──────────────────┐       ┌───────────┐
│ Collateral│◄──────│   BinaryMarket   │──────►│ Collateral│
│  (USDC)   │ xfer  │   (AMM + resolve)│ xfer  │  (USDC)   │
└───────────┘       └───┬──────────┬───┘       └───────────┘
                        │          │
                  mint/burn    mint/burn
                        ▼          ▼
                ┌───────────┐ ┌───────────┐
                │ OutcomeToken│ │OutcomeToken│
                │   (YES)    │ │   (NO)     │
                └────────────┘ └────────────┘

                    ┌──────────────────┐
                    │   TokenFactory    │
                    │ (deploys tokens)  │
                    └────────┬─────────┘
                             │ creates
                             ▼
                    ┌──────────────────┐       ┌───────────┐
                    │ BondingCurveToken │◄─────►│ Collateral│
                    │  (buy/sell curve) │ xfer  │  (USDC)   │
                    └──────────────────┘       └───────────┘
```

### Trust Boundaries

| Trust Relationship | Risk if Breached |
|---|---|
| **OutcomeToken → BinaryMarket** | Market has unlimited mint/burn on both outcome tokens. If market logic is compromised, attacker can mint unlimited tokens and drain collateral via redemption. |
| **BinaryMarket → Owner (resolver)** | Owner can resolve to either outcome at any time (no time check). Malicious owner = rug. Single key risk. |
| **BondingCurveToken → Creator** | Creator receives 1% of all buys. No additional privileges, but the fee drain means the contract cannot honor all sells (see finding #15). |
| **Factories → Anyone** | Both factories are fully permissionless. No admin. Low risk — factories only deploy, they hold no funds. |

### Systemic Risks

1. **Reserve accounting divergence (BinaryMarket)**: The double-subtraction bug (#1) means virtual reserves (`yesReserve`/`noReserve`) will desync from actual token balances held by the contract. Once this happens, the CPMM pricing is wrong, sells revert, and funds lock.

2. **Collateral drain (BondingCurveToken)**: The creator fee creates a monotonically growing deficit between what the bonding curve promises sellers and what the contract actually holds. This is a slow-motion bank run — the last ~1% of holders cannot exit.

3. **No circuit breakers**: Neither system has a pause mechanism. If a bug is discovered in production, there is no way to halt trading or resolution while a fix is deployed.

---

## Invariants Checklist

| # | Invariant | Enforced? | Notes |
|---|-----------|-----------|-------|
| 1 | Total collateral in BinaryMarket ≥ redeemable value of all outstanding outcome tokens | ❌ **BROKEN** | Double-subtraction bug breaks reserve tracking. |
| 2 | `yesReserve * noReserve` = constant (k) between swaps | ❌ **BROKEN** | The mint-complete-set + swap pattern changes k on every trade by design, but the double subtraction additionally corrupts it. |
| 3 | BondingCurve reserve ≥ `_calculateSellReturn(totalSupply(), totalSupply())` | ❌ **BROKEN** | Creator fee leaks 1% of every buy out of the reserve. |
| 4 | Only MarketFactory can create BinaryMarkets | ✅ Holds | Factory uses `new BinaryMarket(...)`. But anyone can also deploy BinaryMarket directly (no factory-only restriction). |
| 5 | Only the designated owner can resolve a market | ✅ Holds | `onlyOwner` modifier on `resolve()`. |
| 6 | Resolved markets cannot accept new trades | ✅ Holds | `notResolved` modifier on all buy/sell functions. |
| 7 | Users can always withdraw their fair share after resolution | ⚠️ **At risk** | Depends on collateral balance being correct. With bugs #1 and #2, this may fail. |
| 8 | OutcomeToken can only be minted/burned by parent market | ✅ Holds | `onlyMarket` modifier, `market` is immutable. |
| 9 | Bonding curve price is monotonically increasing with supply | ✅ Holds | `p(s) = BASE_PRICE + s * SLOPE` is linear increasing. |
| 10 | Graduation only occurs after threshold is met | ✅ Holds | But graduation has no functional effect (finding #17). |

---

## Severity Summary

| Severity | Count | Finding #s |
|----------|-------|------------|
| CRITICAL | 2 | #1, #2 |
| HIGH | 4 | #3, #4, #15, #16 |
| MEDIUM | 5 | #5, #6, #11, #17, #21 |
| LOW | 4 | #7, #8, #12, #13 (applies to both factories), #19, #22 |
| INFO | 4 | #9, #10, #14 (applies to both factories), #20, #23, #24 |

---

## Priority Remediation Order

1. **Fix `_sell` double subtraction** (Critical #1) — This is a funds-locking bug. Remove the second reserve decrement block.
2. **Fix redemption mechanism** (Critical #2) — Snapshot pool balance at resolution or track deposits explicitly.
3. **Add time check to `resolve()`** (High #4) — One-line fix: `require(block.timestamp >= resolutionTime)`.
4. **Add slippage protection** (High #3) — Add `minOut` params to buy/sell.
5. **Fix bonding curve reserve deficit** (High #15, #16) — Apply fee on sell output, not buy input. Add sell fee.
6. **Fix `_curveIntegral` precision** (Medium #18) — Reorder multiplication to avoid early truncation.
7. **Implement or remove `graduate()`** (Medium #17) — Dead code in production is a red flag.
8. **Add input validation to factories** (Medium #11, #21) — Zero-address, empty string, and duplicate checks.
9. **Add market expiry/emergency withdrawal** (Medium #5) — Protect users from absent owners.
10. **Remaining LOW/INFO items** — Gas optimizations, event improvements, documentation.
