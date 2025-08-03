import { WAGMI_CONFIG } from '@/lib/web3/config';
import { writeContract, readContract, simulateContract } from 'wagmi/actions';
import { mainnet } from '@reown/appkit/networks';
import { erc4626ABI } from '@/lib/vaults/abi';
import { erc20Abi, parseUnits } from 'viem';
import { 
  QueueTransaction,
  ApprovalConfig, 
  ExecutionResult, 
  TransactionPreparation,
  ApprovalTransaction 
} from './types';

export class TransactionExecutor {
  private static instance: TransactionExecutor;

  public static getInstance(): TransactionExecutor {
    if (!TransactionExecutor.instance) {
      TransactionExecutor.instance = new TransactionExecutor();
    }
    return TransactionExecutor.instance;
  }

  /**
   * Prepare a queue transaction for execution - now fully generic
   */
  public async prepareTransaction(
    queueTx: QueueTransaction, 
    userAddress: `0x${string}`
  ): Promise<TransactionPreparation> {
    // Validate required fields for generic execution
    if (!queueTx.contractAddress) {
      throw new Error('Transaction missing contractAddress');
    }
    
    if (!queueTx.functionName) {
      throw new Error('Transaction missing functionName');
    }

    if (!queueTx.args) {
      throw new Error('Transaction missing args');
    }

    const contractAddress = queueTx.contractAddress as `0x${string}`;

    return {
      contractAddress,
      functionName: queueTx.functionName,
      args: queueTx.args,
      value: queueTx.value ? BigInt(queueTx.value) : 0n,
      gasLimit: queueTx.gasLimit ? BigInt(queueTx.gasLimit) : 200000n,
    };
  }

  /**
   * Check if transaction needs approval using the new generic ApprovalConfig
   */
  public async checkApprovalNeeded(
    queueTx: QueueTransaction,
    userAddress: `0x${string}`
  ): Promise<ApprovalTransaction | null> {
    // Use the new approvalConfig if provided
    if (queueTx.approvalConfig) {
      return this.checkGenericApproval(queueTx.approvalConfig, userAddress, queueTx.chainId);
    }

    // Legacy fallback for backward compatibility
    return this.checkLegacyApproval(queueTx, userAddress);
  }

  /**
   * Generic approval checking for any token/spender pair
   */
  private async checkGenericApproval(
    approvalConfig: ApprovalConfig,
    userAddress: `0x${string}`,
    chainId: number = mainnet.id
  ): Promise<ApprovalTransaction | null> {
    if (!approvalConfig.checkAllowance) {
      return null;
    }

    try {
      const tokenAddress = approvalConfig.tokenAddress as `0x${string}`;
      const spenderAddress = approvalConfig.spenderAddress as `0x${string}`;
      const requiredAmount = parseUnits(approvalConfig.amount, 18); // Default to 18 decimals

      // Check current allowance
      const currentAllowance = await readContract(WAGMI_CONFIG, {
        chainId,
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [userAddress, spenderAddress],
      }) as bigint;

      // If allowance is insufficient, return approval transaction data
      if (currentAllowance < requiredAmount) {
        return {
          tokenAddress,
          spenderAddress,
          amount: requiredAmount,
          currentAllowance,
          requiredAllowance: requiredAmount,
        };
      }

      return null;
    } catch (error) {
      console.warn('Could not check generic approval, assuming approval needed:', error);
      return {
        tokenAddress: approvalConfig.tokenAddress as `0x${string}`,
        spenderAddress: approvalConfig.spenderAddress as `0x${string}`,
        amount: parseUnits(approvalConfig.amount, 18),
        currentAllowance: 0n,
        requiredAllowance: parseUnits(approvalConfig.amount, 18),
      };
    }
  }

  /**
   * Legacy approval checking for backward compatibility
   */
  private async checkLegacyApproval(
    queueTx: QueueTransaction,
    userAddress: `0x${string}`
  ): Promise<ApprovalTransaction | null> {
    // Skip approval check if this is already an approval transaction
    if (queueTx.type === 'approve') {
      return null;
    }

    // Only deposit and mint operations need approval in legacy mode
    if (queueTx.type !== 'deposit' && queueTx.type !== 'mint') {
      return null;
    }

    const vaultAddress = queueTx.contractAddress as `0x${string}`;
    
    if (!queueTx.amount) {
      return null; // No amount to approve
    }

    const amount = parseUnits(queueTx.amount, queueTx.tokenDecimals || 18);

    try {
      // Get the underlying asset address from the vault
      const assetAddress = await readContract(WAGMI_CONFIG, {
        chainId: queueTx.chainId || mainnet.id,
        address: vaultAddress,
        abi: erc4626ABI,
        functionName: 'asset',
      }) as `0x${string}`;

      // Check current allowance
      const currentAllowance = await readContract(WAGMI_CONFIG, {
        chainId: queueTx.chainId || mainnet.id,
        address: assetAddress,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [userAddress, vaultAddress],
      }) as bigint;

      // If allowance is insufficient, return approval transaction
      if (currentAllowance < amount) {
        return {
          tokenAddress: assetAddress,
          spenderAddress: vaultAddress,
          amount,
          currentAllowance,
          requiredAllowance: amount,
        };
      }

      return null;
    } catch (error) {
      console.error('Error checking approval:', error);
      throw new Error('Failed to check approval requirements');
    }
  }

  /**
   * Execute approval transaction
   */
  public async executeApproval(
    approval: ApprovalTransaction,
    userAddress: `0x${string}`,
    chainId: number = mainnet.id
  ): Promise<ExecutionResult> {
    try {
      // Add 10% buffer to approval amount
      const approvalAmount = (approval.requiredAllowance * 110n) / 100n;

      const txHash = await writeContract(WAGMI_CONFIG, {
        chainId,
        address: approval.tokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [approval.spenderAddress, approvalAmount],
      });

      return {
        success: true,
        txHash,
        gasUsed: 50000n, // Estimated gas for approval
      };
    } catch (error) {
      console.error('Approval execution failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Approval failed',
      };
    }
  }

  /**
   * Execute a single transaction - now fully generic
   */
  public async executeTransaction(
    queueTx: QueueTransaction,
    userAddress: `0x${string}`
  ): Promise<ExecutionResult> {
    try {
      // Prepare the transaction
      const preparation = await this.prepareTransaction(queueTx, userAddress);

      // Use provided ABI or fallback to type-based ABI selection
      const abi = queueTx.abi || this.getAbiForTransaction(queueTx);

      if (!abi) {
        throw new Error('No ABI provided for transaction execution');
      }

      // Simulate the transaction first to catch errors early
      await simulateContract(WAGMI_CONFIG, {
        chainId: queueTx.chainId || mainnet.id,
        address: preparation.contractAddress,
        abi,
        functionName: preparation.functionName as any,
        args: preparation.args as any,
        account: userAddress,
        value: preparation.value,
      });

      // Execute the transaction
      const txHash = await writeContract(WAGMI_CONFIG, {
        chainId: queueTx.chainId || mainnet.id,
        address: preparation.contractAddress,
        abi,
        functionName: preparation.functionName as any,
        args: preparation.args as any,
        gas: preparation.gasLimit,
        value: preparation.value,
      });

      return {
        success: true,
        txHash,
        gasUsed: preparation.gasLimit, // This would be updated with actual gas used
      };
    } catch (error) {
      console.error('Transaction execution failed:', error);
      return {
        success: false,
        error: this.formatError(error),
      };
    }
  }

  /**
   * Execute multiple transactions sequentially
   */
  public async executeSequential(
    transactions: QueueTransaction[],
    userAddress: `0x${string}`,
    onProgress?: (completed: number, total: number) => void
  ): Promise<{ id: string; result: ExecutionResult }[]> {
    const results: { id: string; result: ExecutionResult }[] = [];

    for (let i = 0; i < transactions.length; i++) {
      const queueTx = transactions[i];
      
      try {
        // Check if approval is needed
        const approvalNeeded = await this.checkApprovalNeeded(queueTx, userAddress);
        
        if (approvalNeeded) {
          // Execute approval first
          const approvalResult = await this.executeApproval(approvalNeeded, userAddress, queueTx.chainId);
          if (!approvalResult.success) {
            results.push({
              id: queueTx.id,
              result: {
                success: false,
                error: `Approval failed: ${approvalResult.error}`,
              },
            });
            continue;
          }
        }

        // Execute the main transaction
        const result = await this.executeTransaction(queueTx, userAddress);
        results.push({ id: queueTx.id, result });

        // Report progress
        onProgress?.(i + 1, transactions.length);

        // Add delay between transactions to avoid nonce issues
        if (i < transactions.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        results.push({
          id: queueTx.id,
          result: {
            success: false,
            error: this.formatError(error),
          },
        });
      }
    }

    return results;
  }

  /**
   * Estimate gas for a transaction
   */
  public async estimateGas(
    queueTx: QueueTransaction,
    userAddress: `0x${string}`
  ): Promise<bigint> {
    try {
      const preparation = await this.prepareTransaction(queueTx, userAddress);
      
      // Use simulateContract to get gas estimate
      const abi = queueTx.abi || this.getAbiForTransaction(queueTx);
      
      if (!abi) {
        return 200000n; // Default gas limit if no ABI available
      }

      const simulation = await simulateContract(WAGMI_CONFIG, {
        chainId: queueTx.chainId || mainnet.id,
        address: preparation.contractAddress,
        abi,
        functionName: preparation.functionName as any,
        args: preparation.args as any,
        account: userAddress,
      });

      // Add 20% buffer to gas estimate
      return (simulation.request.gas || 150000n) * 120n / 100n;
    } catch (error) {
      console.error('Gas estimation failed:', error);
      // Return default gas limit
      return 200000n;
    }
  }

  /**
   * Get the appropriate ABI for a transaction type (legacy fallback)
   */
  private getAbiForTransaction(queueTx: QueueTransaction) {
    // If transaction already has an ABI, use it
    if (queueTx.abi) {
      return queueTx.abi;
    }

    // Legacy type-based ABI selection for backward compatibility
    switch (queueTx.type) {
      case 'approve':
      case 'transfer':
        return erc20Abi;
      case 'deposit':
      case 'withdraw':
      case 'mint':
      case 'redeem':
        return erc4626ABI;
      default:
        // For custom transactions, return null to force explicit ABI provision
        return null;
    }
  }

  /**
   * Format error messages for user display
   */
  private formatError(error: unknown): string {
    if (error instanceof Error) {
      // Extract user-friendly messages from common errors
      if (error.message.includes('insufficient')) {
        return 'Insufficient balance or allowance';
      }
      if (error.message.includes('gas')) {
        return 'Transaction failed due to gas issues';
      }
      if (error.message.includes('rejected')) {
        return 'Transaction was rejected by user';
      }
      return error.message;
    }
    return 'Unknown error occurred';
  }
}