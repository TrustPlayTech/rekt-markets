# Blizz Markets Smart Contract Audit Report

Repository: `TrustPlayTech/blizzmarkets`
Branch: `master`
Reviewed files:
- `contracts/src/BinaryMarket.sol`
- `contracts/src/MarketFactory.sol`
- `contracts/src/BondingCurveToken.sol`
- `contracts/src/TokenFactory.sol`
- `contracts/src/OutcomeToken.sol`

## Scope confirmation
I reviewed the five Solidity source files named above. The implementation is compact, which makes the main risk concentration relatively clear: **BinaryMarket** carries the majority of the protocol risk, while the two factory contracts are thin deployers and **OutcomeToken** is a narrowly scoped helper token.

---

## BinaryMarket — Audit Findings

**Summary:** `BinaryMarket` implements a binary prediction market with internal YES/NO outcome tokens and a constant-product style pricing model. The contract has two serious logic issues: redemption can permanently strand collateral after resolution, and the market owner can resolve arbitrarily early because `resolutionTime` is never enforced.

| # | Severity | Title | Location | Description | Recommendation |
|---|---|---|---|---|---|
| 1 | **CRITICAL** | Redemption formula permanently strands collateral held against contract-owned winning tokens | `contracts/src/BinaryMarket.sol:80-84, 109-127, 167-171, 192-209` | The contract mints outcome tokens to itself during seeding and each buy. At resolution, `redeem()` pays `balance * poolBalance / totalWinningSupply`. Because `totalWinningSupply` includes winning tokens still held by the market contract itself, user redemptions are diluted by non-redeemable contract-held winning tokens. In the seeded state, most collateral becomes permanently trapped after users redeem, because the contract cannot call `redeem()` on itself and there is no sweep path. This is a permanent freeze-of-funds bug in the core payout logic. | Redesign settlement so only externally held winning claims participate in payout, or burn/retire contract inventory before resolution. A safer pattern is to maintain explicit user claim accounting and redeem 1 winning share for 1 collateral unit, with AMM inventory fully reconciled before settlement. |
| 2 | **HIGH** | Owner can resolve at any time; `resolutionTime` is unused | `contracts/src/BinaryMarket.sol:18-21, 51-62, 185-190` | `resolutionTime` is stored but never checked in `resolve()`. The owner can resolve immediately after deployment, before trading activity finishes, or at any arbitrary moment. This is a direct market-integrity failure and creates a centralization vector where the owner can freeze trading and force settlement on demand. | Enforce `block.timestamp >= resolutionTime` in `resolve()`. If off-chain adjudication is intended, separate the resolver role from ownership and add an immutable resolver, dispute period, or oracle-based finalization path. |
| 3 | **MEDIUM** | No slippage protection on buys and sells | `contracts/src/BinaryMarket.sol:91-98, 135-142` | `buyYes`, `buyNo`, `sellYes`, and `sellNo` accept only an amount-in/amount token quantity and expose no `minOut` / `maxIn` guard. Users are fully exposed to sandwich attacks and same-block price movement. Because pricing is deterministic and stateful, attackers can front-run and back-run user trades without users being able to bound execution. | Add `minTokensOut` for buys and `minCollateralOut` for sells, and revert on worse execution. |
| 4 | **MEDIUM** | Permissionless seeding allows any address to become the initial LP inventory source | `contracts/src/BinaryMarket.sol:73-87` | `seed()` is callable once by any address, not just the market owner or factory. That may be intentional, but it means the designated owner may not control market initialization timing or initial inventory funding. Combined with the unrestricted resolution power, this creates confusing and potentially adversarial initialization dynamics. | Restrict seeding to a designated initializer/owner, or explicitly document the permissionless design and bind initialization authority at market creation time. |
| 5 | **MEDIUM** | Generic ERC-20 integration is unsafe for fee-on-transfer / non-standard collateral | `contracts/src/BinaryMarket.sol:77-78, 102-103, 177-178` | The market assumes `transferFrom(msg.sender, address(this), x)` causes the contract to receive exactly `x` collateral units. With fee-on-transfer or rebasing collateral, the contract can mint claims against more collateral than it actually received, breaking solvency. The code also uses raw `IERC20` instead of `SafeERC20`. | Restrict collateral to known-safe tokens such as canonical USDC, validate the collateral address in the factory, and use `SafeERC20` plus before/after balance checks if generic ERC-20 support is required. |
| 6 | **LOW** | Constructor accepts zero-address collateral | `contracts/src/BinaryMarket.sol:51-62` | No validation prevents `_collateralToken == address(0)`. That would create an unusable market instance and push failure to runtime. | Validate constructor inputs and revert on zero addresses. |

### Pass notes
- **Architecture & access control:** Inherits `ReentrancyGuard` and `Ownable`; privileged role is `owner`, who can unilaterally resolve the market. No upgradeability or initializer pattern is used.
- **State & data integrity:** Reserve bookkeeping broadly mirrors token inventory during normal trading, but the settlement invariant is broken because contract-held winning supply participates in payout denominator.
- **External interactions & reentrancy:** External token calls are wrapped by `nonReentrant` on trade and redeem flows. `resolve()` is not reentrant-sensitive. Main issue is not reentrancy but settlement/accounting logic.
- **Economic exploits:** No slippage controls; owner-controlled resolution; settlement can freeze large portions of collateral.
- **Edge cases / DoS:** If nobody outside the contract holds winning tokens at resolution, collateral is fully stranded. Direct collateral transfers also distort payout because redemption uses full `balanceOf(this)` as the pool.
- **Standards / integration:** Outcome tokens are standard OZ ERC-20s, but the market’s collateral integration is only safe for standard, non-deflationary ERC-20s.

---

## MarketFactory — Audit Findings

**Summary:** `MarketFactory` is a minimal deployer for `BinaryMarket` instances. Its code is simple, but it performs almost no validation and does not establish itself as an authoritative market registry because markets can also be deployed directly.

| # | Severity | Title | Location | Description | Recommendation |
|---|---|---|---|---|---|
| 1 | **MEDIUM** | Factory does not validate collateral token address | `contracts/src/MarketFactory.sol:14-16` | The constructor accepts any address, including `address(0)` or a malicious/non-standard ERC-20. All markets created by this factory inherit that dependency. | Validate `_collateralToken != address(0)` and, if generic tokens are not intended, restrict to approved collateral. |
| 2 | **LOW** | Anyone can create arbitrary markets with arbitrary metadata | `contracts/src/MarketFactory.sol:19-23` | `createMarket()` is permissionless and accepts arbitrary question text and any `resolutionTime`, including past timestamps. This may be intentional, but it allows spam, malformed markets, and confusing UX. | Add optional governance/curation, or at minimum validate question length/non-emptiness and sensible resolution timestamps. |
| 3 | **LOW** | Factory is not an exclusive trust boundary | `contracts/src/MarketFactory.sol:19-23` and `contracts/src/BinaryMarket.sol:51-62` | The system cannot enforce an invariant such as “only factory-created markets exist” because `BinaryMarket` can be deployed directly by any caller. Off-chain integrations that trust the factory list must explicitly ignore non-factory markets. | If exclusivity matters, gate the `BinaryMarket` constructor behind a factory parameter or immutable factory check. |

### Pass notes
- **Architecture & access control:** No inheritance, no owner/admin role.
- **State integrity:** State is limited to collateral address and append-only market list.
- **External interactions:** Only deploys a new contract.
- **Economic issues:** Spam and spoof markets are possible if the frontend treats all factory entries equally.
- **DoS:** `getMarkets()` returns the full array; over time this can become expensive for on-chain callers.
- **Integration:** Registry discoverability exists, but no validation or uniqueness guarantees are provided.

---

## BondingCurveToken — Audit Findings

**Summary:** `BondingCurveToken` is a linear bonding-curve ERC-20 funded by ERC-20 collateral with a 1% creator fee on buys. The arithmetic is compact and mostly coherent, but the contract has notable market-design and integration weaknesses: there is no slippage protection, the `graduated` flag does not change behavior, and generic collateral support is unsafe for deflationary tokens.

| # | Severity | Title | Location | Description | Recommendation |
|---|---|---|---|---|---|
| 1 | **MEDIUM** | No slippage controls on buy/sell enables sandwich attacks | `contracts/src/BondingCurveToken.sol:50-69, 74-86` | Users cannot specify a minimum acceptable token output on `buy()` or minimum USDC output on `sell()`. Because the price curve is deterministic and depends on `totalSupply()`, attackers can front-run and back-run user orders to extract value. | Add `minTokensOut` and `minCollateralOut` parameters and revert on worse execution. |
| 2 | **MEDIUM** | `graduated` flag has no effect on trading lifecycle | `contracts/src/BondingCurveToken.sol:23, 91-96` | `graduate()` only flips a boolean and emits an event. It does not pause buys/sells, move liquidity, or otherwise change contract behavior. If graduation is supposed to signal migration to a DEX or disable the curve, the current implementation does not enforce that lifecycle. | Either remove the flag or enforce post-graduation behavior explicitly, such as disabling curve trading and enabling migration hooks. |
| 3 | **MEDIUM** | Generic ERC-20 collateral support is unsafe for fee-on-transfer tokens | `contracts/src/BondingCurveToken.sol:53-61, 77-84` | `buy()` assumes the contract receives exactly `usdcAmount`, then transfers a creator fee and mints against the residual. With a fee-on-transfer token, the contract may receive less than expected yet still mint against `usdcAmount - fee`, creating insolvency. | Use `SafeERC20` and before/after balance accounting, or constrain collateral to a known standard token. |
| 4 | **LOW** | Constructor does not validate creator or collateral addresses | `contracts/src/BondingCurveToken.sol:35-45` | A zero-address `creator` burns creator fees permanently; a zero-address collateral token makes the market unusable. | Validate constructor parameters. |
| 5 | **LOW** | Price display and graduation metric are discretized by whole-token supply | `contracts/src/BondingCurveToken.sol:101-108` | `getPrice()` floors supply to whole tokens (`totalSupply() / 1e18`) while the internal buy/sell math uses continuous wad-scaled supply. This creates a mismatch between quoted price/market cap and actual marginal trading cost, especially around fractional supply boundaries. | Align view math with execution math, or document clearly that displayed price is a coarse approximation. |
| 6 | **INFO** | Quadratic discriminant can overflow at extreme scale and revert | `contracts/src/BondingCurveToken.sol:130-135` | `disc = p * p + 4 * q` relies on Solidity 0.8 checked arithmetic. At very high supply or collateral values, the function will revert rather than degrade gracefully. This is not likely in normal operation but is still a hard upper bound. | Consider documenting max supported ranges or using a bounded math library if extreme scaling is expected. |

### Pass notes
- **Architecture & access control:** Inherits `ERC20` and `ReentrancyGuard`; no owner/admin role beyond fixed `creator` fee recipient.
- **State & data integrity:** Buy/sell math is internally symmetric, but reserve solvency relies on standard collateral behavior.
- **External interactions:** Only collateral transfers; nonReentrant is applied correctly.
- **Economic exploits:** Sandwich risk is the main economic weakness. First-buyer advantage is intrinsic to the curve design rather than a coding bug.
- **Edge cases:** Small buys may round down to zero and revert; this is safe but may be surprising UX.
- **Standards:** ERC-20 compliance comes from OZ. No `increaseAllowance`/`decreaseAllowance`, but that is inherited behavior rather than custom logic.

---

## TokenFactory — Audit Findings

**Summary:** `TokenFactory` is a simple deployer for `BondingCurveToken`. The contract is straightforward but performs no validation and, like `MarketFactory`, is not an exclusive deployment authority.

| # | Severity | Title | Location | Description | Recommendation |
|---|---|---|---|---|---|
| 1 | **MEDIUM** | Factory does not validate collateral token address | `contracts/src/TokenFactory.sol:14-16` | A zero or malicious collateral address poisons every token created through the factory. | Validate `_collateralToken != address(0)` and restrict collateral if needed. |
| 2 | **LOW** | Anyone can create arbitrary token instances | `contracts/src/TokenFactory.sol:19-27` | The factory is permissionless and accepts arbitrary metadata. This is fine for open creation, but it allows spam, impersonation, and offensive metadata on-chain. | Add optional curation/whitelisting or explicit frontend filtering if the registry is surfaced to users. |
| 3 | **LOW** | Factory is not an exclusive token registry | `contracts/src/TokenFactory.sol:24-27` and `contracts/src/BondingCurveToken.sol:35-45` | `BondingCurveToken` can be deployed directly without using the factory, so “factory-created token” is only a discoverability property, not an enforceable system invariant. | If exclusivity matters, bind deployment authority in the token constructor. |

### Pass notes
- **Architecture & access control:** No inheritance, no privileged role.
- **State integrity:** Append-only list of token addresses.
- **External interactions:** Deploys new tokens only.
- **DoS:** `getTokens()` may become expensive for on-chain consumers as the array grows.
- **Integration:** No input validation or duplicate detection.

---

## OutcomeToken — Audit Findings

**Summary:** `OutcomeToken` is a thin ERC-20 wrapper controlled entirely by its parent `BinaryMarket`. The contract is simple and low-risk in isolation, but all holders fully trust the parent market to mint/burn correctly.

| # | Severity | Title | Location | Description | Recommendation |
|---|---|---|---|---|---|
| 1 | **LOW** | Symbols are reused across all markets (`YES` / `NO`) | `contracts/src/OutcomeToken.sol:19-20` and `contracts/src/BinaryMarket.sol:60-61` | Every YES token shares symbol `YES` and every NO token shares symbol `NO`, regardless of market. Wallets, explorers, and indexers often key on symbol/name pairs in human-readable surfaces, so cross-market confusion is likely. | Use per-market unique symbols or include a short market identifier. |
| 2 | **INFO** | Holders fully trust the parent market contract | `contracts/src/OutcomeToken.sol:14-28` | The market can mint and burn from any address without allowance because `burn(from, amount)` is restricted only by `onlyMarket`. That is intentional for the design, but it makes `OutcomeToken` security entirely dependent on `BinaryMarket`. | Document the trust model clearly and keep `BinaryMarket` minimal and heavily tested. |

### Pass notes
- **Architecture & access control:** Inherits `ERC20`; only privileged role is immutable `market`.
- **State integrity:** Minimal, with no custom arithmetic.
- **External interactions:** None beyond OZ internals.
- **Standards:** ERC-20 compliance inherited from OZ.

---

## Cross-Contract Interaction Map

```text
MarketFactory
  └─ deploys ──> BinaryMarket(owner = market creator, collateral = factory collateral)
                   ├─ deploys ──> OutcomeToken YES
                   ├─ deploys ──> OutcomeToken NO
                   ├─ pulls collateral from users via IERC20.transferFrom
                   ├─ transfers collateral back on sell/redeem
                   └─ mints/burns OutcomeTokens as market inventory and user claims

TokenFactory
  └─ deploys ──> BondingCurveToken(creator = token creator, collateral = factory collateral)
                   ├─ pulls collateral from buyers via IERC20.transferFrom
                   ├─ sends creator fee in collateral
                   ├─ mints ERC-20 curve tokens on buy
                   └─ burns curve tokens / returns collateral on sell
```

## Trust Boundary Analysis

- **BinaryMarket trusts collateralToken** to behave like a standard ERC-20. If collateral is deflationary, rebasing, or malicious, solvency/accounting can break.
- **OutcomeToken holders trust BinaryMarket completely.** The market can mint/burn arbitrarily and controls all settlement behavior.
- **Users trust the BinaryMarket owner** to resolve honestly and at an appropriate time; the contract currently provides no timing or oracle constraint.
- **BondingCurveToken users trust collateralToken** for standard transfer semantics and trust the creator address as fee recipient, but there is no admin who can confiscate balances.
- **Factory contracts are registries, not security boundaries.** Because `BinaryMarket` and `BondingCurveToken` can both be deployed directly, the factories do not enforce exclusivity.

## Systemic Risks Emerging From Contract Interactions

1. **Settlement risk is systemic across all factory-created markets.** Every market produced by `MarketFactory` inherits the same broken redemption design in `BinaryMarket`.
2. **Collateral integration risk is systemic.** Both factories propagate one collateral token address into all deployed children. A bad collateral choice compromises every instance created by that factory.
3. **Registry assumptions are weak.** Off-chain consumers must decide whether to trust only factory registries or allow direct deployments; the contracts themselves do not enforce one canonical source.

---

## Invariants Checklist

- [ ] **Total OutcomeToken supply == total deposits into that market outcome**  
  **Not enforced.** Supply changes through complete-set minting, AMM inventory mint/burn, and user trading. More importantly, redemption logic does not reconcile contract-held winning supply correctly.

- [ ] **BondingCurve token price is monotonically determined by supply**  
  **Mostly enforced for execution math.** Buy/sell formulas are monotonic in supply, but `getPrice()` is only a whole-token approximation and does not exactly match marginal execution price for fractional supplies.

- [ ] **Only MarketFactory can create new BinaryMarkets**  
  **Not enforced.** `BinaryMarket` can be deployed directly.

- [ ] **Only the designated resolver can resolve a market**  
  **Enforced as `onlyOwner`, but the trust model is highly centralized.**

- [ ] **Resolved markets cannot accept new trades**  
  **Enforced.** `buy*`, `sell*`, and `seed()` are all gated by `notResolved`.

- [ ] **Users can always withdraw their fair share after resolution**  
  **Not enforced.** Contract-held winning supply dilutes redeeming users and can permanently strand collateral.

- [ ] **Factory-created contracts are discoverable**  
  **Enforced for factory-created instances only** via `markets[]` / `tokens[]`, but the registry is not exclusive.

- [ ] **Collateral received by a contract equals accounting assumptions used for minting/redemption**  
  **Not enforced** for generic ERC-20 tokens; fee-on-transfer or malicious collateral can break this assumption.

- [ ] **Graduated bonding-curve tokens transition to a new lifecycle**  
  **Not enforced.** `graduated` is informational only.

---

## Overall Assessment

The main security concern is **BinaryMarket**. I would not ship it in its current form because the redemption logic can permanently trap collateral and the owner can resolve markets arbitrarily early. The remaining contracts are materially simpler, but both factories need basic validation and **BondingCurveToken** needs slippage controls plus a clearer post-graduation lifecycle.
