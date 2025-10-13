import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
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
      console.error('Error obteniendo compras:', comprasError);
      return res.status(500).json({ error: 'Error obteniendo historial de compras' });
    }

    console.log('Compras encontradas:', compras?.length || 0);

    // Obtener información de los paquetes para enriquecer los datos
    const paqueteIds = [...new Set(compras.map(c => c.paquete_id))];
    let paquetesMap = {};
    
    if (paqueteIds.length > 0) {
      const { data: paquetes, error: paquetesError } = await supabase
        .from('paquetes_monedas')
        .select('id, nombre, descuento, popular')
        .in('id', paqueteIds);

      if (paquetesError) {
        console.error('Error obteniendo paquetes:', paquetesError);
      } else if (paquetes) {
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
    console.error('Error en historial:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
