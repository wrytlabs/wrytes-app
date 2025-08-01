import Head from 'next/head';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPiggyBank, 
  faChartLine, 
  faDollarSign, 
  faShieldAlt,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { SavingsVault } from '@/lib/savings/config';
import { SavingsVaultCard } from '@/components/savings/SavingsVaultCard';
import { DepositModal } from '@/components/savings/DepositModal';
import { WithdrawModal } from '@/components/savings/WithdrawModal';
import { SAVINGS_VAULTS } from '@/lib/savings/config';
import Card from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export default function SavingsPage() {
  const [selectedVault, setSelectedVault] = useState<SavingsVault | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const { user } = useAuth();
  const { success, error } = useToast();

  const handleDeposit = (vault: SavingsVault) => {
    setSelectedVault(vault);
    setShowDepositModal(true);
  };

  const handleWithdraw = (vault: SavingsVault) => {
    setSelectedVault(vault);
    setShowWithdrawModal(true);
  };

  // Calculate total stats (using mock values for now)
  const [totalApy, setTotalApy] = useState(0);
  const [totalTvl, setTotalTvl] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const apyValues = await Promise.all(SAVINGS_VAULTS.map(vault => vault.apy()));
        const tvlValues = await Promise.all(SAVINGS_VAULTS.map(vault => vault.tvl()));
        
        const avgApy = apyValues.reduce((sum, apy) => sum + apy, 0) / apyValues.length;
        const totalTvlValue = tvlValues.reduce((sum, tvl) => {
          const tvlNum = parseFloat(tvl.replace(/[$,]/g, ''));
          return sum + tvlNum;
        }, 0);
        
        setTotalApy(avgApy);
        setTotalTvl(totalTvlValue);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

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
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">Savings Vaults</h1>
              <div className="px-2 py-1 bg-green-400/20 text-green-400 text-xs font-medium rounded-full">
                LIVE
              </div>
            </div>
            <p className="text-text-secondary">
              Earn yield on your assets with automated DeFi strategies
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faPiggyBank} className="w-6 h-6 text-accent-orange" />
              </div>
              <div>
                <p className="text-text-secondary text-sm">Total Value Locked</p>
                <p className="text-2xl font-bold text-white">${(totalTvl / 1000000).toFixed(1)}M</p>
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
                <p className="text-2xl font-bold text-green-400">{totalApy.toFixed(1)}%</p>
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
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-400/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faShieldAlt} className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-text-secondary text-sm">Active Vaults</p>
                <p className="text-2xl font-bold text-white">{SAVINGS_VAULTS.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Info Section */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faInfoCircle} className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">How Savings Vaults Work</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Savings vaults are ERC4626-compliant smart contracts that automatically manage your assets 
                across various DeFi protocols to maximize yield while minimizing risk. When you deposit, 
                you receive vault shares that represent your proportional ownership of the underlying assets.
              </p>
            </div>
          </div>
        </Card>

        {/* Vaults Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Available Vaults</h2>
            <div className="text-text-secondary text-sm">
              {SAVINGS_VAULTS.length} vault{SAVINGS_VAULTS.length !== 1 ? 's' : ''} available
            </div>
          </div>
          
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

        {/* Risk Disclaimer */}
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Risk Disclaimer</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              DeFi protocols carry inherent risks including smart contract vulnerabilities, 
              impermanent loss, and market volatility. Past performance does not guarantee 
              future returns. Always do your own research and only invest what you can afford to lose.
            </p>
          </div>
        </Card>
      </div>

      {/* Modals */}
      {selectedVault && (
        <>
          <DepositModal
            vault={selectedVault}
            isOpen={showDepositModal}
            onClose={() => setShowDepositModal(false)}
            onSuccess={() => {
              setShowDepositModal(false);
              success(`Successfully deposited to ${selectedVault?.name}`);
            }}
          />
          <WithdrawModal
            vault={selectedVault}
            isOpen={showWithdrawModal}
            onClose={() => setShowWithdrawModal(false)}
            onSuccess={() => {
              setShowWithdrawModal(false);
              success(`Successfully withdrew from ${selectedVault?.name}`);
            }}
          />
        </>
      )}
    </>
  );
} 