import Head from 'next/head';
import { useState } from 'react';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { useAccount } from 'wagmi';
import { PageHeader, Section } from '@/components/ui/Layout';
import { AuthorizationOverview } from '@/components/features/Authorization';
import { TokenBalances } from '@/components/features/Authorization/TokenBalances';
import { TokenAllowances } from '@/components/features/Authorization/TokenAllowances';
import { AuthorizationSigner } from '@/components/features/Authorization/AuthorizationSigner';
import { TokenConfig } from '@/lib/tokens/config';
import { OperationKind } from '@/hooks/authorization';

export default function AuthorizationsPage() {
  const { address: connectedAddress } = useAccount();
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [selectedTokenDecimals, setSelectedTokenDecimals] = useState<number>(18);
  const [selectedOperation, setSelectedOperation] = useState<OperationKind | undefined>(
    OperationKind.TRANSFER
  );
  const [showAddressSelection, setShowAddressSelection] = useState<boolean>(true);

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
    setShowAddressSelection(false); // Hide address selection after selection
  };

  const handleShowAddressSelection = () => {
    setShowAddressSelection(true);
  };

  const handleTokenChange = (tokenAddress: string, tokenConfig: TokenConfig) => {
    setSelectedToken(tokenAddress);
    setSelectedTokenDecimals(tokenConfig.decimals);
  };

  const handleOperationSelect = (operation: OperationKind) => {
    setSelectedOperation(operation);
  };

  const isOwnAddress =
    selectedAddress &&
    connectedAddress &&
    selectedAddress.toLowerCase() === connectedAddress.toLowerCase();

  return (
    <>
      <Head>
        <title>Authorizations - Authorization Management</title>
        <meta
          name="description"
          content="Manage authorization signatures for smart contracts and safe operations"
        />
      </Head>

      <div className="space-y-6">
        <PageHeader
          title="Authorization"
          description="Create and manage authorization signatures for smart contracts, safes, and EOA operations"
          icon={faUserCheck}
        />

        {/* Step 1: Authorization Overview & Address Selection */}
        {showAddressSelection && (
          <Section>
            <AuthorizationOverview
              onAddressSelect={handleAddressSelect}
              selectedAddress={selectedAddress}
            />
          </Section>
        )}

        {/* Step 2: Token Balances (only show if address selected) */}
        {selectedAddress && (
          <Section>
            <TokenBalances
              selectedAddress={selectedAddress}
              isOwnAddress={Boolean(isOwnAddress)}
              onShowAddressSelection={handleShowAddressSelection}
              onTokenSelect={handleTokenChange}
              selectedToken={selectedToken}
            />
          </Section>
        )}

        {/* Step 3: Operation Allowances (show if token selected) */}
        {selectedAddress && selectedToken && (
          <Section
            title="Operation Types"
            description="Select the type of operation for your authorization signature"
          >
            <TokenAllowances
              selectedAddress={selectedAddress}
              isOwnAddress={Boolean(isOwnAddress)}
              selectedOperation={selectedOperation}
              onOperationSelect={handleOperationSelect}
            />
          </Section>
        )}

        {/* Step 4: Authorization Signing (only show if token and operation selected) */}
        {selectedAddress && selectedToken && selectedOperation !== undefined && (
          <Section
            title="Sign Authorization"
            description="Configure and sign your EIP-712 authorization"
          >
            <AuthorizationSigner
              selectedAddress={selectedAddress}
              onAddressChange={setSelectedAddress}
              selectedToken={selectedToken}
              selectedTokenDecimals={selectedTokenDecimals}
              selectedOperation={selectedOperation}
            />
          </Section>
        )}
      </div>
    </>
  );
}
