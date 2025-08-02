import { Vault } from "./types";

export const lpTokenVault: Vault = {
  address: '0xA0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8', // Example address
  name: 'LP Token Vault',
  symbol: 'vLP',
  decimals: 18,
  description: 'Yield farming with liquidity provision tokens',
  apy: async () => {
    // In a real implementation, this would call the vault's currentRate function
    // For now, returning a mock value
    return 12.5;
  },
  tvl: async () => {
    // In a real implementation, this would calculate total value locked
    // For now, returning a mock value with proper formatting
    return 1200000;
  },
  riskLevel: 'high',
  chainId: 1,
  strategy: 'Liquidity provision + yield optimization',
  icon: 'coins',
  color: 'orange'
}; 