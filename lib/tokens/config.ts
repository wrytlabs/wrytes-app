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

export const getTokenBySymbol = (symbol: string): TokenConfig | undefined => {
  return TOKENS[symbol];
};