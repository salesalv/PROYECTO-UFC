import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Award, Zap, Star, Shield, Settings } from 'lucide-react';
import { obtenerInsigniasPerfil, equiparInsignia, obtenerMisInsignias } from '@/services/insigniasAPI';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import supabase from '@/db';

const UsuarioInsignia = ({ userId, esUsuarioActual = false, enPerfilPublico = true }) => {
  const [insigniaActual, setInsigniaActual] = useState(null);
  const [misInsignias, setMisInsignias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [configurando, setConfigurando] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    // Solo cargar insignias si hay un usuario autenticado
    if (userId || esUsuarioActual) {
      cargarInsignias();
    }
  }, [userId, esUsuarioActual]);

  const cargarInsignias = async () => {
    try {
      setCargando(true);
      
      if (esUsuarioActual) {
        // Cargar insignias propias con opción de cambio
        const insignias = await obtenerMisInsignias();
        setMisInsignias(insignias);
        
        // Obtener insignia equipada directamente de Supabase
        const { data: usuarioData } = await supabase
          .from('usuario')
          .select('insignia_actual')
          .eq('id', userId)
          .single();
        
        if (usuarioData?.insignia_actual) {
          // Buscar la insignia en el listado
          const insigniaEquipment = insignias.find(insignia => insignia.recompensa_id === usuarioData.insignia_actual);
          if (insigniaEquipment) {
            setInsigniaActual({ ...insigniaEquipment, equipada: true });
          }
        }
      } else {
        // Cargar insignia pública del perfil
        const datosPerfil = await obtenerInsigniasPerfil(userId);
        if (datosPerfil.insignia_actual) {
          setInsigniaActual(datosPerfil.insignia_actual);
        }
      }
    } catch (error) {
      console.error('Error cargando insignias:', error);
      toast({
        title: t('error.title'),
        description: error.message || 'Error cargando insignias',
        variant: 'destructive'
      });
    } finally {
      setCargando(false);
    }
  };

  const cambiarInsignia = async (insigniaId) => {
    try {
      await equiparInsignia(insigniaId);
      
      // Actualizar estado local
      setMisInsignias(prev => 
        prev.map(insignia => ({
          ...insignia,
          equipada: insignia.id === insigniaId
        }))
      );
      
      setInsigniaActual(misInsignias.find(i => i.id === insigniaId));
      
      toast({
        title: t('insignias.success.title'),
        description: t('insignias.success.equipped'),
      });
    } catch (error) {
      console.error('Error cambiando insignia:', error);
      toast({
        title: t('error.title'),
        description: error.message || t('error.equip_failed'),
        variant: 'destructive'
      });
    }
  };

  const getRarezaStyles = (rareza) => {
    switch (rareza) {
      case 'comun':
        return {
          border: 'border-gray-600',
          bg: 'bg-gray-800/50',
          text: 'text-gray-300',
          badge: 'bg-gray-600 text-white'
        };
      case 'rara':
        return {
          border: 'border-blue-500',
          bg: 'bg-blue-900/20',
          text: 'text-blue-300',
          badge: 'bg-blue-600 text-white'
        };
      case 'legendaria':
        return {
          border: 'border-yellow-500',
          bg: 'bg-yellow-900/20',
          text: 'text-yellow-300',
          badge: 'bg-yellow-600 text-black'
        };
      default:
        return {
          border: 'border-gray-600',
          bg: 'bg-gray-800/50',
          text: 'text-gray-300',
          badge: 'bg-gray-600 text-white'
        };
    }
  };

  const getRarezaIcon = (rareza) => {
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

  if (cargando) {
    return (
      <Card className="bg-gray-900/50 border-gray-700 mb-6">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-300">{t('loading')}</p>
        </CardContent>
      </Card>
    );
  }

  // Si es perfil público sin insignia
  if (enPerfilPublico && !insigniaActual) {
    return null;
  }

  // Si es usuario propio sin insignias
  if (esUsuarioActual && misInsignias.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-400" />
            <span>{t('insignias.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Shield className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            {t('insignias.no_badges')}
          </h3>
          <p className="text-gray-400 mb-4">
            {t('insignias.no_badges_description')}
          </p>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <a href="/recompensas">{t('insignias.get_badges')}</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-400" />
            <span>{t('insignias.title')}</span>
          </div>
          {esUsuarioActual && misInsignias.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfigurando(!configurando)}
              className="text-gray-400 hover:text-white"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Insignia Actual */}
        {insigniaActual && (
          <div className={`p-4 rounded-lg border-2 ${getRarezaStyles(insigniaActual.rareza).border} ${getRarezaStyles(insigniaActual.rareza).bg}`}>
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{insigniaActual.icono}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-bold text-white">{insigniaActual.nombre}</h3>
                  <Badge className={getRarezaStyles(insigniaActual.rareza).badge}>
                    {getRarezaIcon(insigniaActual.rareza)}
                    <span className="ml-1 capitalize">{insigniaActual.rareza}</span>
```

                  </Badge>
                  {esUsuarioActual && (
                    <Badge variant="secondary" className="bg-green-600 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      {t('insignias.equipped')}
                    </Badge>
                  )}
                </div>
                <p className={`text-sm ${getRarezaStyles(insigniaActual.rareza).text}`}>
                  {insigniaActual.descripcion}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {t('insignias.obtained')}: {new Date(insigniaActual.fecha_canje).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Selector de Insignias (solo para usuario actual) */}
        {esUsuarioActual && configurando && misInsignias.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-semibold">{t('insignias.change_badge')}</h4>
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {misInsignias.map((insignia) => (
                <div
                  key={insignia.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    insigniaActual?.id === insignia.id
                      ? `${getRarezaStyles(insignia.rareza).border} ${getRarezaStyles(insignia.rareza).bg}`
                      : 'border-gray-600 bg-gray-800/30 hover:bg-gray-800/50'
                  }`}
                  onClick={() => !insigniaActual || insigniaActual.id !== insignia.id ? cambiarInsignia(insignia.id) : null}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{insignia.icono}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-medium text-white text-sm">{insignia.nombre}</h5>
                        <Badge className={getRarezaStyles(insignia.rareza).badge} variant="secondary">
                          {insignia.rareza}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(insignia.fecha_canje).toLocaleDateString()}
                      </p>
                    </div>
                    {insigniaActual?.id === insignia.id && (
                      <Crown className="h-4 w-4 text-green-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón para obtener más insignias (solo usuario actual sin insignias) */}
        {esUsuarioActual && misInsignias.length === 0 && (
          <div className="text-center pt-4">
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <a href="/recompensas">{t('insignias.buy_more')}</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsuarioInsignia;
