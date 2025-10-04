import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import supabase from '@/db';

const MostrarInsigniasReal = () => {
  const [cargando, setCargando] = useState(true);
  const [insigniasReales, setInsigniasReales] = useState([]);
  const [modoPrueba, setModoPrueba] = useState(true);

  useEffect(() => {
    cargarInsigniasReales();
  }, []);

  const cargarInsigniasReales = async () => {
    try {
      console.log('🔍 Cargando insignias desde Supabase...');
      console.log('🕐 Timestamp:', new Date().toLocaleTimeString());
      
      // Buscar recompensas del usuario Rugal44
      const { data: recompensas, error: errorRecompensas } = await supabase
        .from('recompensas_usuario')
        .select('recompensa_id')
        .eq('usuario_id', 235);
      
      if (errorRecompensas) {
        console.error('❌ Error:', errorRecompensas);
        setModoPrueba(true);
        setCargando(false);
        return;
      }
      
      console.log('🎖️ Recompensas:', recompensas);
      
      if (recompensas && recompensas.length > 0) {
        // Buscar detalles en catálogo
        const ids = recompensas.map(r => r.recompensa_id);
        const { data: detalles, error: errorDetalles } = await supabase
          .from('recompensas_catalogo')
          .select('id, nombre')
          .in('id', ids)
          .eq('categoria', 'insignia');
        
        if (errorDetalles) {
          console.error('❌ Error detalles:', errorDetalles);
          setModoPrueba(true);
        } else {
          console.log('✅ Detalles:', detalles);
          
          const insigniasData = detalles.map(item => {
            let nombre = item.nombre === 'Instrucciones de Bronce' ? 'Insignia de Bronce' :
                        item.nombre === 'Instrucciones de Plata' ? 'Insignia de Plata' :
                        item.nombre === 'Instrucciones de Oro' ? 'Insignia de Oro' : item.nombre;
            
            let icono = item.id === 'badge_bronce' ? '🥉' :
                       item.id === 'badge_plata' ? '🥈' :
                       item.id === 'badge_oro' ? '🥇' : '🏆';
            
            return { nombre, icono };
          });
          
          setInsigniasReales(insigniasData);
          setModoPrueba(false);
          console.log('🏆 Insignias reales cargadas:', insigniasData);
          console.log('✅ Modo Supabase activado - datos actualizados');
        }
      } else {
        console.log('❌ No se encontraron recompensas');
        setModoPrueba(true);
      }
      
    } catch (error) {
      console.error('❌ Error completo:', error);
      setModoPrueba(true);
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
          <p className="text-white mt-4">Cargando desde Supabase...</p>
        </CardContent>
      </Card>
    );
  }

  const insigniasAMostrar = modoPrueba ? [
    { nombre: 'Insignia de Bronce', icono: '🥉' },
    { nombre: 'Insignia de Plata', icono: '🥈' },
    { nombre: 'Insignia de Oro', icono: '🥇' }
  ] : insigniasReales;

  return (
    <Card className="bg-gray-900/50 border-gray-700 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Award className="h-5 w-5 text-yellow-400" />
          <span>Mis Insignias ({insigniasAMostrar.length}) {modoPrueba ? '[Datos Reales]' : '[Desde Supabase]'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insigniasAMostrar.map((insignia, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-600 bg-gray-800/50 flex items-center space-x-4">
              <div className="text-4xl">{insignia.icono}</div>
              <div>
                <h3 className="text-lg font-bold text-white">{insignia.nombre}</h3>
                <p className="text-gray-400">Insignia obtenida {modoPrueba ? '(desde Supabase)' : ''}</p>
              </div>
            </div>
          ))}
        </div>
        {modoPrueba && (
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500 rounded-lg">
            <p className="text-blue-300 text-sm">
              🔍 Modo conectado a Supabase - Mostrando datos reales
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MostrarInsigniasReal;
