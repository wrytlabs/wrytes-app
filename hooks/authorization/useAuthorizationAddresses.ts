import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { AddressConfig } from '@/components/ui/AddressSelector';
import { UseAuthorizationAddressesReturn } from './types';

/**
 * Hook to manage authorized addresses
 * In a real implementation, this would fetch from a contract or API
 * For now, it provides mock data with the connected address
 */
export const useAuthorizationAddresses = (): UseAuthorizationAddressesReturn => {
  const { address: connectedAddress, isConnected } = useAccount();
  const [addresses, setAddresses] = useState<AddressConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading authorized addresses
    const loadAddresses = async () => {
      setIsLoading(true);

      // Mock authorized addresses - in real implementation, fetch from contract/API
      const mockAuthorizedAddresses: AddressConfig[] = [
        {
          address: '0x0170F42f224b99CcbbeE673093589c5f9691dd06',
          label: 'USDU Deployer #1',
          isConnected: false,
        },
        {
          address: '0x5f238e89F3ba043CF202E1831446cA8C5cd40846',
          label: 'Wrytes DAO',
          isConnected: false,
        },
        {
          address: '0x55cF8D1Dc56b15F6f637982d860E7aeb6DE86DcA',
          label: 'TradeVault DAO',
          isConnected: false,
        },
      ];

      // Add connected address if available
      const allAddresses = [...mockAuthorizedAddresses];
      if (connectedAddress && isConnected) {
        // Check if connected address is already in the list
        const existingIndex = allAddresses.findIndex(
          addr => addr.address.toLowerCase() === connectedAddress.toLowerCase()
        );

        if (existingIndex >= 0) {
          // Update existing entry
          allAddresses[existingIndex] = {
            ...allAddresses[existingIndex],
            isConnected: true,
          };
        } else {
          // Add connected address at the beginning
          allAddresses.unshift({
            address: connectedAddress,
            label: 'Connected Wallet',
            isConnected: true,
          });
        }
      }

      setAddresses(allAddresses);
      setIsLoading(false);
    };

    loadAddresses();
  }, [connectedAddress, isConnected]);

  return {
    addresses,
    connectedAddress,
    isLoading,
  };
};
