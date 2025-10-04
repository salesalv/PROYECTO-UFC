import { useState, useCallback, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import * as coinApi from '@/services/coinApiService';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

export const useCoinApi = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [saldo, setSaldo] = useState(0);
  const [paquetes, setPaquetes] = useState([]);
  const [transacciones, setTransacciones] = useState([]);
  const [compras, setCompras] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Obtener saldo del usuario
  const cargarSaldo = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await coinApi.obtenerSaldoUsuario();
      if (response.success) {
        setSaldo(response.saldo);
      }
    } catch (error) {
      console.error('Error cargando saldo:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Obtener paquetes disponibles
  const cargarPaquetes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await coinApi.obtenerPaquetesDisponibles();
      if (response.success) {
        setPaquetes(response.paquetes);
      }
    } catch (error) {
      console.error('Error cargando paquetes:', error);
      toast({
        title: t('error.title'),
        description: t('error.loading_packages'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  // Obtener historial de transacciones
  const cargarTransacciones = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await coinApi.obtenerHistorialTransacciones();
      if (response.success) {
        setTransacciones(response.transacciones);
      }
    } catch (error) {
      console.error('Error cargando transacciones:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Obtener historial de compras
  const cargarCompras = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await coinApi.obtenerHistorialCompras();
      if (response.success) {
        setCompras(response.compras);
      }
    } catch (error) {
      console.error('Error cargando compras:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Refrescar todos los datos
  const refrescarDatos = useCallback(async () => {
    await Promise.all([
      cargarSaldo(),
      cargarPaquetes(),
      cargarTransacciones(),
      cargarCompras()
    ]);
  }, [cargarSaldo, cargarPaquetes, cargarTransacciones, cargarCompras]);

  // Cargar datos iniciales
  useEffect(() => {
    if (user) {
      cargarSaldo();
      cargarPaquetes();
      cargarTransacciones();
      cargarCompras();
    }
  }, [user, cargarSaldo, cargarPaquetes, cargarTransacciones, cargarCompras]);

  return {
    saldo,
    paquetes,
    transacciones,
    compras,
    isLoading,
    refrescarDatos,
    cargarSaldo,
    cargarPaquetes,
    cargarTransacciones,
    cargarCompras,
    isAuthenticated: !!user
  };
};

export default useCoinApi;
