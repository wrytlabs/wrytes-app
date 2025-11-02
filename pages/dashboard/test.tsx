import Head from 'next/head';
import { useState } from 'react';
import { faFlask } from '@fortawesome/free-solid-svg-icons';
import { useAccount, useSignTypedData, useChainId } from 'wagmi';
import { PageHeader } from '@/components/ui/Layout';
import { AmountInput } from '@/components/ui/AmountInput';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { parseEther, parseUnits } from 'viem';

enum OperationKind {
  TRANSFER = 0,
  DEPOSIT = 1,
  PROCESS = 2,
  CLAIM = 3,
}

interface Authorization {
  kind: OperationKind;
  from: string;
  to: string;
  token: string;
  amount: string;
  nonce: string;
  validAfter: string;
  validBefore: string;
}

export default function TestPage() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { signTypedData, data: signature, isPending, error } = useSignTypedData();

  const [authorization, setAuthorization] = useState<Authorization>({
    kind: OperationKind.TRANSFER,
    from: address || '',
    to: '',
    token: '',
    amount: '',
    nonce: '',
    validAfter: '',
    validBefore: '',
  });

  const [verifyingContract, setVerifyingContract] = useState<string>(
    '0x3874161854D0D5f13B4De2cB5061d9cff547466E'
  );

  const handleInputChange = (field: keyof Authorization, value: string | OperationKind) => {
    setAuthorization(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAmountChange = (value: string) => {
    setAuthorization(prev => ({
      ...prev,
      amount: value,
    }));
  };

  const handleMaxClick = () => {
    setAuthorization(prev => ({
      ...prev,
      amount: '1000', // Mock max amount
    }));
  };

  const handleSign = async () => {
    if (!isConnected || !verifyingContract) return;

    try {
      // EIP-712 domain
      const domain = {
        name: 'AuthorizationProcessor',
        version: '1',
        chainId: chainId,
        verifyingContract: verifyingContract as `0x${string}`,
      };

      // EIP-712 types
      const types = {
        Authorization: [
          { name: 'kind', type: 'uint8' },
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'token', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'nonce', type: 'bytes32' },
          { name: 'validAfter', type: 'uint256' },
          { name: 'validBefore', type: 'uint256' },
        ],
      };

      // Message data
      const message = {
        kind: authorization.kind,
        from: authorization.from as `0x${string}`,
        to: authorization.to as `0x${string}`,
        token: authorization.token as `0x${string}`,
        amount: parseUnits(authorization.amount || '0', 6),
        nonce: authorization.nonce as `0x${string}`,
        validAfter: BigInt(authorization.validAfter || '0'),
        validBefore: BigInt(authorization.validBefore || '0'),
      };

      await signTypedData({
        domain,
        types,
        primaryType: 'Authorization',
        message,
      });
    } catch (err) {
      console.error('Failed to sign typed data:', err);
    }
  };

  const isFormValid =
    authorization.from &&
    authorization.to &&
    authorization.token &&
    authorization.amount &&
    authorization.nonce &&
    authorization.validAfter &&
    authorization.validBefore &&
    verifyingContract;

  return (
    <>
      <Head>
        <title>Test Page - Authorization Signing</title>
        <meta name="description" content="Test page for signing Authorization structs" />
      </Head>

      <div className="space-y-6 max-w-2xl mx-auto">
        <PageHeader
          title="Authorization Signing Test"
          description="Test page for signing Authorization structs with connected wallet"
          icon={faFlask}
        />

        <Card>
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-white">Authorization Parameters</h3>

            {!isConnected && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-sm">Please connect your wallet to continue</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {/* Verifying Contract */}
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">
                  Verifying Contract Address
                </label>
                <input
                  type="text"
                  value={verifyingContract}
                  onChange={e => setVerifyingContract(e.target.value)}
                  placeholder="0x... (AuthorizationProcessor contract address)"
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-accent-orange"
                />
              </div>

              {/* Operation Kind */}
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">
                  Operation Kind
                </label>
                <select
                  value={authorization.kind}
                  onChange={e => handleInputChange('kind', Number(e.target.value) as OperationKind)}
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-orange"
                >
                  <option value={OperationKind.TRANSFER}>TRANSFER</option>
                  <option value={OperationKind.DEPOSIT}>DEPOSIT</option>
                  <option value={OperationKind.PROCESS}>PROCESS</option>
                  <option value={OperationKind.CLAIM}>CLAIM</option>
                </select>
              </div>

              {/* From Address */}
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">
                  From Address
                </label>
                <input
                  type="text"
                  value={authorization.from}
                  onChange={e => handleInputChange('from', e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-accent-orange"
                />
              </div>

              {/* To Address */}
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">
                  To Address
                </label>
                <input
                  type="text"
                  value={authorization.to}
                  onChange={e => handleInputChange('to', e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-accent-orange"
                />
              </div>

              {/* Token Address */}
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">
                  Token Address
                </label>
                <input
                  type="text"
                  value={authorization.token}
                  onChange={e => handleInputChange('token', e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-accent-orange"
                />
              </div>

              {/* Amount Input */}
              <AmountInput
                title="Amount"
                amount={authorization.amount}
                onAmountChange={handleAmountChange}
                symbol="ETH"
                decimals={18}
                availableBalance={parseEther('1000')}
                onMaxClick={handleMaxClick}
                placeholder="0.0"
              />

              {/* Nonce */}
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">
                  Nonce (bytes32)
                </label>
                <input
                  type="text"
                  value={authorization.nonce}
                  onChange={e => handleInputChange('nonce', e.target.value)}
                  placeholder="0x0000000000000000000000000000000000000000000000000000000000000000"
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-accent-orange"
                />
              </div>

              {/* Valid After */}
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">
                  Valid After (timestamp)
                </label>
                <input
                  type="number"
                  value={authorization.validAfter}
                  onChange={e => handleInputChange('validAfter', e.target.value)}
                  placeholder="1640995200"
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-accent-orange"
                />
              </div>

              {/* Valid Before */}
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">
                  Valid Before (timestamp)
                </label>
                <input
                  type="number"
                  value={authorization.validBefore}
                  onChange={e => handleInputChange('validBefore', e.target.value)}
                  placeholder="1672531200"
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-accent-orange"
                />
              </div>
            </div>

            {/* Sign Button */}
            <div className="pt-4">
              <Button
                variant="primary"
                onClick={handleSign}
                disabled={!isConnected || !isFormValid || isPending}
                className="w-full"
              >
                {isPending ? 'Signing...' : 'Sign Authorization (EIP-712)'}
              </Button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">Error: {error.message}</p>
              </div>
            )}

            {/* Signature Display */}
            {signature && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h4 className="text-green-400 font-semibold mb-2">Signature Generated:</h4>
                <p className="text-green-300 text-xs font-mono break-all">{signature}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
