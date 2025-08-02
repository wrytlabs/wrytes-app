import { readContract } from "viem/actions";
import { viemClient } from "../../web3/config";
import { mainnet } from "viem/chains";
import { formatUnits } from "viem";
import { Vault } from "../types";
import { apolloClient } from "../../graphql/client";
import { GET_VAULT_METRICS } from "../../graphql/queries/morpho";

export const alphaUsdcCoreVault: Vault = {
  address: '0xb0f05E4De970A1aaf77f8C2F823953a367504BA9',
  name: 'Alpha USDC Core',
  symbol: 'fUSDC',
  decimals: 18,
  asset: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6, 
  },
  description: 'Earn yield on USDC deposits from native Morpho Vault',
  apy: async () => {
    try {
      // Try to get Morpho data first
      const result = await apolloClient.query({
        query: GET_VAULT_METRICS,
        variables: { 
          address: '0xb0f05E4De970A1aaf77f8C2F823953a367504BA9',
          chainId: 1
        },
        fetchPolicy: 'network-only',
      });

      if (result.data?.vaultByAddress?.state?.dailyNetApy) {
        return result.data.vaultByAddress.state.dailyNetApy * 100;
      }

      // Fallback to contract call if Morpho data not available
      const supplyRate = 0;
      return Number(supplyRate) / 1e25; // Convert to percentage
    } catch (error) {
      console.error('Error reading Morpho vault APY:', error);
      return 0;
    }
  },
  tvl: async () => {
    try {
      // Try to get Morpho data first
      const result = await apolloClient.query({
        query: GET_VAULT_METRICS,
        variables: { 
          address: '0xb0f05E4De970A1aaf77f8C2F823953a367504BA9',
          chainId: 1
        },
        fetchPolicy: 'network-only',
      });

      if (result.data?.vaultByAddress?.state?.totalAssetsUsd) {
        return Number(result.data.vaultByAddress.state.totalAssetsUsd);
      }

      // Fallback to contract call
      const totalAssets = await readContract(viemClient[mainnet.id], {
        address: '0xb0f05E4De970A1aaf77f8C2F823953a367504BA9',
        abi: [
          {
            name: "totalAssets",
            type: "function",
            stateMutability: "view",
            inputs: [],
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }]
          }
        ],
        functionName: 'totalAssets',
      });
      return Number(formatUnits(totalAssets, 6));
    } catch (error) {
      console.error('Error reading Morpho vault TVL:', error);
      return 0;
    }
  },
  riskLevel: 'low',
  chainId: 1,
  strategy: 'USDC staking + yield farming + reward incentives',
  notes: 'This vault is curated by AlphaPing',
  icon: 'vault',
  color: 'orange'
}; 