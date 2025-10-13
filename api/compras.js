import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

const config = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: {
    timeout: 5000,
    idempotencyKey: `mp_${Date.now()}`,
  },
});

const payment = new Payment(config);
const preference = new Preference(config);

// Configurar Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET' && req.url === '/api/compras/historial') {
      // Obtener historial de compras
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de autorización requerido' });
      }

      const token = authHeader.split(' ')[1];

      // Verificar el token y obtener el usuario
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return res.status(401).json({ error: 'Token inválido' });
      }

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

      // Obtener información de los paquetes para enriquecer los datos
      const paqueteIds = [...new Set(compras.map(c => c.paquete_id))];
      const { data: paquetes, error: paquetesError } = await supabase
        .from('paquetes_monedas')
        .select('id, nombre, descuento, popular')
        .in('id', paqueteIds);

      if (paquetesError) {
        console.error('Error obteniendo paquetes:', paquetesError);
      }

      // Crear un mapa de paquetes para acceso rápido
      const paquetesMap = {};
      if (paquetes) {
        paquetes.forEach(p => {
          paquetesMap[p.id] = p;
        });
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

    } else if (req.method === 'POST' && req.url === '/api/compras/webhook') {
      // Procesar webhook
      console.log('Webhook recibido:', req.body);
      
      // Aquí procesarías el pago
      res.status(200).json({ received: true });
    } else if (req.method === 'POST' && req.url === '/api/compras/crear-pago') {
      // Crear preferencia de pago
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
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12,
        },
        notification_url: `${process.env.BASE_URL}/api/compras/webhook`,
        back_urls: {
          success: `${process.env.FRONTEND_URL}/comprar-monedas/success`,
          failure: `${process.env.FRONTEND_URL}/comprar-monedas/failure`,
          pending: `${process.env.FRONTEND_URL}/comprar-monedas/pending`,
        },
        auto_return: 'approved',
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      const response = await preference.create({ body: preferenciaData });
      
      res.json({
        success: true,
        preference_id: response.id,
        init_point: response.init_point,
        external_reference: response.external_reference,
      });
    } else {
      res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
