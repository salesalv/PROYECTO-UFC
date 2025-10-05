// Configuración simplificada para testing
const MERCADOPAGO_ACCESS_TOKEN = 'APP_USR-130708112804803-100510-d3ce971c5ac19413518658f868eb33f1-1444955939';
const BASE_URL = 'https://smashufc-nine.vercel.app';
const FRONTEND_URL = 'https://smashufc-nine.vercel.app';

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

  // Verificar autenticación (simplificado para testing)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autorización requerido' });
  }

  try {
    const { paqueteId } = req.body;
    
    const paquetes = [
      { id: 'basico', nombre: 'Paquete Básico', monedas: 100, precio: 2.99 },
      { id: 'estandar', nombre: 'Paquete Estándar', monedas: 500, precio: 9.99 },
      { id: 'premium', nombre: 'Paquete Premium', monedas: 1200, precio: 19.99 },
      { id: 'pro', nombre: 'Paquete Pro', monedas: 2500, precio: 34.99 }
    ];
    
    const paquete = paquetes.find(p => p.id === paqueteId);
    if (!paquete) {
      return res.status(400).json({ success: false, error: 'Paquete no encontrado' });
    }

    const preferenciaData = {
      items: [
        {
          id: paquete.id,
          title: paquete.nombre,
          description: `Paquete de ${paquete.monedas} monedas virtuales para SMASH UFC`,
          category_id: 'entertainment',
          quantity: 1,
          currency_id: 'ARS',
          unit_price: paquete.precio,
        },
      ],
      external_reference: `smash_ufc_${paquete.id}_${Date.now()}`,
      payer: {
        name: "Usuario",
        email: "usuario@smashufc.com"
      },
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
      },
      notification_url: `${BASE_URL}/api/compras/webhook`,
      back_urls: {
        success: `${FRONTEND_URL}/comprar-monedas/success`,
        failure: `${FRONTEND_URL}/comprar-monedas/failure`,
        pending: `${FRONTEND_URL}/comprar-monedas/pending`,
      },
      auto_return: 'approved',
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    // Crear preferencia usando fetch directo a MercadoPago
    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferenciaData),
    });

    if (!mpResponse.ok) {
      throw new Error(`MercadoPago API error: ${mpResponse.status}`);
    }

    const response = await mpResponse.json();
    
    res.json({
      success: true,
      preference_id: response.id,
      init_point: response.init_point,
      external_reference: response.external_reference,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
