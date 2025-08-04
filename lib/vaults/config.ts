import { Vault } from "./types";
import { alphaUsdcCoreVault } from "./morpho/alpha-usdc-core";
import { usduCoreVault } from "./morpho/usdu-core";
import { zchfSavings } from "./savings/zchf-savings";
import { usduUsdc } from "./curve/usdu-usdc";
import { zchfVault } from "./morpho/alpha-zchf-vault";
import { daiUsdcUsdt } from "./curve/dai-usdc-usdt";
import { gauntletEurcCoreVault } from "./morpho/gaunlet-eurc-core";
import { alphaWethCoreVault } from "./morpho/alpha-wETH-core";

export const VAULTS: Vault[] = [
  // Morpho
  alphaUsdcCoreVault,
  alphaWethCoreVault,
  zchfVault,
  gauntletEurcCoreVault,
  usduCoreVault,

  // Savings
  zchfSavings,

  // Curve
  // usduUsdc,
  // daiUsdcUsdt,
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