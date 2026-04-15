'use client'

import Link from 'next/link'
import Image from 'next/image'
import WalletButton from './WalletButton'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-white/8 bg-card/96 backdrop-blur-md">
      <div className="flex h-full items-center justify-between gap-4 px-4 md:pl-[15rem] md:pr-6">
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/rekt-logo-transparent.png"
            alt="Rekt Palace"
            width={124}
            height={48}
            className="h-8 w-auto md:h-9"
            priority
          />
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/markets"
            className="hidden lg:flex relative w-80 xl:w-96 items-center rounded-xl border border-border bg-background/90 px-4 py-2 text-sm text-foreground/72 hover:border-primary/40 hover:text-white transition-colors"
          >
            <svg className="mr-3 h-4 w-4 text-foreground/55" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search prediction markets, sports, tokens...
          </Link>
          <Link
            href="/waitlist"
            className="hidden md:inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Founders List
          </Link>
          <WalletButton />
        </div>
      </div>
    </header>
  )
}
