import React from 'react';
import { Coins } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useTranslation } from 'react-i18next';

const CoinBalance = ({ showLabel = true, size = 'default', variant = 'default' }) => {
  const { user } = useUser();
  const { t } = useTranslation();

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-xl';
      case 'xl':
        return 'text-2xl';
      default:
        return 'text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'bg-gradient-to-r from-yellow-900/20 to-black border-yellow-500/50 p-4 rounded-lg';
      case 'badge':
        return 'bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full';
      case 'minimal':
        return 'text-yellow-400';
      default:
        return 'text-yellow-400';
    }
  };

  const balance = user?.saldo || 0;

  return (
    <div className={`flex items-center space-x-2 ${getVariantClasses()}`}>
      <Coins className={`${size === 'small' ? 'h-4 w-4' : size === 'large' ? 'h-6 w-6' : size === 'xl' ? 'h-8 w-8' : 'h-5 w-5'} text-yellow-400`} />
      <div className={getSizeClasses()}>
        <span className="font-bold">{balance.toLocaleString()}</span>
        {showLabel && (
          <span className="text-gray-400 ml-1">{t('coins.coins')}</span>
        )}
      </div>
    </div>
  );
};

export default CoinBalance;
