import { type Address } from 'viem'

// Supported networks
export const SUPPORTED_NETWORKS = {
  MAINNET: 1,
  SEPOLIA: 11155111,
} as const

// Network configurations
export const NETWORK_CONFIG = {
  [SUPPORTED_NETWORKS.MAINNET]: {
    name: 'Ethereum Mainnet',
    chainId: SUPPORTED_NETWORKS.MAINNET,
    rpcUrl: 'https://eth.llamarpc.com',
    blockExplorer: 'https://etherscan.io',
  },
  [SUPPORTED_NETWORKS.SEPOLIA]: {
    name: 'Sepolia Testnet',
    chainId: SUPPORTED_NETWORKS.SEPOLIA,
    rpcUrl: 'https://sepolia.infura.io/v3/',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
} as const

// Wallet connection timeouts
export const CONNECTION_TIMEOUT = 30000 // 30 seconds
export const SIGNATURE_TIMEOUT = 60000 // 60 seconds

// Message validation patterns
export const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
export const SIGNATURE_REGEX = /^0x[a-fA-F0-9]{130}$/

// Authentication message constants
export const AUTH_MESSAGE_PREFIX = 'Signing this message confirms your control over the wallet address:'
export const DEFAULT_MESSAGE_VALIDITY = 300000 // 5 minutes in milliseconds
export const DEFAULT_MESSAGE_EXPIRY = 600000 // 10 minutes in milliseconds