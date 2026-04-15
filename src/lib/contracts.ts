// Contract ABIs extracted from compiled artifacts

export const MARKET_FACTORY_ADDRESS = '0xF7F2d998fE9318BeCf41793F0355a7725302631c' as const
export const TOKEN_FACTORY_ADDRESS = '0x89d90a7ad09d76a533085EA2370c107DFf2b61a6' as const
export const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as const

export const ERC20ABI = [
  { type: 'function', name: 'approve', inputs: [{name: 'spender', type: 'address'}, {name: 'amount', type: 'uint256'}], outputs: [{type: 'bool'}], stateMutability: 'nonpayable' },
  { type: 'function', name: 'balanceOf', inputs: [{name: 'account', type: 'address'}], outputs: [{type: 'uint256'}], stateMutability: 'view' },
  { type: 'function', name: 'allowance', inputs: [{name: 'owner', type: 'address'}, {name: 'spender', type: 'address'}], outputs: [{type: 'uint256'}], stateMutability: 'view' },
  { type: 'function', name: 'decimals', inputs: [], outputs: [{type: 'uint8'}], stateMutability: 'view' },
] as const

// Helper to check if contracts are deployed (non-zero address)
export function isDeployed(address: string): boolean {
  return address !== '0x0000000000000000000000000000000000000000'
}

export const MarketFactoryABI = [
  { type: 'function', name: 'createMarket', inputs: [{ name: 'question', type: 'string' }, { name: 'resolutionTime', type: 'uint256' }], outputs: [{ name: '', type: 'address' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'getMarketCount', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'getMarkets', inputs: [], outputs: [{ name: '', type: 'address[]' }], stateMutability: 'view' },
  { type: 'function', name: 'markets', inputs: [{ name: '', type: 'uint256' }], outputs: [{ name: '', type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'paused', inputs: [], outputs: [{ name: '', type: 'bool' }], stateMutability: 'view' },
  { type: 'function', name: 'owner', inputs: [], outputs: [{ name: '', type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'treasury', inputs: [], outputs: [{ name: '', type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'pause', inputs: [], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'unpause', inputs: [], outputs: [], stateMutability: 'nonpayable' },
  { type: 'event', name: 'MarketCreated', inputs: [{ name: 'market', type: 'address', indexed: true }, { name: 'question', type: 'string', indexed: false }, { name: 'creator', type: 'address', indexed: true }], anonymous: false },
] as const

export const BinaryMarketABI = [
  { type: 'function', name: 'buyYes', inputs: [{ name: 'amount', type: 'uint256' }, { name: 'minTokensOut', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'buyNo', inputs: [{ name: 'amount', type: 'uint256' }, { name: 'minTokensOut', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'sellYes', inputs: [{ name: 'amount', type: 'uint256' }, { name: 'minUsdcOut', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'sellNo', inputs: [{ name: 'amount', type: 'uint256' }, { name: 'minUsdcOut', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'getYesPrice', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'getNoPrice', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'question', inputs: [], outputs: [{ name: '', type: 'string' }], stateMutability: 'view' },
  { type: 'function', name: 'resolutionTime', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'resolved', inputs: [], outputs: [{ name: '', type: 'bool' }], stateMutability: 'view' },
  { type: 'function', name: 'yesWins', inputs: [], outputs: [{ name: '', type: 'bool' }], stateMutability: 'view' },
  { type: 'function', name: 'initialized', inputs: [], outputs: [{ name: '', type: 'bool' }], stateMutability: 'view' },
  { type: 'function', name: 'yesReserve', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'noReserve', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'yesToken', inputs: [], outputs: [{ name: '', type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'noToken', inputs: [], outputs: [{ name: '', type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'owner', inputs: [], outputs: [{ name: '', type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'redeem', inputs: [], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'resolve', inputs: [{ name: '_yesWins', type: 'bool' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'seed', inputs: [{ name: 'amount', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'resolvedPoolBalance', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'emergencyRefund', inputs: [], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'EMERGENCY_PERIOD', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'event', name: 'SharesBought', inputs: [{ name: 'buyer', type: 'address', indexed: true }, { name: 'yes', type: 'bool', indexed: false }, { name: 'ethIn', type: 'uint256', indexed: false }, { name: 'tokensOut', type: 'uint256', indexed: false }], anonymous: false },
  { type: 'function', name: 'treasury', inputs: [], outputs: [{ name: '', type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'PLATFORM_FEE_BPS', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'paused', inputs: [], outputs: [{ name: '', type: 'bool' }], stateMutability: 'view' },
  { type: 'function', name: 'pause', inputs: [], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'unpause', inputs: [], outputs: [], stateMutability: 'nonpayable' },
  { type: 'event', name: 'SharesSold', inputs: [{ name: 'seller', type: 'address', indexed: true }, { name: 'yes', type: 'bool', indexed: false }, { name: 'tokensIn', type: 'uint256', indexed: false }, { name: 'ethOut', type: 'uint256', indexed: false }], anonymous: false },
] as const

export const TokenFactoryABI = [
  { type: 'function', name: 'createToken', inputs: [{ name: 'name', type: 'string' }, { name: 'symbol', type: 'string' }, { name: 'imageURI', type: 'string' }], outputs: [{ name: '', type: 'address' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'getTokenCount', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'getTokens', inputs: [], outputs: [{ name: '', type: 'address[]' }], stateMutability: 'view' },
  { type: 'function', name: 'tokens', inputs: [{ name: '', type: 'uint256' }], outputs: [{ name: '', type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'paused', inputs: [], outputs: [{ name: '', type: 'bool' }], stateMutability: 'view' },
  { type: 'function', name: 'owner', inputs: [], outputs: [{ name: '', type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'pause', inputs: [], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'unpause', inputs: [], outputs: [], stateMutability: 'nonpayable' },
  { type: 'event', name: 'TokenCreated', inputs: [{ name: 'token', type: 'address', indexed: true }, { name: 'name', type: 'string', indexed: false }, { name: 'symbol', type: 'string', indexed: false }, { name: 'creator', type: 'address', indexed: true }], anonymous: false },
] as const

export const BondingCurveTokenABI = [
  { type: 'function', name: 'buy', inputs: [{ name: 'usdcAmount', type: 'uint256' }, { name: 'minTokensOut', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'sell', inputs: [{ name: 'amount', type: 'uint256' }, { name: 'minUsdcOut', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'getPrice', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'getMarketCap', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'graduated', inputs: [], outputs: [{ name: '', type: 'bool' }], stateMutability: 'view' },
  { type: 'function', name: 'creator', inputs: [], outputs: [{ name: '', type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'imageURI', inputs: [], outputs: [{ name: '', type: 'string' }], stateMutability: 'view' },
  { type: 'function', name: 'name', inputs: [], outputs: [{ name: '', type: 'string' }], stateMutability: 'view' },
  { type: 'function', name: 'symbol', inputs: [], outputs: [{ name: '', type: 'string' }], stateMutability: 'view' },
  { type: 'function', name: 'totalSupply', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'balanceOf', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'decimals', inputs: [], outputs: [{ name: '', type: 'uint8' }], stateMutability: 'view' },
  { type: 'function', name: 'BASE_PRICE', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'SLOPE', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'GRADUATION_THRESHOLD', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'event', name: 'TokensBought', inputs: [{ name: 'buyer', type: 'address', indexed: true }, { name: 'ethIn', type: 'uint256', indexed: false }, { name: 'tokensOut', type: 'uint256', indexed: false }], anonymous: false },
  { type: 'event', name: 'TokensSold', inputs: [{ name: 'seller', type: 'address', indexed: true }, { name: 'tokensIn', type: 'uint256', indexed: false }, { name: 'ethOut', type: 'uint256', indexed: false }], anonymous: false },
  { type: 'function', name: 'treasury', inputs: [], outputs: [{ name: '', type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'PLATFORM_FEE_BPS', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'GRADUATION_FEE', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
] as const

export const OutcomeTokenABI = [
  { type: 'function', name: 'balanceOf', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'totalSupply', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'name', inputs: [], outputs: [{ name: '', type: 'string' }], stateMutability: 'view' },
  { type: 'function', name: 'symbol', inputs: [], outputs: [{ name: '', type: 'string' }], stateMutability: 'view' },
  { type: 'function', name: 'decimals', inputs: [], outputs: [{ name: '', type: 'uint8' }], stateMutability: 'view' },
  { type: 'function', name: 'market', inputs: [], outputs: [{ name: '', type: 'address' }], stateMutability: 'view' },
  { type: 'function', name: 'allowance', inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'approve', inputs: [{ name: 'spender', type: 'address' }, { name: 'value', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'transfer', inputs: [{ name: 'to', type: 'address' }, { name: 'value', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'transferFrom', inputs: [{ name: 'from', type: 'address' }, { name: 'to', type: 'address' }, { name: 'value', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable' },
] as const
