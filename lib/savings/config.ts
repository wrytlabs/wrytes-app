import { readContract } from "viem/actions";
import { viemClient } from "../web3/config";
import { mainnet } from "viem/chains";
import { formatUnits } from "viem";
import { formatCompactNumber } from "../utils/format-handling";

export interface SavingsVault {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  description: string;
  apy: () => Promise<number>;
  tvl: () => Promise<string>;
  riskLevel: 'low' | 'medium' | 'high';
  chainId: number;
  strategy: string;
  icon?: string;
  color?: string;
  untilUnlock?: number | (() => Promise<number>);
}

export const SAVINGS_VAULTS: SavingsVault[] = [
  {
    address: '0xce22b5fb17ccbc0c5d87dc2e0df47dd71e3adc0a',
    name: 'USDU Core Vault',
    symbol: 'sUSDU',
    decimals: 18,
    description: 'Earn yield on USDU deposits from native Morpho Vault',
    apy: async () => {
      try {
        const supplyRate = await readContract(viemClient[mainnet.id], {
          address: '0xce22b5fb17ccbc0c5d87dc2e0df47dd71e3adc0a',
          abi: [
            {
              name: "supplyRate",
              type: "function",
              stateMutability: "view",
              inputs: [],
              outputs: [{ internalType: "uint256", name: "", type: "uint256" }]
            }
          ],
          functionName: 'supplyRate',
        });
        console.log(supplyRate);
        // Convert rate to APY percentage (rate is in RAY format: 1e27)
        return Number(supplyRate) / 1e25; // Convert to percentage
      } catch (error) {
        console.error('Error reading Morpho vault APY:', error);
        return 0;
      }
    },
    tvl: async () => {
      try {
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
  
        const formattedBalance = formatCompactNumber(formatUnits(totalAssets, 18));
        return `$${formattedBalance}`;
      } catch (error) {
        console.error('Error reading Morpho vault TVL:', error);
        return '$0';
      }
    },
    riskLevel: 'low',
    chainId: 1,
    strategy: 'USDU staking + yield farming combination',
    icon: 'usdu',
    color: 'green'
  },
  {
    address: '0x637F00cAb9665cB07d91bfB9c6f3fa8faBFEF8BC',
    name: 'ZCHF Savings Vault',
    symbol: 'svZCHF',
    decimals: 18,
    description: 'Earn yield on ZCHF deposits from native savings module.',
    apy: async () => {
      try {
        const ppm = await readContract(viemClient[mainnet.id], {
          address: '0x27d9AD987BdE08a0d083ef7e0e4043C857A17B38',
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
        // Convert PPM (parts per million) to percent
        return Number(ppm) / 10000;
      } catch (error) {
        console.error('Error reading vault APY:', error);
        return 0;
      }
    },
    tvl: async () => {
      try {
        const balance = await readContract(viemClient[mainnet.id], {
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

        const formattedBalance = formatCompactNumber(formatUnits(balance, 18));
        return `$${formattedBalance}`;
      } catch (error) {
        console.error('Error reading vault TVL:', error);
        return '$0';
      }
    },
    untilUnlock: async () => {
      try {
        const untilUnlock = await readContract(viemClient[mainnet.id], {
          address: '0x637F00cAb9665cB07d91bfB9c6f3fa8faBFEF8BC',
          abi: [
            { 
              name: "untilUnlock",
              type: "function",
              stateMutability: "view",
              inputs: [],
              outputs: [{ internalType: "uint256", name: "", type: "uint256" }]
            }
          ],
          functionName: 'untilUnlock',
        });
        return Number(untilUnlock);
      } catch (error) {
        console.error('Error reading vault untilUnlock:', error);
        return 0;
      }
    },
    riskLevel: 'low',
    chainId: 1,
    strategy: 'Native yield from the savings module. Note: the average weighted interest introduces a locking period up to 3 days.',
    icon: 'piggy-bank',
    color: 'green'
  },
  {
    address: '0xA0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8', // Example address
    name: 'LP Token Vault',
    symbol: 'vLP',
    decimals: 18,
    description: 'Yield farming with liquidity provision tokens',
    apy: async () => {
      // In a real implementation, this would call the vault's currentRate function
      // For now, returning a mock value
      return 12.5;
    },
    tvl: async () => {
      // In a real implementation, this would calculate total value locked
      // For now, returning a mock value with proper formatting
      return `$${formatCompactNumber(1200000)}`;
    },
    riskLevel: 'high',
    chainId: 1,
    strategy: 'Liquidity provision + yield optimization',
    icon: 'vault',
    color: 'orange'
  }
];

export const getVaultByAddress = (address: string): SavingsVault | undefined => {
  return SAVINGS_VAULTS.find(vault => vault.address.toLowerCase() === address.toLowerCase());
};

export const getVaultsByChain = (chainId: number): SavingsVault[] => {
  return SAVINGS_VAULTS.filter(vault => vault.chainId === chainId);
};

export const getRiskColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'low': return 'text-green-400 bg-green-400/20';
    case 'medium': return 'text-yellow-400 bg-yellow-400/20';
    case 'high': return 'text-red-400 bg-red-400/20';
    default: return 'text-gray-400 bg-gray-400/20';
  }
}; 