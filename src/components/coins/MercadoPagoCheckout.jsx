import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Shield, Zap, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

const MercadoPagoCheckout = ({ paquete, onSuccess, onError }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [mpLoaded, setMpLoaded] = useState(false);

  // Cargar SDK de MercadoPago
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      setMpLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://sdk.mercadopago.com/js/v2"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!mpLoaded) {
      toast({
        title: 'Error',
        description: 'SDK de MercadoPago no cargado',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Crear preferencia en el backend
      const apiUrl = import.meta.env.PROD 
        ? 'https://smashufc-nine.vercel.app/api/compras/crear-pago'
        : 'http://localhost:3001/api/compras/crear-pago';
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ paqueteId: paquete.id }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error creando pago');
      }

      // Redirigir directamente a MercadoPago Checkout Pro
      window.location.href = data.init_point;

      toast({
        title: 'Redirigiendo a MercadoPago',
        description: 'Serás redirigido para completar el pago',
      });

    } catch (error) {
      console.error('Error procesando pago:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error procesando el pago',
        variant: 'destructive'
      });
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800">
          {paquete.nombre}
        </CardTitle>
        {paquete.popular && (
          <Badge className="mx-auto bg-yellow-400 text-yellow-900">
            <Star className="w-3 h-3 mr-1" />
            Más Popular
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Precio */}
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600">
            ${paquete.precio}
          </div>
          <div className="text-lg text-gray-600">
            {paquete.monedas} Monedas
          </div>
          {paquete.descuento > 0 && (
            <div className="text-sm text-green-600 font-semibold">
              {paquete.descuento}% de descuento
            </div>
          )}
        </div>

        {/* Beneficios */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Zap className="w-4 h-4 mr-2 text-yellow-500" />
            Entrega instantánea
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Shield className="w-4 h-4 mr-2 text-green-500" />
            Pago 100% seguro
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CreditCard className="w-4 h-4 mr-2 text-blue-500" />
            Todas las tarjetas
          </div>
        </div>

        {/* Botón de pago */}
        <Button
          onClick={handlePayment}
          disabled={isLoading || !mpLoaded}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
        >
          {isLoading ? (
            'Procesando...'
          ) : !mpLoaded ? (
            'Cargando...'
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pagar con MercadoPago
            </>
          )}
        </Button>

        {/* Información adicional */}
        <div className="text-xs text-gray-500 text-center">
          <p>Procesado por MercadoPago</p>
          <p>Pago seguro y protegido</p>
        </div>

        {/* Container para checkout (opcional) */}
        <div id="checkout-container" className="hidden"></div>
      </CardContent>
    </Card>
  );
};

export default MercadoPagoCheckout;
