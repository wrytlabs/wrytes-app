import React from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faWallet, 
  faFileSignature, 
  faShieldAlt, 
  faCheck, 
  faSpinner,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/hooks/useAuth'
import { useWallet } from '@/hooks/useWallet'
import { AuthStep } from '@/lib/auth/types'

const steps = [
  {
    id: AuthStep.CONNECT_WALLET,
    title: 'Connect Wallet',
    description: 'Link your Web3 wallet',
    icon: faWallet,
  },
  {
    id: AuthStep.GENERATE_MESSAGE,
    title: 'Generate Message',
    description: 'Create authentication message',
    icon: faFileSignature,
  },
  {
    id: AuthStep.SIGN_MESSAGE,
    title: 'Sign Message',
    description: 'Confirm with your wallet',
    icon: faShieldAlt,
  },
  {
    id: AuthStep.VERIFY_SIGNATURE,
    title: 'Verify & Authenticate',
    description: 'Complete authentication',
    icon: faCheck,
  },
]

export function AuthStepper() {
  const { isAuthenticated, isLoading } = useAuth()
  const { isConnected } = useWallet()

  // Determine current step based on state
  const getCurrentStep = (): AuthStep => {
    if (isAuthenticated) return AuthStep.AUTHENTICATED
    if (isLoading) {
      // Return the step that's currently loading
      if (!isConnected) return AuthStep.CONNECT_WALLET
      return AuthStep.VERIFY_SIGNATURE
    }
    if (isConnected) return AuthStep.GENERATE_MESSAGE
    return AuthStep.CONNECT_WALLET
  }

  const currentStep = getCurrentStep()
  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

  const getStepStatus = (stepIndex: number) => {
    if (currentStep === AuthStep.ERROR) {
      return stepIndex <= currentStepIndex ? 'error' : 'pending'
    }
    if (currentStep === AuthStep.AUTHENTICATED) {
      return 'completed'
    }
    if (stepIndex < currentStepIndex) {
      return 'completed'
    }
    if (stepIndex === currentStepIndex) {
      return isLoading ? 'loading' : 'current'
    }
    return 'pending'
  }

  const getStepIcon = (step: typeof steps[0], status: string) => {
    switch (status) {
      case 'completed':
        return faCheck
      case 'loading':
        return faSpinner
      case 'error':
        return faExclamationTriangle
      case 'current':
        return step.icon
      default:
        return step.icon
    }
  }

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500'
      case 'loading':
        return 'text-orange-500'
      case 'error':
        return 'text-red-500'
      case 'current':
        return 'text-orange-500'
      default:
        return 'text-gray-500'
    }
  }

  const getConnectorColor = (fromStatus: string, toStatus: string) => {
    if (fromStatus === 'completed' && (toStatus === 'completed' || toStatus === 'current' || toStatus === 'loading')) {
      return 'bg-green-500'
    }
    if (fromStatus === 'error' || toStatus === 'error') {
      return 'bg-red-500'
    }
    return 'bg-gray-600'
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          const icon = getStepIcon(step, status)
          const colorClass = getStepColor(status)
          
          return (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="flex flex-col items-center">
                <motion.div
                  className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2
                    ${status === 'completed' ? 'border-green-500 bg-green-500/20' : 
                      status === 'current' || status === 'loading' ? 'border-orange-500 bg-orange-500/20' :
                      status === 'error' ? 'border-red-500 bg-red-500/20' :
                      'border-gray-600 bg-gray-800'}
                  `}
                  animate={{
                    scale: status === 'current' || status === 'loading' ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: status === 'loading' ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    className={`text-sm ${colorClass} ${
                      status === 'loading' ? 'animate-spin' : ''
                    }`}
                  />
                </motion.div>
                
                <div className="text-center max-w-20">
                  <p className={`text-xs font-medium ${
                    status === 'current' || status === 'completed' || status === 'loading'
                      ? 'text-white' 
                      : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 leading-tight">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 px-2">
                  <div className={`
                    h-0.5 rounded-full transition-colors duration-300
                    ${getConnectorColor(getStepStatus(index), getStepStatus(index + 1))}
                  `} />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Status Message */}
      <div className="mt-4 text-center">
        {currentStep === AuthStep.AUTHENTICATED && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-green-400"
          >
            ✅ Authentication completed successfully!
          </motion.p>
        )}
        {currentStep === AuthStep.ERROR && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400"
          >
            ❌ Authentication failed. Please try again.
          </motion.p>
        )}
        {isLoading && currentStep !== AuthStep.AUTHENTICATED && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-orange-400"
          >
            🔄 Processing authentication...
          </motion.p>
        )}
      </div>
    </div>
  )
}