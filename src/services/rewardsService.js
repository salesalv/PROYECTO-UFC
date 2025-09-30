import supabase from "@/db";

/**
 * Catálogo de recompensas disponibles
 */
export const RECOMPENSAS_CATALOGO = [
  // Insignias Básicas
  {
    id: 'badge_bronce',
    categoria: 'insignias',
    tipo: 'badge',
    nombre: 'Insignia de Bronce',
    descripcion: 'Insignia básica de bronce para tu perfil',
    precio: 100,
    icono: '🥉',
    rareza: 'comun',
    disponible: true
  },
  {
    id: 'badge_plata',
    categoria: 'insignias',
    tipo: 'badge',
    nombre: 'Insignia de Plata',
    descripcion: 'Insignia elegante de plata para tu perfil',
    precio: 150,
    icono: '🥈',
    rareza: 'comun',
    disponible: true
  },
  {
    id: 'badge_oro',
    categoria: 'insignias',
    tipo: 'badge',
    nombre: 'Insignia de Oro',
    descripcion: 'Insignia premium de oro para tu perfil',
    precio: 250,
    icono: '🥇',
    rareza: 'comun',
    disponible: true
  },

  // Insignias Especiales
  {
    id: 'badge_cinturon',
    categoria: 'insignias',
    tipo: 'badge',
    nombre: 'Cinturón de Campeón',
    descripcion: 'Insignia especial del cinturón de campeón',
    precio: 500,
    icono: '🏆',
    rareza: 'rara',
    disponible: true
  },
  {
    id: 'badge_guantes',
    categoria: 'insignias',
    tipo: 'badge',
    nombre: 'Guantes de Guerrero',
    descripcion: 'Insignia especial de guantes de pelea',
    precio: 600,
    icono: '🥊',
    rareza: 'rara',
    disponible: true
  },
  {
    id: 'badge_fuego',
    categoria: 'insignias',
    tipo: 'badge',
    nombre: 'Llama del Combate',
    descripcion: 'Insignia especial con efectos de fuego',
    precio: 700,
    icono: '🔥',
    rareza: 'rara',
    disponible: true
  },
  {
    id: 'badge_aguila',
    categoria: 'insignias',
    tipo: 'badge',
    nombre: 'Águila Dominante',
    descripcion: 'Insignia especial del águila dominante',
    precio: 800,
    icono: '🦅',
    rareza: 'rara',
    disponible: true
  },

  // Insignias Exclusivas de Temporada
  {
    id: 'badge_campeon_octubre_2026',
    categoria: 'insignias',
    tipo: 'badge',
    nombre: 'Campeón Octubre 2026',
    descripcion: 'Insignia exclusiva de temporada - Campeón de Octubre 2026',
    precio: 1000,
    icono: '👑',
    rareza: 'legendaria',
    disponible: true,
    limitada: true,
    fechaLimite: '2026-10-31'
  },

  // Documentales Exclusivos
  {
    id: 'documental_exclusivo',
    categoria: 'contenido',
    tipo: 'documental',
    nombre: 'Documentales Exclusivos',
    descripcion: 'Acceso completo a documentales exclusivos de peleadores',
    precio: 700,
    icono: '🎥',
    rareza: 'rara',
    disponible: true,
    contenido: [
      'Documental: La Historia de Jon Jones',
      'Documental: El Legado de Khabib',
      'Documental: McGregor - El Notorio',
      'Documental: Las Mejores Peleas de la Historia'
    ]
  },

  // Acceso a Clips Destacados
  {
    id: 'clips_destacados',
    categoria: 'contenido',
    tipo: 'acceso',
    nombre: 'Clips Destacados Premium',
    descripcion: 'Acceso ilimitado a clips destacados exclusivos',
    precio: 300,
    icono: '⭐',
    rareza: 'comun',
    disponible: true,
    beneficios: [
      'Acceso a clips exclusivos',
      'Calidad HD premium',
      'Sin límites de reproducción',
      'Contenido actualizado semanalmente'
    ]
  }
];

/**
 * Obtiene todas las recompensas disponibles
 */
export async function obtenerRecompensasDisponibles() {
  return RECOMPENSAS_CATALOGO.filter(recompensa => recompensa.disponible);
}

/**
 * Obtiene recompensas por categoría
 */
export async function obtenerRecompensasPorCategoria(categoria) {
  return RECOMPENSAS_CATALOGO.filter(recompensa => 
    recompensa.categoria === categoria && recompensa.disponible
  );
}

/**
 * Obtiene una recompensa por ID
 */
export async function obtenerRecompensaPorId(id) {
  return RECOMPENSAS_CATALOGO.find(recompensa => recompensa.id === id);
}

/**
 * Canjea una recompensa por el usuario
 */
export async function canjearRecompensa(userId, recompensaId) {
  try {
    // Obtener la recompensa
    const recompensa = await obtenerRecompensaPorId(recompensaId);
    if (!recompensa) {
      throw new Error('Recompensa no encontrada');
    }

    // Verificar si el usuario ya tiene esta recompensa
    const { data: recompensaExistente } = await supabase
      .from('recompensas_usuario')
      .select('*')
      .eq('usuario_id', userId)
      .eq('recompensa_id', recompensaId)
      .single();

    if (recompensaExistente) {
      throw new Error('Ya tienes esta recompensa');
    }

    // Obtener saldo actual del usuario
    const { data: user, error: userError } = await supabase
      .from('usuario')
      .select('saldo')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    if (Number(user.saldo) < Number(recompensa.precio)) {
      throw new Error('Saldo insuficiente');
    }

    // Iniciar transacción
    const nuevoSaldo = Number(user.saldo) - Number(recompensa.precio);

    // Actualizar saldo del usuario
    const { error: updateError } = await supabase
      .from('usuario')
      .update({ saldo: nuevoSaldo })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Registrar la compra de recompensa
    const { error: recompensaError } = await supabase
      .from('recompensas_usuario')
      .insert([{
        usuario_id: userId,
        recompensa_id: recompensaId,
        fecha_canje: new Date().toISOString(),
        precio_pagado: recompensa.precio
      }]);

    if (recompensaError) throw recompensaError;

    // Registrar transacción de monedas
    try {
      await supabase.from('transacciones_moneda').insert([{
        usuario_id: userId,
        tipo: 'egreso',
        cantidad: recompensa.precio,
        motivo: `canje_recompensa_${recompensaId}`
      }]);
    } catch (e) { /* ignorar si la tabla no existe */ }

    return {
      success: true,
      nuevoSaldo,
      recompensa
    };

  } catch (error) {
    console.error('Error canjeando recompensa:', error);
    throw error;
  }
}

/**
 * Obtiene las recompensas del usuario
 */
export async function obtenerRecompensasUsuario(userId) {
  try {
    const { data, error } = await supabase
      .from('recompensas_usuario')
      .select(`
        *,
        recompensa:recompensas_catalogo(*)
      `)
      .eq('usuario_id', userId)
      .order('fecha_canje', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error obteniendo recompensas del usuario:', error);
    return [];
  }
}

/**
 * Verifica si el usuario tiene una recompensa específica
 */
export async function usuarioTieneRecompensa(userId, recompensaId) {
  try {
    const { data, error } = await supabase
      .from('recompensas_usuario')
      .select('id')
      .eq('usuario_id', userId)
      .eq('recompensa_id', recompensaId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    console.error('Error verificando recompensa:', error);
    return false;
  }
}

/**
 * Obtiene estadísticas de recompensas del usuario
 */
export async function obtenerEstadisticasRecompensas(userId) {
  try {
    const { data, error } = await supabase
      .from('recompensas_usuario')
      .select('precio_pagado')
      .eq('usuario_id', userId);

    if (error) throw error;

    const totalGastado = data?.reduce((sum, item) => sum + Number(item.precio_pagado), 0) || 0;
    const totalRecompensas = data?.length || 0;

    return {
      totalRecompensas,
      totalGastado,
      promedioPorRecompensa: totalRecompensas > 0 ? totalGastado / totalRecompensas : 0
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return {
      totalRecompensas: 0,
      totalGastado: 0,
      promedioPorRecompensa: 0
    };
  }
}
