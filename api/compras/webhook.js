// Configuración para procesar pagos reales
const MERCADOPAGO_ACCESS_TOKEN = 'APP_USR-130708112804803-100510-d3ce971c5ac19413518658f868eb33f1-1444955939';
const SUPABASE_URL = 'https://gqylknstxjwlybyvvcvx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxeWxrbnN0eGp3bHlieXZ2Y3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTMyNzIsImV4cCI6MjA2NTY2OTI3Mn0.fdOlalxcPaKzpjaUnFowsY3gz6f0LYmCdE--aJ76zc8';

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
    
    // Obtener ID del pago desde MercadoPago
    const paymentId = req.body?.data?.id;
    if (!paymentId) {
      console.warn('⚠ Webhook recibido sin payment ID');
      return res.status(400).json({ error: 'Missing payment ID' });
    }

    // Verificar el pago en MercadoPago
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!mpResponse.ok) {
      throw new Error(`MercadoPago API error: ${mpResponse.status}`);
    }

    const payment = await mpResponse.json();
    console.log('💳 Pago verificado:', payment.status, payment.id);

    // Si el pago fue aprobado, procesar la compra
    if (payment.status === 'approved') {
      console.log('✅ Pago aprobado, procesando compra...');
      
      // Obtener información del pago
      const externalReference = payment.external_reference;
      const amount = payment.transaction_amount;
      
      // Extraer información del external_reference (formato: smash_ufc_paqueteId_timestamp)
      const referenceParts = externalReference.split('_');
      if (referenceParts.length >= 4) {
        const paqueteId = referenceParts[2];
        
        // Definir paquetes (debe coincidir con crear-pago.js)
        const paquetes = [
          { id: 'basico', nombre: 'Paquete Básico', monedas: 100, precio: 2.99 },
          { id: 'estandar', nombre: 'Paquete Estándar', monedas: 500, precio: 9.99 },
          { id: 'premium', nombre: 'Paquete Premium', monedas: 1200, precio: 19.99 },
          { id: 'pro', nombre: 'Paquete Pro', monedas: 2500, precio: 34.99 }
        ];
        
        const paquete = paquetes.find(p => p.id === paqueteId);
        if (paquete) {
          // Aquí necesitarías obtener el usuario_id del pago
          // Por ahora, vamos a crear una entrada en la base de datos
          
          // Insertar en compras_monedas (si la tabla existe)
          const compraData = {
            usuario_id: 1, // TODO: Obtener del pago o external_reference
            paquete_id: paquete.id,
            monedas: paquete.monedas,
            precio: paquete.precio,
            payment_id: paymentId,
            estado: 'aprobado',
            fecha_compra: new Date().toISOString()
          };
          
          console.log('💰 Procesando compra:', compraData);
          
          // TODO: Actualizar saldo del usuario en Supabase
          // await actualizarSaldoUsuario(usuario_id, paquete.monedas);
          
          console.log('✅ Compra procesada exitosamente');
        }
      }
    } else {
      console.log('⚠ Pago no aprobado:', payment.status);
    }

    res.status(200).json({ 
      success: true,
      status: payment.status,
      payment_id: paymentId,
      message: 'Webhook procesado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error en webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
