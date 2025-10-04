import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import supabase from '@/db';

const InsigniasDebugger = () => {
  const [debugInfo, setDebugInfo] = useState('');
  const [insignias, setInsignias] = useState([]);
  const [ultimaActualizacion, setUltimaActualizacion] = useState('');

  useEffect(() => {
    console.log('🚀 INSIGNIAS DEBUGGER INICIADO');
    
    const verificarInsignias = async () => {
      try {
        console.log('🔍 === INICIANDO VERIFICACIÓN ===');
        
        // Verificar tabla recompensas_usuario
        const { data: recompensasEncontradas, error: errorRecompensas } = await supabase
          .from('recompensas_usuario')
          .select('*')
          .eq('usuario_id', 235);
          
        console.log('🎖️ Recompensas encontradas:', recompensasEncontradas, 'Error:', errorRecompensas);

        // Verificar tabla recompensas_catalogo
        const { data: catalogoExistente, error: errorCatalogo } = await supabase
          .from('recompensas_catalogo')
          .select('*');
          
        console.log('📖 Catálogo encontrado:', catalogoExistente, 'Error:', errorCatalogo);

        // Buscar solo insignias
        const idsInsignias = recompensasEncontradas?.map(r => r.recompensa_id) || [];
        console.log('🔍 IDs de insignias a buscar:', idsInsignias);

        const { data: insigniasDetalles, error: errorInsignias } = await supabase
          .from('recompensas_catalogo')
          .select('*')
          .in('id', idsInsignias);
          
        console.log('🏆 Detalles de insignias:', insigniasDetalles, 'Error:', errorInsignias);

        const timestamp = new Date().toLocaleTimeString();
        setUltimaActualizacion(timestamp);

        if (insigniasDetalles) {
          setInsignias(insigniasDetalles);
          setDebugInfo(`✅ Encontradas ${insigniasDetalles.length} insignias a las ${timestamp}`);
          console.log('✅ SUCCESS - Insignias cargadas:', insigniasDetalles);
        } else {
          setDebugInfo(`❌ Sin insignias a las ${timestamp}`);
          setInsignias([]);
        }

      } catch (error) {
        console.error('💥 ERROR COMPLETO:', error);
        setDebugInfo(`💥 Error: ${error.message}`);
      }
    };

    verificarInsignias();
  }, []);

  return (
    <Card className="bg-gray-900/50 border-gray-700 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Award className="h-5 w-5 text-yellow-400" />
          <span>🔬 Debugger de Insignias</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-2 bg-blue-800/50 text-white text-sm rounded">
          📡 Estado: {debugInfo}
        </div>
        
        {ultimaActualizacion && (
          <div className="text-xs text-gray-400">
            🕐 Última actualización: {ultimaActualizacion}
          </div>
        )}

        {insignias.length > 0 ? (
          <div className="space-y-2">
            <div className="text-green-400 font-semibold">
              ✅ Encontradas {insignias.length} insignias:
            </div>
            {insignias.map(insignia => (
              <div key={insignia.id} className="p-2 bg-gray-800/30 rounded text-sm">
                <div className="font-semibold text-white">{insignia.nombre}</div>
                <div className="text-gray-300">ID: {insignia.id}</div>
                <div className="text-gray-300">Categoría: {insignia.categoria}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-yellow-400">
            ⚪ Sin insignias encontradas
          </div>
        )}

        <div className="mt-4 p-2 bg-purple-800/50 text-white text-xs rounded">
          🔧 Este debugger ejecuta en tiempo real para verificar datos
        </div>
      </CardContent>
    </Card>
  );
};

export default InsigniasDebugger;
