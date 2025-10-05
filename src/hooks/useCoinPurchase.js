import { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { crearPaymentIntent, simularPago } from '@/services/coinApiService';
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
      // Crear intención de pago usando el backend API
      const response = await crearPaymentIntent(paquete.id);
      
      if (!response.success) {
        throw new Error(response.error || 'Error creando pago');
      }
      
      // En desarrollo, usar simulación de pago
      if (process.env.NODE_ENV === 'development') {
        toast({
          title: t('coins.purchase_initiated'),
          description: t('coins.processing_payment'),
        });

        // Simular el proceso de pago
        setTimeout(async () => {
          try {
            // Simular pago usando el endpoint de testing
            await simularPago(response.preference_id);
            
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
      } else {
        // En producción, redirigir a MercadoPago
        toast({
          title: t('coins.purchase_initiated'),
          description: t('coins.redirecting_payment'),
        });
        
        // Redirigir a MercadoPago Checkout Pro
        window.location.href = response.init_point;
      }

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
      // En este caso, el pago ya fue procesado por el webhook
      // Solo refrescamos los datos del usuario
      await refreshUser();
      
      toast({
        title: t('coins.purchase_success'),
        description: t('coins.coins_added', { coins: paquete.monedas }),
      });
      
      return true;
    } catch (error) {
      console.error('Error refrescando datos:', error);
      toast({
        title: t('error.title'),
        description: t('error.refresh_failed'),
        variant: 'destructive'
      });
      return false;
    }
  }, [toast, t, refreshUser]);

  return {
    purchaseCoins,
    handlePaymentSuccess,
    isLoading,
    selectedPaquete,
    isAuthenticated: !!user
  };
};
