import supabase from '@/db';

/**
 * Servicio para manejar recompensas de acceso a contenido premium
 */

/**
 * Verifica si el usuario tiene acceso a clips destacados
 */
export async function usuarioTieneAccesoClipsDestacados(usuarioId) {
  try {
    const { data, error } = await supabase
      .from('recompensas_usuario')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('tipo_recompensa', 'acceso_clips_destacados')
      .eq('activa', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    console.error('Error verificando acceso a clips destacados:', error);
    return false;
  }
}

/**
 * Compra acceso a clips destacados
 */
export async function comprarAccesoClipsDestacados(usuarioId, precio = 500) {
  try {
    // Verificar si ya tiene acceso
    const tieneAcceso = await usuarioTieneAccesoClipsDestacados(usuarioId);
    if (tieneAcceso) {
      throw new Error('Ya tienes acceso a clips destacados');
    }

    // Verificar saldo del usuario
    const { data: user, error: userError } = await supabase
      .from('usuario')
      .select('saldo')
      .eq('id', usuarioId)
      .single();

    if (userError) throw userError;

    if (Number(user.saldo) < precio) {
      throw new Error('Saldo insuficiente para comprar acceso a clips destacados');
    }

    // Calcular nuevo saldo
    const nuevoSaldo = Number(user.saldo) - precio;

    // Actualizar saldo del usuario
    const { error: updateError } = await supabase
      .from('usuario')
      .update({ saldo: nuevoSaldo })
      .eq('id', usuarioId);

    if (updateError) throw updateError;

    // Registrar la compra de acceso
    const { error: compraError } = await supabase
      .from('recompensas_usuario')
      .insert([{
        usuario_id: usuarioId,
        tipo_recompensa: 'acceso_clips_destacados',
        precio_pagado: precio,
        fecha_compra: new Date().toISOString(),
        activa: true
      }]);

    if (compraError) throw compraError;

    // Registrar transacción en el sistema de monedas
    try {
      await supabase.from('transacciones_moneda').insert([{
        usuario_id: usuarioId,
        tipo: 'egreso',
        cantidad: precio,
        motivo: 'compra_acceso_clips_destacados'
      }]);
    } catch (e) {
      console.warn('Error registrando transacción de monedas:', e);
    }

    return {
      success: true,
      nuevoSaldo,
      precio
    };

  } catch (error) {
    console.error('Error comprando acceso a clips destacados:', error);
    throw error;
  }
}

/**
 * Obtiene todas las recompensas del usuario
 */
export async function obtenerRecompensasUsuario(usuarioId) {
  try {
    const { data, error } = await supabase
      .from('recompensas_usuario')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('activa', true)
      .order('fecha_compra', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo recompensas del usuario:', error);
    return [];
  }
}
