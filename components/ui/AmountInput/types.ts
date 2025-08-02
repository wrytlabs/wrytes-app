export interface AmountInputProps {
  // Core input props
  amount: string;
  onAmountChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;

  // Display props
  title: string;
  symbol: string;
  decimals: number;

  // Balance and max functionality
  availableBalance: bigint;
  availableLabel?: string;
  onMaxClick: () => void;
  showMaxButton?: boolean;

  // Styling
  className?: string;
}