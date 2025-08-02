import { useCallback, useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { type Address } from 'viem'
import { type WalletState } from '@/lib/auth/types'

/**
 * Hook for wallet connection management
 * Provides wallet state and connection functions
 */
export function useWallet() {
  const { address, isConnected, isConnecting, connector } = useAccount()
  const { connect, connectors, error: connectError, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  
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
      chainId: connector?.chainId as number || null,
      error: connectError?.message || null,
    }))
  }, [address, isConnected, isConnecting, isPending, connector, connectError])

  // Connect to wallet with specific connector
  const connectWallet = useCallback(async (connectorId?: string) => {
    try {
      setWalletState(prev => ({ ...prev, error: null, isConnecting: true }))
      
      let targetConnector
      if (connectorId) {
        targetConnector = connectors.find(c => c.id === connectorId)
      } else {
        // Default to injected (MetaMask) if available, otherwise first available
        targetConnector = connectors.find(c => c.id === 'injected') || connectors[0]
      }
      
      if (targetConnector) {
        // Add timeout for connection
        const connectionPromise = connect({ connector: targetConnector })
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Connection timeout. Please try again.')), 30000) // 30 second timeout
        })
        
        await Promise.race([connectionPromise, timeoutPromise])
      } else {
        throw new Error('No wallet connectors available')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet'
      setWalletState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isConnecting: false 
      }))
      throw error // Re-throw to allow component to handle
    }
  }, [connect, connectors])

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

  // Check if specific connector is available
  const isConnectorAvailable = useCallback((connectorId: string) => {
    return connectors.some(connector => connector.id === connectorId)
  }, [connectors])

  // Get available connector names
  const availableConnectors = connectors.map(connector => ({
    id: connector.id,
    name: connector.name,
    icon: connector.icon,
  }))

  return {
    // State
    ...walletState,
    connector,
    availableConnectors,
    
    // Functions
    connectWallet,
    disconnectWallet,
    clearWalletError,
    isConnectorAvailable,
    
    // Raw wagmi hooks for advanced usage
    connect,
    disconnect,
    connectors,
  }
}