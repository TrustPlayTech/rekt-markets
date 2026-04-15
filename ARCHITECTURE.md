# Blizz Markets - Smart Contract Architecture

## Chain: Base (Base Sepolia for testnet)

## Prediction Markets

### Contracts

**MarketFactory.sol**
- Creates new prediction markets
- Stores market metadata (question, resolution time, oracle)
- Emits MarketCreated events

**BinaryMarket.sol**
- Each market is a separate contract instance
- Mints YES/NO tokens (ERC-20) when users buy shares
- AMM: Constant product (x*y=k) for YES/NO pricing
- Users deposit USDC (or ETH) -> receive YES or NO tokens
- Resolution: oracle or admin calls `resolve(outcome)`
- Winners redeem tokens for the pot

**Key functions:**
- `buyYes(amount)` / `buyNo(amount)` - buy outcome tokens via AMM
- `sell(tokenAddress, amount)` - sell back to AMM
- `resolve(Outcome)` - admin/oracle resolves the market
- `redeem()` - winners claim winnings
- `getYesPrice()` / `getNoPrice()` - current implied probability

### Token Model
- YES token: worth $1 if outcome is YES, $0 if NO
- NO token: worth $1 if outcome is NO, $0 if YES
- Prices always sum to ~$1 (AMM invariant)
- Trading moves prices = implied probability

---

## Meme Token Launchpad

### Contracts

**TokenFactory.sol**
- Creates new meme tokens with bonding curve
- Stores token metadata (name, ticker, image URI, creator)
- Emits TokenCreated events

**BondingCurveToken.sol**
- ERC-20 token with built-in bonding curve
- Price = f(supply) - linear or exponential curve
- `buy()` - send ETH, receive tokens at current curve price
- `sell()` - burn tokens, receive ETH at current curve price
- Auto-graduation: when market cap hits threshold (e.g. 10 ETH), 
  migrates liquidity to Uniswap V3 pool on Base
- Creator gets small % of trading fees

**Key functions:**
- `buy()` payable - buy tokens along bonding curve
- `sell(amount)` - sell tokens back to curve
- `graduate()` - triggered when MC threshold hit, deploys to Uniswap
- `getPrice()` - current price based on supply
- `getMarketCap()` - current market cap

### Bonding Curve
- Linear: price = basePrice + (supply * slope)
- Keeps it simple, predictable
- Reserve ratio determines curve steepness

---

## Frontend Integration

1. Replace mock wallet with real wagmi/viem (Base Sepolia)
2. Replace mock trade panels with actual contract calls
3. Add transaction confirmation UI
4. Poll contract state for live prices
5. Display on-chain tx hashes for every action

## Dependencies
- Solidity ^0.8.20
- OpenZeppelin (ERC-20, Ownable, ReentrancyGuard)
- Foundry (forge) for compile/test/deploy
- wagmi + viem for frontend
- Base Sepolia RPC: https://sepolia.base.org
- Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

## Deploy Order
1. Deploy MarketFactory
2. Deploy TokenFactory  
3. Create a few test markets via MarketFactory
4. Create a few test tokens via TokenFactory
5. Wire frontend to contract addresses
6. Test full flow: connect wallet -> buy YES -> resolve -> redeem
