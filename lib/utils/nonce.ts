import { keccak256, encodePacked } from 'viem';

export interface NonceInputData {
  from: string;
  to: string;
  token: string;
  amount: string;
  validAfter: string;
  validBefore: string;
  operation: number;
}

/**
 * Generates a secure nonce for authorization based on input data and timestamp
 * Uses keccak256 hash of the input parameters and current timestamp
 */
export const generateNonce = (inputData: NonceInputData): string => {
  const timestamp = Math.floor(Date.now() / 1000);
  
  // Create a hash of all input parameters plus timestamp for uniqueness
  const packedData = encodePacked(
    ['address', 'address', 'address', 'uint256', 'uint256', 'uint256', 'uint8', 'uint256'],
    [
      inputData.from as `0x${string}`,
      inputData.to as `0x${string}`,
      inputData.token as `0x${string}`,
      BigInt(inputData.amount || '0'),
      BigInt(inputData.validAfter || '0'),
      BigInt(inputData.validBefore || '0'),
      inputData.operation,
      BigInt(timestamp)
    ]
  );
  
  return keccak256(packedData);
};

/**
 * Generates a simple random nonce using crypto.getRandomValues
 * Falls back to Math.random if crypto is not available
 */
export const generateRandomNonce = (): string => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return '0x' + Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } else {
    // Fallback for environments without crypto API
    const randomHex = Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    return '0x' + randomHex;
  }
};

/**
 * Validates that a nonce is a valid bytes32 hex string
 */
export const isValidNonce = (nonce: string): boolean => {
  if (!nonce.startsWith('0x')) return false;
  if (nonce.length !== 66) return false; // 0x + 64 hex chars = 66 total
  return /^0x[0-9a-fA-F]{64}$/.test(nonce);
};