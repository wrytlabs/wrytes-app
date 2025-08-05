import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faVault } from '@fortawesome/free-solid-svg-icons';
import { Vault } from '@/lib/vaults/types';
import { VAULTS } from '@/lib/vaults/config';
import Card from '@/components/ui/Card';
import { PageHeader, Section } from '@/components/ui/Layout';
import { showToast } from '@/components/ui';
import { Overview, VaultGrid } from '@/components/features/Vaults';
import { useModal } from '@/hooks/ui/useModal';
import { VaultDepositModal } from '@/components/features/Vaults/VaultDepositModal';
import { VaultWithdrawModal } from '@/components/features/Vaults/VaultWithdrawModal';

export default function VaultsPage() {
  const depositModal = useModal<Vault>();
  const withdrawModal = useModal<Vault>();

  const morphoVaults = VAULTS.filter(vault => vault.kind === 'morpho');
  const savingsVaults = VAULTS.filter(vault => vault.kind === 'savings');

  const handleDeposit = (vault: Vault) => {
    depositModal.openWith(vault);
  };

  const handleWithdraw = (vault: Vault) => {
    withdrawModal.openWith(vault);
  };

  const handleDepositSuccess = (vault: Vault) => {
    depositModal.close();
    showToast.success(
      `Added deposit to ${vault.name} to queue`,
      {
        duration: 4000,
        id: `deposit-success-${vault.address}`,
      }
    );
  };

  const handleWithdrawSuccess = (vault: Vault) => {
    withdrawModal.close();
    showToast.success(
      `Added withdrawal from ${vault.name} to queue`,
      {
        duration: 4000,
        id: `withdraw-success-${vault.address}`,
      }
    );
  };

  return (
    <>
      <Head>
        <title>Vaults - Wrytes</title>
        <meta name="description" content="Manage your DeFi vaults" />
      </Head>

      <div className="space-y-6">
        <PageHeader
          title="DeFi Vaults"
          description="Earn yield on your assets with automated DeFi strategies"
          icon={faVault}
          badge={{ text: "LIVE", variant: "success" }}
        />

        <Overview />

        <Section>
          <Card>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faInfoCircle} className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">How DeFi Vaults Work</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  DeFi vaults are ERC4626-compliant smart contracts that automatically manage your assets 
                  across various protocols to maximize yield while minimizing risk. Morpho vaults provide 
                  lending-based yields through automated strategies, while savings vaults offer stable 
                  returns through diversified DeFi protocols. When you deposit, you receive vault shares 
                  that represent your proportional ownership of the underlying assets.
                </p>
              </div>
            </div>
          </Card>
        </Section>

        <Section
          title="Morpho Vaults"
          description={`${morphoVaults.length} vault${morphoVaults.length !== 1 ? 's' : ''} available`}
        >
          <VaultGrid
            vaults={morphoVaults}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
          />
        </Section>
       
        <Section
          title="Savings Vaults"
          description={`${savingsVaults.length} vault${savingsVaults.length !== 1 ? 's' : ''} available`}
        >
          <VaultGrid
            vaults={savingsVaults}
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
        <VaultDepositModal
          vault={depositModal.data}
          isOpen={depositModal.isOpen}
          onClose={depositModal.close}
          onSuccess={() => handleDepositSuccess(depositModal.data!)}
        />
      )}
      
      {withdrawModal.data && (
        <VaultWithdrawModal
          vault={withdrawModal.data}
          isOpen={withdrawModal.isOpen}
          onClose={withdrawModal.close}
          onSuccess={() => handleWithdrawSuccess(withdrawModal.data!)}
        />
      )}
    </>
  );
}