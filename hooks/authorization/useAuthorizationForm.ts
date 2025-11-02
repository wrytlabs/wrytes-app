import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { isAddress } from 'viem';
import { Authorization, AuthorizationState, OperationKind } from './types';
import { generateNonce, generateRandomNonce, isValidNonce } from '@/lib/utils/nonce';

/**
 * Hook for managing authorization form state and validation
 */
export const useAuthorizationForm = () => {
  const { address: connectedAddress } = useAccount();

  // Helper function to get current timestamp
  const getCurrentTimestamp = () => Math.floor(Date.now() / 1000).toString();
  
  // Helper function to get timestamp 3 days from now
  const getThreeDaysFromNow = () => Math.floor((Date.now() + 3 * 24 * 60 * 60 * 1000) / 1000).toString();

  const [state, setState] = useState<AuthorizationState>({
    authorization: {
      kind: OperationKind.TRANSFER,
      from: connectedAddress || '',
      to: '',
      token: '',
      amount: '',
      nonce: generateRandomNonce(), // Auto-generate nonce
      validAfter: getCurrentTimestamp(), // Set to now
      validBefore: getThreeDaysFromNow(), // Set to 3 days from now
    },
    verifyingContract: '0x3874161854D0D5f13B4De2cB5061d9cff547466E',
    selectedTokenDecimals: 18,
    errors: {},
  });

  // Update field values
  const updateField = useCallback((field: keyof Authorization, value: string | OperationKind) => {
    setState(prev => ({
      ...prev,
      authorization: {
        ...prev.authorization,
        [field]: value,
      },
      errors: {
        ...prev.errors,
        [field]: undefined, // Clear error when field is updated
      },
    }));
  }, []);

  // Update verifying contract
  const updateVerifyingContract = useCallback((contract: string) => {
    setState(prev => ({
      ...prev,
      verifyingContract: contract,
      errors: {
        ...prev.errors,
        verifyingContract: undefined,
      },
    }));
  }, []);

  // Update token decimals when token is selected
  const updateTokenDecimals = useCallback((decimals: number) => {
    setState(prev => ({
      ...prev,
      selectedTokenDecimals: decimals,
    }));
  }, []);

  // Generate nonce based on form data
  const generateFormNonce = useCallback(() => {
    const { authorization } = state;

    // Generate based on form data if we have enough information
    if (authorization.from && authorization.to && authorization.token) {
      const nonce = generateNonce({
        from: authorization.from,
        to: authorization.to,
        token: authorization.token,
        amount: authorization.amount || '0',
        validAfter: authorization.validAfter || '0',
        validBefore: authorization.validBefore || '0',
        operation: authorization.kind,
      });
      updateField('nonce', nonce);
    } else {
      // Generate random nonce if form data is incomplete
      const nonce = generateRandomNonce();
      updateField('nonce', nonce);
    }
  }, [state.authorization, updateField]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const { authorization, verifyingContract } = state;
    const newErrors: Partial<Record<keyof Authorization | 'verifyingContract', string>> = {};

    // Validate addresses
    if (!authorization.from) {
      newErrors.from = 'From address is required';
    } else if (!isAddress(authorization.from)) {
      newErrors.from = 'Invalid from address';
    }

    if (!authorization.to) {
      newErrors.to = 'To address is required';
    } else if (!isAddress(authorization.to)) {
      newErrors.to = 'Invalid to address';
    }

    if (!authorization.token) {
      newErrors.token = 'Token address is required';
    } else if (!isAddress(authorization.token)) {
      newErrors.token = 'Invalid token address';
    }

    if (!verifyingContract) {
      newErrors.verifyingContract = 'Verifying contract is required';
    } else if (!isAddress(verifyingContract)) {
      newErrors.verifyingContract = 'Invalid verifying contract address';
    }

    // Validate amount
    if (!authorization.amount || authorization.amount === '0') {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(authorization.amount)) || Number(authorization.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    // Validate nonce
    if (!authorization.nonce) {
      newErrors.nonce = 'Nonce is required';
    } else if (!isValidNonce(authorization.nonce)) {
      newErrors.nonce = 'Invalid nonce format (must be 32-byte hex string)';
    }

    // Validate timestamps
    if (!authorization.validAfter || authorization.validAfter === '0') {
      newErrors.validAfter = 'Valid after timestamp is required';
    }

    if (!authorization.validBefore || authorization.validBefore === '0') {
      newErrors.validBefore = 'Valid before timestamp is required';
    }

    if (
      authorization.validAfter &&
      authorization.validBefore &&
      Number(authorization.validAfter) >= Number(authorization.validBefore)
    ) {
      newErrors.validBefore = 'Valid before must be after valid after';
    }

    setState(prev => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [state]);

  // Reset form
  const resetForm = useCallback(() => {
    setState({
      authorization: {
        kind: OperationKind.TRANSFER,
        from: connectedAddress || '',
        to: '',
        token: '',
        amount: '',
        nonce: '',
        validAfter: '',
        validBefore: '',
      },
      verifyingContract: '0x3874161854D0D5f13B4De2cB5061d9cff547466E',
      selectedTokenDecimals: 18,
      errors: {},
    });
  }, [connectedAddress]);

  return {
    authorization: state.authorization,
    verifyingContract: state.verifyingContract,
    selectedTokenDecimals: state.selectedTokenDecimals,
    errors: state.errors,
    updateField,
    updateVerifyingContract,
    updateTokenDecimals,
    generateFormNonce,
    validateForm,
    resetForm,
    isValid: Object.keys(state.errors).length === 0,
  };
};
