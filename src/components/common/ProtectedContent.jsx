import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRecompensas } from '@/hooks/useRecompensas';
import { useUser } from '@/context/UserContext';

const ProtectedContent = ({ children }) => {
  const { user } = useUser();
  const { tieneAccesoClipsDestacados, loading } = useRecompensas(user?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!tieneAccesoClipsDestacados) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-gradient-to-br from-gray-900/50 to-black border-purple-500/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-purple-500/20 rounded-full w-fit">
              <Lock className="h-12 w-12 text-purple-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Contenido Premium
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-300">
              Este contenido es exclusivo para usuarios premium. 
              Desbloquea el acceso para disfrutar de clips destacados.
            </p>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Crown className="h-5 w-5 text-purple-400" />
                <span className="text-white font-semibold">Acceso a Clips Destacados</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Coins className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">500 monedas</span>
              </div>
            </div>

            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
              <Link to="/badges">
                <Crown className="h-4 w-4 mr-2" />
                Desbloquear Acceso
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
};

export default ProtectedContent;
