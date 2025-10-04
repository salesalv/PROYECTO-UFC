import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Award, ShoppingBag, Coins, Star, Zap } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { useBadgePurchase } from '@/hooks/useBadgePurchase';
import { useRecompensas } from '@/hooks/useRecompensas';
import AccesoClipsDestacadosCard from '@/components/recompensas/AccesoClipsDestacadosCard';
import { 
  obtenerInsigniasDisponibles, 
  obtenerInsigniasUsuario
} from '@/services/insigniasService';

const BadgesShopPage = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { loading: purchaseLoading, purchaseBadge } = useBadgePurchase();
  const { 
    tieneAccesoClipsDestacados, 
    loading: recompensasLoading, 
    comprarAccesoClips 
  } = useRecompensas(user?.id);

  const [badges, setBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
    }, [user?.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [badgesData, userBadgesData] = await Promise.all([
        obtenerInsigniasDisponibles(),
        obtenerInsigniasUsuario(user.id)
      ]);

      setBadges(badgesData);
      setUserBadges(userBadgesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de la tienda",
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (badgeId) => {
    try {
      await purchaseBadge(user.id, badgeId, [loadData]);
    } catch (error) {
      console.error('Error comprando insignia:', error);
    }
  };

  const getUserBadgeIds = () => {
    return userBadges.map(userBadge => userBadge.insignia_id);
  };

  const getRarityStyles = (rareza) => {
    switch (rareza) {
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

  const getRarityIcon = (rareza) => {
    switch (rareza) {
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

  const getUserOwnedBadgeIds = () => {
    return userBadges.map(badge => badge.insignia_id);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
          <CardContent className="p-8 text-center">
            <Crown className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white mb-4">Inscríbete para acceder</h2>
            <p className="text-gray-400 mb-6">Necesitas estar registrado para acceder a la tienda de insignias</p>
            <Button asChild className="w-full bg-red-600 hover:bg-red-700">
              <a href="/login">Iniciar Sesión</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ownedBadgeIds = getUserOwnedBadgeIds();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Crown className="h-8 w-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">Canjear Recompensas</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Colecciona insignias exclusivas y desbloquea contenido premium
          </p>
        </div>

        {/* Current Balance */}
        <Card className="mb-8 bg-gradient-to-r from-gray-800 to-gray-900 border-yellow-500/70 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Coins className="h-8 w-8 text-yellow-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Tu Saldo Actual</h3>
                  <p className="text-gray-300">Monedas disponibles para comprar insignias</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-yellow-400">
                  {user.saldo?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-300">monedas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recompensas Premium */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <Star className="h-6 w-6 text-purple-400" />
            <span>Recompensas Premium</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AccesoClipsDestacadosCard
              userId={user?.id}
              tieneAcceso={tieneAccesoClipsDestacados}
              loading={recompensasLoading}
              onComprarAcceso={comprarAccesoClips}
              saldoUsuario={user?.saldo}
            />
            {/* Aquí se pueden agregar más recompensas en el futuro */}
          </div>
        </div>

        {/* Badges Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Insignias Disponibles ({badges.length})
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-16 bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {badges.map((badge) => {
                const isOwned = ownedBadgeIds.includes(badge.id);
                const styles = getRarityStyles(badge.rareza);
                const canAfford = user.saldo >= badge.precio;

                return (
                  <Card 
                    key={badge.id} 
                    className={`transition-all duration-300 ${styles.border} ${styles.background} hover:scale-105`}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className="flex justify-center mb-2">
                        <Badge className={`${styles.badge} text-xs font-bold`}>
                          {getRarityIcon(badge.rareza)}
                          <span className="ml-1 capitalize">{badge.rareza}</span>
                        </Badge>
                        {badge.limitada && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            <Crown className="h-3 w-3 mr-1" />
                            Limitada
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-6xl mb-4">
                        {badge.icono}
                      </div>
                      
                      <CardTitle className="text-xl font-bold text-white mb-2">
                        {badge.nombre}
                      </CardTitle>
                      
                      <div className="text-gray-200 text-sm mb-4">
                        {badge.descripcion}
                      </div>

                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <Coins className="h-5 w-5 text-yellow-400" />
                        <span className="text-2xl font-bold text-yellow-400">
                          {badge.precio.toLocaleString()}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="text-center">
                      <Button
                        className={`w-full ${
                          isOwned 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : !canAfford 
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                        onClick={() => handlePurchase(badge.id)}
                        disabled={isOwned || !canAfford || purchaseLoading}
                      >
                        {purchaseLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Procesando...</span>
                          </div>
                        ) : isOwned ? (
                          <div className="flex items-center space-x-2">
                            <Award className="h-4 w-4" />
                            <span>Ya poseída</span>
                          </div>
                        ) : !canAfford ? (
                          <div className="flex items-center space-x-2">
                            <Coins className="h-4 w-4" />
                            <span>Saldo insuficiente</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <ShoppingBag className="h-4 w-4" />
                            <span>Comprar</span>
                          </div>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BadgesShopPage;
