/**
 * Servicio para interactuar con la API de recompensas del backend
 */

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://smashufc-nine.vercel.app/api/recompensas'
  : 'http://localhost:3001/api/recompensas';

/**
 * Realiza una petición autenticada al backend
 */
async function authenticatedFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  if (!token) {
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

// GET /api/recompensas/catalogo - Obtener catálogo de recompensas
export async function obtenerCatalogoRecompensas(categoria = null) {
  try {
    const url = categoria && categoria !== 'all' 
      ? `/catalogo?categoria=${categoria}` 
      : '/catalogo';
    
    const response = await fetch(`${API_BASE_URL}${url}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error obteniendo catálogo');
    }

    return data.recompensas;
  } catch (error) {
    console.error('Error obteniendo catálogo:', error);
    throw error;
  }
}

// GET /api/recompensas/catalogo/:id - Obtener recompensa por ID
export async function obtenerRecompensaPorId(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/catalogo/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error obteniendo recompensa');
    }

    return data.recompensa;
  } catch (error) {
    console.error('Error obteniendo recompensa:', error);
    throw error;
  }
}

// POST /api/recompensas/canjear - Canjear una recompensa
export async function canjearRecompensa(recompensaId) {
  try {
    const data = await authenticatedFetch('/canjear', {
      method: 'POST',
      body: JSON.stringify({ recompensaId }),
    });

    return data;
  } catch (error) {
    console.error('Error canjeando recompensa:', error);
    throw error;
  }
}

// GET /api/recompensas/usuario - Obtener recompensas del usuario
export async function obtenerRecompensasUsuario() {
  try {
    const data = await authenticatedFetch('/usuario');
    return data.recompensas;
  } catch (error) {
    console.error('Error obteniendo recompensas del usuario:', error);
    throw error;
  }
}

// GET /api/recompensas/estadisticas - Obtener estadísticas del usuario
export async function obtenerEstadisticasRecompensas() {
  try {
    const data = await authenticatedFetch('/estadisticas');
    return data.estadisticas;
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    throw error;
  }
}

// GET /api/recompensas/tiene/:id - Verificar si usuario tiene recompensa
export async function usuarioTieneRecompensa(recompensaId) {
  try {
    const data = await authenticatedFetch(`/tiene/${recompensaId}`);
    return data.tiene_recompensa;
  } catch (error) {
    console.error('Error verificando recompensa:', error);
    return false;
  }
}

/**
 * Hook para usar el servicio de recompensas API
 * Puede ser usado en componentes React
 */
export function useRecompensasAPI() {
  return {
    obtenerCatalogoRecompensas,
    obtenerRecompensaPorId,
    canjearRecompensa,
    obtenerRecompensasUsuario,
    obtenerEstadisticasRecompensas,
    usuarioTieneRecompensa,
  };
}
