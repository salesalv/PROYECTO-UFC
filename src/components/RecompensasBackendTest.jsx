import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Zap, Gift } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  obtenerCatalogoRecompensas,
  canjearRecompensa,
  obtenerRecompensasUsuario,
  obtenerEstadisticasRecompensas,
  usuarioTieneRecompensa
} from '@/services/recompensasAPI';

const RecompensasBackendTest = () => {
  const [catalogo, setCatalogo] = useState(null);
  const [recompensasUsuario, setRecompensasUsuario] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [testingResults, setTestingResults] = useState([]);
  const { toast } = useToast();

  const logResult = (test, success, message, data = null) => {
    const result = {
      id: Date.now(),
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestingResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const testObtenerCatalogo = async () => {
    try {
      setCargando(true);
      const resultado = await obtenerCatalogoRecompensas();
      setCatalogo(resultado);
      logResult('Obtener Catálogo', true, `Se obtuvieron ${resultado.length} recompensas`, resultado);
      toast({
        title: "✅ Éxito",
        description: `Catálogo obtenido: ${resultado.length} recompensas`
      });
    } catch (error) {
      logResult('Obtener Catálogo', false, error.message);
      toast({
        title: "❌ Error",
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setCargando(false);
    }
  };

  const testCanjearRecompensa = async () => {
    try {
      setCargando(true);
      // Intentar canjear la insignia de bronce
      const resultado = await canjearRecompensa('badge_bronce');
      logResult('Canjear Recompensa', true, `${resultado.mensaje} - Nuevo saldo: ${resultado.nuevoSaldo}`);
      toast({
        title: "✅ Éxito",
        description: resultado.mensaje
      });
    } catch (error) {
      logResult('Canjear Recompensa', false, error.message);
      toast({
        title: "❌ Error",
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setCargando(false);
    }
  };

  const testObtenerRecompensasUsuario = async () => {
    try {
      setCargando(true);
      const resultado = await obtenerRecompensasUsuario();
      setRecompensasUsuario(resultado);
      logResult('Obtener Recompensas Usuario', true, `Usuario tiene ${resultado.length} recompensas`);
      toast({
        title: "✅ Éxito",
        description: `Usuario tiene ${resultado.length} recompensas`
      });
    } catch (error) {
      logResult('Obtener Recompensas Usuario', false, error.message);
      toast({
        title: "❌ Error",
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setCargando(false);
    }
  };

  const testEstadisticas = async () => {
    try {
      setCargando(true);
      const resultado = await obtenerEstadisticasRecompensas();
      setEstadisticas(resultado);
      logResult('Obtener Estadísticas', true, `Total recompensas: ${resultado.totalRecompensas}`, resultado);
      toast({
        title: "✅ Éxito",
        description: `Estadísticas obtenidas - Total: ${resultado.totalRecompensas} recompensas`
      });
    } catch (error) {
      logResult('Obtener Estadísticas', false, error.message);
      toast({
        title: "❌ Error",
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setCargando(false);
    }
  };

  const testVerificarTieneRecompensa = async () => {
    try {
      setCargando(true);
      const tieneBronce = await usuarioTieneRecompensa('badge_bronce');
      logResult('Verificar Tiene Recompensa', true, `Tiene insignia de bronce: ${tieneBronce ? 'Sí' : 'No'}`);
      toast({
        title: "✅ Éxito",
        description: `Tiene insignia de bronce: ${tieneBronce ? 'Sí' : 'No'}`
      });
    } catch (error) {
      logResult('Verificar Tiene Recompensa', false, error.message);
      toast({
        title: "❌ Error",
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setCargando(false);
    }
  };

  const limpiarLogs = () => {
    setTestingResults([]);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Crown className="h-6 w-6 text-yellow-400" />
            <span>Test de Backend - Sistema de Recompensas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Botones de prueba */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button 
              onClick={testObtenerCatalogo} 
              disabled={cargando}
              className="bg-blue-600 hover:bg-blue-700"
            >
              📋 Catálogo
            </Button>
            <Button 
              onClick={testCanjearRecompensa} 
              disabled={cargando}
              className="bg-green-600 hover:bg-green-700"
            >
              🛒 Canjear
            </Button>
            <Button 
              onClick={testObtenerRecompensasUsuario} 
              disabled={cargando}
              className="bg-purple-600 hover:bg-purple-700"
            >
              👤 Mis Recompensas
            </Button>
            <Button 
              onClick={testEstadisticas} 
              disabled={cargando}
              className="bg-orange-600 hover:bg-orange-700"
            >
              📊 Estadísticas
            </Button>
            <Button 
              onClick={testVerificarTieneRecompensa} 
              disabled={cargando}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              🔍 Verificar
            </Button>
            <Button 
              onClick={limpiarLogs} 
              disabled={cargando}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              🧹 Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados de las pruebas */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Resultados de las Pruebases</CardTitle>
        </CardHeader>
        <CardContent>
          {testingResults.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              Ejecuta alguna prueba para ver los resultados aquí
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {testingResults.map((result) => (
                <div 
                  key={result.id}
                  className={`p-3 rounded-lg border ${
                    result.success 
                      ? 'bg-green-900/20 border-green-600/50 text-green-300' 
                      : 'bg-red-900/20 border-red-600/50 text-red-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">
                        {rarity === 'common' ? '🥉' : rarity === 'rare' ? '🥈' : rarity === 'legendary' ? '👑' : '🥉'}
                        {result.test}
                      </p>
                      <p className="text-sm">{result.message}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {result.timestamp}
                    </Badge>
                  </div>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer">Ver datos</summary>
                      <pre className="text-xs mt-1 overflow-auto max-h-20 bg-black/20 p-2 rounded">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información del catálogo */}
      {catalogo && (
        <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              📋 Catálogo Obtenido ({catalogo.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalogo.slice(0, 6).map((recompensa) => (
                <div key={recompensa.id} className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{recompensa.icono}</span>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{recompensa.nombre}</h4>
                      <p className="text-gray-400 text-xs">{recompensa.precio} monedas</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Badge className={`text-xs ${
                      recompensa.rareza === 'comun' ? 'bg-gray-600' :
                      recompensa.rareza === 'rara' ? 'bg-blue-600' :
                      'bg-yellow-600'
                    }`}>
                      {recompensa.rareza}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {recompensa.categoria}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas */}
      {estadisticas && (
        <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">📊 Estadísticas Obtenidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-900/20 rounded-lg">
                <Crown className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-400">{estadisticas.totalRecompensas}</p>
                <p className="text-sm text-gray-400">Total Recompensas</p>
              </div>
              <div className="text-center p-4 bg-green-900/20 rounded-lg">
                <Star className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-400">{estadisticas.totalGastado}</p>
                <p className="text-sm text-gray-400">Total Gastado</p>
              </div>
              <div className="text-center p-4 bg-purple-900/20 rounded-lg">
                <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-400">{Math.round(estadisticas.promedioPorRecompensa)}</p>
                <p className="text-sm text-gray-400">Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado de carga */}
      {cargando && (
        <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Procesando solicitud...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecompensasBackendTest;
