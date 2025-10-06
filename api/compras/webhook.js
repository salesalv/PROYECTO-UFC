// Configuración simplificada para testing
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
    console.log('🔔 Webhook recibido:', JSON.stringify(req.body, null, 2));
    
    // MercadoPago puede enviar diferentes formatos de notificación
    let paymentId = null;
    
    // Formato 1: { data: { id: "123456" } }
    if (req.body.data && req.body.data.id) {
      paymentId = req.body.data.id;
      console.log('💳 ID del pago (formato 1):', paymentId);
    }
    // Formato 2: { id: "123456" }
    else if (req.body.id) {
      paymentId = req.body.id;
      console.log('💳 ID del pago (formato 2):', paymentId);
    }
    // 🛒 Formato 3: merchant_orders PRIMERO, antes que los otros
    else if (req.body.resource && req.body.resource.includes('merchant_orders')) {
      console.log('🛒 Detectado merchant_order:', req.body.resource);
      const merchantOrderMatch = req.body.resource.match(/merchant_orders\/(\d+)/);
      if (merchantOrderMatch) {
        const merchantOrderId = merchantOrderMatch[1];
        console.log('🛒 Merchant Order ID extraído:', merchantOrderId);
        
        // Obtener el payment_id del merchant_order
        try {
          const moResponse = await fetch(`https://api.mercadopago.com/merchant_orders/${merchantOrderId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (moResponse.ok) {
            const moData = await moResponse.json();
            console.log('📦 Merchant Order Data:', JSON.stringify(moData, null, 2));
            
            if (moData.payments && moData.payments.length > 0) {
              paymentId = moData.payments[0].id;
              console.log('💳 ID del pago (desde merchant_order):', paymentId);
            } else {
              console.log('⚠️ No se encontraron pagos en el merchant_order');
            }
          } else {
            const errorText = await moResponse.text();
            console.error('❌ Error en respuesta de merchant_order:', moResponse.status, errorText);
          }
        } catch (error) {
          console.error('❌ Error obteniendo merchant_order:', error);
        }
      } else {
        console.log('⚠️ No se pudo extraer merchant_order_id de:', req.body.resource);
      }
    }
    // Formato 4: { resource: "/v1/payments/123456" }
    else if (req.body.resource && req.body.resource.includes('/v1/payments/')) {
      const resourceMatch = req.body.resource.match(/\/v1\/payments\/(.+)/);
      if (resourceMatch) {
        paymentId = resourceMatch[1];
        console.log('💳 ID del pago (formato 4):', paymentId);
      }
    }
    // Formato 5: { resource: "123456789", topic: "payment" }
    else if (req.body.resource && req.body.topic === 'payment') {
      // Si resource es solo un número o string, es el payment_id
      if (/^[a-zA-Z0-9_]+$/.test(req.body.resource)) {
        paymentId = req.body.resource;
        console.log('💳 ID del pago (formato 5 - string):', paymentId);
      }
      // Si resource es una URL, extraer el ID
      else if (req.body.resource.includes('/payments/')) {
        const paymentMatch = req.body.resource.match(/\/payments\/(.+)/);
        if (paymentMatch) {
          paymentId = paymentMatch[1];
          console.log('💳 ID del pago (formato 5 - URL):', paymentId);
        }
      }
    }
    
    if (!paymentId) {
      console.log('⚠️ Notificación no relacionada con pagos:', JSON.stringify(req.body, null, 2));
      return res.status(200).json({ 
        received: true,
        message: 'Notificación procesada (no es un pago)',
        type: req.body.topic || 'unknown',
        body: req.body
      });
    }

    // Verificar el estado del pago en MercadoPago
    console.log('🔍 Verificando pago en MercadoPago...');
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!mpResponse.ok) {
      const errorText = await mpResponse.text();
      console.error(`❌ Error verificando pago en MercadoPago: ${mpResponse.status}`, errorText);
      throw new Error(`Error verificando pago en MercadoPago: ${mpResponse.status}`);
    }

    const paymentData = await mpResponse.json();
    console.log('💳 Datos del pago:', JSON.stringify(paymentData, null, 2));

    // Verificar si el pago fue aprobado
    if (paymentData.status !== 'approved') {
      console.log('⚠️ Pago no aprobado:', paymentData.status);
      return res.status(200).json({ 
        received: true,
        message: 'Pago no aprobado',
        status: paymentData.status
      });
    }

    // Obtener información del paquete desde external_reference
    const externalReference = paymentData.external_reference;
    if (!externalReference) {
      throw new Error('External reference no encontrado');
    }

    // Extraer el ID del paquete del external_reference
    const paqueteId = externalReference.split('_')[2]; // smash_ufc_{paqueteId}_{timestamp}
    
    const paquetes = [
      { id: 'basico', nombre: 'Paquete Básico', monedas: 100, precio: 0.01 },
      { id: 'estandar', nombre: 'Paquete Estándar', monedas: 500, precio: 9.99 },
      { id: 'premium', nombre: 'Paquete Premium', monedas: 1200, precio: 19.99 },
      { id: 'pro', nombre: 'Paquete Pro', monedas: 2500, precio: 34.99 }
    ];

    const paquete = paquetes.find(p => p.id === paqueteId);
    if (!paquete) {
      throw new Error('Paquete no encontrado');
    }

    // Buscar la compra en la base de datos para obtener el usuario correcto
    let compra = null;
    
    // Buscar por external_reference primero
    const compraResponse = await fetch(`${SUPABASE_URL}/rest/v1/compras_monedas?external_reference=eq.${externalReference}`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (compraResponse.ok) {
      const compras = await compraResponse.json();
      if (compras && compras.length > 0) {
        compra = compras[0];
        console.log('✅ Compra encontrada por external_reference:', compra.id);
      }
    }
    
    // Si no se encontró por external_reference, buscar por payment_id
    if (!compra) {
      const compraResponse2 = await fetch(`${SUPABASE_URL}/rest/v1/compras_monedas?payment_id=eq.${paymentId}`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (compraResponse2.ok) {
        const compras = await compraResponse2.json();
        if (compras && compras.length > 0) {
          compra = compras[0];
          console.log('✅ Compra encontrada por payment_id:', compra.id);
        }
      }
    }
    
    if (!compra) {
      console.log('❌ Compra no encontrada en la base de datos');
      console.log('🔍 Datos disponibles:', {
        paymentId,
        externalReference,
        paymentData: {
          id: paymentData.id,
          status: paymentData.status,
          external_reference: paymentData.external_reference,
          transaction_amount: paymentData.transaction_amount
        }
      });
      
      // Verificar si hay compras en la base de datos
      const allComprasResponse = await fetch(`${SUPABASE_URL}/rest/v1/compras_monedas?select=*&order=fecha_compra.desc&limit=5`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (allComprasResponse.ok) {
        const allCompras = await allComprasResponse.json();
        console.log('📋 Últimas 5 compras en la base de datos:', allCompras);
      }
      
      return res.status(200).json({ 
        received: true,
        message: 'Compra no encontrada - posiblemente no se registró correctamente',
        paymentId: paymentId,
        externalReference: externalReference
      });
    }

    // Verificar si ya se procesó este pago
    if (compra.estado === 'completado') {
      console.log('⚠️ Pago ya fue procesado anteriormente:', paymentId);
      return res.status(200).json({ 
        received: true,
        message: 'Pago ya procesado',
        paymentId: paymentId,
        estado: compra.estado
      });
    }

    const userId = compra.usuario_id;
    console.log('👤 ID del usuario desde compra:', userId);

    // Buscar el usuario en Supabase por ID
    const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/usuario?id=eq.${userId}&select=id,nombre_usuario,correo,saldo`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text();
      console.error(`❌ Error buscando usuario en Supabase: ${supabaseResponse.status}`, errorText);
      throw new Error(`Error buscando usuario en Supabase: ${supabaseResponse.status} - ${errorText}`);
    }

    const usuarios = await supabaseResponse.json();
    console.log('👤 Usuarios encontrados:', usuarios);
    if (!usuarios || usuarios.length === 0) {
      throw new Error('Usuario no encontrado en Supabase');
    }

    const usuario = usuarios[0];
    console.log('👤 Usuario encontrado:', usuario.nombre_usuario, 'Saldo actual:', usuario.saldo);
    const nuevoSaldo = Number(usuario.saldo) + Number(paquete.monedas);
    console.log('💰 Nuevo saldo calculado:', nuevoSaldo);

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

    // Actualizar el estado de la compra
    const estadoResponse = await fetch(`${SUPABASE_URL}/rest/v1/compras_monedas?id=eq.${compra.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        estado: 'completado',
        procesado_at: new Date().toISOString()
      }),
    });

    if (!estadoResponse.ok) {
      console.warn('⚠️ No se pudo actualizar el estado de la compra');
    }

    // Registrar la transacción en el historial (si la tabla existe)
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/transacciones_moneda`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: usuario.id,
          cantidad: paquete.monedas,
          tipo: 'ingreso',
          motivo: `Compra de ${paquete.nombre}`,
          fecha: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.warn('No se pudo registrar la transacción:', error);
    }

    console.log('✅ Monedas acreditadas exitosamente:', {
      usuario: usuario.nombre_usuario,
      monedas: paquete.monedas,
      nuevoSaldo: nuevoSaldo
    });

    res.status(200).json({ 
      received: true,
      message: 'Pago procesado y monedas acreditadas',
      usuario: usuario.nombre_usuario,
      monedas: paquete.monedas,
      nuevoSaldo: nuevoSaldo
    });
  } catch (error) {
    console.error('❌ Error en webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
