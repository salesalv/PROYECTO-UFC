// Endpoint para probar el webhook manualmente
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, paqueteId } = req.body;
    
    if (!email || !paqueteId) {
      return res.status(400).json({ error: 'Email y paqueteId requeridos' });
    }

    const paquetes = [
      { id: 'basico', nombre: 'Paquete Básico', monedas: 100, precio: 0.01 },
      { id: 'estandar', nombre: 'Paquete Estándar', monedas: 500, precio: 9.99 },
      { id: 'premium', nombre: 'Paquete Premium', monedas: 1200, precio: 19.99 },
      { id: 'pro', nombre: 'Paquete Pro', monedas: 2500, precio: 34.99 }
    ];

    const paquete = paquetes.find(p => p.id === paqueteId);
    if (!paquete) {
      return res.status(400).json({ error: 'Paquete no encontrado' });
    }

    const SUPABASE_URL = 'https://gqylknstxjwlybyvvcvx.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxeWxrbnN0eGp3bHlieXZ2Y3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTMyNzIsImV4cCI6MjA2NTY2OTI3Mn0.fdOlalxcPaKzpjaUnFowsY3gz6f0LYmCdE--aJ76zc8';

    // Buscar el usuario en Supabase por email
    const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/usuario?correo=eq.${email}`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!supabaseResponse.ok) {
      throw new Error(`Error buscando usuario en Supabase: ${supabaseResponse.status}`);
    }

    const usuarios = await supabaseResponse.json();
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado en Supabase' });
    }

    const usuario = usuarios[0];
    const nuevoSaldo = Number(usuario.saldo) + Number(paquete.monedas);

    // Actualizar el saldo del usuario en Supabase
    const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/usuario?id=eq.${usuario.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ saldo: nuevoSaldo }),
    });

    if (!updateResponse.ok) {
      throw new Error(`Error actualizando saldo en Supabase: ${updateResponse.status}`);
    }

    res.json({
      success: true,
      message: 'Monedas acreditadas exitosamente',
      usuario: usuario.nombre_usuario,
      monedas: paquete.monedas,
      saldoAnterior: usuario.saldo,
      nuevoSaldo: nuevoSaldo
    });

  } catch (error) {
    console.error('❌ Error en test-webhook:', error);
    res.status(500).json({ error: error.message });
  }
}
