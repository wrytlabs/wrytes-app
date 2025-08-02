import { readContract } from "wagmi/actions";
import { WAGMI_CONFIG } from "@/lib/web3/config";
import { mainnet } from "@reown/appkit/networks";
import { formatUnits } from "viem";
import { Vault } from "../types";

export const zchfSavings: Vault = {
  address: '0x637F00cAb9665cB07d91bfB9c6f3fa8faBFEF8BC',
  name: 'ZCHF Savings',
  symbol: 'svZCHF',
  decimals: 18,
  asset: {
    address: '0xB58E61C3098d85632Df34EecfB899A1Ba80246cc', // ZCHF asset
    name: 'Frankencoin',
    symbol: 'ZCHF',
    decimals: 18,
  },
  description: 'Earn yield on ZCHF deposits from native savings module.',
  apy: async () => {
    try {
      const savingsModule = "0x27d9AD987BdE08a0d083ef7e0e4043C857A17B38";

      // Get current rate PPM
      const currentRatePPM = await readContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: savingsModule,
        abi: [
          {
            name: "currentRatePPM",
            type: "function",
            stateMutability: "view",
            inputs: [],
            outputs: [{ internalType: "uint24", name: "", type: "uint24" }]
          }
        ],
        functionName: 'currentRatePPM',
      });

      // Get savings data for the vault address to calculate referral fee
      const savingsData = await readContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: savingsModule,
        abi: [
          {
            name: "savings",
            type: "function",
            stateMutability: "view",
            inputs: [{ internalType: "address", name: "", type: "address" }],
            outputs: [
              { internalType: "uint192", name: "saved", type: "uint192" },
              { internalType: "uint64", name: "ticks", type: "uint64" },
              { internalType: "address", name: "referrer", type: "address" },
              { internalType: "uint32", name: "referralFeePPM", type: "uint32" }
            ]
          }
        ],
        functionName: 'savings',
        args: ['0x637F00cAb9665cB07d91bfB9c6f3fa8faBFEF8BC'], // vault address
      });

      // Calculate APY: currentRatePPM - referralFeePPM
      const netPPM = Number(currentRatePPM) * (1 - Number(savingsData[3]) / 1000000); // referralFeePPM is at index 3
      
      // Convert PPM (parts per million) to percent
      return netPPM / 10000;
    } catch (error) {
      console.error('Error reading vault APY:', error);
      return 0;
    }
  },
  tvl: async () => {
    try {
      const balance = await readContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: '0x637F00cAb9665cB07d91bfB9c6f3fa8faBFEF8BC',
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
  untilUnlocked: async () => {
    try {
      const untilUnlocked = await readContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: '0x637F00cAb9665cB07d91bfB9c6f3fa8faBFEF8BC',
        abi: [
          { 
            name: "untilUnlocked",
            type: "function",
            stateMutability: "view",
            inputs: [],
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }]
          }
        ],
        functionName: 'untilUnlocked',
      });
      return Number(untilUnlocked);
    } catch (error) {
      console.error('Error reading vault untilUnlocked:', error);
      return 0;
    }
  },
  riskLevel: 'low',
  chainId: 1,
  strategy: 'Native yield from the savings module.',
  notes: 'The average weighted interest introduces a locking period up to 3 days.',
  icon: 'piggy-bank',
  color: 'green'
}; 