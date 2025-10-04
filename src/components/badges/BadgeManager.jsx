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
import { useUser } from '@/context/UserContext';
import { useBadgeEvents } from '@/context/BadgeEventContext';

const BadgeManager = ({ userId }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { refreshUser } = useUser();
  const { triggerBadgeUpdate } = useBadgeEvents();
  
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

  // Refrescar insignias cuando cambian las props del user
  useEffect(() => {
    if (userId) {
      loadUserBadges();
      loadEquippedBadge();
    }
  }, [userId]);

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
      // Buscar la insignia antes de equiparla para obtener el nombre
      const userBadge = userBadges.find(b => b.insignias_catalogo?.id === badgeId);
      
      await equiparInsignia(userId, badgeId);
      await loadEquippedBadge();
      await loadUserBadges();
      
      // Refrescar el contexto del usuario para actualizar otras interfaces
      if (refreshUser) {
        refreshUser();
      }
      
      // Disparar evento de actualización de insignias
      triggerBadgeUpdate();
      
      toast({
        title: "✨ Insignia equipada",
        description: `Has equipado la insignia ${userBadge?.insignias_catalogo?.nombre}`,
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
      
      // Refrescar el contexto del usuario para actualizar otras interfaces
      if (refreshUser) {
        refreshUser();
      }
      
      // Disparar evento de actualización de insignias
      triggerBadgeUpdate();
      
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
            <div className="group relative p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/20 rounded-xl border-2 border-green-500 shadow-lg">
              {/* Efecto de brillo animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-green-500/10 rounded-xl opacity-50 animate-pulse"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl transform transition-transform group-hover:scale-110 animate-glow">
                      {equippedBadge.insignias_catalogo?.icono || '🏆'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-white text-lg">
                          {equippedBadge.insignias_catalogo?.nombre}
                        </h3>
                        <Badge className="bg-green-500 text-white text-xs animate-pulse shadow-lg">
                          <Crown className="h-3 w-3 mr-1" />
                          <span>Equipada</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        {equippedBadge.insignias_catalogo?.descripcion}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getBadgeRarityStyles(equippedBadge.insignias_catalogo?.rareza).badge} text-xs`}>
                          {getBadgeRarityIcon(equippedBadge.insignias_catalogo?.rareza)}
                          <span className="ml-1 capitalize">
                            {equippedBadge.insignias_catalogo?.rareza}
                          </span>
                        </Badge>
                        <span className="text-xs text-yellow-400">
                          Comprada por {equippedBadge.precio_pagado} monedas
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUnequipBadge}
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-lg"
                  >
                    <Crown className="h-4 w-4 mr-1" />
                    Desequipar
                  </Button>
                </div>
              </div>
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
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {userBadges.map((userBadge) => {
                const badge = userBadge.insignias_catalogo;
                const isEquipped = userBadge.equipada;
                
                return (
                  <div 
                    key={`${userBadge.id}-${badge?.id}`}
                    className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      isEquipped 
                        ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/20 border-green-500 shadow-green-500/20' 
                        : 'bg-gradient-to-r from-gray-800/50 to-gray-800/30 border-gray-600 hover:border-gray-500'
                    } ${getBadgeRarityStyles(badge?.rareza).border}`}
                  >
                    {/* Efecto de brillo para insignias equipadas */}
                    {isEquipped && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-green-500/10 rounded-xl opacity-50 animate-pulse"></div>
                    )}
                    
                    <div className="relative z-10">
                      {/* Header de la insignia */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`text-3xl transform transition-transform group-hover:scale-110 ${isEquipped ? 'animate-glow' : ''}`}>
                            {badge?.icono}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white text-sm leading-tight truncate">{badge?.nombre}</h3>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{badge?.descripcion}</p>
                          </div>
                        </div>
                        
                        {/* Indicador de rareza */}
                        <Badge className={`${getBadgeRarityStyles(badge?.rareza).badge} text-xs px-2 py-1 flex-shrink-0`}>
                          {getBadgeRarityIcon(badge?.rareza)}
                          <span className="ml-1 capitalize">{badge?.rareza}</span>
                        </Badge>
                      </div>

                      {/* Badge de equipada */}
                      {isEquipped && (
                        <div className="mb-3">
                          <Badge className="bg-green-500 text-white text-xs px-2 py-1 animate-pulse shadow-lg">
                            <span className="flex items-center space-x-1">
                              <Crown className="h-3 w-3" />
                              <span>Equipada</span>
                            </span>
                          </Badge>
                        </div>
                      )}

                      {/* Información de compra */}
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <span>Comprada: {new Date(userBadge.fecha_compra).toLocaleDateString('es-ES')}</span>
                        <div className="flex items-center space-x-1">
                          <Coins className="h-3 w-3 text-yellow-400" />
                          <span className="text-yellow-400 font-medium">{userBadge.precio_pagado}</span>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex space-x-2">
                        {isEquipped ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-xs"
                            onClick={handleUnequipBadge}
                          >
                            <Crown className="h-3 w-3 mr-1" />
                            Desequipar
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs transition-all duration-300 hover:shadow-lg"
                            onClick={() => handleEquipBadge(badge.id)}
                          >
                            <Crown className="h-3 w-3 mr-1" />
                            Equipar
                          </Button>
                        )}
                      </div>
                    </div>
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
