import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Star, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CoinPurchaseCard = ({ paquete, onSelect, isSelected, isLoading }) => {
  const { t } = useTranslation();

  const getCardStyles = () => {
    if (paquete.popular) {
      return "border-yellow-500 bg-gradient-to-br from-yellow-900/20 to-black ring-2 ring-yellow-500/50";
    }
    if (isSelected) {
      return "border-red-500 bg-gradient-to-br from-red-900/20 to-black ring-2 ring-red-500/50";
    }
    return "border-gray-700 bg-gradient-to-br from-gray-900/50 to-black hover:border-gray-600";
  };

  const getButtonStyles = () => {
    if (paquete.popular) {
      return "bg-yellow-600 hover:bg-yellow-700 text-black font-bold";
    }
    return "bg-red-600 hover:bg-red-700 text-white";
  };

  return (
    <Card className={`transition-all duration-300 cursor-pointer ${getCardStyles()}`}>
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-2">
          {paquete.popular && (
            <Badge className="bg-yellow-500 text-black font-bold mb-2">
              <Star className="h-3 w-3 mr-1" />
              {t('coins.most_popular')}
            </Badge>
          )}
        </div>
        
        <CardTitle className="text-xl font-bold text-white mb-2">
          {paquete.nombre}
        </CardTitle>
        
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Coins className="h-6 w-6 text-yellow-400" />
          <span className="text-3xl font-bold text-yellow-400">
            {paquete.monedas.toLocaleString()}
          </span>
        </div>

        <div className="text-gray-400 text-sm mb-4">
          {paquete.descripcion}
        </div>

        {paquete.descuento > 0 && (
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Badge variant="destructive" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              {paquete.descuento}% {t('coins.discount')}
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="text-center">
        <div className="mb-4">
          <div className="text-2xl font-bold text-white">
            ${paquete.precio.toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">
            {t('coins.per_coin')}: ${(paquete.precio / paquete.monedas).toFixed(3)}
          </div>
        </div>

        <Button
          className={`w-full ${getButtonStyles()}`}
          onClick={() => onSelect(paquete)}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{t('coins.processing')}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4" />
              <span>{t('coins.buy_now')}</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CoinPurchaseCard;
