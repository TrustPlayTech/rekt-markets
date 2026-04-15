import Link from 'next/link'

export default function BlockedPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
          <svg className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Trading Unavailable</h1>
        <p className="text-rekt-muted mb-6">
          Trading on Rekt Markets is not available in your region due to regulatory restrictions.
          You may continue to browse market data and informational content.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl border border-rekt-border px-6 py-3 text-sm font-medium text-rekt-muted hover:text-white hover:border-rekt-blue/50 transition-colors"
        >
          Browse Markets
        </Link>
      </div>
    </div>
  )
}
