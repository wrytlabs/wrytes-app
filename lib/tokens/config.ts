// Common ERC20 token addresses on different chains
export interface TokenConfig {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
}

export const TOKENS: Record<string, TokenConfig> = {
  // Ethereum Mainnet tokens, Stablecoins
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

  // Crypto
  WETH: {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH token
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    chainId: 1,
  },
  WBTC: {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC token
    symbol: 'WBTC',
    name: 'Wrapped BTC',
    decimals: 8,
    chainId: 1,
  },
  cbBTC: {
    address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf', // cbBTC token
    symbol: 'cbBTC',
    name: 'Coinbase Wrapped BTC',
    decimals: 8,
    chainId: 1,
  },
  FPS: {
    address: '0x1bA26788dfDe592fec8bcB0Eaff472a42BE341B2', // FPS token
    symbol: 'FPS',
    name: 'Frankencoin Pool Share',
    decimals: 18,
    chainId: 1,
  },
};

export const getTokenBySymbol = (symbol: string): TokenConfig | undefined => {
  return TOKENS[symbol];
};
