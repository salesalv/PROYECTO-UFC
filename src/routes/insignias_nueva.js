import express from 'express';
import supabase from '../db.js';

const router = express.Router();

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Token requerido' });
  }
  
  // Aquí podrías verificar el token JWT, pero por ahora lo vamos a usar temporalmente
  req.userId = 235; // Temporalmente usar Rugal44 para testing
  next();
};

// GET /api/insignias/mis-insignias - Obtener insignias del usuario
router.get('/mis-insignias', verifyToken, async (req, res) => {
  try {
    console.log('🔍 Obteniendo insignias para usuario:', req.userId);
    
    // Usar supabase directamente
    // const supabase = await supabaseModule();
    
    // Buscar recompensas del usuario
    const { data: recompensas, error: recompensasError } = await supabase
      .from('recompensas_usuario')
      .select('recompensa_id')
      .eq('usuario_id', req.userId);
    
    if (recompensasError) {
      console.error('❌ Error buscando recompensas:', recompensasError);
      return res.status(500).json({ 
        success: false, 
        error: 'Error buscando recompensas del usuario' 
      });
    }
    
    console.log('🎖️ Recompensas encontradas:', recompensas);
    
    // Obtener detalles de las insignias desde el catálogo
    if (recompensas && recompensas.length > 0) {
      const ids = recompensas.map(r => r.recompensa_id);
      
      const { data: insigniasDetalles, error: insigniasError } = await supabase
        .from('recompensas_catalogo')
        .select('*')
        .in('id', ids)
        .eq('categoria', 'insignia');
      
      if (insigniasError) {
        console.error('❌ Error buscando insignias:', insigniasError);
        return res.status(500).json({ 
          success: false, 
          error: 'Error buscando detalles de insignias' 
        });
      }
      
      console.log('✅ Insignias encontradas:', insigniasDetalles);
      
      return res.json({
        success: true,
        insignias: insigniasDetalles || []
      });
    }
    
    return res.json({
      success: true,
      insignias: []
    });
    
  } catch (error) {
    console.error('❌ Error completo en obtenerMisInsignias:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// GET /api/insignias/perfil/:usuarioId - Obtener insignias de perfil público
router.get('/perfil/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    // Obtener insignia actual del usuario
    const { data, error } = await supabase
      .from('usuario')
      .select('insignia_actual')
      .eq('id', usuarioId)
      .single();
    
    if (error) {
      console.error('Error obteniendo insignia actual:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error obteniendo insignia del usuario' 
      });
    }
    
    let insigniaActual = null;
    if (data?.insignia_actual) {
      // Obtener detalles de la insignia
      const { data: insignia, error: insigniaError } = await supabase
        .from('recompensas_catalogo')
        .select('*')
        .eq('id', data.insignia_actual)
        .single();
      
      if (!insigniaError && insignia) {
        insigniaActual = insignia;
      }
    }
    
    res.json({
      success: true,
      usuario: {
        id: usuarioId,
        insignia_actual: insigniaActual
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

// Rutas temporales básicas para otras funciones
router.post('/equipar', verifyToken, async (req, res) => {
  res.json({ success: true, message: 'Funcionalidad próximamente' });
});

router.post('/desequipar', verifyToken, async (req, res) => {
  res.json({ success: true, message: 'Funcionalidad próximamente' });
});

router.get('/historial', verifyToken, async (req, res) => {
  res.json({ success: true, historial: [] });
});

router.put('/configuracion', verifyToken, async (req, res) => {
  res.json({ success: true, message: 'Configuración guardada' });
});

export default router;
