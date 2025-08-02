import { useCallback, useEffect, useState } from 'react'
import { useAppKitAccount, useDisconnect, useAppKitConnection } from '@reown/appkit-controllers/react'
import { type Address } from 'viem'
import { type WalletState } from '@/lib/auth/types'
import { WAGMI_ADAPTER, WAGMI_CONFIG } from '@/lib/web3/config'

/**
 * Hook for wallet connection management
 * Provides wallet state and connection functions
 */
export function useWallet() {
  const { address, isConnected } = useAppKitAccount()
  const { isPending } = useAppKitConnection({});
  const { disconnect } = useDisconnect()

  const isConnecting = WAGMI_CONFIG.state.status === 'connecting'
  
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    address: null,
    chainId: null,
    error: null,
  })

  // Update wallet state when account changes
  useEffect(() => {
    setWalletState(prev => ({
      ...prev,
      isConnected,
      isConnecting: isConnecting || isPending,
      address: address as Address || null,
      chainId: WAGMI_CONFIG.getClient()?.chain.id as number || null,
      error: null,
    }))
  }, [address, isConnected, isConnecting, isPending])

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      disconnect()
      setWalletState({
        isConnected: false,
        isConnecting: false,
        address: null,
        chainId: null,
        error: null,
      })
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }, [disconnect])

  // Clear wallet error
  const clearWalletError = useCallback(() => {
    setWalletState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    // State
    ...walletState,
    
    // Functions
    disconnectWallet,
    clearWalletError,
    
    // Raw wagmi hooks for advanced usage
    disconnect,
  }
}