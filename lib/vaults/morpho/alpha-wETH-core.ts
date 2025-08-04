import { readContract } from "wagmi/actions";
import { WAGMI_CONFIG } from "@/lib/web3/config";
import { mainnet } from "@reown/appkit/networks";
import { formatUnits } from "viem";
import { Vault } from "../types";
import { apolloClient } from "../../graphql/client";
import { GET_VAULT_METRICS } from "../../graphql/queries/morpho";

export const alphaWethCoreVault: Vault = {
  kind: 'morpho',
  address: '0x47fe8Ab9eE47DD65c24df52324181790b9F47EfC',
  name: 'Alpha WETH Core',
  symbol: 'aWETH',
  decimals: 18,
  asset: {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18, 
  },
  description: 'Earn yield on WETH deposits from native Morpho Vault',
  apy: async () => {
    try {
      // Try to get Morpho data first
      const result = await apolloClient.query({
        query: GET_VAULT_METRICS,
        variables: { 
          address: '0x47fe8Ab9eE47DD65c24df52324181790b9F47EfC',
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
          address: '0x47fe8Ab9eE47DD65c24df52324181790b9F47EfC',
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
        address: '0x47fe8Ab9eE47DD65c24df52324181790b9F47EfC',
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
  strategy: 'WETH staking + yield farming + reward incentives',
  link: `https://app.morpho.org/ethereum/vault/0x47fe8Ab9eE47DD65c24df52324181790b9F47EfC`,
  notes: 'This vault is curated by AlphaPing',
  icon: 'vault',
  color: 'orange'
}; 