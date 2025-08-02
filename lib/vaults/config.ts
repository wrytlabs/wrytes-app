import { Vault } from "./types";
import { alphaUsdcCoreVault } from "./alpha-usdc-core";
import { usduCoreVault } from "./usdu-core";
import { zchfSavings } from "./zchf-savings";
import { lpTokenVault } from "./lp-token-vault";
import { zchfVault } from "./zchf-vault";

export const VAULTS: Vault[] = [
  alphaUsdcCoreVault,
  usduCoreVault,
  zchfVault,
  zchfSavings,
  lpTokenVault,
];

export const getVaultByAddress = (address: string): Vault | undefined => {
  return VAULTS.find(vault => vault.address.toLowerCase() === address.toLowerCase());
};

export const getVaultsByChain = (chainId: number): Vault[] => {
  return VAULTS.filter(vault => vault.chainId === chainId);
};

export const getRiskColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'low': return 'text-green-400 bg-green-400/20';
    case 'medium': return 'text-yellow-400 bg-yellow-400/20';
    case 'high': return 'text-red-400 bg-red-400/20';
    default: return 'text-gray-400 bg-gray-400/20';
  }
}; 