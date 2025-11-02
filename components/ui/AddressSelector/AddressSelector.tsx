import React from 'react';
import { AddressSelectorProps } from './types';

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  selectedAddress,
  onChange,
  addresses,
  title = "Address",
  disabled = false,
  error,
  className = "",
  placeholder = "Select an address"
}) => {
  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="block text-text-secondary text-sm font-medium">
          {title}
        </label>
      </div>

      {/* Select */}
      <div className="relative">
        <select
          value={selectedAddress}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full bg-dark-surface border rounded-lg px-4 py-3 
            text-white 
            focus:outline-none transition-colors
            ${error 
              ? 'border-red-400 focus:border-red-400' 
              : 'border-gray-600 focus:border-accent-orange'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {addresses.map((addressConfig) => (
            <option key={addressConfig.address} value={addressConfig.address}>
              {addressConfig.label ? 
                `${addressConfig.label} (${formatAddress(addressConfig.address)})` :
                formatAddress(addressConfig.address)
              }
              {addressConfig.isConnected ? ' 🟢' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Address Info */}
      {selectedAddress && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">
            Full address: {selectedAddress}
          </span>
          {(() => {
            const addressConfig = addresses.find(a => a.address === selectedAddress);
            return addressConfig?.isConnected ? (
              <span className="text-green-400">Connected Wallet</span>
            ) : (
              <span className="text-text-secondary">Authorized Address</span>
            );
          })()}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};