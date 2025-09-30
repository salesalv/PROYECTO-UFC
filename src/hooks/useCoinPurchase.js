import { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { crearPreferenciaMercadoPago, procesarPagoExitoso } from '@/services/coinService';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

export const useCoinPurchase = () => {
  const { user, refreshUser } = useUser();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaquete, setSelectedPaquete] = useState(null);

  const purchaseCoins = useCallback(async (paquete) => {
    if (!user) {
      toast({
        title: t('error.title'),
        description: t('auth.login_required'),
        variant: 'destructive'
      });
      return false;
    }

    setIsLoading(true);
    setSelectedPaquete(paquete);

    try {
      // Crear preferencia de MercadoPago
      const preferencia = await crearPreferenciaMercadoPago(paquete, user.id);
      
      // En un entorno real, aquí redirigirías a MercadoPago
      // window.location.href = preferencia.init_point;
      
      // Por ahora, simulamos el proceso
      toast({
        title: t('coins.purchase_initiated'),
        description: t('coins.redirecting_payment'),
      });

      // Simular redirección a MercadoPago (en desarrollo)
      setTimeout(async () => {
        try {
          // Simular pago exitoso
          await procesarPagoExitoso(`payment_${Date.now()}`, user.id, paquete);
          
          toast({
            title: t('coins.purchase_success'),
            description: t('coins.coins_added', { coins: paquete.monedas }),
          });
          
          // Refrescar datos del usuario
          refreshUser();
          
          return true;
        } catch (error) {
          console.error('Error procesando pago:', error);
          toast({
            title: t('error.title'),
            description: t('error.purchase_failed'),
            variant: 'destructive'
          });
          return false;
        } finally {
          setSelectedPaquete(null);
        }
      }, 2000);

      return true;
    } catch (error) {
      console.error('Error iniciando compra:', error);
      toast({
        title: t('error.title'),
        description: t('error.purchase_failed'),
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast, t, refreshUser]);

  const handlePaymentSuccess = useCallback(async (paymentId, paquete) => {
    try {
      await procesarPagoExitoso(paymentId, user.id, paquete);
      
      toast({
        title: t('coins.purchase_success'),
        description: t('coins.coins_added', { coins: paquete.monedas }),
      });
      
      refreshUser();
      return true;
    } catch (error) {
      console.error('Error procesando pago exitoso:', error);
      toast({
        title: t('error.title'),
        description: t('error.purchase_failed'),
        variant: 'destructive'
      });
      return false;
    }
  }, [user, toast, t, refreshUser]);

  return {
    purchaseCoins,
    handlePaymentSuccess,
    isLoading,
    selectedPaquete,
    isAuthenticated: !!user
  };
};
