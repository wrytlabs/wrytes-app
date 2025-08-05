export interface Vault {
  kind: 'erc4626' | 'curve' | 'savings' | 'morpho';
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  asset: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
  description: string;
  apy: () => Promise<number>;
  tvl: () => Promise<number>;
  riskLevel: 'low' | 'medium' | 'high';
  chainId: number;
  strategy: string;
  managedBy?: string;
  notes?: string;
  icon?: string;
  link?: string;
  color?: string;
  untilUnlocked?: number | (() => Promise<number>);
} 