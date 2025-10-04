import express from 'express';
import supabase from '../db.js';
import jwt from 'jsonwebtoken';

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

// GET /api/insignias/mis-insignias - Obtener insignias del usuario
router.get('/mis-insignias', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('recompensas_usuario')
      .select(`
        *,
        recompensa:recompensas_catalogo(*)
      `)
      .eq('usuario_id', req.userId)
      .eq('recompensa.categoria', 'insignias')
      .order('fecha_canje', { ascending: false });

    if (error) {
      console.error('Error obteniendo insignias:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error obteniendo insignias' 
      });
    }

    // Enriquecer con información del catálogo
    const insignias = data?.map(item => ({
      id: item.recompensa_id,
      fecha_canje: item.fecha_canje,
      equipada: false, // Se determinará después
      ...item.recompensa
    })) || [];

    res.json({
      success: true,
      insignias
    });
  } catch (error) {
    console.error('Error obteniendo insignias:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// GET /api/insignias/perfil/:usuarioId - Obtener insignias visibles en perfil público
router.get('/perfil/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;

    // Obtener datos del usuario incluyendo insignia actual
    const { data: usuarioData, error: userError } = await supabase
      .from('usuario')
      .select('insignia_actual, insignias_mostradas, nombre_usuario')
      .eq('id', usuarioId)
      .single();

    if (userError) {
      console.error('Error obteniendo usuario:', userError);
      return res.status(500).json({ 
        success: false, 
        error: 'Error obteniendo datos del usuario' 
      });
    }

    if (!usuarioData) {
      return res.status(404).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }

    // Si no tiene insignia equipada, devolver datos básicos
    if (!usuarioData.insignia_actual) {
      return res.json({
        success: true,
        usuario: {
          nombre_usuario: usuarioData.nombre_usuario,
          insignia_actual: null
        }
      });
    }

    // Obtener datos de la insignia actual
    const { data: insigniaData, error: insigniaError } = await supabase
      .from('recompensas_catalogo')
      .select('*')
      .eq('id', usuarioData.insignia_actual)
      .eq('categoria', 'insignias')
      .single();

    if (insigniaError) {
      console.error('Error obteniendo insignia:', insigniaError);
      return res.status(500).json({ 
        success: false, 
        error: 'Error obteniendo insignia' 
      });
    }

    res.json({
      success: true,
      usuario: {
        nombre_usuario: usuarioData.nombre_usuario,
        insignia_actual: insigniaData || null
      }
    });
  } catch (error) {
    console.error('Error obteniendo insignias de perfil:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// POST /api/insignias/equipar - Equipar una insignia
router.post('/equipar', verifyToken, async (req, res) => {
  try {
    const { insigniaId } = req.body;

    if (!insigniaId) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID de insignia requerido' 
      });
    }

    // Verificar que el usuario tiene esta insignia
    const { data: insigniaUsuario, error: insigniaError } = await supabase
      .from('recompensas_usuario')
      .select('*')
      .eq('usuario_id', req.userId)
      .eq('recompensa_id', insigniaId)
      .single();

    if (insigniaError || !insigniaUsuario) {
      return res.status(400).json({ 
        success: false, 
        error: 'No tienes esta insignia o no es una insignia válida' 
      });
    }

    // Verificar que es una insignia
    const { data: insigniaCatalogo, error: catalogoError } = await supabase
      .from('recompensas_catalogo')
      .select('*')
      .eq('id', insigniaId)
      .eq('categoria', 'insignias')
      .single();

    if (catalogoError || !insigniaCatalogo) {
      return res.status(400).json({ 
        success: false, 
        error: 'Insignia no válida' 
      });
    }

    // Actualizar insignia actual del usuario
    const { error: updateError } = await supabase
      .from('usuario')
      .update({ 
        insignia_actual: insigniaId,
        insignias_mostradas: { 
          mostrar_insignia: true,
          mostrar_fecha_canje: true 
        }
      })
      .eq('id', req.userId);

    if (updateError) {
      console.error('Error actualizando insignia:', updateError);
      return res.status(500).json({ 
        success: false, 
        error: 'Error equipando insignia' 
      });
    }

    // Registrar en historial
    try {
      await supabase
        .from('usuario_insignias_historial')
        .insert([{
          usuario_id: req.userId,
          insignia_id: insigniaId,
          fecha_equipada: new Date().toISOString()
        }]);

      // Cerrar historial de insignia anterior si existe
      await supabase
        .from('usuario_insignias_historial')
        .update({ fecha_desequipada: new Date().toISOString() })
        .eq('usuario_id', req.userId)
        .eq('fecha_desequipada', null)
        .neq('insignia_id', insigniaId);
    } catch (historialError) {
      console.warn('Error registrando historial:', historialError);
      // No es crítico si falla el historial
    }

    res.json({
      success: true,
      insignia: insigniaCatalogo,
      mensaje: `Insignia "${insigniaCatalogo.nombre}" equipada exitosamente`
    });

  } catch (error) {
    console.error('Error equipando insignia:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// POST /api/insignias/desequipar - Desequipar insignia actual
router.post('/desequipar', verifyToken, async (req, res) => {
  try {
    // Obtener insignia actual
    const { data: usuarioData, error: userError } = await supabase
      .from('usuario')
      .select('insignia_actual')
      .eq('id', req.userId)
      .single();

    if (userError) {
      console.error('Error obteniendo usuario:', userError);
      return res.status(500).json({ 
        success: false, 
        error: 'Error obteniendo datos del usuario' 
      });
    }

    if (!usuarioData.insignia_actual) {
      return res.status(400).json({ 
        success: false, 
        error: 'No tienes ninguna insignia equipada' 
      });
    }

    // Actualizar usuario (quitar insignia actual)
    const { error: updateError } = await supabase
      .from('usuario')
      .update({ 
        insignia_actual: null,
        insignias_mostradas: { 
          mostrar_insignia: false,
          mostrar_fecha_canje: false 
        }
      })
      .eq('id', req.userId);

    if (updateError) {
      console.error('Error actualizando usuario:', updateError);
      return res.status(500).json({ 
        success: false, 
        error: 'Error desequipando insignia' 
      });
    }

    // Registrar en historial
    try {
      await supabase
        .from('usuario_insignias_historial')
        .update({ fecha_desequipada: new Date().toISOString() })
        .eq('usuario_id', req.userId)
        .eq('insignia_id', usuarioData.insignia_actual)
        .eq('fecha_desequipada', null);
    } catch (historialError) {
      console.warn('Error actualizando historial:', historialError);
    }

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

// GET /api/insignias/historial - Obtener historial de insignias del usuario
router.get('/historial', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuario_insignias_historial')
      .select(`
        *,
        insignia:recompensas_catalogo(*)
      `)
      .eq('usuario_id', req.userId)
      .order('fecha_equipada', { ascending: false });

    if (error) {
      console.error('Error obteniendo historial:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error obteniendo historial' 
      });
    }

    res.json({
      success: true,
      historial: data || []
    });
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
 }};

// PUT /api/insignias/configuracion - Actualizar configuración de visualización
router.put('/configuracion', verifyToken, async (req, res) => {
  try {
    const { mostrar_insignia, mostrar_fecha_canje } = req.body;

    const configuracion = {
      mostrar_insignia: mostrar_insignia !== undefined ? mostrar_insignia : true,
      mostrar_fecha_canje: mostrar_fecha_canje !== undefined ? mostrar_fecha_canje : true
    };

    const { error: updateError } = await supabase
      .from('usuario')
      .update({ insignias_mostradas: configuracion })
      .eq('id', req.userId);

    if (updateError) {
      console.error('Error actualizando configuración:', updateError);
      return res.status(500).json({ 
        success: false, 
        error: 'Error actualizando configuración' 
      });
    }

    res.json({
      success: true,
      configuracion,
      mensaje: 'Configuración actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando configuración:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

export default router;
