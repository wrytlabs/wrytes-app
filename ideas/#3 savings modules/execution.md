# Savings Modules - Execution Guide

## Phase 1: Foundation Setup

### Step 1: Create Configuration System
```typescript
// lib/savings/config.ts
export interface SavingsVault {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  description: string;
  apy: number;
  tvl: string;
  riskLevel: 'low' | 'medium' | 'high';
  chainId: number;
  strategy: string;
  minDeposit: string;
  maxDeposit: string;
}

export const SAVINGS_VAULTS: SavingsVault[] = [
  {
    address: '0x...',
    name: 'USDC Savings Vault',
    symbol: 'vUSDC',
    decimals: 6,
    description: 'Earn yield on USDC deposits with automated strategies',
    apy: 4.2,
    tvl: '$2.4M',
    riskLevel: 'low',
    chainId: 1,
    strategy: 'Automated yield farming with risk management',
    minDeposit: '100',
    maxDeposit: '1000000'
  }
];
```

### Step 2: Web3 Integration Layer
```typescript
// lib/web3/savings.ts
import { erc4626ABI } from 'wagmi';
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';

export const useSavingsVault = (vaultAddress: string) => {
  // Read vault data
  const { data: totalAssets } = useContractRead({
    address: vaultAddress as `0x${string}`,
    abi: erc4626ABI,
    functionName: 'totalAssets',
  });

  const { data: totalSupply } = useContractRead({
    address: vaultAddress as `0x${string}`,
    abi: erc4626ABI,
    functionName: 'totalSupply',
  });

  // Deposit function
  const { config: depositConfig } = usePrepareContractWrite({
    address: vaultAddress as `0x${string}`,
    abi: erc4626ABI,
    functionName: 'deposit',
  });

  const { write: deposit, isLoading: isDepositing } = useContractWrite(depositConfig);

  // Withdraw function
  const { config: withdrawConfig } = usePrepareContractWrite({
    address: vaultAddress as `0x${string}`,
    abi: erc4626ABI,
    functionName: 'withdraw',
  });

  const { write: withdraw, isLoading: isWithdrawing } = useContractWrite(withdrawConfig);

  return {
    totalAssets,
    totalSupply,
    deposit,
    withdraw,
    isDepositing,
    isWithdrawing,
  };
};
```

### Step 3: Create UI Components

#### SavingsVaultCard Component
```typescript
// components/savings/SavingsVaultCard.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPiggyBank, faChartLine, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import Card from '@/components/ui/Card';
import { SavingsVault } from '@/lib/savings/config';

interface SavingsVaultCardProps {
  vault: SavingsVault;
  onDeposit: (vault: SavingsVault) => void;
  onWithdraw: (vault: SavingsVault) => void;
  userBalance?: string;
}

export const SavingsVaultCard: React.FC<SavingsVaultCardProps> = ({
  vault,
  onDeposit,
  onWithdraw,
  userBalance
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="relative overflow-hidden group hover:scale-105 transition-transform duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent-orange/20 rounded-lg flex items-center justify-center">
            <FontAwesomeIcon icon={faPiggyBank} className="w-5 h-5 text-accent-orange" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{vault.name}</h3>
            <p className="text-text-secondary text-sm">{vault.symbol}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(vault.riskLevel)} bg-opacity-20`}>
          {vault.riskLevel.toUpperCase()}
        </div>
      </div>

      {/* Description */}
      <p className="text-text-secondary text-sm mb-4">{vault.description}</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-dark-surface/50 rounded-lg">
          <p className="text-text-secondary text-xs">APY</p>
          <p className="text-xl font-bold text-green-400">{vault.apy}%</p>
        </div>
        <div className="text-center p-3 bg-dark-surface/50 rounded-lg">
          <p className="text-text-secondary text-xs">TVL</p>
          <p className="text-lg font-semibold text-white">{vault.tvl}</p>
        </div>
      </div>

      {/* User Balance */}
      {userBalance && (
        <div className="mb-4 p-3 bg-accent-orange/10 rounded-lg">
          <p className="text-text-secondary text-xs">Your Balance</p>
          <p className="text-white font-semibold">{userBalance} {vault.symbol}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onDeposit(vault)}
          className="flex-1 bg-accent-orange hover:bg-accent-orange/90 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Deposit
        </button>
        <button
          onClick={() => onWithdraw(vault)}
          className="flex-1 border border-accent-orange text-accent-orange hover:bg-accent-orange/10 py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Withdraw
        </button>
      </div>
    </Card>
  );
};
```

#### Deposit Modal Component
```typescript
// components/savings/DepositModal.tsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faWallet } from '@fortawesome/free-solid-svg-icons';
import { SavingsVault } from '@/lib/savings/config';
import { useSavingsVault } from '@/lib/web3/savings';

interface DepositModalProps {
  vault: SavingsVault;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  vault,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [amount, setAmount] = useState('');
  const { deposit, isDepositing } = useSavingsVault(vault.address);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    try {
      await deposit?.({
        args: [BigInt(parseFloat(amount) * 10 ** vault.decimals)],
      });
      onSuccess();
    } catch (error) {
      console.error('Deposit failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-card rounded-xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Deposit to {vault.name}</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-text-secondary text-sm mb-2">
            Amount to Deposit
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-accent-orange"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
              {vault.symbol}
            </div>
          </div>
          <p className="text-text-secondary text-xs mt-2">
            Min: {vault.minDeposit} {vault.symbol} | Max: {vault.maxDeposit} {vault.symbol}
          </p>
        </div>

        {/* Preview */}
        <div className="mb-6 p-4 bg-dark-surface/50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Estimated APY:</span>
            <span className="text-green-400 font-medium">{vault.apy}%</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-text-secondary">Risk Level:</span>
            <span className="text-white">{vault.riskLevel.toUpperCase()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-dark-border text-white py-3 px-4 rounded-lg hover:bg-dark-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeposit}
            disabled={isDepositing || !amount}
            className="flex-1 bg-accent-orange hover:bg-accent-orange/90 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            {isDepositing ? 'Processing...' : 'Deposit'}
          </button>
        </div>
      </div>
    </div>
  );
};
```

### Step 4: Create Savings Page
```typescript
// pages/dashboard/savings.tsx
import Head from 'next/head';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPiggyBank, faChartLine, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { SavingsVaultCard } from '@/components/savings/SavingsVaultCard';
import { DepositModal } from '@/components/savings/DepositModal';
import { WithdrawModal } from '@/components/savings/WithdrawModal';
import { SAVINGS_VAULTS } from '@/lib/savings/config';
import Card from '@/components/ui/Card';

export default function SavingsPage() {
  const [selectedVault, setSelectedVault] = useState<SavingsVault | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const handleDeposit = (vault: SavingsVault) => {
    setSelectedVault(vault);
    setShowDepositModal(true);
  };

  const handleWithdraw = (vault: SavingsVault) => {
    setSelectedVault(vault);
    setShowWithdrawModal(true);
  };

  return (
    <>
      <Head>
        <title>Savings Vaults - Wrytes</title>
        <meta name="description" content="Manage your DeFi savings vaults" />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Savings Vaults</h1>
            <p className="text-text-secondary">
              Earn yield on your assets with automated DeFi strategies
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faPiggyBank} className="w-6 h-6 text-accent-orange" />
              </div>
              <div>
                <p className="text-text-secondary text-sm">Total Value Locked</p>
                <p className="text-2xl font-bold text-white">$12.4M</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-text-secondary text-sm">Average APY</p>
                <p className="text-2xl font-bold text-green-400">5.2%</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faDollarSign} className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-text-secondary text-sm">Your Deposits</p>
                <p className="text-2xl font-bold text-white">$2,450</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Vaults Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAVINGS_VAULTS.map((vault) => (
            <SavingsVaultCard
              key={vault.address}
              vault={vault}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedVault && (
        <>
          <DepositModal
            vault={selectedVault}
            isOpen={showDepositModal}
            onClose={() => setShowDepositModal(false)}
            onSuccess={() => setShowDepositModal(false)}
          />
          <WithdrawModal
            vault={selectedVault}
            isOpen={showWithdrawModal}
            onClose={() => setShowWithdrawModal(false)}
            onSuccess={() => setShowWithdrawModal(false)}
          />
        </>
      )}
    </>
  );
}
```

### Step 5: Update Navigation
```typescript
// components/layout/DashboardLayout.tsx
// Add to navigation items:
<Link 
  href="/dashboard/savings" 
  className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:text-accent-orange hover:bg-accent-orange/20 rounded-lg transition-all duration-200 hover:shadow-sm"
  onClick={closeSidebar}
>
  <FontAwesomeIcon icon={faPiggyBank} className="w-4 h-4" />
  Savings
</Link>
```

## Phase 2: Advanced Features

### Step 6: Add Toast Notifications
```typescript
// hooks/useToast.ts
import { toast } from 'react-hot-toast';

export const useToast = () => {
  return {
    success: (message: string) => toast.success(message, {
      style: {
        background: '#10B981',
        color: '#fff',
      },
    }),
    error: (message: string) => toast.error(message, {
      style: {
        background: '#EF4444',
        color: '#fff',
      },
    }),
    loading: (message: string) => toast.loading(message, {
      style: {
        background: '#F59E0B',
        color: '#fff',
      },
    }),
  };
};
```

### Step 7: Error Handling
```typescript
// lib/utils/error-handling.ts
export const handleTransactionError = (error: any) => {
  if (error.code === 4001) {
    return 'Transaction rejected by user';
  }
  if (error.message.includes('insufficient funds')) {
    return 'Insufficient balance for transaction';
  }
  if (error.message.includes('gas')) {
    return 'Transaction failed - try increasing gas limit';
  }
  return 'Transaction failed - please try again';
};
```

## Testing Checklist

### Unit Tests
- [ ] Configuration loading
- [ ] Web3 hook functionality
- [ ] Component rendering
- [ ] Modal interactions

### Integration Tests
- [ ] Wallet connection
- [ ] Contract interactions
- [ ] Transaction flows
- [ ] Error scenarios

### User Acceptance Tests
- [ ] Deposit flow
- [ ] Withdraw flow
- [ ] Balance updates
- [ ] Error handling
- [ ] Mobile responsiveness

## Deployment Checklist

### Pre-deployment
- [ ] Test on testnet
- [ ] Audit smart contracts
- [ ] Security review
- [ ] Performance testing

### Production
- [ ] Deploy smart contracts
- [ ] Update configurations
- [ ] Monitor transactions
- [ ] User feedback collection

## Success Metrics

### Technical Metrics
- Transaction success rate > 95%
- Page load time < 2 seconds
- Error rate < 1%

### User Metrics
- User engagement with vaults
- Deposit/withdraw frequency
- User retention rate
- Support ticket volume

## Future Enhancements

### Phase 3 Features
- Automated rebalancing
- Yield optimization
- Cross-chain bridging
- Advanced analytics

### Phase 4 Features
- Social features
- Community vaults
- Institutional tools
- Mobile app