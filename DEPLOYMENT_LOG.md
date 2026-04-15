# Deployment Log - Base Sepolia Testnet

**Date:** 2026-03-25
**Chain:** Base Sepolia (Chain ID: 84532)
**Deployer:** 0xb251987ABfc2F34f5B16C1D43962e93a474b5526

## Deployed Contracts

| Contract | Address | Deploy TX |
|----------|---------|-----------|
| MarketFactory | `0xF7F2d998fE9318BeCf41793F0355a7725302631c` | `0xabe03fc17a15f55e553e58a123cb018cf961758a5b16443da0c3121ba15cb669` |
| TokenFactory | `0x89d90a7ad09d76a533085EA2370c107DFf2b61a6` | `0x2863ce3ca99bc6a0fa4a8ea114a3a479b16b73bb12eb4ef9d3a07dffd42cc3fc` |
| UMAMarketResolver | `0xC89eA61eBA55406d0836689889D19B2BE739E33E` | `0x0ff51b872ffcfa2fad0227a7d3fa2ff861fac43c265750a2f76132d6b55d8a82` |

## Configuration Transactions

| Action | TX Hash |
|--------|---------|
| Set resolver on MarketFactory | `0x32c94062b2dc34ac0a9481b923d5b3a164b43db9b4c510f25dcc8aff253ef7d8` |
| Set deployer as trustedCreator | `0x9502d8118030ce7250b45388cb4996c41bf4cf4aaec94424e51f305691ebe97a` |

## External Dependencies

| Contract | Address |
|----------|---------|
| USDC (testnet) | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |
| Treasury (Gnosis Safe) | `0xBeA133eBCa0F66d1eB68fE5485edc419096A5b72` |
| UMA OOV3 | `0x0F7fC5E6482f096380db6158f978167b57388deE` |
| UMA Bond Token | `0x7E6d9618Ba8a87421609352d6e711958A97e2512` |

## Verification Results

All view function calls confirmed correct state:

| Check | Result |
|-------|--------|
| MF owner | `0xb251987ABfc2F34f5B16C1D43962e93a474b5526` ✅ |
| MF resolver | `0xC89eA61eBA55406d0836689889D19B2BE739E33E` ✅ |
| MF trustedCreator(deployer) | `true` ✅ |
| MF treasury | `0xBeA133eBCa0F66d1eB68fE5485edc419096A5b72` ✅ |
| MF collateralToken | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` ✅ |
| TF owner | `0xb251987ABfc2F34f5B16C1D43962e93a474b5526` ✅ |
| TF treasury | `0xBeA133eBCa0F66d1eB68fE5485edc419096A5b72` ✅ |
| TF collateralToken | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` ✅ |

## Integration Tests (T11)

### TEST 1: Market lifecycle
**Status: BLOCKED** - Insufficient testnet USDC. Deployer has 4 USDC, needs 5 USDC for market creation fee + 5 USDC for seed + 1 USDC for buy = 11 USDC total. Circle faucet requires reCAPTCHA (no headless browser available). Need manual faucet request at https://faucet.circle.com (select Base Sepolia, USDC, address 0xb251987ABfc2F34f5B16C1D43962e93a474b5526).

### TEST 2: Access control
| Check | Result |
|-------|--------|
| Owner is deployer | ✅ `0xb251987ABfc2F34f5B16C1D43962e93a474b5526` |

### TEST 3: Pause mechanism
| Step | TX | Result |
|------|-----|--------|
| Pause from owner | `0x6d3236ec546ba11bd70e9837b8a2161218c255c13031aeef543bec447a851d64` | ✅ paused=true |
| Unpause from owner | `0xa59017cc6fa3b4263c59d639a90d54da042b99f9954a69ee8cf4ed7c1ee50d82` | ✅ paused=false |

### TEST 4: Token lifecycle
**Status: BLOCKED** - Same USDC shortage. TokenFactory creation fee is 10 USDC.

### TEST 5: Pool cap
**Status: BLOCKED** - Requires active market from TEST 1.

## Notes

- All contracts deployed and configured successfully
- Pause/unpause mechanism verified working
- Access control verified (owner check)
- USDC-dependent tests (market creation, token creation, trading) blocked due to insufficient testnet USDC
- **Action needed:** Request 20 USDC from https://faucet.circle.com for address `0xb251987ABfc2F34f5B16C1D43962e93a474b5526` on Base Sepolia, then re-run integration tests
- Frontend contracts.ts updated with new addresses
