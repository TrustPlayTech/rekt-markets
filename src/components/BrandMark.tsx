import Link from 'next/link'

type BrandMarkProps = {
  compact?: boolean
}

export default function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2">
      <span className="inline-flex h-10 items-center rounded-xl border border-rekt-gold/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-rekt-dark px-3 shadow-[0_0_24px_rgba(245,166,35,0.12)]">
        <span className="font-display text-xl font-black tracking-[0.28em] text-white drop-shadow-[0_0_10px_rgba(245,166,35,0.2)]">
          REKT
        </span>
      </span>
      {!compact && <span className="hidden text-xs font-medium uppercase tracking-[0.24em] text-rekt-muted md:block">Markets</span>}
    </Link>
  )
}
