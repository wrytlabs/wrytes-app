import { AddressConfig } from '@/components/ui/AddressSelector';

export enum OperationKind {
  TRANSFER = 0,
  DEPOSIT = 1,
  PROCESS = 2,
  CLAIM = 3,
}

export interface Authorization {
  kind: OperationKind;
  from: string;
  to: string;
  token: string;
  amount: string;
  nonce: string;
  validAfter: string;
  validBefore: string;
}

export interface AuthorizationState {
  authorization: Authorization;
  verifyingContract: string;
  selectedTokenDecimals: number;
  errors: Partial<Record<keyof Authorization | 'verifyingContract', string>>;
}

export interface UseAuthorizationAddressesReturn {
  addresses: AddressConfig[];
  connectedAddress: string | undefined;
  isLoading: boolean;
}