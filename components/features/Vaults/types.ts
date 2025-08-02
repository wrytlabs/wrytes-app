import { SavingsVault } from '@/lib/vaults/config';

export interface SavingsOverviewProps {
  /** Custom stats data override */
  stats?: OverviewStat[];
  /** Loading state for overview */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export interface OverviewStat {
  icon: any; // FontAwesome icon
  label: string;
  value: string | number;
  color?: 'orange' | 'green' | 'blue' | 'purple';
  loading?: boolean;
}

export interface VaultGridProps {
  /** Array of vault configurations */
  vaults?: SavingsVault[];
  /** Loading state for entire grid */
  loading?: boolean;
  /** Callback when deposit is requested */
  onDeposit?: (vault: SavingsVault) => void;
  /** Callback when withdraw is requested */
  onWithdraw?: (vault: SavingsVault) => void;
  /** Additional CSS classes */
  className?: string;
  /** Grid layout columns */
  columns?: {
    base?: number;
    md?: number;
    lg?: number;
  };
}

export interface VaultCardProps {
  /** Vault configuration */
  vault: SavingsVault;
  /** User's balance in this vault */
  userBalance?: bigint;
  /** APY percentage */
  apy?: number;
  /** Total Value Locked */
  tvl?: string;
  /** Loading state for vault data */
  loading?: boolean;
  /** Callback when deposit is requested */
  onDeposit?: (vault: SavingsVault) => void;
  /** Callback when withdraw is requested */
  onWithdraw?: (vault: SavingsVault) => void;
  /** Additional CSS classes */
  className?: string;
}

export interface VaultActionsProps {
  /** Selected vault for actions */
  vault: SavingsVault | null;
  /** Deposit modal state */
  showDepositModal?: boolean;
  /** Withdraw modal state */
  showWithdrawModal?: boolean;
  /** Close deposit modal */
  onCloseDeposit?: () => void;
  /** Close withdraw modal */
  onCloseWithdraw?: () => void;
  /** Success callback for deposit */
  onDepositSuccess?: (vault: SavingsVault) => void;
  /** Success callback for withdraw */
  onWithdrawSuccess?: (vault: SavingsVault) => void;
}

export interface UseVaultDataReturn {
  /** User's balance in the vault */
  balance: bigint;
  /** Current APY percentage */
  apy: number;
  /** Total Value Locked */
  tvl: string;
  /** Until unlocked in seconds (0 if not locked) */
  untilUnlocked: number;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Refresh data */
  refresh: () => void;
}