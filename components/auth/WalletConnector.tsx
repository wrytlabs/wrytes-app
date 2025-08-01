import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faSpinner, faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useWallet } from '@/hooks/useWallet'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface WalletConnectorProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  className?: string
}

export function WalletConnector({ onSuccess, onError, className = '' }: WalletConnectorProps) {
  const { connectWallet, disconnectWallet, isConnected, isConnecting, address, error: walletError, clearWalletError } = useWallet()
  const { signIn, isLoading: authLoading, error: authError, clearError, isAuthenticated } = useAuth()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const handleConnect = async () => {
    try {
      clearWalletError()
      clearError()
      
      if (!isConnected) {
        await connectWallet()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet'
      onError?.(errorMessage)
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
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
      onError?.(errorMessage)
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectWallet()
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
    <Card className={`p-6 max-w-md mx-auto ${className}`}>
      <div className="text-center">
        <div className="mb-4">
          <FontAwesomeIcon 
            icon={faWallet} 
            className="text-4xl text-orange-500 mb-2" 
          />
          <h3 className="text-xl font-bold text-white mb-2">
            {showConnectedState 
              ? 'Wallet Connected' 
              : isConnected 
                ? 'Authenticate' 
                : 'Connect Wallet'
            }
          </h3>
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
                    ? 'Authenticating...'
                    : 'Processing...'
                }
              </p>
            </motion.div>
          )}

          {/* Connect Button */}
          {showConnectButton && (
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
              <div className="mb-4 p-3 bg-gray-800 rounded-lg">
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
              <div className="mb-4 p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
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
            className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg"
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
    </Card>
  )
}