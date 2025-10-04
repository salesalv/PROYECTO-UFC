import { useState, useEffect } from 'react';
import { obtenerInsigniaEquipada } from '@/services/insigniasService';
import { useBadgeEvents } from '@/context/BadgeEventContext';

/**
 * Hook para obtener la insignia equipada del usuario
 */
export const useEquippedBadge = (userId) => {
  const [equippedBadge, setEquippedBadge] = useState(null);
  const [loading, setLoading] = useState(false);
  const { badgeUpdateTrigger } = useBadgeEvents();

  useEffect(() => {
    const loadEquippedBadge = async () => {
      if (!userId) {
        setEquippedBadge(null);
        return;
      }

      try {
        setLoading(true);
        const badge = await obtenerInsigniaEquipada(userId);
        setEquippedBadge(badge);
      } catch (error) {
        console.error('Error cargando insignia equipada:', error);
        setEquippedBadge(null);
      } finally {
        setLoading(false);
      }
    };

    loadEquippedBadge();
  }, [userId, badgeUpdateTrigger]);

  return {
    equippedBadge,
    loading
  };
};
