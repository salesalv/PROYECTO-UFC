import { useState } from 'react';
import { comprarInsignia } from '@/services/insigniasService';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook personalizado para manejar la compra de insignias
 */
export const useBadgePurchase = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const purchaseBadge = async (userId, insigniaId, refreshCallbacks = []) => {
    setLoading(true);
    
    try {
      const result = await comprarInsignia(userId, insigniaId);
      
      toast({
        title: "¡Insignia comprada con éxito!",
        description: `Has adquirido la insignia por ${result.insignia.precio} monedas`,
      });

      // Ejecutar callbacks para refrescar datos
      refreshCallbacks.forEach(callback => {
        if (typeof callback === 'function') {
          callback();
        }
      });

      return result;
    } catch (error) {
      console.error('Error comprando insignia:', error);
      
      toast({
        title: "Error al comprar insignia",
        description: error.message || "No se pudo completar la compra",
        variant: 'destructive'
      });

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    purchaseBadge
  };
};
