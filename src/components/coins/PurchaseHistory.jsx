import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  History, 
  Coins, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  XCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { obtenerHistorialCompras } from '@/services/coinApiService';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

const PurchaseHistory = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadHistorial();
  }, []);

  const loadHistorial = async () => {
    try {
      setLoading(true);
      const response = await obtenerHistorialCompras();
      
      if (response.success) {
        setCompras(response.compras || []);
      } else {
        throw new Error(response.error || 'Error cargando historial');
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el historial de compras',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (compraId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(compraId)) {
      newExpanded.delete(compraId);
    } else {
      newExpanded.add(compraId);
    }
    setExpandedItems(newExpanded);
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'completado':
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completado
          </Badge>
        );
      case 'pendiente':
        return (
          <Badge className="bg-yellow-600 hover:bg-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      case 'rechazado':
        return (
          <Badge className="bg-red-600 hover:bg-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Rechazado
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-600 hover:bg-gray-700">
            {estado}
          </Badge>
        );
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(precio);
  };

  const displayedCompras = showAll ? compras : compras.slice(0, 5);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-5 w-5 animate-spin text-yellow-400" />
            <span className="text-white">Cargando historial...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compras.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <History className="h-5 w-5 text-yellow-400" />
            <span>Historial de Compras</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <History className="h-16 w-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-lg font-semibold text-white mb-2">No hay compras registradas</h3>
          <p className="text-gray-400 mb-4">
            Cuando realices tu primera compra de monedas, aparecerá aquí.
          </p>
          <Button 
            onClick={loadHistorial}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <History className="h-5 w-5 text-yellow-400" />
            <span>Historial de Compras</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-yellow-500 text-yellow-400">
              {compras.length} compras
            </Badge>
            <Button 
              onClick={loadHistorial}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {displayedCompras.map((compra) => {
            const isExpanded = expandedItems.has(compra.id);
            
            return (
              <div
                key={compra.id}
                className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Coins className="h-5 w-5 text-yellow-400" />
                      <div>
                        <h4 className="text-white font-semibold">
                          {compra.paquete?.nombre || `Paquete ${compra.paquete_id}`}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {compra.monedas} monedas • {formatPrecio(compra.precio)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getEstadoBadge(compra.estado)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(compra.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">Fecha:</span>
                          <span className="text-white">{formatFecha(compra.fecha)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">ID de Pago:</span>
                          <span className="text-white font-mono text-xs">
                            {compra.payment_id}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {compra.procesado_at && (
                          <div className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-gray-300">Procesado:</span>
                            <span className="text-white">{formatFecha(compra.procesado_at)}</span>
                          </div>
                        )}
                        
                        {compra.paquete?.descuento > 0 && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Badge className="bg-green-600 text-xs">
                              {compra.paquete.descuento}% descuento
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {compras.length > 5 && (
          <div className="mt-6 text-center">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Ver menos
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Ver todas ({compras.length})
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PurchaseHistory;
