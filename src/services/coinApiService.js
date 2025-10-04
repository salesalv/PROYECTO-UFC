/**
 * Servicio para interactuar con el backend API de compras de monedas
 * Este servicio comunica el frontend con el backend Express que implementamos
 */

const API_BASE_URL = 'http://localhost:3001/api/compras';

/**
 * Obtiene el token JWT del almacenamiento local
 */
function getAuthToken() {
  // Aquí deberías obtener el token del contexto de usuario o localStorage
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return token;
}

/**
 * Hace una petición autenticada al API
 */
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en API request ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Obtiene los paquetes de monedas disponibles
 */
export async function obtenerPaquetesDisponibles() {
  return apiRequest('/paquetes');
}

/**
 * Obtiene el saldo actual del usuario autenticado
 */
export async function obtenerSaldoUsuario() {
  return apiRequest('/saldo');
}

/**
 * Crea una intención de pago para un paquete específico
 */
export async function crearPaymentIntent(paqueteId) {
  return apiRequest('/crear-pago', {
    method: 'POST',
    body: JSON.stringify({ paqueteId }),
  });
}

/**
 * Obtiene el historial de compras del usuario
 */
export async function obtenerHistorialCompras() {
  return apiRequest('/historial');
}

/**
 * Obtiene el historial de transacciones de monedas
 */
export async function obtenerHistorialTransacciones() {
  return apiRequest('/transacciones');
}

/**
 * Simula un pago para testing (solo en desarrollo)
 */
export async function simularPago(paymentId) {
  return apiRequest(`/test-payment/${paymentId}`, {
    method: 'POST',
  });
}

/**
 * Procesa un pago completado (usado por webhooks)
 * Esta función normalmente sería llamada por el backend, no por el frontend
 */
export async function procesarPagoCompletado(paymentData) {
  return apiRequest('/procesar-pago', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
}

export default {
  obtenerPaquetesDisponibles,
  obtenerSaldoUsuario,
  crearPaymentIntent,
  obtenerHistorialCompras,
  obtenerHistorialTransacciones,
  simularPago,
  procesarPagoCompletado,
};
