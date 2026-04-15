# Environment Variables - Blizz Markets

> Last updated: 24 March 2026

## Variable Reference

| Variable | Environments | Sensitivity | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_TRADING_ENABLED` | Preview: `true`, Production: `false` (for now) | Public | Controls whether buy/sell UI is active |
| `NEXT_PUBLIC_POSTHOG_KEY` | All | Public | PostHog analytics project key |
| `NEXT_PUBLIC_POSTHOG_HOST` | All | Public | PostHog ingest endpoint. Defaults to `https://eu.i.posthog.com` |
| `ODDS_API_KEY` | All (server-side) | Secret | The Odds API key for sports data and auto-resolution |
| `RESEND_API_KEY` | All (server-side) | Secret | Resend email API key for waitlist signups |
| `CHAINALYSIS_API_KEY` | All (server-side) | Secret | Chainalysis sanctions screening API key |
| `DEMO_PASSWORD` | Preview only | Secret | Password gate for preview/demo environment |
| `CRON_SECRET` | All (server-side) | Secret | Vercel cron job authentication secret for `/api/sports/resolve` |
| `DEPLOYER_PRIVATE_KEY` | Resolution server ONLY | Critical | Private key for on-chain market resolution. **NEVER set in Vercel** |
| `RPC_URL` | Resolution server | Secret | RPC endpoint for resolution server. Defaults to Alchemy Base Sepolia |

## Environment Matrix

| Variable | Vercel Production | Vercel Preview | Resolution Server |
|---|---|---|---|
| `NEXT_PUBLIC_TRADING_ENABLED` | `false` | `true` | N/A |
| `NEXT_PUBLIC_POSTHOG_KEY` | Yes | Yes | N/A |
| `NEXT_PUBLIC_POSTHOG_HOST` | Yes | Yes | N/A |
| `ODDS_API_KEY` | Yes | Yes | Yes |
| `RESEND_API_KEY` | Yes | Yes | N/A |
| `CHAINALYSIS_API_KEY` | Yes | Yes | N/A |
| `DEMO_PASSWORD` | No | Yes | N/A |
| `CRON_SECRET` | Yes | Yes | N/A |
| `DEPLOYER_PRIVATE_KEY` | **NEVER** | **NEVER** | Yes |
| `RPC_URL` | No | No | Yes |

## Security Notes

- `DEPLOYER_PRIVATE_KEY` must never be set in Vercel or any client-accessible environment. It should only exist on the dedicated resolution server.
- All `NEXT_PUBLIC_*` variables are exposed to the browser. Never put secrets in these.
- `CRON_SECRET` protects the `/api/sports/resolve` endpoint from unauthorized invocation.
