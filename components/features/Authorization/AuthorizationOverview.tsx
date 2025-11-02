import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faShield, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Card from '@/components/ui/Card';
import { StatGrid, StatCard } from '@/components/ui/Stats';
import { useAuthorizationAddresses } from '@/hooks/authorization';
import { AuthorizationOverviewProps } from './types';

export const AuthorizationOverview: React.FC<AuthorizationOverviewProps> = ({
  onAddressSelect,
  selectedAddress,
}) => {
  const { addresses, connectedAddress, isLoading } = useAuthorizationAddresses();

  const connectedAddresses = addresses.filter(addr => addr.isConnected);
  const authorizedAddresses = addresses.filter(addr => !addr.isConnected);

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <Card>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-dark-border rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-dark-border rounded"></div>
              <div className="h-3 bg-dark-border rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {/* <StatGrid
        stats={[
          {
            label: "Connected Wallets",
            value: connectedAddresses.length,
            icon: faWallet,
          },
          {
            label: "Authorized Addresses", 
            value: authorizedAddresses.length,
            icon: faShield,
          },
          {
            label: "Total Addresses",
            value: addresses.length,
            icon: faCheckCircle,
          }
        ]}
      /> */}

      {/* Address List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Authorization Addresses</h3>
          <p className="text-text-secondary text-sm mb-6">
            Select an address to create authorization signatures. Connected wallets have full
            access, while authorized addresses can sign on behalf of contracts and smart wallets.
          </p>

          <div className="space-y-3">
            {addresses.map(address => (
              <div
                key={address.address}
                onClick={() => onAddressSelect?.(address.address)}
                className={`
                  p-4 rounded-lg bg-dark-surface border cursor-pointer transition-all duration-200
                  ${
                    selectedAddress === address.address
                      ? 'border-accent-orange bg-accent-orange/10'
                      : 'border-gray-600 hover:border-accent-orange/50 hover:bg-accent-orange/5'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      w-3 h-3 rounded-full
                      ${address.isConnected ? 'bg-green-400' : 'bg-blue-400'}
                    `}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          {address.label || formatAddress(address.address)}
                        </span>
                        {address.isConnected && (
                          <FontAwesomeIcon icon={faWallet} className="w-3 h-3 text-green-400" />
                        )}
                      </div>
                      <p className="text-text-secondary text-xs font-mono">{address.address}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`
                      inline-flex items-center px-2 py-1 rounded-md text-xs font-medium
                      ${
                        address.isConnected
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }
                    `}
                    >
                      {address.isConnected ? 'Connected' : 'Authorized'}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {addresses.length === 0 && (
              <div className="text-center py-8">
                <FontAwesomeIcon icon={faShield} className="w-12 h-12 text-text-secondary mb-4" />
                <p className="text-text-secondary">
                  No authorized addresses found. Connect a wallet to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
