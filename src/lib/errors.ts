// Parse blockchain/wallet errors into user-friendly messages

export function parseTradeError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error)
  const lower = msg.toLowerCase()

  // User rejected in wallet
  if (lower.includes('user rejected') || lower.includes('user denied') || lower.includes('rejected the request'))
    return 'Transaction cancelled in wallet.'

  // Insufficient funds
  if (lower.includes('insufficient funds') || lower.includes('exceeds balance'))
    return 'Insufficient ETH for gas fees. You need a small amount of ETH on Base for transaction fees.'

  // USDC specific
  if (lower.includes('erc20: transfer amount exceeds balance') || lower.includes('transfer amount exceeds balance'))
    return 'Insufficient USDC balance.'

  if (lower.includes('erc20: insufficient allowance') || lower.includes('insufficient allowance'))
    return 'USDC not approved. Please approve first.'

  // Contract errors
  if (lower.includes('exceeds trade limit'))
    return 'Trade exceeds the $100 maximum per transaction.'

  if (lower.includes('pool cap reached'))
    return 'This market has reached its maximum pool size.'

  if (lower.includes('trading closed'))
    return 'Trading has closed for this market.'

  if (lower.includes('paused'))
    return 'Trading is temporarily paused.'

  if (lower.includes('min seed'))
    return 'Minimum seed amount is 1 USDC.'

  if (lower.includes('not initialized') || lower.includes('notinitialized'))
    return 'This market has not been seeded yet.'

  if (lower.includes('insufficientoutput') || lower.includes('insufficient output'))
    return 'Slippage too high. The price moved before your transaction could execute.'

  // Network errors
  if (lower.includes('network') || lower.includes('timeout') || lower.includes('could not detect network'))
    return 'Network error. Please check your connection and try again.'

  if (lower.includes('nonce'))
    return 'Transaction nonce error. Try resetting your wallet activity (MetaMask > Settings > Advanced > Clear activity tab data).'

  // Gas estimation
  if (lower.includes('cannot estimate gas') || lower.includes('gas required exceeds'))
    return 'Transaction would fail. This usually means insufficient USDC balance or the market is in an unexpected state.'

  // Fallback
  if (msg.length > 200) return msg.slice(0, 150) + '...'
  return msg || 'An unexpected error occurred. Please try again.'
}
