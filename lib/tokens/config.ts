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
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Circle USDC
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    chainId: 1,
  },
  USDT: {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Tether USD
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    chainId: 1,
  },
  DAI: {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // MakerDAO DAI
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    chainId: 1,
  },
  ZCHF: {
    address: '0xB58E61C3098d85632Df34EecfB899A1Ed80921cB', // Frankencoin ZCHF
    symbol: 'ZCHF',
    name: 'Frankencoin',
    decimals: 18,
    chainId: 1,
  },
  USDU: {
    address: '0xdde3eC717f220Fc6A29D6a4Be73F91DA5b718e55', // USDU token
    symbol: 'USDU',
    name: 'USDU',
    decimals: 18,
    chainId: 1,
  },
};

export const getTokenBySymbol = (symbol: string): TokenConfig | undefined => {
  return TOKENS[symbol];
};
