import { readContract } from "viem/actions";
import { Vault } from "../types";
import { viemClient } from "@/lib/web3/config";
import { mainnet } from "viem/chains";

export const usduUsdc: Vault = {
  address: '0x771c91e699B4B23420de3F81dE2aA38C4041632b',
  name: 'USDU-USDC',
  symbol: 'USDU-USDC',
  decimals: 18,
  asset: {
    address: '0x5801D0e1C7D977D78E4890880B8E579eb4943276', // USDU as primary asset
    name: 'USDU',
    symbol: 'USDU',
    decimals: 18,
  },
  description: 'Yield farming with liquidity provision tokens from Curve',
  apy: async () => {
    try {
      // TODO: Implement a different way to fetch APY data from Curve API, not reliable.
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
        (pool: { address: string }) => pool.address.toLowerCase() === '0x771c91e699B4B23420de3F81dE2aA38C4041632b'.toLowerCase()
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
      const totalSupply = await readContract(viemClient[mainnet.id], {
        address: '0x771c91e699B4B23420de3F81dE2aA38C4041632b',
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
      const virtualPrice = await readContract(viemClient[mainnet.id], {
        address: '0x771c91e699B4B23420de3F81dE2aA38C4041632b',
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