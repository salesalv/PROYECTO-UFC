import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import supabase from '@/db';

const MostrarInsignias = () => {
  const [insigniasGuardadas, setInsigniasGuardadas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    buscarInsignias();
  }, []);

  const buscarInsignias = async () => {
    try {
      console.log('🔍 Buscando insignias directamente...');
      
      // Buscar recompensas de Rugal44 (ID 235)
      const { data: recompensas, error } = await supabase
        .from('recompensas_usuario')
        .select('recompensa_id')
        .eq('usuario_id', 235);

      if (error) {
        console.error('❌ Error:', error);
        return;
      }

      console.log('🎖️ Recompensas encontradas:', recompensas);

      if (recompensas && recompensas.length > 0) {
        // Buscar detalles en el catálogo
        const ids = recompensas.map(r => r.recompensa_id);
        const { data: detalles, error: errorDetalles } = await supabase
          .from('recompensas_catalogo')
          .select('id, nombre')
          .in('id', ids)
          .eq('categoria', 'insignia');

        if (errorDetalles) {
          console.error('❌ Error detalles:', errorDetalles);
          return;
        }

        console.log('✅ Detalles encontrados:', detalles);

        // Crear lista simple de insignias
        const insigniasLista = detalles.map((item, index) => ({
          id: index + 1,
          nombre: item.nombre === 'Instrucciones de Bronce' ? 'Bronce' :
                 item.nombre === 'Instrucciones de Plata' ? 'Plata' :
                 item.nombre === 'Instrucciones de Oro' ? 'Oro' : item.nombre,
          icono: item.id === 'badge_bronce' ? '🥉' :
                item.id === 'badge_plata' ? '🥈' :
                item.id === 'badge_oro' ? '🥇' : '🏆'
        }));

        setInsigniasGuardadas(insigniasLista);
        console.log('🏆 Insignias procesadas:', insigniasLista);
      }

    } catch (error) {
      console.error('❌ Error completo:', error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <Card className="bg-gray-900/50 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-400" />
            <span>Insignias</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-white mt-4">Cargando...</p>
        </CardContent>
      </Card>
    );
  }

  if (insigniasGuardadas.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-400" />
            <span>Insignias</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <h3 className="text-lg font-semibold text-white mb-2">No tienes insignias aún</h3>
          <p className="text-gray-400 mb-4">¡Comienza a coleccionar insignias!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Award className="h-5 w-5 text-yellow-400" />
          <span>Mis Insignias ({insigniasGuardadas.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insigniasGuardadas.map((insignia) => (
            <div
              key={insignia.id}
              className="p-4 rounded-lg border border-gray-600 bg-gray-800/50 flex items-center space-x-4"
            >
              <div className="text-4xl">{insignia.icono}</div>
              <div>
                <h3 className="text-lg font-bold text-white">{insignia.nombre}</h3>
                <p className="text-gray-400">Insignia obtenida</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MostrarInsignias;
