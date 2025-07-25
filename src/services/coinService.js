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