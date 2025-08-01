export const handleTransactionError = (error: any): string => {
  if (!error) return 'An unknown error occurred';

  // Handle user rejection
  if (error.code === 4001) {
    return 'Transaction rejected by user';
  }

  // Handle insufficient funds
  if (error.message?.includes('insufficient funds') || error.message?.includes('Insufficient funds')) {
    return 'Insufficient balance for transaction';
  }

  // Handle gas issues
  if (error.message?.includes('gas') || error.message?.includes('Gas')) {
    return 'Transaction failed - try increasing gas limit';
  }

  // Handle slippage issues
  if (error.message?.includes('slippage') || error.message?.includes('Slippage')) {
    return 'Transaction failed due to slippage - try adjusting amount';
  }

  // Handle allowance issues
  if (error.message?.includes('allowance') || error.message?.includes('Allowance')) {
    return 'Insufficient allowance - please approve tokens first';
  }

  // Handle network issues
  if (error.message?.includes('network') || error.message?.includes('Network')) {
    return 'Network error - please check your connection';
  }

  // Handle contract errors
  if (error.message?.includes('execution reverted')) {
    return 'Transaction reverted - check contract conditions';
  }

  // Handle timeout errors
  if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
    return 'Transaction timed out - please try again';
  }

  // Handle generic contract errors
  if (error.message?.includes('revert') || error.message?.includes('Revert')) {
    return 'Transaction failed - contract conditions not met';
  }

  // Return the original error message if it's user-friendly
  if (error.message && error.message.length < 100) {
    return error.message;
  }

  // Default error message
  return 'Transaction failed - please try again';
};

export const isUserRejection = (error: any): boolean => {
  return error?.code === 4001;
};

export const isNetworkError = (error: any): boolean => {
  return error?.message?.includes('network') || 
         error?.message?.includes('Network') ||
         error?.message?.includes('connection');
};

export const isGasError = (error: any): boolean => {
  return error?.message?.includes('gas') || 
         error?.message?.includes('Gas') ||
         error?.message?.includes('out of gas');
};

export const isAllowanceError = (error: any): boolean => {
  return error?.message?.includes('allowance') || 
         error?.message?.includes('Allowance') ||
         error?.message?.includes('approve');
}; 