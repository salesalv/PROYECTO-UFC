import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Coins, CheckCircle, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AccesoClipsDestacadosCard = ({ 
  userId, 
  tieneAcceso, 
  loading, 
  onComprarAcceso,
  saldoUsuario 
}) => {
  const { toast } = useToast();
  const precio = 500;

  const handleComprar = async () => {
    try {
      await onComprarAcceso(precio);
      toast({
        title: "🎉 ¡Acceso desbloqueado!",
        description: "Ahora puedes acceder a clips destacados exclusivos",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo comprar el acceso",
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className={`bg-gradient-to-br from-gray-900/50 to-black border-2 transition-all duration-300 ${
      tieneAcceso 
        ? 'border-green-500 shadow-green-500/20' 
        : 'border-purple-500 shadow-purple-500/20'
    }`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <PlayCircle className="h-6 w-6 text-purple-400" />
          <span>Acceso a Clips Destacados</span>
          {tieneAcceso && (
            <Badge className="bg-green-500 text-white text-xs animate-pulse">
              <CheckCircle className="h-3 w-3 mr-1" />
              Desbloqueado
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="text-4xl flex-shrink-0">
              {tieneAcceso ? '🎬' : '🔒'}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg mb-2">
                {tieneAcceso ? 'Acceso Premium Desbloqueado' : 'Contenido Exclusivo'}
              </h3>
              <p className="text-gray-300 mb-3">
                {tieneAcceso 
                  ? 'Disfruta de clips destacados exclusivos y contenido premium'
                  : 'Desbloquea acceso a clips destacados exclusivos y contenido premium'
                }
              </p>
              
              {!tieneAcceso && (
                <div className="flex items-center space-x-2 mb-4">
                  <Coins className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">
                    Precio: {precio.toLocaleString()} monedas
                  </span>
                </div>
              )}
            </div>
          </div>

          {!tieneAcceso && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Saldo disponible: {saldoUsuario?.toLocaleString() || 0} monedas
              </div>
              <Button
                onClick={handleComprar}
                disabled={loading || (saldoUsuario || 0) < precio}
                className={`${
                  (saldoUsuario || 0) >= precio
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-600 cursor-not-allowed'
                } text-white`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Comprando...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Desbloquear Acceso
                  </>
                )}
              </Button>
            </div>
          )}

          {tieneAcceso && (
            <div className="text-center py-4">
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">¡Acceso activo!</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Puedes acceder a clips destacados desde el menú principal
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccesoClipsDestacadosCard;
