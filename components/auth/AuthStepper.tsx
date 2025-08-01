import React, { useEffect } from 'react'
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

interface AuthStepperProps {
  onComplete?: () => void
}

export function AuthStepper({ onComplete }: AuthStepperProps) {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    authFlow,
    error 
  } = useAuth()
  const { isConnected } = useWallet()

  // Auto-close modal after successful authentication
  useEffect(() => {
    if (isAuthenticated && onComplete) {
      const timer = setTimeout(() => {
        onComplete()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, onComplete])

  // Determine current step based on auth flow state
  const getCurrentStep = (): AuthStep => {
    if (isAuthenticated) return AuthStep.AUTHENTICATED
    
    // Use authFlow.currentStep if available, otherwise fallback to wallet state
    if (authFlow?.currentStep) {
      return authFlow.currentStep
    }
    
    if (isConnected) return AuthStep.GENERATE_MESSAGE
    return AuthStep.CONNECT_WALLET
  }

  const currentStep = getCurrentStep()
  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

  const getStepStatus = (stepIndex: number) => {
    if (currentStep === AuthStep.AUTHENTICATED) {
      return 'completed'
    }
    
    // If there's an error on the current step, show error state
    if (stepIndex === currentStepIndex && authFlow?.error && authFlow?.currentStep === steps[stepIndex].id) {
      return 'error'
    }
    
    if (stepIndex < currentStepIndex) {
      return 'completed'
    }
    
    if (stepIndex === currentStepIndex) {
      return authFlow?.isLoading ? 'loading' : 'current'
    }
    
    return 'pending'
  }

  const getStepIcon = (step: typeof steps[0], status: string) => {
    switch (status) {
      case 'completed':
        return faCheck
      case 'error':
        return faExclamationTriangle
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
      <div className="flex justify-between">
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
                    className={`text-sm ${colorClass}`}
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
    </div>
  )
}