import { createClient } from '@supabase/supabase-js';

// Configurar Supabase con validación
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no configuradas');
  console.error('SUPABASE_URL:', supabaseUrl ? 'Configurada' : 'No configurada');
  console.error('SUPABASE_ANON_KEY:', supabaseKey ? 'Configurada' : 'No configurada');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verificar configuración de Supabase
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Variables de entorno de Supabase no configuradas');
      return res.status(500).json({ error: 'Configuración del servidor incompleta' });
    }

    // Obtener el token de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No se encontró token de autorización');
      return res.status(401).json({ error: 'Token de autorización requerido' });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔑 Token recibido:', token ? 'Sí' : 'No');

    // Verificar el token y obtener el usuario
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error('❌ Error de autenticación:', authError);
      return res.status(401).json({ error: 'Token inválido' });
    }

    console.log('✅ Usuario autenticado:', user.id);

    // Obtener el historial de compras del usuario
    console.log('🔍 Consultando compras para usuario:', user.id);
    
    // Primero verificar si la tabla existe haciendo una consulta simple
    const { data: compras, error: comprasError } = await supabase
      .from('compras_monedas')
      .select(`
        id,
        paquete_id,
        monedas,
        precio,
        payment_id,
        estado,
        fecha,
        procesado_at
      `)
      .eq('usuario_id', user.id)
      .order('fecha', { ascending: false })
      .limit(50);

    if (comprasError) {
      console.error('❌ Error obteniendo compras:', comprasError);
      console.error('Detalles del error:', {
        message: comprasError.message,
        details: comprasError.details,
        hint: comprasError.hint,
        code: comprasError.code
      });
      
      // Si la tabla no existe, retornar array vacío en lugar de error
      if (comprasError.code === 'PGRST116' || comprasError.message.includes('relation') || comprasError.message.includes('does not exist')) {
        console.log('ℹ️ Tabla compras_monedas no existe, retornando array vacío');
        return res.json({
          success: true,
          compras: [],
          total: 0,
          message: 'Tabla de compras no configurada aún'
        });
      }
      
      return res.status(500).json({ 
        error: 'Error obteniendo historial de compras',
        details: comprasError.message 
      });
    }

    console.log('✅ Compras encontradas:', compras?.length || 0);

    // Obtener información de los paquetes para enriquecer los datos
    const paqueteIds = [...new Set(compras.map(c => c.paquete_id))];
    let paquetesMap = {};
    
    if (paqueteIds.length > 0) {
      console.log('🔍 Consultando paquetes:', paqueteIds);
      
      const { data: paquetes, error: paquetesError } = await supabase
        .from('paquetes_monedas')
        .select('id, nombre, descuento, popular')
        .in('id', paqueteIds);

      if (paquetesError) {
        console.error('⚠️ Error obteniendo paquetes (continuando sin ellos):', paquetesError);
        // No fallar si no se pueden obtener los paquetes, continuar sin ellos
      } else if (paquetes) {
        console.log('✅ Paquetes encontrados:', paquetes.length);
        paquetes.forEach(p => {
          paquetesMap[p.id] = p;
        });
      }
    }

    // Enriquecer las compras con información del paquete
    const comprasEnriquecidas = compras.map(compra => ({
      ...compra,
      paquete: paquetesMap[compra.paquete_id] || {
        id: compra.paquete_id,
        nombre: `Paquete ${compra.paquete_id}`,
        descuento: 0,
        popular: false
      }
    }));

    res.json({
      success: true,
      compras: comprasEnriquecidas,
      total: compras.length
    });

  } catch (error) {
    console.error('❌ Error general en historial:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
}
