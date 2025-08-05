import { readContract } from "wagmi/actions";
import { WAGMI_CONFIG } from "@/lib/web3/config";
import { mainnet } from "@reown/appkit/networks";
import { formatUnits } from "viem";
import { Vault } from "../types";
import { apolloClient } from "../../graphql/client";
import { GET_VAULT_METRICS } from "../../graphql/queries/morpho";

export const gauntletEurcCoreVault: Vault = { 
  kind: 'morpho',
  address: '0x2ed10624315b74a78f11FAbedAa1A228c198aEfB',
  name: 'Gauntlet EURC Core',
  symbol: 'gteurcc',
  decimals: 18,
  asset: {
    address: '0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c',
    name: 'Euro Coin',
    symbol: 'EURC',
    decimals: 18, 
  },
  description: 'Earn yield on EURC deposits from native Morpho Vault',
  apy: async () => {
    try {
      // Try to get Morpho data first
      const result = await apolloClient.query({
        query: GET_VAULT_METRICS,
        variables: { 
          address: '0x2ed10624315b74a78f11FAbedAa1A228c198aEfB',
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
          address: '0x2ed10624315b74a78f11FAbedAa1A228c198aEfB',
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
        address: '0x2ed10624315b74a78f11FAbedAa1A228c198aEfB',
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
  strategy: 'EURC staking + yield farming + reward incentives',
  link: `https://app.morpho.org/ethereum/vault/0x2ed10624315b74a78f11FAbedAa1A228c198aEfB`,
  managedBy: 'Gauntlet Core',
  icon: 'vault',
  color: 'orange'
}; 