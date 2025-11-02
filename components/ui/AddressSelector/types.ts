export interface AddressConfig {
  address: string;
  label?: string;
  isConnected?: boolean;
}

export interface AddressSelectorProps {
  selectedAddress: string;
  onChange: (address: string) => void;
  addresses: AddressConfig[];
  title?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  placeholder?: string;
}