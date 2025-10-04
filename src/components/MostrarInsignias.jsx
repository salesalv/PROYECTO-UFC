import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';

const MostrarInsignias = () => {
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Simular carga
    setTimeout(() => {
      console.log('🔍 Cargando insignias de prueba...');
      setCargando(false);
    }, 1000);
  }, []);

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
          <p className="text-white mt-4">Cargando insignias...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Award className="h-5 w-5 text-yellow-400" />
          <span>Mis Insignias (3)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-4 rounded-lg border border-gray-600 bg-gray-800/50 flex items-center space-x-4">
            <div className="text-4xl">🥉</div>
            <div>
              <h3 className="text-lg font-bold text-white">Insignia de Bronce</h3>
              <p className="text-gray-400">Insignia obtenida</p>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border border-gray-600 bg-gray-800/50 flex items-center space-x-4">
            <div className="text-4xl">🥈</div>
            <div>
              <h3 className="text-lg font-bold text-white">Insignia de Plata</h3>
              <p className="text-gray-400">Insignia obtenida</p>
            </div>
          </div>
      
          <div className="p-4 rounded-lg border border-gray-600 bg-gray-800/50 flex items-center space-x-4">
            <div className="text-4xl">🥇</div>
            <div>
              <h3 className="text-lg font-bold text-white">Insignia de Oro</h3>
              <p className="text-gray-400">Insignia obtenida</p>
            </div>
          </div>
                        
        </div>
      </CardContent>
    </Card>
  );
};

export default MostrarInsignias;