import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Calendar, Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const UserRewardsList = ({ userRewards, isLoading }) => {
  const { t } = useTranslation();

  const formatDate = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRarityBadge = (rareza) => {
    switch (rareza) {
      case 'comun':
        return <Badge className="bg-gray-600 text-white text-xs">Común</Badge>;
      case 'rara':
        return <Badge className="bg-blue-600 text-white text-xs">Rara</Badge>;
      case 'legendaria':
        return <Badge className="bg-yellow-600 text-black text-xs">Legendaria</Badge>;
      default:
        return <Badge className="bg-gray-600 text-white text-xs">Común</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Crown className="h-5 w-5" />
            <span>{t('rewards.my_rewards')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg animate-pulse">
                <div className="h-8 w-8 bg-gray-600 rounded"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-600 rounded w-3/4 mb-1"></div>
                  <div className="h-2 bg-gray-600 rounded w-1/2"></div>
                </div>
                <div className="h-3 bg-gray-600 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Crown className="h-5 w-5" />
          <span>{t('rewards.my_rewards')}</span>
          <Badge variant="secondary" className="ml-auto">
            {userRewards.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {userRewards.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Crown className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('rewards.no_rewards')}</p>
            <p className="text-sm mt-2">{t('rewards.start_collecting')}</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {userRewards.map((reward) => (
              <div
                key={reward.id}
                className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
              >
                <div className="text-2xl">
                  {reward.recompensa?.icono || '🎁'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-white truncate">
                      {reward.recompensa?.nombre || 'Recompensa'}
                    </span>
                    {getRarityBadge(reward.recompensa?.rareza)}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(reward.fecha_canje)}</span>
                    <Coins className="h-3 w-3 ml-2" />
                    <span>{reward.precio_pagado} monedas</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRewardsList;
