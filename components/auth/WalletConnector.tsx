import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faSpinner, faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useWallet } from '@/hooks/useWallet'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'

interface WalletConnectorProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  className?: string
}

export function WalletConnector({ onSuccess, onError, className = '' }: WalletConnectorProps) {
  const { 
    connectWallet, 
    disconnectWallet, 
    isConnected, 
    isConnecting, 
    address, 
    error: walletError, 
    clearWalletError,
    availableConnectors 
  } = useWallet()
  const { signIn, signOut, isLoading: authLoading, error: authError, clearError, isAuthenticated } = useAuth()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [showWalletSelector, setShowWalletSelector] = useState(false)

  const handleConnect = async () => {
    try {
      clearWalletError()
      clearError()
      
      if (!isConnected) {
        setShowWalletSelector(true)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet'
      onError?.(errorMessage)
    }
  }

  const handleWalletSelect = async (connectorId: string) => {
    try {
      setShowWalletSelector(false)
      console.log('Connecting to:', connectorId)
      await connectWallet(connectorId)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet'
      onError?.(errorMessage)
      // Reset the wallet selector state to allow retry
      setShowWalletSelector(true)
    }
  }

  const handleAuthenticate = async () => {
    if (!address) return

    try {
      setIsAuthenticating(true)
      clearError()
      
      await signIn(address)
      onSuccess?.()
    } catch (error) {
      let errorMessage = 'Authentication failed'
      
      if (error instanceof Error) {
        // Handle wallet rejection errors
        if (error.name === 'UserRejectedRequestError' || error.message.includes('User rejected')) {
          errorMessage = 'Signature request was cancelled. Please try again.'
        } else {
          errorMessage = error.message
        }
      }
      
      onError?.(errorMessage)
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Failed to disconnect:', error)
    }
  }

  const isLoading = isConnecting || authLoading || isAuthenticating
  const error = walletError || authError
  const showConnectButton = !isConnected && !isLoading
  const showAuthenticateButton = isConnected && !isAuthenticated && !isLoading
  const showConnectedState = isConnected && isAuthenticated

  return (
    <div className={`text-center max-w-md mx-auto ${className}`}>
      <div className="mb-4">
        <p className="text-gray-400 text-sm">
          {showConnectedState
            ? 'You are successfully authenticated'
            : isConnected
              ? 'Sign a message to complete authentication'
              : 'Connect your Web3 wallet to continue'
          }
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Loading State */}
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-4"
          >
            <FontAwesomeIcon 
              icon={faSpinner} 
              className="text-2xl text-orange-500 animate-spin mb-2" 
            />
            <p className="text-gray-300 text-sm">
              {isConnecting 
                ? 'Connecting wallet...' 
                : isAuthenticating || authLoading
                  ? 'Signing message...'
                  : 'Processing...'
              }
            </p>
          </motion.div>
        )}

        {/* Wallet Selection */}
        {showConnectButton && showWalletSelector && (
          <motion.div
            key="wallet-selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            <div className="flex flex-wrap gap-3 justify-center">
              {availableConnectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleWalletSelect(connector.id)}
                  className="flex flex-col items-center gap-2 p-3 hover:bg-dark-surface/50 rounded-lg transition-colors"
                >
                  {connector.icon ? (
                    <img 
                      src={connector.icon} 
                      alt={connector.name}
                      className="w-10 h-10"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-accent-orange/20 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={faWallet} className="w-5 h-5 text-accent-orange" />
                    </div>
                  )}
                  <span className="text-xs text-white font-medium">{connector.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowWalletSelector(false)}
              className="w-full mt-3 p-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
          </motion.div>
        )}

        {/* Connect Button */}
        {showConnectButton && !showWalletSelector && (
          <motion.div
            key="connect"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Button
              onClick={handleConnect}
              className="w-full mb-4"
              variant="primary"
            >
              <FontAwesomeIcon icon={faWallet} className="mr-2" />
              Connect Wallet
            </Button>
          </motion.div>
        )}

        {/* Authenticate Button */}
        {showAuthenticateButton && (
          <motion.div
            key="authenticate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Connected Address:</p>
              <p className="text-sm text-white font-mono break-all">
                {address}
              </p>
            </div>
            <Button
              onClick={handleAuthenticate}
              className="w-full mb-2"
              variant="primary"
            >
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
              Sign Message
            </Button>
            <Button
              onClick={handleDisconnect}
              className="w-full"
              variant="secondary"
            >
              Disconnect
            </Button>
          </motion.div>
        )}

        {/* Connected State */}
        {showConnectedState && (
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-4 p-3 bg-green-900/20 rounded-lg">
              <FontAwesomeIcon icon={faCheck} className="text-green-500 text-lg mb-2" />
              <p className="text-xs text-gray-400 mb-1">Authenticated Address:</p>
              <p className="text-sm text-white font-mono break-all">
                {address}
              </p>
            </div>
            <Button
              onClick={handleDisconnect}
              className="w-full"
              variant="secondary"
            >
              Disconnect
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-900/20 rounded-lg"
        >
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mr-2" />
          <span className="text-red-400 text-sm">{error}</span>
        </motion.div>
      )}

      {/* Additional Info */}
      <div className="mt-6 text-xs text-gray-500 space-y-1">
        <p>• Supported wallets: MetaMask, WalletConnect</p>
        <p>• Your signature confirms wallet ownership</p>
        <p>• No transaction fees required</p>
      </div>
    </div>
  )
}