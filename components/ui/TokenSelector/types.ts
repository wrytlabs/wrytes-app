import { TokenConfig } from '@/lib/tokens/config';

export interface TokenSelectorProps {
  selectedToken: string;
  onChange: (tokenAddress: string, tokenConfig: TokenConfig) => void;
  title?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  availableTokens?: string[]; // Optional filter for specific tokens
}