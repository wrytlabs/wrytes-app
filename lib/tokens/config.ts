// Common ERC20 token addresses on different chains
export interface TokenConfig {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
}

export const TOKENS: Record<string, TokenConfig> = {
  // Ethereum Mainnet tokens
  USDC: {
    address: '0xA0b86a33E6Ff8d95927C3aaFbd9Cf56512E3aAe0', // Circle USDC
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    chainId: 1,
  },
  USDT: {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7', // Tether USD
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    chainId: 1,
  },
  DAI: {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f', // MakerDAO DAI
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    chainId: 1,
  },
  ZCHF: {
    address: '0xB58E61C3098d85632Df34EecfB899A1Ba80246cc', // Frankencoin ZCHF
    symbol: 'ZCHF',
    name: 'Frankencoin',
    decimals: 18,
    chainId: 1,
  },
  USDU: {
    address: '0x5801D0e1C7D977D78E4890880B8E579eb4943276', // USDU token
    symbol: 'USDU',
    name: 'USDU',
    decimals: 18,
    chainId: 1,
  }
};

// Mapping of vault addresses to their underlying asset tokens
export const VAULT_ASSET_MAPPING: Record<string, string> = {
  // Morpho vaults
  '0xb0f05E4De970A1aaf77f8C2F823953a367504BA9': 'USDC', // Alpha USDC Core
  '0xce22b5fb17ccbc0c5d87dc2e0df47dd71e3adc0a': 'USDU', // USDU Core
  '0xFa7ED49Eb24A6117D8a3168EEE69D26b45C40C63': 'ZCHF', // ZCHF Vault
  
  // Savings vaults
  '0x637F00cAb9665cB07d91bfB9c6f3fa8faBFEF8BC': 'ZCHF', // ZCHF Savings
  
  // Curve pools (multi-asset, but we'll use primary token)
  '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7': 'USDC', // DAI-USDC-USDT (using USDC as primary)
  '0x771c91e699B4B23420de3F81dE2aA38C4041632b': 'USDU', // USDU-USDC (using USDU as primary)
};

export const getAssetTokenForVault = (vaultAddress: string): TokenConfig | undefined => {
  const tokenSymbol = VAULT_ASSET_MAPPING[vaultAddress];
  return tokenSymbol ? TOKENS[tokenSymbol] : undefined;
};

export const getTokenBySymbol = (symbol: string): TokenConfig | undefined => {
  return TOKENS[symbol];
};