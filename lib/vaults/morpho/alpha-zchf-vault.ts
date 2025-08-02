import { readContract } from "wagmi/actions";
import { WAGMI_CONFIG } from "@/lib/web3/config";
import { mainnet } from "@reown/appkit/networks";
import { formatUnits } from "viem";
import { Vault } from "../types";
import { apolloClient } from "../../graphql/client";
import { GET_VAULT_METRICS } from "../../graphql/queries/morpho";

export const zchfVault: Vault = {
  kind: 'morpho',
  address: '0xFa7ED49Eb24A6117D8a3168EEE69D26b45C40C63',
  name: 'ZCHF Vault',
  symbol: 'aZCHF',
  decimals: 18,
  asset: {
    address: '0xb58e61c3098d85632df34eecfb899a1ed80921cb',
    name: 'ZCHF',
    symbol: 'ZCHF',
    decimals: 18, 
  },
  description: 'Earn yield on ZCHF deposits from native Morpho Vault',
  apy: async () => {
    try {
      // Try to get Morpho data first
      const result = await apolloClient.query({
        query: GET_VAULT_METRICS,
        variables: { 
          address: '0xFa7ED49Eb24A6117D8a3168EEE69D26b45C40C63',
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
          address: '0xFa7ED49Eb24A6117D8a3168EEE69D26b45C40C63',
          chainId: 1
        },
        fetchPolicy: 'network-only',
      });

      if (result.data?.vaultByAddress?.state?.totalAssetsUsd) {
        return Number(result.data.vaultByAddress.state.totalAssetsUsd);
      } 

      // Fallback to contract call
      const totalAssets = await readContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: '0xFa7ED49Eb24A6117D8a3168EEE69D26b45C40C63',
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
  strategy: 'ZCHF staking + yield farming + reward incentives',
  notes: 'This vault is curated by AlphaPing',
  icon: 'vault',
  color: 'orange'
}; 