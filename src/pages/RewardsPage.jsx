import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Zap, Gift, Filter } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useTranslation } from 'react-i18next';
import { 
  RECOMPENSAS_CATALOGO, 
  canjearRecompensa, 
  obtenerRecompensasUsuario,
  obtenerEstadisticasRecompensas 
} from '@/services/rewardsService';
import RewardCard from '@/components/rewards/RewardCard';
import UserRewardsList from '@/components/rewards/UserRewardsList';
import { useToast } from '@/components/ui/use-toast';

const RewardsPage = () => {
  const { user, refreshUser } = useUser();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userRewards, setUserRewards] = useState([]);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [statistics, setStatistics] = useState({
    totalRecompensas: 0,
    totalGastado: 0,
    promedioPorRecompensa: 0
  });

  const categories = [
    { id: 'all', name: t('rewards.all_categories'), icon: Gift },
    { id: 'insignias', name: t('rewards.badges'), icon: Crown },
    { id: 'contenido', name: t('rewards.content'), icon: Star }
  ];

  useEffect(() => {
    if (user?.id) {
      loadUserRewards();
      loadStatistics();
    }
  }, [user?.id]);

  const loadUserRewards = async () => {
    try {
      setLoadingRewards(true);
      const rewards = await obtenerRecompensasUsuario(user.id);
      setUserRewards(rewards);
    } catch (error) {
      console.error('Error cargando recompensas:', error);
      toast({
        title: t('error.title'),
        description: t('error.loading_rewards'),
        variant: 'destructive'
      });
    } finally {
      setLoadingRewards(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await obtenerEstadisticasRecompensas(user.id);
      setStatistics(stats);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleRedeem = async (recompensa) => {
    if (!user) {
      toast({
        title: t('error.title'),
        description: t('auth.login_required'),
        variant: 'destructive'
      });
      return;
    }

    setIsRedeeming(true);

    try {
      const result = await canjearRecompensa(user.id, recompensa.id);
      
      toast({
        title: t('rewards.redeem_success'),
        description: t('rewards.reward_added', { name: recompensa.nombre }),
      });

      // Refrescar datos del usuario y recompensas
      refreshUser();
      loadUserRewards();
      loadStatistics();

    } catch (error) {
      console.error('Error canjeando recompensa:', error);
      toast({
        title: t('error.title'),
        description: error.message || t('error.redeem_failed'),
        variant: 'destructive'
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const getFilteredRewards = () => {
    if (selectedCategory === 'all') {
      return RECOMPENSAS_CATALOGO;
    }
    return RECOMPENSAS_CATALOGO.filter(recompensa => recompensa.categoria === selectedCategory);
  };

  const getUserOwnedRewardIds = () => {
    return userRewards.map(reward => reward.recompensa_id);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
          <CardContent className="p-8 text-center">
            <Crown className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white mb-4">{t('rewards.login_required')}</h2>
            <p className="text-gray-400 mb-6">{t('rewards.login_message')}</p>
            <Button asChild className="w-full bg-red-600 hover:bg-red-700">
              <a href="/login">{t('auth.login')}</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ownedRewardIds = getUserOwnedRewardIds();
  const filteredRewards = getFilteredRewards();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Crown className="h-8 w-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">{t('rewards.title')}</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('rewards.subtitle')}
          </p>
        </div>

        {/* Current Balance */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-900/20 to-black border-yellow-500/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="h-8 w-8 text-yellow-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{t('rewards.current_balance')}</h3>
                  <p className="text-gray-400">{t('rewards.balance_description')}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-yellow-400">
                  {user.saldo?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-400">{t('coins.coins')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-900/20 to-black border-blue-500/50">
            <CardContent className="p-6 text-center">
              <Crown className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">{t('rewards.total_rewards')}</h3>
              <p className="text-2xl font-bold text-blue-400">{statistics.totalRecompensas}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-900/20 to-black border-green-500/50">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">{t('rewards.total_spent')}</h3>
              <p className="text-2xl font-bold text-green-400">{statistics.totalGastado.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-900/20 to-black border-purple-500/50">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">{t('rewards.average_per_reward')}</h3>
              <p className="text-2xl font-bold text-purple-400">{Math.round(statistics.promedioPorRecompensa)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Filter */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>{t('rewards.categories')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        selectedCategory === category.id 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <category.icon className="h-4 w-4 mr-2" />
                      {category.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Rewards */}
            <UserRewardsList 
              userRewards={userRewards} 
              isLoading={loadingRewards}
            />
          </div>

          {/* Rewards Grid */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-white mb-6">
              {selectedCategory === 'all' 
                ? t('rewards.all_rewards') 
                : categories.find(c => c.id === selectedCategory)?.name
              }
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRewards.map((recompensa) => (
                <RewardCard
                  key={recompensa.id}
                  recompensa={recompensa}
                  onRedeem={handleRedeem}
                  isOwned={ownedRewardIds.includes(recompensa.id)}
                  isLoading={isRedeeming}
                  userBalance={user.saldo || 0}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
