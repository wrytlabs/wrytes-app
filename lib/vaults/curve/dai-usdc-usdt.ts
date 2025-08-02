import { readContract } from "wagmi/actions";
import { Vault } from "../types";
import { WAGMI_CONFIG } from "@/lib/web3/config";
import { mainnet } from "@reown/appkit/networks";

export const daiUsdcUsdt: Vault = {
  kind: 'curve',
  address: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
  name: 'DAI-USDC-USDT',
  symbol: 'DAI-USDC-USDT',
  decimals: 18,
  asset: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC as primary asset
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
  },
  description: 'Yield farming with liquidity provision tokens from Curve',
  apy: async () => {
    try {
      // TODO: Implement a different way to fetch APY data from Curve API, not reliable.
      // Fetch APY data from Curve API
      const response = await fetch('https://api.curve.finance/v1/getBaseApys/ethereum');
      
      if (!response.ok) {
        console.error('Failed to fetch Curve APY data:', response.statusText);
        return 0;
      }
      
      const data = await response.json();
      
      if (!data.success || !data.data?.baseApys) {
        console.error('Invalid response from Curve API');
        return 0;
      }
      
      // Find the pool by address
      const poolData = data.data.baseApys.find(
        (pool: { address: string }) => pool.address.toLowerCase() === '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7'.toLowerCase()
      );
      
      if (!poolData) {
        console.error('Pool not found in Curve API response');
        return 0;
      }
      
      // Return the latest weekly APY
      return poolData.latestWeeklyApyPcent || 0;
    } catch (error) {
      console.error('Error fetching Curve APY:', error);
      return 0;
    }
  },
  tvl: async () => {
    try {
      // Get total supply of LP tokens
      const totalSupply = await readContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490', // older version for token
        abi: [
          {
            name: "totalSupply",
            type: "function",
            stateMutability: "view",
            inputs: [],
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }]
          }
        ],
        functionName: 'totalSupply',
      });

      // Get virtual price (price of 1 LP token in USD)
      const virtualPrice = await readContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
        abi: [
          {
            name: "get_virtual_price",
            type: "function",
            stateMutability: "view",
            inputs: [],
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }]
          }
        ],
        functionName: 'get_virtual_price',
      });

      // Calculate TVL: totalSupply * virtualPrice / 1e18
      const tvl = (Number(totalSupply) * Number(virtualPrice)) / 1e18 / 1e18;
      return tvl;
    } catch (error) {
      console.error('Error reading Curve pool TVL:', error);
      return 0;
    }
  },
  riskLevel: 'low',
  chainId: 1,
  strategy: 'Liquidity provision + yield optimization',
  icon: 'coins',
  color: 'blue'
}; 