import { WAGMI_CONFIG } from '@/lib/web3/config';
import { writeContract, readContract, simulateContract } from 'wagmi/actions';
import { mainnet } from '@reown/appkit/networks';
import { erc4626ABI } from '@/lib/vaults/abi';
import { erc20Abi } from 'viem';
import { parseUnits, formatUnits } from 'viem';
import { QueueTransaction } from '@/contexts/TransactionQueueContext';
import { 
  PreparedTransaction, 
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
   * Prepare a queue transaction for execution
   */
  public async prepareTransaction(
    queueTx: QueueTransaction, 
    userAddress: `0x${string}`
  ): Promise<TransactionPreparation> {
    const contractAddress = queueTx.contractAddress as `0x${string}`;

    // If transaction has explicit function name and args, use them
    if (queueTx.functionName && queueTx.args) {
      return {
        contractAddress,
        functionName: queueTx.functionName,
        args: queueTx.args,
        value: queueTx.value ? BigInt(queueTx.value) : 0n,
        gasLimit: queueTx.gasLimit ? BigInt(queueTx.gasLimit) : 150000n,
      };
    }

    // Fallback: derive from transaction type and amount (legacy support)
    if (!queueTx.amount) {
      throw new Error('Transaction missing required parameters: either (functionName + args) or amount must be provided');
    }

    const amount = parseUnits(queueTx.amount, this.getTokenDecimals(queueTx));

    switch (queueTx.type) {
      case 'approve':
        return {
          contractAddress,
          functionName: 'approve',
          args: [queueTx.targetContract || userAddress, amount],
          gasLimit: 50000n,
        };

      case 'deposit':
        return {
          contractAddress,
          functionName: 'deposit',
          args: [amount, userAddress], // assets, receiver
          gasLimit: 150000n,
        };

      case 'withdraw':
        return {
          contractAddress,
          functionName: 'withdraw',
          args: [amount, userAddress, userAddress], // assets, receiver, owner
          gasLimit: 150000n,
        };

      case 'mint':
        return {
          contractAddress,
          functionName: 'mint',
          args: [amount, userAddress], // shares, receiver
          gasLimit: 150000n,
        };

      case 'redeem':
        return {
          contractAddress,
          functionName: 'redeem',
          args: [amount, userAddress, userAddress], // shares, receiver, owner
          gasLimit: 150000n,
        };

      default:
        throw new Error(`Unsupported transaction type: ${queueTx.type}`);
    }
  }

  /**
   * Check if transaction needs approval and prepare approval transaction
   */
  public async checkApprovalNeeded(
    queueTx: QueueTransaction,
    userAddress: `0x${string}`
  ): Promise<ApprovalTransaction | null> {
    // Skip approval check if this is already an approval transaction
    if (queueTx.type === 'approve') {
      return null;
    }

    // Only deposit and mint operations need approval
    if (queueTx.type !== 'deposit' && queueTx.type !== 'mint') {
      return null;
    }

    const vaultAddress = queueTx.contractAddress as `0x${string}`;
    
    if (!queueTx.amount) {
      return null; // No amount to approve
    }

    const amount = parseUnits(queueTx.amount, this.getTokenDecimals(queueTx));

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
   * Execute a single transaction
   */
  public async executeTransaction(
    queueTx: QueueTransaction,
    userAddress: `0x${string}`
  ): Promise<ExecutionResult> {
    try {
      // Prepare the transaction
      const preparation = await this.prepareTransaction(queueTx, userAddress);

      // Get the appropriate ABI based on transaction type
      const abi = this.getAbiForTransaction(queueTx);

      // Simulate the transaction first to catch errors early
      await simulateContract(WAGMI_CONFIG, {
        chainId: queueTx.chainId || mainnet.id,
        address: preparation.contractAddress,
        abi,
        functionName: preparation.functionName as any,
        args: preparation.args,
        account: userAddress,
        value: preparation.value,
      });

      // Execute the transaction
      const txHash = await writeContract(WAGMI_CONFIG, {
        chainId: queueTx.chainId || mainnet.id,
        address: preparation.contractAddress,
        abi,
        functionName: preparation.functionName as any,
        args: preparation.args,
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
      const simulation = await simulateContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: preparation.contractAddress,
        abi: erc4626ABI,
        functionName: preparation.functionName as any,
        args: preparation.args,
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
   * Get the appropriate ABI for a transaction type
   */
  private getAbiForTransaction(queueTx: QueueTransaction) {
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
        // For custom transactions, assume ERC20 if no specific ABI is needed
        return erc20Abi;
    }
  }

  /**
   * Get token decimals for the transaction
   */
  private getTokenDecimals(queueTx: QueueTransaction): number {
    // For deposit/mint, use asset decimals
    // For withdraw/redeem, use vault token decimals
    // This is a simplified version - in production, you'd fetch this from contracts
    switch (queueTx.type) {
      case 'approve':
      case 'deposit':
      case 'mint':
        return 6; // USDC/USDT have 6 decimals
      case 'withdraw':
      case 'redeem':
        return 18; // Most vault tokens have 18 decimals
      default:
        return 18;
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