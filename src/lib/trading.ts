// Trading feature flag
// Set NEXT_PUBLIC_TRADING_ENABLED=true in Vercel env vars to enable wallet/trading
// Production: false (view-only), Preview deployments: true (full trading)

export const TRADING_ENABLED = process.env.NEXT_PUBLIC_TRADING_ENABLED === 'true'
