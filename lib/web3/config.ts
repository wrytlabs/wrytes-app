import { QueryClient } from '@tanstack/react-query'
import { http, createConfig } from 'wagmi'
import { mainnet, base } from 'wagmi/chains'
import { walletConnect, injected, coinbaseWallet, safe } from 'wagmi/connectors'
import { createStorage, cookieStorage } from 'wagmi'
import { createPublicClient } from 'viem'

// Configuration from environment variables
const CONFIG = {
  wagmiId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
  rpc: process.env.NEXT_PUBLIC_RPC_URL,
}

if (!CONFIG.wagmiId) {
  throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not set')
}

if (!CONFIG.rpc) {
  throw new Error('NEXT_PUBLIC_RPC_URL is not set')
}

// Chain configuration
export const WAGMI_CHAIN = mainnet
export const WAGMI_CHAINS = [mainnet, base] as const

// Helper functions for chain operations
export const getChainById = (chainId: number) => {
  return WAGMI_CHAINS.find(chain => chain.id === chainId) || mainnet;
};

export const getBlockExplorerUrl = (path: string, chainId?: number) => {
  const chain = chainId ? getChainById(chainId) : mainnet;
  const baseUrl = chain.blockExplorers?.default?.url;
  
  if (!baseUrl) {
    // Fallback to etherscan if no block explorer is configured
    return `https://etherscan.io/${path}`;
  }
  
  // Ensure the path doesn't start with a slash if baseUrl ends with one
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
};

// Metadata for wallets
const WAGMI_METADATA = {
  name: 'Wrytes',
  description: 'Swiss precision in software development, Bitcoin/Blockchain technology, and AI solutions',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://wrytes.io',
  icons: ['/favicon.ico'],
}

// Set up React Query client
export const queryClient = new QueryClient()

// Create Wagmi config
export const config = createConfig({
  chains: WAGMI_CHAINS,
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${CONFIG.rpc}`),
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${CONFIG.rpc}`),
  },
  batch: {
    multicall: {
      wait: 200,
    },
  },
  connectors: [
    safe({
      allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/, /dhedge.org$/],
    }),
    walletConnect({ 
      projectId: CONFIG.wagmiId, 
      metadata: WAGMI_METADATA, 
      showQrModal: true 
    }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: WAGMI_METADATA.name,
      appLogoUrl: WAGMI_METADATA.icons[0],
    }),
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
})

// Create Viem clients for contract reading
export const viemClient = {
  [mainnet.id]: createPublicClient({
    chain: mainnet,
    transport: http(`https://eth-mainnet.g.alchemy.com/v2/${CONFIG.rpc}`),
  }),
  [base.id]: createPublicClient({
    chain: base,
    transport: http(`https://base-mainnet.g.alchemy.com/v2/${CONFIG.rpc}`),
  }),
}