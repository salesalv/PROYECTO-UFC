import express from 'express';
import supabase from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Catálogo de recompensas disponibles
const RECOMPENSAS_CATALOGO = [
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

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mi-secreto');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// GET /api/recompensas/catalogo - Obtener catálogo de recompensas disponibles
router.get('/catalogo', async (req, res) => {
  try {
    const { categoria } = req.query;
    
    let recompensas = RECOMPENSAS_CATALOGO.filter(recompensa => recompensa.disponible);
    
    if (categoria && categoria !== 'all') {
      recompensas = recompensas.filter(recompensa => recompensa.categoria === categoria);
    }

    res.json({
      success: true,
      recompensas
    });
  } catch (error) {
    console.error('Error obteniendo catálogo:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// GET /api/recompensas/catalogo/:id - Obtener una recompensa específica por ID
router.get('/catalogo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const recompensa = RECOMPENSAS_CATALOGO.find(r => r.id === id && r.disponible);
    
    if (!recompensa) {
      return res.status(404).json({ 
        success: false, 
        error: 'Recompensa no encontrada' 
      });
    }

    res.json({
      success: true,
      recompensa
    });
  } catch (error) {
    console.error('Error obteniendo recompensa:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// POST /api/recompensas/canjear - Canjear una recompensa
router.post('/canjear', verifyToken, async (req, res) => {
  try {
    const { recompensaId } = req.body;

    if (!recompensaId) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID de recompensa requerido' 
      });
    }

    // Obtener la recompensa del catálogo
    const recompensa = RECOMPENSAS_CATALOGO.find(r => r.id === recompensaId && r.disponible);
    if (!recompensa) {
      return res.status(404).json({ 
        success: false, 
        error: 'Recompensa no encontrada' 
      });
    }

    // Verificar si el usuario ya tiene esta recompensa
    const { data: recompensaExistente, error: checkError } = await supabase
      .from('recompensas_usuario')
      .select('*')
      .eq('usuario_id', req.userId)
      .eq('recompensa_id', recompensaId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error verificando recompensa existente:', checkError);
      return res.status(500).json({ 
        success: false, 
        error: 'Error verificando recompensa' 
      });
    }

    if (recompensaExistente) {
      return res.status(400).json({ 
        success: false, 
        error: 'Ya tienes esta recompensa' 
      });
    }

    // Obtener saldo actual del usuario
    const { data: user, error: userError } = await supabase
      .from('usuario')
      .select('saldo')
      .eq('id', req.userId)
      .single();

    if (userError) {
      console.error('Error obteniendo usuario:', userError);
      return res.status(500).json({ 
        success: false, 
        error: 'Error obteniendo datos del usuario' 
      });
    }

    if (!user || Number(user.saldo) < Number(recompensa.precio)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Saldo insuficiente' 
      });
    }

    // Calcular nuevo saldo
    const nuevoSaldo = Number(user.saldo) - Number(recompensa.precio);

    // Actualizar saldo del usuario
    const { error: updateError } = await supabase
      .from('usuario')
      .update({ saldo: nuevoSaldo })
      .eq('id', req.userId);

    if (updateError) {
      console.error('Error actualizando saldo:', updateError);
      return res.status(500).json({ 
        success: false, 
        error: 'Error actualizando saldo' 
      });
    }

    // Registrar la compra de recompensa
    const { error: recompensaError } = await supabase
      .from('recompensas_usuario')
      .insert([{
        usuario_id: req.userId,
        recompensa_id: recompensaId,
        fecha_canje: new Date().toISOString(),
        precio_pagado: recompensa.precio
      }]);

    if (recompensaError) {
      console.error('Error registrando recompensa:', recompensaError);
      
      // Rollback del saldo si falla el registro
      await supabase
        .from('usuario')
        .update({ saldo: user.saldo })
        .eq('id', req.userId);
      
      // Mensaje más específico sobre la tabla faltante
      let errorMessage = 'Error registrando recompensa';
      if (recompensaError.message.includes('recompensas_usuario')) {
        errorMessage = '⚠️ TABLA FALTANTE: Necesitas crear la tabla "recompensas_usuario" en Supabase Dashboard. Consulta el archivo SOLUCION_EMPENTA_RECOMPENSAS.md';
      }
      
      return res.status(500).json({ 
        success: false, 
        error: errorMessage,
        details: recompensaError.message
      });
    }

    // Registrar transacción de monedas
    try {
      await supabase.from('transacciones_moneda').insert([{
        usuario_id: req.userId,
        tipo: 'egreso',
        cantidad: recompensa.precio,
        motivo: `canje_recompensa_${recompensaId}`,
        fecha: new Date().toISOString()
      }]);
    } catch (txError) {
      console.warn('No se pudo registrar transacción de monedas:', txError);
      // No es crítico si falla el registro de transacción
    }

    res.json({
      success: true,
      nuevoSaldo,
      recompensa,
      mensaje: `Recompensa "${recompensa.nombre}" canjeada exitosamente`
    });

  } catch (error) {
    console.error('Error canjeando recompensa:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// GET /api/recompensas/usuario - Obtener recompensas del usuario
router.get('/usuario', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('recompensas_usuario')
      .select(`
        *,
        recompensa:recompensas_catalogo(*)
      `)
      .eq('usuario_id', req.userId)
      .order('fecha_canje', { ascending: false });

    if (error) {
      console.error('Error obteniendo recompensas del usuario:', error);
      
      let errorMessage = 'Error obteniendo recompensas';
      if (error.message.includes('recompensas_usuario')) {
        errorMessage = '⚠️ TABLA FALTANTE: Necesitas crear la tabla "recompensas_usuario" en Supabase Dashboard.';
      }
      
      return res.status(500).json({ 
        success: false, 
        error: errorMessage,
        details: error.message
      });
    }

    // Enriquecer con datos del catálogo
    const recompensasEnriquecidas = data?.map(item => {
      const recompensaCatalogo = RECOMPENSAS_CATALOGO.find(r => r.id === item.recompensa_id);
      return {
        ...item,
        datos_recompensa: recompensaCatalogo
      };
    }) || [];

    res.json({
      success: true,
      recompensas: recompensasEnriquecidas
    });
  } catch (error) {
    console.error('Error obteniendo recompensas del usuario:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// GET /api/recompensas/estadisticas - Obtener estadísticas de recompensas del usuario
router.get('/estadisticas', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('recompensas_usuario')
      .select('precio_pagado')
      .eq('usuario_id', req.userId);

    if (error) {
      console.error('Error obteniendo estadísticas:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error obteniendo estadísticas' 
      });
    }

    const totalGastado = data?.reduce((sum, item) => sum + Number(item.precio_pagado), 0) || 0;
    const totalRecompensas = data?.length || 0;

    res.json({
      success: true,
      estadisticas: {
        totalRecompensas,
        totalGastado,
        promedioPorRecompensa: totalRecompensas > 0 ? totalGastado / totalRecompensas : 0
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// GET /api/recompensas/tiene/:recompensaId - Verificar si usuario tiene una recompensa específica
router.get('/tiene/:recompensaId', verifyToken, async (req, res) => {
  try {
    const { recompensaId } = req.params;

    const { data, error } = await supabase
      .from('recompensas_usuario')
      .select('id')
      .eq('usuario_id', req.userId)
      .eq('recompensa_id', recompensaId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error verificando recompensa:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error verificando recompensa' 
      });
    }

    res.json({
      success: true,
      tiene_recompensa: !!data
    });
  } catch (error) {
    console.error('Error verificando recompensa:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

export default router;
