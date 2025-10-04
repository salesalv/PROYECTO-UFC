import { useState, useEffect } from 'react';
import { 
  usuarioTieneAccesoClipsDestacados, 
  comprarAccesoClipsDestacados,
  obtenerRecompensasUsuario 
} from '@/services/recompensasService';

/**
 * Hook para manejar recompensas del usuario
 */
export const useRecompensas = (userId) => {
  const [tieneAccesoClipsDestacados, setTieneAccesoClipsDestacados] = useState(false);
  const [recompensas, setRecompensas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRecompensas = async () => {
      if (!userId) {
        setTieneAccesoClipsDestacados(false);
        setRecompensas([]);
        return;
      }

      try {
        setLoading(true);
        
        // Verificar acceso a clips destacados
        const accesoClips = await usuarioTieneAccesoClipsDestacados(userId);
        setTieneAccesoClipsDestacados(accesoClips);

        // Cargar todas las recompensas
        const recompensasData = await obtenerRecompensasUsuario(userId);
        setRecompensas(recompensasData);

      } catch (error) {
        console.error('Error cargando recompensas:', error);
        setTieneAccesoClipsDestacados(false);
        setRecompensas([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecompensas();
  }, [userId]);

  const comprarAccesoClips = async (precio = 500) => {
    try {
      setLoading(true);
      const result = await comprarAccesoClipsDestacados(userId, precio);
      
      // Actualizar estado local
      setTieneAccesoClipsDestacados(true);
      
      // Recargar recompensas
      const recompensasData = await obtenerRecompensasUsuario(userId);
      setRecompensas(recompensasData);

      return result;
    } catch (error) {
      console.error('Error comprando acceso a clips:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    tieneAccesoClipsDestacados,
    recompensas,
    loading,
    comprarAccesoClips
  };
};
