import { readContract } from "wagmi/actions";
import { WAGMI_CONFIG } from "@/lib/web3/config";
import { mainnet } from "@reown/appkit/networks";
import { formatUnits } from "viem";
import { Vault } from "../types";
import { FALCON_API_URL } from "@/hooks/adapter/useFalconData";

export const stakedFalconUsd: Vault = {
  kind: 'savings',
  address: '0xc8CF6D7991f15525488b2A83Df53468D682Ba4B0',
  name: 'Staked Falcon USD',
  symbol: 'sUSDf',
  decimals: 18,
  asset: {
    address: '0xFa2B947eEc368f42195f24F36d2aF29f7c24CeC2',
    name: 'Falcon USD',
    symbol: 'USDf',
    decimals: 18,
  },
  description: 'Earn yield on USDf deposits from native staking module.',
  apy: async () => {
    try {
      // Fetch APY from Falcon Finance API
      const response = await fetch(FALCON_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Return the 7-day APY converted to percentage
      const apy = Number(data['7d_apy']) * 100;
      return apy;
    } catch (error) {
      console.error('Error reading vault APY:', error);
      return 0;
    }
  },
  tvl: async () => {
    try {
      // Try to get TVL from Falcon API first
      try {
        const response = await fetch(FALCON_API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          return Number(data.usdf_staked);
        }
      } catch (apiError) {
        console.warn('Falcon API TVL fetch failed, falling back to contract:', apiError);
      }

      // Fallback to contract call
      const balance = await readContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: '0xc8CF6D7991f15525488b2A83Df53468D682Ba4B0',
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

      return Number(formatUnits(balance, 18));
    } catch (error) {
      console.error('Error reading vault TVL:', error);
      return 0;
    }
  },
  riskLevel: 'low',
  chainId: 1,
  strategy: 'Native yield from the staking module',
  managedBy: 'Falcon Finance',
  link: `https://app.falcon.finance/earn/classic`,
  icon: 'piggy-bank',
  color: 'green'
}; 