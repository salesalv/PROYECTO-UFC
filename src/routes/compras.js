import express from 'express';
import supabase from '../db.js';
import jwt from 'jsonwebtoken';
import { crearPreferenciaCheckoutPro } from '../services/checkoutProService.js';

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

// Definir paquetes de monedas disponibles
const PAQUETES_MONEDAS = [
  {
    id: 'basico',
    nombre: 'Paquete Básico',
    monedas: 100,
    precio: 2.99,
    popular: false
  },
  {
    id: 'estandar',
    nombre: 'Paquete Estándar',
    monedas: 500,
    precio: 9.99,
    popular: true
  },
  {
    id: 'premium',
    nombre: 'Paquete Premium',
    monedas: 1200,
    precio: 19.99,
    popular: false
  },
  {
    id: 'pro',
    nombre: 'Paquete Pro',
    monedas: 2500,
    precio: 34.99,
    popular: false
  }
];

// GET /api/compras/paquetes - Obtener paquetes disponibles
router.get('/paquetes', (req, res) => {
  try {
    res.json({
      success: true,
      paquetes: PAQUETES_MONEDAS
    });
  } catch (error) {
    console.error('Error obteniendo paquetes:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// GET /api/compras/saldo - Obtener saldo del usuario
router.get('/saldo', verifyToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('usuario')
      .select('saldo')
      .eq('id', req.userId)
      .single();

    if (error) {
      console.error('Error obteniendo saldo:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error obteniendo saldo' 
      });
    }

    res.json({
      success: true,
      saldo: parseFloat(user.saldo) || 0
    });
  } catch (error) {
    console.error('Error obteniendo saldo:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// POST /api/compras/crear-pago - Crear intención de pago con Checkout Pro
router.post('/crear-pago', verifyToken, async (req, res) => {
  try {
    const { paqueteId } = req.body;

    const paquete = PAQUETES_MONEDAS.find(p => p.id === paqueteId);
    if (!paquete) {
      return res.status(400).json({ 
        success: false, 
        error: 'Paquete no encontrado' 
      });
    }

    const datosPago = {
      usuario_id: req.userId,
      paquete: paquete,
      baseUrl: process.env.BASE_URL || 'http://localhost:3001',
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
    };

    // Crear preferencia con Checkout Pro
    const respuestaPago = await crearPreferenciaCheckoutPro(datosPago);

    // Registrar la intención de pago en la base de datos
    try {
      await supabase.from('compras_monedas').insert([{
        usuario_id: req.userId,
        paquete_id: paquete.id,
        monedas: paquete.monedas,
        precio: paquete.precio,
        payment_id: respuestaPago.external_reference,
        estado: 'pendiente'
      }]);
    } catch (dbError) {
      console.warn('No se pudo registrar la intención de pago:', dbError);
    }

    res.json({
      success: true,
      preference_id: respuestaPago.id,
      init_point: respuestaPago.init_point,
      sandbox_init_point: respuestaPago.sandbox_init_point,
      external_reference: respuestaPago.external_reference,
      expires: respuestaPago.expires,
      expiration_date_to: respuestaPago.expiration_date_to
    });
  } catch (error) {
    console.error('Error creando pago:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Error interno del servidor' 
    });
  }
});

// POST /api/compras/procesar-pago - Procesar pago exitoso (webhook)
router.post('/procesar-pago', async (req, res) => {
  try {
    const { payment_id, status, paquete_id, usuario_id } = req.body;

    if (!payment_id || !status || !paquete_id || !usuario_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Faltan datos requeridos' 
      });
    }

    // Verificar que el pago esté aprobado
    if (status !== 'approved') {
      return res.status(400).json({ 
        success: false, 
        error: 'Pago no aprobado' 
      });
    }

    const paquete = PAQUETES_MONEDAS.find(p => p.id === paquete_id);
    if (!paquete) {
      return res.status(400).json({ 
        success: false, 
        error: 'Paquete no encontrado' 
      });
    }

    // Verificar si ya se procesó este pago
    const { data: pagoExistente } = await supabase
      .from('compras_monedas')
      .select('*')
      .eq('payment_id', payment_id)
      .single();

    if (pagoExistente) {
      return res.status(400).json({ 
        success: false, 
        error: 'Pago ya procesado anteriormente' 
      });
    }

    // Obtener saldo actual del usuario
    const { data: user, error: userError } = await supabase
      .from('usuario')
      .select('saldo')
      .eq('id', usuario_id)
      .single();

    if (userError) {
      console.error('Error obteniendo usuario:', userError);
      return res.status(500).json({ 
        success: false, 
        error: 'Error obteniendo datos del usuario' 
      });
    }

    // Calcular nuevo saldo
    const nuevoSaldo = parseFloat(user.saldo) + paquete.monedas;

    // Actualizar saldo del usuario
    const { error: updateError } = await supabase
      .from('usuario')
      .update({ saldo: nuevoSaldo })
      .eq('id', usuario_id);

    if (updateError) {
      console.error('Error actualizando saldo:', updateError);
      return res.status(500).json({ 
        success: false, 
        error: 'Error actualizando saldo del usuario' 
      });
    }

    // Registrar transacción de monedas
    try {
      await supabase.from('transacciones_moneda').insert([{
        usuario_id: usuario_id,
        tipo: 'ingreso',
        cantidad: paquete.monedas,
        motivo: `compra_paquete_${paquete.id}`
      }]);
    } catch (txError) {
      console.warn('No se pudo registrar transacción:', txError);
      // No es crítico, continuamos
    }

    // Registrar la compra
    try {
      await supabase.from('compras_monedas').insert([{
        usuario_id: usuario_id,
        paquete_id: paquete.id,
        monedas: paquete.monedas,
        precio: paquete.precio,
        payment_id: payment_id,
        fecha: new Date().toISOString(),
        estado: 'completado'
      }]);
    } catch (compraError) {
      console.warn('No se pudo registrar compra:', compraError);
      // No es crítico, continuamos
    }

    res.json({
      success: true,
      nuevo_saldo: nuevoSaldo,
      monedas_agregadas: paquete.monedas,
      paquete: paquete.nombre
    });
  } catch (error) {
    console.error('Error procesando pago:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// GET /api/compras/historial - Obtener historial de compras del usuario
router.get('/historial', verifyToken, async (req, res) => {
  try {
    const { data: compras, error } = await supabase
      .from('compras_monedas')
      .select('*')
      .eq('usuario_id', req.userId)
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error obteniendo historial:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error obteniendo historial de compras' 
      });
    }

    res.json({
      success: true,
      compras: compras || []
    });
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// GET /api/compras/transacciones - Obtener historial de transacciones de monedas
router.get('/transacciones', verifyToken, async (req, res) => {
  try {
    const { data: transacciones, error } = await supabase
      .from('transacciones_moneda')
      .select('*')
      .eq('usuario_id', req.userId)
      .order('fecha', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error obteniendo transacciones:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error obteniendo historial de transacciones' 
      });
    }

    res.json({
      success: true,
      transacciones: transacciones || []
    });
  } catch (error) {
    console.error('Error obteniendo transacciones:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// POST /api/compras/webhook - Webhook de MercadoPago
router.post('/webhook', async (req, res) => {
  try {
    console.log('Webhook recibido:', req.body);
    
    // Procesar el webhook con el servicio de MercadoPago
    const datosProcesados = await mercadopagoService.procesarWebhook(req.body);
    
    // Si es un evento de pago aprobado, procesar la compra
    if (datosProcesados.tipo === 'payment' && datosProcesados.estado === 'approved') {
      await procesarCompraExitoso(datosProcesados);
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error procesando webhook:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/compras/test-payment/:paymentId - Endpoint para testing de pagos
router.all('/test-payment/:paymentId', verifyToken, async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // Simular que el pago fue aprobado
    const datosPagoTest = {
      tipo: 'payment',
      payment_id: paymentId,
      estado: 'approved',
      usuario_id: req.userId,
      paquete_id: 'estandar', // Paquete por defecto para testing
      monedas: 500,
      monto: 9.99
    };
    
    await procesarCompraExitoso(datosPagoTest);
    
    res.json({
      success: true,
      message: 'Pago de prueba procesado exitosamente',
      nuevo_saldo: await obtenerSaldoUsuario(req.userId)
    });
  } catch (error) {
    console.error('Error procesando pago de prueba:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error procesando pago de prueba' 
    });
  }
});

/**
 * Función auxiliar para procesar una compra exitosa
 * @param {Object} datosPago - Datos del pago realizado
 */
async function procesarCompraExitoso(datosPago) {
  const { payment_id, usuario_id, paquete_id, monedas } = datosPago;
  
  // Verificar si ya se procesó este pago
  const { data: pagoExistente } = await supabase
    .from('compras_monedas')
    .select('*')
    .eq('payment_id', payment_id)
    .eq('estado', 'completado')
    .single();

  if (pagoExistente) {
    console.log(`Pago ${payment_id} ya fue procesado anteriormente`);
    return;
  }

  // Obtener el paquete
  const paquete = PAQUETES_MONEDAS.find(p => p.id === paquete_id);
  if (!paquete) {
    throw new Error(`Paquete ${paquete_id} no encontrado`);
  }

  // Obtener saldo actual del usuario
  const { data: user, error: userError } = await supabase
    .from('usuario')
    .select('saldo')
    .eq('id', usuario_id)
    .single();

  if (userError) {
    throw new Error('Error obteniendo datos del usuario');
  }

  // Calcular nuevo saldo
  const nuevoSaldo = parseFloat(user.saldo) + monedas;

  // Actualizar saldo del usuario
  const { error: updateError } = await supabase
    .from('usuario')
    .update({ saldo: nuevoSaldo })
    .eq('id', usuario_id);

  if (updateError) {
    throw new Error('Error actualizando saldo del usuario');
  }

  // Registrar transacción de monedas
  try {
    await supabase.from('transacciones_moneda').insert([{
      usuario_id: usuario_id,
      tipo: 'ingreso',
      cantidad: monedas,
      motivo: `compra_paquete_${paquete.id}_${payment_id}`
    }]);
  } catch (txError) {
    console.warn('No se pudo registrar transacción:', txError);
  }

  // Actualizar el estado de la compra
  try {
    await supabase
      .from('compras_monedas')
      .update({ 
        estado: 'completado',
        procesado_at: new Date().toISOString()
      })
      .eq('payment_id', payment_id);
  } catch (updateError) {
    console.warn('No se pudo actualizar estado de compra:', updateError);
  }

  console.log(`Compra procesada exitosamente: ${payment_id}, Usuario: ${usuario_id}, Monedas: ${monedas}`);
}

/**
 * Función auxiliar para obtener el saldo de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<number>} Saldo del usuario
 */
async function obtenerSaldoUsuario(userId) {
  const { data: user, error } = await supabase
    .from('usuario')
    .select('saldo')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error('Error obteniendo saldo del usuario');
  }

  return parseFloat(user.saldo) || 0;
}

export default router;
