import { WAGMI_CONFIG } from '@/lib/web3/config';
import { writeContract, simulateContract } from 'wagmi/actions';
import { mainnet } from '@reown/appkit/networks';
import { 
  QueueTransaction,
  ExecutionResult, 
  TransactionPreparation,
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

    if (!queueTx.chainId) {
      throw new Error('Transaction missing chainId');
    }

    // not yet implemented to parse abi from etherscan or other sources
    if (!queueTx.abi) {
      throw new Error('Transaction missing abi');
    }

    return {
      chainId: queueTx.chainId || mainnet.id,
      contractAddress: queueTx.contractAddress as `0x${string}`,
      functionName: queueTx.functionName,
      abi: queueTx.abi || this.getAbiForTransaction(queueTx),
      args: queueTx.args,
      value: queueTx.value ? BigInt(queueTx.value) : 0n,
      gasLimit: queueTx.gasLimit ? BigInt(queueTx.gasLimit) : 200000n,
    };
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

      // Simulate the transaction first to catch errors early
      await simulateContract(WAGMI_CONFIG, {
        chainId: preparation.chainId,
        address: preparation.contractAddress,
        abi: preparation.abi,
        functionName: preparation.functionName,
        args: preparation.args,
        account: userAddress,
        value: preparation.value,
      });

      // Execute the transaction
      const txHash = await writeContract(WAGMI_CONFIG, {
        chainId: preparation.chainId,
        address: preparation.contractAddress,
        abi: preparation.abi,
        functionName: preparation.functionName,
        args: preparation.args,
        gas: preparation.gasLimit,
        value: preparation.value,
      });

      return {
        success: true,
        txHash,
        gasUsed: preparation.gasLimit,
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
    userAddress: `0x${string}`
  ): Promise<{ id: string; result: ExecutionResult }[]> {
    const results: { id: string; result: ExecutionResult }[] = [];

    for (let i = 0; i < transactions.length; i++) {
      const queueTx = transactions[i];
      
      try {
        // Execute the transaction
        const result = await this.executeTransaction(queueTx, userAddress);
        results.push({ id: queueTx.id, result });

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
    const defaultGasLimit = 300000n;

    try {
      const preparation = await this.prepareTransaction(queueTx, userAddress);

      const simulation = await simulateContract(WAGMI_CONFIG, {
        chainId: preparation.chainId,
        address: preparation.contractAddress,
        abi: preparation.abi,
        functionName: preparation.functionName,
        args: preparation.args,
        account: userAddress,
        value: preparation.value,
      });

      // Add 20% buffer to gas estimate
      return (simulation.request.gas || defaultGasLimit) * 120n / 100n;
    } catch (error) {
      console.error('Gas estimation failed:', error);
      return defaultGasLimit;
    }
  }

  /**
   * Get the appropriate ABI for a transaction type (legacy fallback)
   */
  private getAbiForTransaction(queueTx: QueueTransaction) {
    return queueTx.abi;
    // TODO: this is okay for now, could be parsed from etherscan api or other sources
    // if (queueTx.abi) return queueTx.abi;
    // fallback to api call to etherscan
    // return await this.getAbiFromEtherscan(queueTx.contractAddress, queueTx.functionName);
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