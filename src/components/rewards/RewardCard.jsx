import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Crown, Star, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const RewardCard = ({ recompensa, onRedeem, isOwned, isLoading, userBalance }) => {
  const { t } = useTranslation();

  const getRarityStyles = () => {
    switch (recompensa.rareza) {
      case 'comun':
        return {
          border: 'border-gray-600',
          background: 'bg-gradient-to-br from-gray-800/50 to-black',
          badge: 'bg-gray-600 text-white',
          icon: 'text-gray-400'
        };
      case 'rara':
        return {
          border: 'border-blue-500',
          background: 'bg-gradient-to-br from-blue-900/20 to-black',
          badge: 'bg-blue-600 text-white',
          icon: 'text-blue-400'
        };
      case 'legendaria':
        return {
          border: 'border-yellow-500',
          background: 'bg-gradient-to-br from-yellow-900/20 to-black',
          badge: 'bg-yellow-600 text-black',
          icon: 'text-yellow-400'
        };
      default:
        return {
          border: 'border-gray-600',
          background: 'bg-gradient-to-br from-gray-800/50 to-black',
          badge: 'bg-gray-600 text-white',
          icon: 'text-gray-400'
        };
    }
  };

  const getRarityIcon = () => {
    switch (recompensa.rareza) {
      case 'comun':
        return <Star className="h-3 w-3" />;
      case 'rara':
        return <Zap className="h-3 w-3" />;
      case 'legendaria':
        return <Crown className="h-3 w-3" />;
      default:
        return <Star className="h-3 w-3" />;
    }
  };

  const getRarityText = () => {
    switch (recompensa.rareza) {
      case 'comun':
        return t('rewards.common');
      case 'rara':
        return t('rewards.rare');
      case 'legendaria':
        return t('rewards.legendary');
      default:
        return t('rewards.common');
    }
  };

  const styles = getRarityStyles();
  const canAfford = userBalance >= recompensa.precio;
  const isDisabled = isOwned || !canAfford || isLoading;

  return (
    <Card className={`transition-all duration-300 ${styles.border} ${styles.background} hover:scale-105`}>
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-2">
          <Badge className={`${styles.badge} text-xs font-bold`}>
            {getRarityIcon()}
            <span className="ml-1">{getRarityText()}</span>
          </Badge>
          {recompensa.limitada && (
            <Badge variant="destructive" className="ml-2 text-xs">
              <Crown className="h-3 w-3 mr-1" />
              {t('rewards.limited')}
            </Badge>
          )}
        </div>
        
        <div className="text-6xl mb-4">
          {recompensa.icono}
        </div>
        
        <CardTitle className="text-xl font-bold text-white mb-2">
          {recompensa.nombre}
        </CardTitle>
        
        <div className="text-gray-200 text-sm mb-4">
          {recompensa.descripcion}
        </div>

        <div className="flex items-center justify-center space-x-2 mb-3">
          <Coins className="h-5 w-5 text-yellow-400" />
          <span className="text-2xl font-bold text-yellow-400">
            {recompensa.precio.toLocaleString()}
          </span>
        </div>
      </CardHeader>

      <CardContent className="text-center">
        {recompensa.contenido && (
          <div className="mb-4 text-left">
            <h4 className="text-sm font-semibold text-white mb-2">{t('rewards.includes')}:</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              {recompensa.contenido.map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recompensa.beneficios && (
          <div className="mb-4 text-left">
            <h4 className="text-sm font-semibold text-white mb-2">{t('rewards.benefits')}:</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              {recompensa.beneficios.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          className={`w-full ${
            isOwned 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : canAfford 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
          onClick={() => onRedeem(recompensa)}
          disabled={isDisabled}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{t('rewards.processing')}</span>
            </div>
          ) : isOwned ? (
            <div className="flex items-center space-x-2">
              <Crown className="h-4 w-4" />
              <span>{recompensa.tipo === 'badge' ? 'Insignia Obtenida' : t('rewards.owned')}</span>
            </div>
          ) : !canAfford ? (
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4" />
              <span>{t('rewards.insufficient_coins')}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4" />
              <span>{recompensa.tipo === 'badge' ? 'Comprar Insignia' : t('rewards.redeem')}</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RewardCard;
