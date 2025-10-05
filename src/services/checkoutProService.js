import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuración de MercadoPago
const config = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-6082603998976520-100418-2a1d606a17c86190e7589c021dfa3a60-2903456179',
  options: {
    timeout: 5000,
    idempotencyKey: `mp_${Date.now()}`,
  },
});

const preference = new Preference(config);

/**
 * Crear preferencia de pago para Checkout Pro
 * @param {Object} datosPago - Datos del pago
 * @param {string} datosPago.usuario_id - ID del usuario
 * @param {Object} datosPago.paquete - Paquete de monedas
 * @param {string} datosPago.baseUrl - URL base del sitio
 * @param {string} datosPago.frontendUrl - URL del frontend
 * @returns {Promise<Object>} Respuesta de MercadoPago
 */
export async function crearPreferenciaCheckoutPro(datosPago) {
  try {
    const { usuario_id, paquete, baseUrl, frontendUrl } = datosPago;
    
    // Generar ID único para la transacción
    const externalReference = `smash_ufc_${usuario_id}_${paquete.id}_${Date.now()}`;
    
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
      payer: {
        // Información del pagador (opcional, se puede completar en el checkout)
        name: 'Usuario',
        surname: 'SMASH UFC',
      },
      external_reference: externalReference,
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12, // Máximo 12 cuotas
        default_installments: 1,
      },
      notification_url: `${baseUrl}/api/compras/webhook`,
      back_urls: {
        success: `${frontendUrl}/comprar-monedas/success`,
        failure: `${frontendUrl}/comprar-monedas/failure`,
        pending: `${frontendUrl}/comprar-monedas/pending`,
      },
      auto_return: 'approved',
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      metadata: {
        usuario_id: usuario_id,
        paquete_id: paquete.id,
        monedas: paquete.monedas,
        plataforma: 'SMASH UFC',
        version: '1.0',
      },
      additional_info: `Compra de ${paquete.monedas} monedas virtuales para la plataforma SMASH UFC. El usuario podrá usar estas monedas para participar en predicciones, apuestas y otras actividades de la plataforma.`,
      statement_descriptor: 'SMASH UFC',
    };

    const response = await preference.create({ body: preferenciaData });
    
    return {
      success: true,
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
      external_reference: response.external_reference,
      expires: response.expires,
      expiration_date_from: response.expiration_date_from,
      expiration_date_to: response.expiration_date_to,
    };
  } catch (error) {
    console.error('Error creando preferencia Checkout Pro:', error);
    throw new Error(`Error creando preferencia: ${error.message}`);
  }
}

/**
 * Obtener información de una preferencia
 * @param {string} preferenceId - ID de la preferencia
 * @returns {Promise<Object>} Información de la preferencia
 */
export async function obtenerPreferencia(preferenceId) {
  try {
    const response = await preference.get({ id: preferenceId });
    
    return {
      success: true,
      preference: response,
    };
  } catch (error) {
    console.error('Error obteniendo preferencia:', error);
    throw new Error(`Error obteniendo preferencia: ${error.message}`);
  }
}

export default {
  crearPreferenciaCheckoutPro,
  obtenerPreferencia,
};
