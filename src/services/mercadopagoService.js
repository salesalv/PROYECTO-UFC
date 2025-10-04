import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

// Configuración de MercadoPago (en producción usar variables de entorno)
const config = {
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST_ACCESS_TOKEN',
  options: {
    timeout: 5000,
    idempotencyKey: `mp_${Date.now()}`,
  },
};

const client = new MercadoPagoConfig(config);
const payment = new Payment(client);
const preference = new Preference(client);

/**
 * Crear una preferencia de pago en MercadoPago
 * @param {Object} datosPago - Datos del pago
 * @param {string} datosPago.usuario_id - ID del usuario
 * @param {Object} datosPago.paquete - Paquete de monedas
 * @returns {Promise<Object>} Respuesta de MercadoPago
 */
export async function crearPreferenciaMercadoPago(datosPago) {
  try {
    const { usuario_id, paquete } = datosPago;
    
    const preferenciaData = {
      items: [
        {
          title: paquete.nombre,
          quantity: 1,
          unit_price: paquete.precio,
          currency_id: 'ARS', // Pesos argentinos
        },
      ],
      external_reference: `compra_${usuario_id}_${Date.now()}`,
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12, // Máximo 12 cuotas
      },
      notification_url: `${process.env.BASE_URL}/api/compras/webhook`,
      back_urls: {
        success: `${process.env.FRONTEND_URL}/comprar-monedas/success`,
        failure: `${process.env.FRONTEND_URL}/comprar-monedas/failure`,
        pending: `${process.env.FRONTEND_URL}/comprar-monedas/pending`,
      },
      auto_return: 'approved',
      metadata: {
        usuario_id: usuario_id,
        paquete_id: paquete.id,
        monedas: paquete.monedas,
      },
    };

    const response = await preference.create({ body: preferenciaData });
    
    return {
      success: true,
      id: response.id,
      init_point: response.init_point,
      external_reference: response.external_reference,
    };
  } catch (error) {
    console.error('Error creando preferencia MercadoPago:', error);
    throw new Error(`Error creando pago: ${error.message}`);
  }
}

/**
 * Verificar el estado de un pago en MercadoPago
 * @param {string} paymentId - ID del pago
 * @returns {Promise<Object>} Estado del pago
 */
export async function verificarEstadoPago(paymentId) {
  try {
    const response = await payment.get({ id: paymentId });
    
    return {
      id: response.id,
      status: response.status,
      status_detail: response.status_detail,
      external_reference: response.external_reference,
      metadata: response.metadata,
      amount: response.transaction_amount,
      currency: response.currency_id,
      date_approved: response.date_approved,
    };
  } catch (error) {
    console.error('Error verificando pago:', error);
    throw new Error(`Error verificando pago: ${error.message}`);
  }
}

/**
 * Procesar webhook de MercadoPago
 * @param {Object} webhookData - Datos del webhook
 * @returns {Promise<Object>} Datos procesados
 */
export async function procesarWebhook(webhookData) {
  try {
    // Verificar que sea un evento de pago
    if (webhookData.type === 'payment') {
      const paymentId = webhookData.data.id;
      const estadoPago = await verificarEstadoPago(paymentId);
      
      return {
        tipo: 'payment',
        payment_id: paymentId,
        estado: estadoPago.status,
        usuario_id: estadoPago.metadata?.usuario_id,
        paquete_id: estadoPago.metadata?.paquete_id,
        monedas: estadoPago.metadata?.monedas,
        monto: estadoPago.amount,
      };
    }
    
    return {
      tipo: webhookData.type,
      procesado_los: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error procesando webhook:', error);
    throw new Error(`Error procesando webhook: ${error.message}`);
  }
}

/**
 * Simular pago para testing (solo usar en desarrollo)
 * @param {Object} datosPago - Datos del pago simulado
 * @returns {Promise<Object>} Pago simulado
 */
export async function simularPago(datosPago) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Simulación solo disponible en desarrollo');
  }
  
  const { usuario_id, paquete } = datosPago;
  const paymentId = `test_${Date.now()}_${usuario_id}`;
  
  return {
    success: true,
    id: paymentId,
    init_point: `${process.env.FRONTEND_URL}/comprar-monedas/test-payment/${paymentId}`,
    external_reference: `compra_${usuario_id}_${Date.now()}`,
    simulated: true,
  };
}

export default {
  crearPreferenciaMercadoPago,
  verificarEstadoPago,
  procesarWebhook,
  simularPago,
};
