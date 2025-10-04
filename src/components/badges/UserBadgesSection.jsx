import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, Gift, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/context/UserContext';

const UserBadgesSection = ({ userId }) => {
  const { refreshUser } = useUser();
  const { toast } = useToast();
  const [insignias, setInsignias] = useState([]);
  const [insigniaEquipada, setInsigniaEquipada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [equipando, setEquipando] = useState(false);

  useEffect(() => {
    if (userId) {
      loadBadges();
      loadEquippedBadge();
    }
  }, [userId]);

  const loadBadges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/recompensas/usuario/insignias', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setInsignias(data.insignias);
      }
    } catch (error) {
      console.error('Error cargando insignias:', error);
    }
  };

  const loadEquippedBadge = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/recompensas/usuario/insignia-equipada', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setInsigniaEquipada(data.insigniaEquipada);
      }
    } catch (error) {
      console.error('Error cargando insignia equipada:', error);
    } 
  };

  const handleEquipBadge = async (recompensaId, nombreInsignia) => {
    setEquipando(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/recompensas/equipar-insignia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ recompensaId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setInsigniaEquipada(data.insigniaEquipada);
        toast({
          title: '¡Insignia equipada!',
          description: `${nombreInsignia} ahora es tu insignia activa`,
        });
      } else {
        throw new Error(data.error || 'Error al equipar insignia');
      }
    } catch (error) {
      console.error('Error equipando insignia:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al equipar insignia',
        variant: 'destructive'
      });
    } finally {
      setEquipando(false);
    }
  };

  const handleUnequipBadge = async () => {
    setEquipando(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/recompensas/desequipar-insignia', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setInsigniaEquipada(null);
        toast({
          title: 'Insignia desequipada',
          description: 'Ya no tienes ninguna insignia equipada',
        });
      } else {
        throw new Error(data.error || 'Error al desequipar insignia');
      }
    } catch (error) {
      console.error('Error desequipando insignia:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al desequipar insignia',
        variant: 'destructive'
      });
    } finally {
      setEquipando(false);
    }
  };

  const getRarityColor = (rareza) => {
    switch (rareza) {
      case 'comun': return 'bg-gray-600 text-white';
      case 'rara': return 'bg-purple-600 text-white';
      case 'legendaria': return 'bg-orange-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getRarityLabel = (rareza) => {
    switch (rareza) {
      case 'comun': return 'Común';
      case 'rara': return 'Rara';
      case 'legendaria': return 'Legendaria';
      default: return 'Común';
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
        <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-400" />
                <span>Mis Insignias</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="text-gray-400 mt-2">Cargando insignias...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insignias.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-400" />
            <span>Mis Insignias</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Gift className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No tienes insignias</h3>
            <p className="text-gray-400 mb-4">
              Visita la tienda de recompensas para adquirir insignias especiales
            </p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <a href="/recompensas">Ver Recompensas</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Insignia Equipada Actualmente */}
      {insigniaEquipada && (
        <Card className="mb-6 bg-gradient-to-r from-yellow-900/20 to-yellow-800/10 border-yellow-500/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Insignia Equipada</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-yellow-900/20 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{insigniaEquipada.recompensa?.icono}</div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {insigniaEquipada.recompensa?.nombre}
                  </h3>
                  <Badge className={getRarityColor(insigniaEquipada.recompensa?.rareza)}>
                    {getRarityLabel(insigniaEquipada.recompensa?.rareza)}
                  </Badge>
                  <p className="text-gray-300 text-sm mt-1">
                    Equipada el {new Date(insigniaEquipada.fecha_equipado).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={handleUnequipBadge}
                disabled={equipando}
              >
                {equipando ? 'Desequipando...' : 'Desequipar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Colección de Insignias */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-400" />
            <span>Mi Colección de Insignias</span>
            <Badge variant="outline" className="ml-2 text-gray-300 border-gray-500">
              {insignias.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insignias.map((insignia) => (
              <div 
                key={insignia.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  insigniaEquipada?.recompensa_id === insignia.recompensa_id
                    ? 'border-yellow-500 bg-yellow-900/20'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{insignia.recompensa?.icono}</div>
                  <h4 className="font-bold text-white mb-2">{insignia.recompensa?.nombre}</h4>
                  
                  <Badge className={`mb-3 ${getRarityColor(insignia.recompensa?.rareza)}`}>
                    {getRarityLabel(insignia.recompensa?.rareza)}
                  </Badge>
                  
                  <div className="text-xs text-gray-400 mb-3">
                    Obtenida: {new Date(insignia.fecha_canje).toLocaleDateString()}
                  </div>
                  
                  {insigniaEquipada?.recompensa_id === insignia.recompensa_id ? (
                    <Button 
                      variant="outline" 
                      className="w-full border-yellow-500 text-yellow-500"
                      disabled
                    >
                      Equipada
                    </ Button>
                  ) : (
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => handleEquipBadge(insignia.recompensa_id, insignia.recompensa?.nombre)}
                      disabled={equipando}
                    >
                      {equipando ? 'Equipando...' : 'Equipar'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default UserBadgesSection;
