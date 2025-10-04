import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Crown, Award, ShoppingBag, Coins, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { 
  obtenerInsigniasUsuario, 
  obtenerInsigniaEquipada, 
  equiparInsignia,
  desequiparInsignia,
  obtenerInsigniasDisponibles 
} from '@/services/insigniasService';
import { useBadgePurchase } from '@/hooks/useBadgePurchase';

const BadgeManager = ({ userId }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [userBadges, setUserBadges] = useState([]);
  const [equippedBadge, setEquippedBadge] = useState(null);
  const [availableBadges, setAvailableBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { loading: purchaseLoading, purchaseBadge } = useBadgePurchase();

  useEffect(() => {
    if (userId) {
      loadUserBadges();
      loadEquippedBadge();
      if (isSheetOpen) {
        loadAvailableBadges();
      }
    }
  }, [userId, isSheetOpen]);

  const loadUserBadges = async () => {
    try {
      const badges = await obtenerInsigniasUsuario(userId);
      setUserBadges(badges);
    } catch (error) {
      console.error('Error cargando insignias del usuario:', error);
    }
  };

  const loadEquippedBadge = async () => {
    try {
      const equipped = await obtenerInsigniaEquipada(userId);
      setEquippedBadge(equipped);
    } catch (error) {
      console.error('Error cargando insignia equipada:', error);
    }
  };

  const loadAvailableBadges = async () => {
    try {
      const badges = await obtenerInsigniasDisponibles();
      const userBadgeIds = userBadges.map(badge => badge.insignias_catalogo?.id);
      const available = badges.filter(badge => !userBadgeIds.includes(badge.id));
      setAvailableBadges(available);
    } catch (error) {
      console.error('Error cargando insignias disponibles:', error);
    }
  };

  const handleEquipBadge = async (badgeId) => {
    try {
      await equiparInsignia(userId, badgeId);
      await loadEquippedBadge();
      await loadUserBadges();
      
      const badge = userBadges.find(b => b.insignias_catalogo?.id === badgeId);
      toast({
        title: "Insignia equipada",
        description: `Has equipado la insignia ${badge.insignias_catalogo?.nombre}`,
      });
    } catch (error) {
      console.error('Error equipando insignia:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo equipar la insignia",
        variant: 'destructive'
      });
    }
  };

  const handleUnequipBadge = async () => {
    try {
      await desequiparInsignia(userId);
      await loadEquippedBadge();
      
      toast({
        title: "Insignia desequipada",
        description: "Has desequipado tu insignia actual",
      });
    } catch (error) {
      console.error('Error desequipando insignia:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo desequipar la insignia",
        variant: 'destructive'
      });
    }
  };

  const handlePurchaseBadge = async (badgeId) => {
    try {
      await purchaseBadge(userId, badgeId, [
        loadUserBadges,
        loadAvailableBadges
      ]);
    } catch (error) {
      // El error ya es manejado en el hook useBadgePurchase
      console.error('Error en compra de insignia:', error);
    }
  };

  const getBadgeRarityStyles = (rareza) => {
    switch (rareza) {
      case 'comun':
        return {
          badge: 'bg-gray-600 text-white',
          border: 'border-gray-600'
        };
      case 'rara':
        return {
          badge: 'bg-blue-600 text-white',
          border: 'border-blue-600'
        };
      case 'legendaria':
        return {
          badge: 'bg-yellow-600 text-black',
          border: 'border-yellow-600'
        };
      default:
        return {
          badge: 'bg-gray-600 text-white',
          border: 'border-gray-600'
        };
    }
  };

  const getBadgeRarityIcon = (rareza) => {
    switch (rareza) {
      case 'comun':
        return <Star className="h-3 w-3" />;
      case 'rara':
        return <Award className="h-3 w-3" />;
      case 'legendaria':
        return <Crown className="h-3 w-3" />;
      default:
        return <Star className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Insignia Equipada */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-400" />
            <span>Insignia Equipada</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {equippedBadge ? (
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-600">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">
                  {equippedBadge.insignias_catalogo?.icono || '🏆'}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-white">
                      {equippedBadge.insignias_catalogo?.nombre}
                    </h3>
                    <Badge className={getBadgeRarityStyles(equippedBadge.insignias_catalogo?.rareza).badge}>
                      {getBadgeRarityIcon(equippedBadge.insignias_catalogo?.rareza)}
                      <span className="ml-1 capitalize">
                        {equippedBadge.insignias_catalogo?.rareza}
                      </span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">
                    {equippedBadge.insignias_catalogo?.descripcion}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUnequipBadge}
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Desequipar
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tienes ninguna insignia equipada</p>
              <p className="text-sm mt-2">Compra y equipa insignias para mostrar tu estilo</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mis Insignias */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <Award className="h-5 w-5 text-blue-400" />
            <span>Mis Insignias</span>
          </CardTitle>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Comprar
              </Button>
            </SheetTrigger>
            <SheetContent className="w-96 bg-gray-900 border-gray-700">
              <SheetHeader>
                <SheetTitle className="text-white flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Tienda de Insignias</span>
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-6 max-h-96 overflow-y-auto">
                {availableBadges.map((badge) => (
                  <div key={badge.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{badge.icono}</span>
                        <div>
                          <h3 className="font-semibold text-white">{badge.nombre}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge className={getBadgeRarityStyles(badge.rareza).badge}>
                              {getBadgeRarityIcon(badge.rareza)}
                              <span className="ml-1 capitalize">{badge.rareza}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <Coins className="h-4 w-4" />
                          <span className="font-bold">{badge.precio.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{badge.descripcion}</p>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="sm"
                      disabled={purchaseLoading}
                      onClick={() => handlePurchaseBadge(badge.id)}
                    >
                      {purchaseLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Comprando...</span>
                        </div>
                      ) : (
                        <>
                          <Coins className="h-4 w-4 mr-2" />
                          Comprar por {badge.precio.toLocaleString()} monedas
                        </>
                      )}
                    </Button>
                  </div>
                ))}
                {availableBadges.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <span>Ya tienes todas las insignias disponibles</span>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </CardHeader>
        <CardContent>
          {userBadges.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tienes insignias compradas</p>
              <p className="text-sm mt-2">Compra tu primera insignia para empezar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
              {userBadges.map((userBadge) => {
                const badge = userBadge.insignias_catalogo;
                const isEquipped = userBadge.equipada;
                
                return (
                  <div 
                    key={userBadge.id}
                    className={`p-3 rounded-lg border ${
                      isEquipped 
                        ? 'bg-green-900/30 border-green-600' 
                        : 'bg-gray-800/50 border-gray-600'
                    } ${getBadgeRarityStyles(badge?.rareza).border}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{badge?.icono}</span>
                        <div className="flex flex-col">
                          <span className="font-medium text-white text-sm">{badge?.nombre}</span>
                          {isEquipped && (
                            <Badge className="bg-green-600 text-white text-xs">
                              Equipada
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Badge className={getBadgeRarityStyles(badge?.rareza).badge}>
                        {getBadgeRarityIcon(badge?.rareza)}
                      </Badge>
                    </div>
                    {!isEquipped && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                        onClick={() => handleEquipBadge(badge.id)}
                      >
                        Equipar
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgeManager;
