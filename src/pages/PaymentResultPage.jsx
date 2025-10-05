import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const status = searchParams.get('status') || 'pending';
  const paymentId = searchParams.get('payment_id');
  const preferenceId = searchParams.get('preference_id');

  useEffect(() => {
    // Determinar el estado del pago basado en la URL
    switch (status) {
      case 'approved':
        setPaymentStatus('success');
        break;
      case 'rejected':
        setPaymentStatus('failure');
        break;
      case 'pending':
      default:
        setPaymentStatus('pending');
        break;
    }

    // Mostrar toast según el estado
    if (status === 'approved') {
      toast({
        title: '¡Pago Exitoso!',
        description: 'Las monedas han sido agregadas a tu cuenta',
      });
    } else if (status === 'rejected') {
      toast({
        title: 'Pago Rechazado',
        description: 'El pago no pudo ser procesado',
        variant: 'destructive'
      });
    }
  }, [status, toast]);

  const handleGoBack = () => {
    navigate('/comprar-monedas');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const renderSuccessContent = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="w-16 h-16 text-green-500" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          ¡Pago Exitoso!
        </h2>
        <p className="text-gray-600">
          Tu pago ha sido procesado correctamente
        </p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">
          ¿Qué sigue?
        </h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Las monedas han sido agregadas a tu cuenta</li>
          <li>• Puedes usar las monedas inmediatamente</li>
          <li>• Recibirás un email de confirmación</li>
        </ul>
      </div>

      <div className="flex gap-3 justify-center">
        <Button onClick={handleGoBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Compras
        </Button>
        <Button onClick={handleGoHome}>
          Ir al Inicio
        </Button>
      </div>
    </div>
  );

  const renderFailureContent = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <XCircle className="w-16 h-16 text-red-500" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Pago Rechazado
        </h2>
        <p className="text-gray-600">
          No se pudo procesar tu pago
        </p>
      </div>

      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="font-semibold text-red-800 mb-2">
          Posibles causas:
        </h3>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• Fondos insuficientes</li>
          <li>• Tarjeta bloqueada</li>
          <li>• Datos incorrectos</li>
          <li>• Problemas de conectividad</li>
        </ul>
      </div>

      <div className="flex gap-3 justify-center">
        <Button onClick={handleGoBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Intentar Nuevamente
        </Button>
        <Button onClick={handleGoHome}>
          Ir al Inicio
        </Button>
      </div>
    </div>
  );

  const renderPendingContent = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <Clock className="w-16 h-16 text-yellow-500" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-yellow-600 mb-2">
          Pago Pendiente
        </h2>
        <p className="text-gray-600">
          Tu pago está siendo procesado
        </p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">
          ¿Qué significa esto?
        </h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Tu pago está siendo verificado</li>
          <li>• Puede tomar unos minutos</li>
          <li>• Recibirás una notificación cuando se complete</li>
          <li>• Las monedas se agregarán automáticamente</li>
        </ul>
      </div>

      <div className="flex gap-3 justify-center">
        <Button onClick={handleGoBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Compras
        </Button>
        <Button onClick={handleGoHome}>
          Ir al Inicio
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            Estado del Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paymentStatus === 'success' && renderSuccessContent()}
          {paymentStatus === 'failure' && renderFailureContent()}
          {paymentStatus === 'pending' && renderPendingContent()}
          
          {/* Información técnica (solo en desarrollo) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-3 bg-gray-100 rounded text-xs">
              <p><strong>Status:</strong> {status}</p>
              {paymentId && <p><strong>Payment ID:</strong> {paymentId}</p>}
              {preferenceId && <p><strong>Preference ID:</strong> {preferenceId}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentResultPage;
