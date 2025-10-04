import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Award, Zap, Star, Shield, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const InsigniaPerfilSimplet = ({ usuario }) => {
  const [insigniaData, setInsigniaData] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Simular datos de insignia básicos si el usuario viene con insignia_actual
    if (usuario?.insignia_actual) {
      // Mapear IDs a datos básicos de insignias
      const insigniaBase = obtenerDatosInsignia(usuario.insignia_actual);
      if (insigniaBase) {
        setInsigniaData(insigniaBase);
      }
    }
  }, [usuario]);

  const obtenerDatosInsignia = (insigniaId) => {
    const insigniasCatalog = {
      'badge_bronce': {
        id: 'badge_bronce',
        nombre: 'Insignia de Bronce',
        icono: '🥉',
        rareza: 'comun',
        descripcion: 'Insignia básica de bronce para tu perfil'
      },
      'badge_plata': {
        id: 'badge_plata',
        nombre: 'Insignia de Plata',
        icono: '🥈',
        rareza: 'comun',
        descripcion: 'Insignia elegante de plata para tu perfil'
      },
      'badge_oro': {
        id: 'badge_oro',
        nombre: 'Insignia de Oro',
        icono: '🥇',
        rareza: 'comun',
        descripcion: 'Insignia premium de oro para tu perfil'
      },
      'badge_cinturon': {
        id: 'badge_cinturon',
        nombre: 'Cinturón de Campeón',
        icono: '🏆',
        rareza: 'rara',
        descripcion: 'Insignia especial del cinturón de campeón'
      },
      'badge_guantes': {
        id: 'badge_guantes',
        nombre: 'Guantes de Guerrero',
        icono: '🥊',
        rareza: 'rara',
        descripcion: 'Insignia especial de guantes de pelea'
      },
      'badge_fuego': {
        id: 'badge_fuego',
        nombre: 'Llama del Combate',
        icono: '🔥',
        rareza: 'rara',
        descripcion: 'Insignia especial con efectos de fuego'
      },
      'badge_aguila': {
        id: 'badge_aguila',
        nombre: 'Águila Dominante',
        icono: '🦅',
        rareza: 'rara',
        descripcion: 'Insignia especial del águila dominante'
      },
      'badge_campeon_octubre_2026': {
        id: 'badge_campeon_octubre_2026',
        nombre: 'Campeón Octubre 2026',
        icono: '👑',
        rareza: 'legendaria',
        descripcion: 'Insignia exclusiva de temporada - Campeón de Octubre 2026'
      }
    };

    return insigniasCatalog[insigniaId];
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

  // Si no tiene insignia, mostrar mensaje de sin insignias
  if (!insigniaData) {
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
        <CardTitle className="text-white flex items-center space-x-2">
          <Award className="h-5 w-5 text-yellow-400" />
          <span>{t('insignias.title')}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Insignia Actual */}
        <div className={`p-4 rounded-lg border-2 ${getRarezaStyles(insigniaData.rareza).border} ${getRarezaStyles(insigniaData.rareza).bg}`}>
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{insigniaData.icono}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-bold text-white">{insigniaData.nombre}</h3>
                <Badge className={getRarezaStyles(insigniaData.rareza).badge}>
                  {getRarezaIcon(insigniaData.rareza)}
                  <span className="ml-1 capitalize">{insigniaData.rareza}</span>
                </Badge>
              </div>
              <p className={`text-sm ${getRarezaStyles(insigniaData.rareza).text}`}>
                {insigniaData.descripcion}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsigniaPerfilSimplet;
