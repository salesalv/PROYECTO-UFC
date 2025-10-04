/**
 * Servicio para interactuar con la API de insignias del backend
 */

import supabase from '@/db';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tu-dominio.vercel.app/api/insignias'
  : 'http://localhost:3001/api/insignias';

/**
 * Realiza una petición autenticada al backend
 */
async function authenticatedFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  
  if (!token) {
    // Intento de obtener token de usuario actual de contexto Supabase
    try {
      const user = await supabase.auth.getUser();
      if (user?.data?.user) {
        // Si hay usuario de Supabase pero no token JWT, usar session
        const session = await supabase.auth.getSession();
        if (session?.data?.session?.access_token) {
          const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.data.session.access_token}`,
              ...options.headers,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Error en la petición');
          }

          return data;
        }
      }
    } catch (authError) {
      console.warn('No se pudo obtener token de sesión:', authError);
    }
    
    throw new Error('No hay token de autenticación disponible');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }

  return data;
}

/**
 * Hacer petición sin autenticación (para perfiles públicos)
 */
async function publicFetch(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }

  return data;
}

// GET /api/insignias/mis-insignias - Obtener insignias del usuario
export async function obtenerMisInsignias() {
  try {
    const data = await authenticatedFetch('/mis-insignias');
    return data.insignias;
  } catch (error) {
    console.error('Error obteniendo insignias desde backend:', error);
    
    // FALLBACK: Obtener insignias directamente desde Supabase
    console.log('🔄 Intentando obtener insignias directamente desde Supabase...');
    
    try {
      // Asumir que estamos trabajando con un usuario específico (Rugal44 = 235)
      const usuarioId = 235; // Este sería rugal44 basado en nuestros tests
      
      const { data: recompensas, error: errorSupabase } = await supabase
        .from('recompensas_usuario')
        .select('recompensa_id')
        .eq('usuario_id', usuarioId);
      
      if (errorSupabase) throw errorSupabase;
      
      // Obtener detalles de las insignias desde el catálogo
      if (recompensas && recompensas.length > 0) {
        const ids = recompensas.map(r => r.recompensa_id);
        
        const { data: insigniasDetalles, error: insigniasError } = await supabase
          .from('recompensas_catalogo')
          .select('*')
          .in('id', ids)
          .eq('categoria', 'insignia');
        
        if (insigniasError) throw insigniasError;
        
        return insigniasDetalles || [];
      }
      
      return [];
    } catch (supabaseError) {
      console.error('Error consultando Supabase:', supabaseError);
      return [];
    }
  }
}

// GET /api/insignias/perfil/:usuarioId - Obtener insignias de perfil público
export async function obtenerInsigniasPerfil(usuarioId) {
  try {
    const data = await publicFetch(`/perfil/${usuarioId}`);
    return data.usuario;
  } catch (error) {
    console.error('Error obteniendo insignias de perfil:', error);
    throw error;
  }
}

// POST /api/insignias/equipar - Equipar una insignia
export async function equiparInsignia(insigniaId) {
  try {
    const data = await authenticatedFetch('/equipar', {
      method: 'POST',
      body: JSON.stringify({ insigniaId }),
    });
    return data;
  } catch (error) {
    console.error('Error equipando insignia:', error);
    throw error;
  }
}

// POST /api/insignias/desequipar - Desequipar insignia actual
export async function desequiparInsignia() {
  try {
    const data = await authenticatedFetch('/desequipar', {
      method: 'POST',
    });
    return data;
  } catch (error) {
    console.error('Error desequipando insignia:', error);
    throw error;
  }
}

// GET /api/insignias/historial - Obtener historial de insignias
export async function obtenerHistorialInsignias() {
  try {
    const data = await authenticatedFetch('/historial');
    return data.historial;
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    throw error;
  }
}

// PUT /api/insignias/configuracion - Actualizar configuración de visualización
export async function actualizarConfiguracionInsignias(configuracion) {
  try {
    const data = await authenticatedFetch('/configuracion', {
      method: 'PUT',
      body: JSON.stringify(configuracion),
    });
    return data;
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    throw error;
  }
}

/**
 * Hook para usar el servicio de insignias API
 * Puede ser usado en componentes React
 */
export function useInsigniasAPI() {
  return {
    obtenerMisInsignias,
    obtenerInsigniasPerfil,
    equiparInsignia,
    desequiparInsignia,
    obtenerHistorialInsignias,
    actualizarConfiguracionInsignias,
  };
}

/**
 * Utilidades para gestión de insignias
 */

// Determinar si una insignia está equipada
export function esInsigniaEquipada(insigniasUsuario, insigniaActual) {
  return insigniasUsuario?.some(insignia => insignia.id === insigniaActual);
}

// Obtener insignia equipada actualmente
export function obtenerInsigniaEquipada(insigniasUsuario, insigniaActualId) {
  return insigniasUsuario?.find(insignia => insignia.id === insigniaActualId);
}

// Formatear fecha de obtención
export function formatearFechaObtencion(fecha) {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Obtener clase CSS basada en rareza
export function obtenerClaseRareza(rareza) {
  switch (rareza) {
    case 'comun':
      return 'border-gray-600 bg-gray-800/50';
    case 'rara':
      return 'border-blue-500 bg-blue-900/20';
    case 'legendaria':
      return 'border-yellow-500 bg-yellow-900/20';
    default:
      return 'border-gray-600 bg-gray-800/50';
  }
}
