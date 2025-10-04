import express from 'express';
import supabase from '../db.js';
import jwt from 'jsonwebtoken';
import { 
  canjearRecompensa, 
  obtenerRecompensasUsuario, 
  obtenerEstadisticasRecompensas,
  RECOMPENSAS_CATALOGO 
} from '../services/rewardsService.js';

const router = express.Router();

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

// GET /api/recompensas/catalogo - Obtener catálogo completo de recompensas
router.get('/catalogo', async (req, res) => {
  try {
    // Obtener desde base de datos para datos dinámicos
    const { data: catalogoDb, error } = await supabase
      .from('recompensas_catalogo')
      .select('*')
      .eq('disponible', true)
      .order('orden', { ascending: true });

    if (error) {
      console.error('Error obteniendo catálogo:', error);
      // Fallback al catálogo estático
      res.json({
        success: true,
        recompensas: RECOMPENSAS_CATALOGO.filter(r => r.disponible)
      });
      return;
    }

    // Si tenemos datos en DB, usarlos; si no, usar estático
    const recompensas = catalogoDb?.length > 0 ? catalogoDb : RECOMPENSAS_CATALOGO.filter(r => r.disponible);

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

// GET /api/recompensas/catalogo/insignias - Obtener solo insignias
router.get('/catalogo/insignias', async (req, res) => {
  try {
    const { data: insignias, error } = await supabase
      .from('recompensas_catalogo')
      .select('*')
      .eq('disponible', true)
      .eq('categoria', 'insignias')
      .eq('tipo', 'badge')
      .order('orden', { ascending: true });

    if (error) {
      console.error('Error obteniendo insignias:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error obteniendo insignias: ' + error.message 
      });
    }

    res.json({
      success: true,
      insignias: insignias || []
    });
  } catch (error) {
    console.error('Error obteniendo insignias:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// GET /api/recompensas/usuario - Obtener recompensas del usuario autenticado
router.get('/usuario', verifyToken, async (req, res) => {
  try {
    const recompensas = await obtenerRecompensasUsuario(req.userId);
    res.json({
      success: true,
      recompensas
    });
  } catch (error) {
    console.error('Error obteniendo recompensas del usuario:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// GET /api/recompensas/usuario/insignias - Obtener insignias específicas del usuario
router.get('/usuario/insignias', verifyToken, async (req, res) => {
  try {
    const { data: insignias, error } = await supabase
      .from('recompensas_usuario')
      .select(`
        *,
        recompensa:recompensas_catalogo(*)
      `)
      .eq('usuario_id', req.userId)
      .like('recompensa_id', 'badge_%')
      .order('fecha_canje', { ascending: false });

    if (error) {
      console.error('Error obteniendo insignias del usuario:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error interno del servidor' 
      });
    }

    res.json({
      success: true,
      insignias: insignias || []
    });
  } catch (error) {
    console.error('Error obteniendo insignias del usuario:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// GET /api/recompensas/usuario/insignia-equipada - Obtener insignia equipada del usuario
router.get('/usuario/insignia-equipada', verifyToken, async (req, res) => {
  try {
    const { data: insigniaEquipada, error } = await supabase
      .from('insignias_equipadas')
      .select(`
        *,
        recompensa:recompensas_catalogo(*)
      `)
      .eq('usuario_id', req.userId)
      .eq('activo', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error obteniendo insignia equipada:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error interno del servidor' 
      });
    }

    res.json({
      success: false,
      insigniaEquipada: insigniaEquipada || null
    });
  } catch (error) {
    console.error('Error obteniendo insignia equipada:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// POST /api/recompensas/canjear - Canjear una recompensa/insignia
router.post('/canjear', verifyToken, async (req, res) => {
  try {
    const { recompensaId } = req.body;

    if (!recompensaId) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID de recompensa requerido' 
      });
    }

    const result = await canjearRecompensa(req.userId, recompensaId);

    res.json({
      success: true,
      nuevoSaldo: result.nuevoSaldo,
      recompensa: result.recompensa,
      mensaje: `¡${result.recompensa.nombre} agregada exitosamente!`
    });
  } catch (error) {
    console.error('Error canjeando recompensa:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message || 'Error interno del servidor' 
    });
  }
});

// POST /api/recompensas/equipar-insignia - Equipar una insignia
router.post('/equipar-insignia', verifyToken, async (req, res) => {
  try {
    const { recompensaId } = req.body;

    if (!recompensaId) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID de recompensa requerido' 
      });
    }

    // Verificar que el usuario tiene la insignia
    const { data: usuarioTiene, error: checkError } = await supabase
      .from('recompensas_usuario')
      .select('id')
      .eq('usuario_id', req.userId)
      .eq('recompensa_id', recompensaId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (!usuarioTiene) {
      return res.status(400).json({ 
        success: false, 
        error: 'No tienes esta insignia en tu colección' 
      });
    }

    // Verificar que es una insignia
    const { data: recompensa, error: recompensaError } = await supabase
      .from('recompensas_catalogo')
      .select('*')
      .eq('id', recompensaId)
      .eq('tipo', 'badge')
      .single();

    if (recompensaError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Recompensa no válida o no es una insignia' 
      });
    }

    // Desactivar insignia actual si existe
    await supabase
      .from('insignias_equipadas')
      .update({ activo: false })
      .eq('usuario_id', req.userId)
      .eq('activo', true);

    // Equipar nueva insignia
    const { data: nuevaInsignia, error: equiparError } = await supabase
      .from('insignias_equipadas')
      .insert([{
        usuario_id: req.userId,
        recompensa_id: recompensaId,
        activo: true
      }])
      .select(`
        *,
        recompensa:recompensas_catalogo(*)
      `)
      .single();

    if (equiparError) {
      // Si ya existe, actualizarla
      const { data: updateData, error: updateError } = await supabase
        .from('insignias_equipadas')
            .update({ activo: true })
        .eq('usuario_id', req.userId)
        .eq('recompensa_id', recompensaId)
        .select(`
          *,
          recompensa:recompensas_catalogo(*)
        `)
        .single();

      if (updateError) {
        throw updateError;
      }

      res.json({
        success: true,
        insigniaEquipada: updateData,
        mensaje: `${recompensa.nombre} equipada exitosamente`
      });
      return;
    }

    // Actualizar el estado equipado en recompensas_usuario
    await supabase
      .from('recompensas_usuario')
      .update({ equipado: true })
      .eq('usuario_id', req.userId)
      .eq('recompensa_id', recompensaId);

    res.json({
      success: true,
      insigniaEquipada: nuevaInsignia,
      mensaje: `${recompensa.nombre} equipada exitosamente`
    });
  } catch (error) {
    console.error('Error equipando insignia:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// DELETE /api/recompensas/desequipar-insignia - Desequipar insignia (permite solo una insignia equipada)
router.delete('/desequipar-insignia', verifyToken, async (req, res) => {
  try {
    // Desactivar insignia actual
    const { error: desequiparError } = await supabase
      .from('insignias_equipadas')
      .update({ activo: false })
      .eq('usuario_id', req.userId)
      .eq('activo', true);

    if (desequiparError) {
      throw desequiparError;
    }

    // Actualizar el estado equipado en recompensas_usuario para todas las insignias del usuario
    await supabase
      .from('recompensas_usuario')
      .update({ equipado: false })
      .eq('usuario_id', req.userId)
      .like('recompensa_id', 'badge_%');

    res.json({
      success: true,
      mensaje: 'Insignia desequipada exitosamente'
    });
  } catch (error) {
    console.error('Error desequipando insignia:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// GET /api/recompensas/estadisticas - Obtener estadísticas del usuario
router.get('/estadisticas', verifyToken, async (req, res) => {
  try {
    const estadisticas = await obtenerEstadisticasRecompensas(req.userId);
    res.json({
      success: true,
      estadisticas
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

export default router;
