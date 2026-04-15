import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-6xl font-bold text-white">404</h1>
      <p className="mt-4 text-rekt-muted">Page not found</p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-rekt-blue px-8 py-3 text-sm font-medium text-white hover:bg-rekt-blue/80 transition-colors"
      >
        Go Home
      </Link>
    </div>
  )
}
