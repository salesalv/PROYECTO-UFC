import supabase from "@/db";

/**
 * Suma monedas al usuario y registra la transacción (si la tabla existe)
 * @param {number} userId
 * @param {number} cantidad
 * @param {string} motivo (opcional)
 */
export async function agregarMonedas(userId, cantidad, motivo = "ingreso") {
  // Obtener saldo actual
  const { data: user, error } = await supabase
    .from('usuario')
    .select('saldo')
    .eq('id', userId)
    .single();
  if (error) throw error;

  const nuevoSaldo = Number(user.saldo) + Number(cantidad);

  // Actualizar saldo
  const { error: updateError } = await supabase
    .from('usuario')
    .update({ saldo: nuevoSaldo })
    .eq('id', userId);
  if (updateError) throw updateError;

  // Registrar transacción (ignorar error si la tabla no existe)
  try {
    await supabase.from('transacciones_moneda').insert([{
      usuario_id: userId,
      tipo: 'ingreso',
      cantidad,
      motivo
    }]);
  } catch (e) { /* ignorar si la tabla no existe */ }

  return nuevoSaldo;
}

/**
 * Resta monedas al usuario y registra la transacción (si la tabla existe)
 * @param {number} userId
 * @param {number} cantidad
 * @param {string} motivo (opcional)
 */
export async function gastarMonedas(userId, cantidad, motivo = "egreso") {
  // Obtener saldo actual
  const { data: user, error } = await supabase
    .from('usuario')
    .select('saldo')
    .eq('id', userId)
    .single();
  if (error) throw error;

  if (Number(user.saldo) < Number(cantidad)) {
    throw new Error("Saldo insuficiente");
  }

  const nuevoSaldo = Number(user.saldo) - Number(cantidad);

  // Actualizar saldo
  const { error: updateError } = await supabase
    .from('usuario')
    .update({ saldo: nuevoSaldo })
    .eq('id', userId);
  if (updateError) throw updateError;

  // Registrar transacción (ignorar error si la tabla no existe)
  try {
    await supabase.from('transacciones_moneda').insert([{
      usuario_id: userId,
      tipo: 'egreso',
      cantidad,
      motivo
    }]);
  } catch (e) { /* ignorar si la tabla no existe */ }

  return nuevoSaldo;
}

/**
 * Consulta el saldo actual del usuario
 * @param {number} userId
 */
export async function obtenerSaldo(userId) {
  const { data, error } = await supabase
    .from('usuario')
    .select('saldo')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return Number(data.saldo);
}

/**
 * Obtiene el historial de transacciones del usuario
 * @param {number} userId
 * @param {number} limit - Límite de transacciones a obtener
 */
export async function obtenerHistorialTransacciones(userId, limit = 50) {
  const { data, error } = await supabase
    .from('transacciones_moneda')
    .select('*')
    .eq('usuario_id', userId)
    .order('fecha', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}

/**
 * Paquetes de monedas disponibles para compra
 */
export const PAQUETES_MONEDAS = [
  {
    id: 'basico',
    nombre: 'Paquete Básico',
    monedas: 100,
    precio: 0.01,
    descuento: 0,
    popular: false,
    descripcion: 'Perfecto para empezar'
  },
  {
    id: 'estandar',
    nombre: 'Paquete Estándar',
    monedas: 500,
    precio: 9.99,
    descuento: 17,
    popular: true,
    descripcion: 'El más popular'
  },
  {
    id: 'premium',
    nombre: 'Paquete Premium',
    monedas: 1200,
    precio: 19.99,
    descuento: 33,
    popular: false,
    descripcion: 'Mejor valor'
  },
  {
    id: 'pro',
    nombre: 'Paquete Pro',
    monedas: 2500,
    precio: 34.99,
    descuento: 44,
    popular: false,
    descripcion: 'Para usuarios avanzados'
  }
];

/**
 * Simula la creación de una preferencia de MercadoPago
 * En el backend real, esto se haría con la API de MercadoPago
 * @param {Object} paquete - Paquete de monedas seleccionado
 * @param {number} userId - ID del usuario
 */
export async function crearPreferenciaMercadoPago(paquete, userId) {
  // Esta función será implementada en el backend
  // Por ahora retornamos un objeto simulado
  return {
    id: `pref_${Date.now()}`,
    init_point: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref_${Date.now()}`,
    sandbox_init_point: `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref_${Date.now()}`,
    paquete,
    userId
  };
}

/**
 * Procesa el pago exitoso (será llamado desde el webhook del backend)
 * @param {string} paymentId - ID del pago de MercadoPago
 * @param {number} userId - ID del usuario
 * @param {Object} paquete - Paquete comprado
 */
export async function procesarPagoExitoso(paymentId, userId, paquete) {
  try {
    // Agregar las monedas al usuario
    await agregarMonedas(userId, paquete.monedas, `compra_paquete_${paquete.id}`);
    
    // Registrar la compra en una tabla de compras (si existe)
    try {
      await supabase.from('compras_monedas').insert([{
        usuario_id: userId,
        paquete_id: paquete.id,
        monedas: paquete.monedas,
        precio: paquete.precio,
        payment_id: paymentId,
        fecha: new Date().toISOString()
      }]);
    } catch (e) { /* ignorar si la tabla no existe */ }
    
    return true;
  } catch (error) {
    console.error('Error procesando pago:', error);
    throw error;
  }
} 