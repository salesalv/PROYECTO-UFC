import supabase from '@/db';

/**
 * Servicio para manejar todas las operaciones relacionadas con insignias
 */

/**
 * Obtiene todas las insignias disponibles desde Supabase
 */
export async function obtenerInsigniasDisponibles() {
  try {
    const { data, error } = await supabase
      .from('insignias_catalogo')
      .select('*')
      .eq('disponible', true)
      .order('orden', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo insignias disponibles:', error);
    throw error;
  }
}

/**
 * Obtiene insignias por categoría
 */
export async function obtenerInsigniasPorCategoria(categoria) {
  try {
    const { data, error } = await supabase
      .from('insignias_catalogo')
      .select('*')
      .eq('categoria', categoria)
      .eq('disponible', true)
      .order('orden', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo insignias por categoría:', error);
    throw error;
  }
}

/**
 * Obtiene una insignia por ID
 */
export async function obtenerInsigniaPorId(id) {
  try {
    const { data, error } = await supabase
      .from('insignias_catalogo')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error obteniendo insignia por ID:', error);
    throw error;
  }
}

/**
 * Compra una insignia para el usuario
 */
export async function comprarInsignia(usuarioId, insigniaId) {
  try {
    // Verificar si ya tiene la insignia
    const { data: insigniaExistente } = await supabase
      .from('insignias_usuario')
      .select('id')
      .eq('usuario_id', usuarioId)
      .eq('insignia_id', insigniaId)
      .single();

    if (insigniaExistente) {
      throw new Error('Ya tienes esta insignia');
    }

    // Obtener datos de la insignia
    const insignia = await obtenerInsigniaPorId(insigniaId);
    if (!insignia) {
      throw new Error('Insignia no encontrada');
    }

    if (!insignia.disponible) {
      throw new Error('Esta insignia no está disponible');
    }

    // Verificar saldo del usuario
    const { data: user, error: userError } = await supabase
      .from('usuario')
      .select('saldo')
      .eq('id', usuarioId)
      .single();

    if (userError) throw userError;

    if (Number(user.saldo) < Number(insignia.precio)) {
      throw new Error('Saldo insuficiente para comprar esta insignia');
    }

    // Calcular nuevo saldo
    const nuevoSaldo = Number(user.saldo) - Number(insignia.precio);

    // Actualizar saldo del usuario
    const { error: updateError } = await supabase
      .from('usuario')
      .update({ saldo: nuevoSaldo })
      .eq('id', usuarioId);

    if (updateError) throw updateError;

    // Registrar la compra de insignia
    const fechaExpira = insignia.fecha_expira ? new Date(insignia.fecha_expira).toISOString() : null;
    
    const { error: compraError } = await supabase
      .from('insignias_usuario')
      .insert([{
        usuario_id: usuarioId,
        insignia_id: insigniaId,
        precio_pagado: insignia.precio,
        fecha_expira: fechaExpira
      }]);

    if (compraError) throw compraError;

    // Registrar transacción en el sistema de monedas
    try {
      await supabase.from('transacciones_moneda').insert([{
        usuario_id: usuarioId,
        tipo: 'egreso',
        cantidad: insignia.precio,
        motivo: `compra_insignia_${insignia.codigo}`
      }]);
    } catch (e) {
      console.warn('Error registrando transacción de monedas:', e);
    }

    return {
      success: true,
      nuevoSaldo,
      insignia
    };

  } catch (error) {
    console.error('Error comprando insignia:', error);
    throw error;
  }
}

/**
 * Obtiene las insignias del usuario
 */
export async function obtenerInsigniasUsuario(usuarioId) {
  try {
    const { data, error } = await supabase
      .from('insignias_usuario')
      .select(`
        *,
        insignia:insignias_catalogo(*)
      `)
      .eq('usuario_id', usuarioId)
      .order('fecha_compra', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo insignias del usuario:', error);
    return [];
  }
}

/**
 * Equipa una insignia para el usuario
 */
export async function equiparInsignia(usuarioId, insigniaId) {
  try {
    // Verificar que el usuario tiene la insignia
    const { data: usuarioInsignia, error: checkError } = await supabase
      .from('insignias_usuario')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('insignia_id', insigniaId)
      .single();

    if (checkError) throw new Error('No tienes esta insignia');

    // Desequipar cualquier insignia actualmente equipada
    await supabase
      .from('insignias_usuario')
      .update({ equipada: false })
      .eq('usuario_id', usuarioId)
      .eq('equipada', true);

    // Equipar la nueva insignia
    const { error: equiparError } = await supabase
      .from('insignias_usuario')
      .update({ equipada: true })
      .eq('usuario_id', usuarioId)
      .eq('insignia_id', insigniaId);

    if (equiparError) throw equiparError;

    return { success: true };
  } catch (error) {
    console.error('Error equipando insignia:', error);
    throw error;
  }
}

/**
 * Desequipa la insignia actual del usuario
 */
export async function desequiparInsignia(usuarioId) {
  try {
  const { error } = await supabase
    .from('insignias_usuario')
    .update({ equipada: false })
    .eq('usuario_id', usuarioId)
    .eq('equipada', true);

  if (error) throw error;
  return { success: true };
  } catch (error) {
    console.error('Error desequipando insignia:', error);
    throw error;
  }
}

/**
 * Obtiene la insignia equipada del usuario
 */
export async function obtenerInsigniaEquipada(usuarioId) {
  try {
    const { data, error } = await supabase
      .from('insignias_usuario')
      .select(`
        *,
        insignia:insignias_catalogo(*)
      `)
      .eq('usuario_id', usuarioId)
      .eq('equipada', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (error) {
    console.error('Error obteniendo insignia equipada:', error);
    return null;
  }
}

/**
 * Verifica si el usuario tiene una insignia específica
 */
export async function usuarioTieneInsignia(usuarioId, insigniaId) {
  try {
    const { data, error } = await supabase
      .from('insignias_usuario')
      .select('id')
      .eq('usuario_id', usuarioId)
      .eq('insignia_id', insigniaId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    console.error('Error verificando insignia:', error);
    return false;
  }
}

/**
 * Obtiene estadísticas de insignias del usuario
 */
export async function obtenerEstadisticasInsignias(usuarioId) {
  try {
    const { data, error } = await supabase
      .from('insignias_usuario')
      .select('precio_pagado, equipada')
      .eq('usuario_id', usuarioId);

    if (error) throw error;

    const totalGastado = data?.reduce((sum, item) => sum + Number(item.precio_pagado), 0) || 0;
    const totalInsignias = data?.length || 0;
    const insigniasEquipadas = data?.filter(item => item.equipada).length || 0;

    return {
      totalInsignias,
      totalGastado,
      insigniasEquipadas,
      promedioPorInsignia: totalInsignias > 0 ? totalGastado / totalInsignias : 0
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas de insignias:', error);
    return {
      totalInsignias: 0,
      totalGastado: 0,
      insigniasEquipadas: 0,
      promedioPorInsignia: 0
    };
  }
}

/**
 * Obtiene el historial de transacciones de insignias del usuario
 */
export async function obtenerHistorialInsignias(usuarioId, limite = 50) {
  try {
    const { data, error } = await supabase
      .from('transacciones_insignias')
      .select(`
        *,
        insignia:insignias_catalogo(codigo, nombre, icono)
      `)
      .eq('usuario_id', usuarioId)
      .order('fecha_transaccion', { ascending: false })
      .limit(limite);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo historial de insignias:', error);
    return [];
  }
}
