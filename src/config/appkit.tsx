// Contribution #55: "^1.8.14", - Bookmark feature
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { mainnet, arbitrum, base, baseSepolia, type AppKitNetwork } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { ReactNode } from 'react'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://dashboard.reown.com
const projectId = import.meta.env.VITE_PROJECT_ID

// 2. Create a metadata object
const metadata = {
  name: 'THE WALL',
  description: 'Anonymous thoughts. Permanent records. Real connections.',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://example.com',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set the networks - Base Sepolia as primary for testing
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [baseSepolia, base, mainnet, arbitrum]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false
})

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true
  },
  themeMode: 'light',
  themeVariables: {
    '--apkt-accent': '#000000',
    '--apkt-color-mix': '#ffffff',
    '--apkt-color-mix-strength': 0
  }
})

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
