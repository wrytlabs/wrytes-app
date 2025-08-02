import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { SavingsVault } from '@/lib/savings/config';
import { DepositModal } from '@/components/savings/DepositModal';
import { WithdrawModal } from '@/components/savings/WithdrawModal';
import { SAVINGS_VAULTS } from '@/lib/savings/config';
import Card from '@/components/ui/Card';
import { PageHeader, Section } from '@/components/ui/Layout';
import { SavingsOverview, VaultGrid } from '@/components/features/Savings';
import { useModal } from '@/hooks/ui/useModal';
import { useToast } from '@/hooks/useToast';

export default function SavingsPage() {
  const { success } = useToast();
  const depositModal = useModal<SavingsVault>();
  const withdrawModal = useModal<SavingsVault>();

  const handleDeposit = (vault: SavingsVault) => {
    depositModal.openWith(vault);
  };

  const handleWithdraw = (vault: SavingsVault) => {
    withdrawModal.openWith(vault);
  };

  const handleDepositSuccess = (vault: SavingsVault) => {
    depositModal.close();
    success(`Successfully deposited to ${vault.name}`);
  };

  const handleWithdrawSuccess = (vault: SavingsVault) => {
    withdrawModal.close();
    success(`Successfully withdrew from ${vault.name}`);
  };

  return (
    <>
      <Head>
        <title>Savings Vaults - Wrytes</title>
        <meta name="description" content="Manage your DeFi savings vaults" />
      </Head>

      <div className="space-y-6">
        <PageHeader
          title="Savings Vaults"
          description="Earn yield on your assets with automated DeFi strategies"
          badge={{ text: "LIVE", variant: "success" }}
        />

        <SavingsOverview />

        <Section>
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
        </Section>

        <Section
          title="Available Vaults"
          description={`${SAVINGS_VAULTS.length} vault${SAVINGS_VAULTS.length !== 1 ? 's' : ''} available`}
        >
          <VaultGrid
            vaults={SAVINGS_VAULTS}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
          />
        </Section>

        <Section>
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
        </Section>
      </div>

      {/* Modals */}
      {depositModal.data && (
        <DepositModal
          vault={depositModal.data}
          isOpen={depositModal.isOpen}
          onClose={depositModal.close}
          onSuccess={() => handleDepositSuccess(depositModal.data!)}
        />
      )}
      
      {withdrawModal.data && (
        <WithdrawModal
          vault={withdrawModal.data}
          isOpen={withdrawModal.isOpen}
          onClose={withdrawModal.close}
          onSuccess={() => handleWithdrawSuccess(withdrawModal.data!)}
        />
      )}
    </>
  );
}