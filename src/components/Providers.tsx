'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider, createConfig } from '@privy-io/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { type ReactNode } from 'react'
import { http } from 'viem'
import { base, baseSepolia } from 'viem/chains'

const queryClient = new QueryClient()

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http('https://base-sepolia.g.alchemy.com/v2/qHJU5KP9m1kmtzADnJSdT'),
  },
})

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId="cmn9hex8900710dktxtmeenyh"
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#6EC8FF',
          walletChainType: 'ethereum-only',
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia, base],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}
