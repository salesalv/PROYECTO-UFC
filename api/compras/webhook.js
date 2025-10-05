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
    console.log('🔔 Webhook recibido:', req.body);
    
    // Aquí procesarías el pago real
    // Por ahora solo confirmamos que recibimos el webhook
    
    res.status(200).json({ 
      received: true,
      message: 'Webhook procesado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error en webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
