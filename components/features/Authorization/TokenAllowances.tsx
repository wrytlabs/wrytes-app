import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faArrowUp,
  faArrowDown,
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';
import Card from '@/components/ui/Card';
import { OperationKind } from '@/hooks/authorization';

interface TokenAllowancesProps {
  selectedAddress?: string;
  isOwnAddress: boolean;
  selectedOperation?: OperationKind;
  onOperationSelect: (operation: OperationKind) => void;
}

interface AllowanceInfo {
  operation: OperationKind;
  operationName: string;
  icon: any;
  color: string;
}

export const TokenAllowances: React.FC<TokenAllowancesProps> = ({
  selectedAddress,
  isOwnAddress,
  selectedOperation,
  onOperationSelect
}) => {
  // Operation definitions with descriptions
  const getAllowances = (): AllowanceInfo[] => {
    return [
      {
        operation: OperationKind.TRANSFER,
        operationName: 'Transfer',
        icon: faArrowUp,
        color: 'text-green-400',
      },
      {
        operation: OperationKind.DEPOSIT,
        operationName: 'Deposit',
        icon: faArrowDown,
        color: 'text-blue-400',
      },
      {
        operation: OperationKind.PROCESS,
        operationName: 'Process',
        icon: faExchangeAlt,
        color: 'text-purple-400',
      },
      {
        operation: OperationKind.CLAIM,
        operationName: 'Claim',
        icon: faCoins,
        color: 'text-orange-400',
      },
    ];
  };

  const allowances = getAllowances();

  const getOperationDescription = (operation: OperationKind): string => {
    switch (operation) {
      case OperationKind.TRANSFER:
        return "Send tokens from selected account to another address";
      case OperationKind.DEPOSIT:
        return "Deposit tokens into processor";
      case OperationKind.PROCESS:
        return "Internal transfers within the processor";
      case OperationKind.CLAIM:
        return "Withdraw funds from the processor";
      default:
        return "";
    }
  };

  return (
    <Card>
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Operation Allowances</h3>
          <p className="text-text-secondary text-sm">
            Click on an operation to select it for authorization signing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allowances.map((allowance) => (
            <div
              key={allowance.operation}
              onClick={() => onOperationSelect(allowance.operation)}
              className={`
                p-4 bg-dark-surface border rounded-lg cursor-pointer transition-all duration-200
                ${selectedOperation === allowance.operation
                  ? 'border-accent-orange bg-accent-orange/10'
                  : 'border-gray-600 hover:border-accent-orange/50 hover:bg-accent-orange/5'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center ${allowance.color} flex-shrink-0`}>
                  <FontAwesomeIcon icon={allowance.icon} className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm mb-1">{allowance.operationName}</p>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {getOperationDescription(allowance.operation)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isOwnAddress && (
          <div className="p-3 bg-green-500/10 border border-gray-600 rounded-lg">
            <p className="text-green-400 text-sm">
              ✓ You have full access to all operations with your connected wallet
            </p>
          </div>
        )}

        {!isOwnAddress && (
          <div className="p-3 bg-blue-500/10 border border-gray-600 rounded-lg">
            <p className="text-blue-400 text-sm">
              ℹ️ These are the approved allowances for the selected contract address
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};