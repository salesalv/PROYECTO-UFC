import React, { useState, useEffect } from 'react';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, CreditCard, Shield, Zap, Star } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useTranslation } from 'react-i18next';
import { crearPaymentIntent, obtenerPaquetesDisponibles } from '@/services/coinApiService';
import CoinPurchaseCard from '@/components/coins/CoinPurchaseCard';
import { useToast } from '@/components/ui/use-toast';

const CoinPurchasePage = () => {
  const { user, refreshUser } = useUser();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedPaquete, setSelectedPaquete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paquetes, setPaquetes] = useState([]);
  const [loadingPaquetes, setLoadingPaquetes] = useState(true);

  useEffect(() => {
    loadPaquetes();
  }, []);

  const loadPaquetes = async () => {
    try {
      console.log('🔄 Cargando paquetes...');
      setLoadingPaquetes(true);
      const response = await obtenerPaquetesDisponibles();
      console.log('📦 Respuesta de paquetes:', response);
      if (response.success) {
        setPaquetes(response.paquetes);
        console.log('✅ Paquetes cargados:', response.paquetes);
      }
    } catch (error) {
      console.error('❌ Error cargando paquetes:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los paquetes',
        variant: 'destructive'
      });
    } finally {
      setLoadingPaquetes(false);
    }
  };


  const handlePurchase = async (paquete) => {
    if (!user) {
      toast({
        title: t('error.title'),
        description: t('auth.login_required'),
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setSelectedPaquete(paquete);

    try {
      // Crear intención de pago usando el nuevo servicio
      const response = await crearPaymentIntent(paquete.id);
      
      if (!response.success) {
        throw new Error(response.error || 'Error creando pago');
      }

      // Redirigir a MercadoPago Checkout Pro
      toast({
        title: t('coins.purchase_initiated'),
        description: t('coins.redirecting_payment'),
      });

      // Redirigir a MercadoPago
      window.location.href = response.init_point;

    } catch (error) {
      console.error('Error iniciando compra:', error);
      toast({
        title: t('error.title'),
        description: t('error.purchase_failed'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
          <CardContent className="p-8 text-center">
            <Coins className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white mb-4">{t('coins.login_required')}</h2>
            <p className="text-gray-400 mb-6">{t('coins.login_message')}</p>
            <Button asChild className="w-full bg-red-600 hover:bg-red-700">
              <a href="/login">{t('auth.login')}</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Coins className="h-8 w-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">{t('coins.title')}</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('coins.subtitle')}
          </p>
        </div>

        {/* Current Balance */}
        <Card className="mb-8 bg-gradient-to-r from-gray-800 to-gray-900 border-yellow-500/70 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Coins className="h-8 w-8 text-yellow-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{t('coins.current_balance')}</h3>
                  <p className="text-gray-300">{t('coins.balance_description')}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-yellow-400">
                  {user.saldo?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-300">{t('coins.coins')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-900/20 to-black border-green-500/50">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">{t('coins.secure_payment')}</h3>
              <p className="text-gray-400 text-sm">{t('coins.secure_description')}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-900/20 to-black border-blue-500/50">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">{t('coins.instant_delivery')}</h3>
              <p className="text-gray-400 text-sm">{t('coins.instant_description')}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-900/20 to-black border-purple-500/50">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">{t('coins.best_value')}</h3>
              <p className="text-gray-400 text-sm">{t('coins.best_value_description')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Packages */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">{t('coins.choose_package')}</h2>
          {loadingPaquetes ? (
            <div className="text-center py-8">
              <div className="text-white">Cargando paquetes...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paquetes.map((paquete) => (
                <CoinPurchaseCard
                  key={paquete.id}
                  paquete={paquete}
                  onSelect={handlePurchase}
                  isSelected={selectedPaquete?.id === paquete.id}
                  isLoading={isLoading && selectedPaquete?.id === paquete.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Payment Info */}
        <Card className="mt-8 bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>{t('coins.payment_methods')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">{t('coins.accepted_methods')}</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>• {t('coins.credit_cards')}</li>
                  <li>• {t('coins.debit_cards')}</li>
                  <li>• {t('coins.bank_transfer')}</li>
                  <li>• {t('coins.digital_wallets')}</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">{t('coins.security_info')}</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>• {t('coins.ssl_encryption')}</li>
                  <li>• {t('coins.pci_compliant')}</li>
                  <li>• {t('coins.refund_policy')}</li>
                  <li>• {t('coins.customer_support')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default CoinPurchasePage;
