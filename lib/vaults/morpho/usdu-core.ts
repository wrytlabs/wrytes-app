import { readContract } from "viem/actions";
import { viemClient } from "../../web3/config";
import { mainnet } from "viem/chains";
import { formatUnits } from "viem";
import { Vault } from "../types";
import { apolloClient } from "../../graphql/client";
import { GET_VAULT_METRICS } from "../../graphql/queries/morpho";

export const usduCoreVault: Vault = {
  address: '0xce22b5fb17ccbc0c5d87dc2e0df47dd71e3adc0a',
  name: 'USDU Core',
  symbol: 'sUSDU',
  decimals: 18,
  description: 'Earn yield on USDU deposits from native Morpho Vault',
  apy: async () => {
    try {
      // Try to get Morpho data first
      const result = await apolloClient.query({
        query: GET_VAULT_METRICS,
        variables: { 
          address: '0xce22b5fb17ccbc0c5d87dc2e0df47dd71e3adc0a',
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
          address: '0xce22b5fb17ccbc0c5d87dc2e0df47dd71e3adc0a',
          chainId: 1
        },
        fetchPolicy: 'network-only',
      });

      if (result.data?.vaultByAddress?.state?.totalAssetsUsd) {
        return Number(result.data.vaultByAddress.state.totalAssetsUsd);
      }

      // Fallback to contract call
      const totalAssets = await readContract(viemClient[mainnet.id], {
        address: '0xce22b5fb17ccbc0c5d87dc2e0df47dd71e3adc0a',
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

      return Number(formatUnits(totalAssets, 18));
    } catch (error) {
      console.error('Error reading Morpho vault TVL:', error);
      return 0;
    }
  },
  riskLevel: 'low',
  chainId: 1,
  strategy: 'USDU staking + yield farming + reward incentives',
  notes: 'This vault is curated by USDU Core Aragon DAO',
  icon: 'vault',
  color: 'orange'
}; 