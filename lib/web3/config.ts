import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, sepolia } from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'

// Get project ID from environment variables
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID

if (!projectId) {
  throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not set')
}

// Set up the Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, sepolia],
  projectId,
  ssr: true,
})

// Set up React Query client
export const queryClient = new QueryClient()

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, sepolia],
  projectId,
  metadata: {
    name: 'Wrytes',
    description: 'Swiss precision in software development, Bitcoin/Blockchain technology, and AI solutions',
    url: process.env.NEXT_PUBLIC_LANDINGPAGE_URL || 'https://wrytes.io',
    icons: ['/favicon.ico'],
  },
  features: {
    analytics: true,
    email: false,
    socials: [],
  },
})

export { wagmiAdapter }
export const config = wagmiAdapter.wagmiConfig