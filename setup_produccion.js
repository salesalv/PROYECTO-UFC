/**
 * Script para configurar MercadoPago en producción
 * Ejecutar: node setup_produccion.js
 */

import dotenv from 'dotenv';
dotenv.config();

console.log('🚀 Configuración de MercadoPago para Producción');
console.log('');

// Verificar variables de entorno
const requiredEnvVars = [
  'MERCADOPAGO_ACCESS_TOKEN',
  'MERCADOPAGO_PUBLIC_KEY',
  'BASE_URL',
  'FRONTEND_URL',
  'JWT_SECRET'
];

console.log('📋 Verificando configuración requerida:');
console.log('');

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: Configurado`);
    if (envVar.includes('SECRET') || envVar.includes('TOKEN')) {
      console.log(`   Valor: ${value.substring(0, 10)}...`);
    } else {
      console.log(`   Valor: ${value}`);
    }
  } else {
    console.log(`❌ ${envVar}: NO CONFIGURADO`);
  }
});

console.log('');
console.log('🔧 Información de configuración:');
console.log('');

// Información sobre acceso tokens
if (process.env.MERCADOPAGO_ACCESS_TOKEN && process.env.MERCADOPAGO_ACCESS_TOKEN.startsWith('TEST_')) {
  console.log('⚠️  MODO TESTING detectado');
  console.log('   Para producción, debes usar un access token real');
  console.log('   Formato: APP_USR_xxxxxxxxxxxxxxxxxxxxxxxxxxx');
} else if (process.env.MERCADOPAGO_ACCESS_TOKEN && process.env.MERCADOPAGO_ACCESS_TOKEN.startsWith('APP_USR_')) {
  console.log('✅ MODO PRODUCCIÓN detectado');
  console.log('   Token válido para recibir pagos reales');
} else {
  console.log('❌ Token de acceso inválido o no configurado');
}

// Información sobre URLs
if (process.env.BASE_URL && process.env.BASE_URL.includes('localhost')) {
  console.log('⚠️  URL localhost detectada');
  console.log('   Para producción, configura tu dominio real');
  console.log('   Ejemplo: https://tu-dominio.com');
} else if (process.env.BASE_URL && process.env.BASE_URL.startsWith('https://')) {
  console.log('✅ URL de producción detectada');
  console.log(`   Backend: ${process.env.BASE_URL}`);
  console.log(`   Frontend: ${process.env.FRONTEND_URL}`);
}

console.log('');
console.log('🌐 URLs que necesitas configurar en MercadoPago:');
console.log('');

if (process.env.BASE_URL && process.env.FRONTEND_URL) {
  console.log('📡 Webhook URL:');
  console.log(`   ${process.env.BASE_URL}/api/compras/webhook`);
  console.log('');
  
  console.log('🔄 URLs de Retorno:');
  console.log(`   Success: ${process.env.FRONTEND_URL}/comprar-monedas/success`);
  console.log(`   Failure: ${process.env.FRONTEND_URL}/comprar-monedas/failure`);
  console.log(`   Pending: ${process.env.FRONTEND_URL}/comprar-monedas/pending`);
} else {
  console.log('❌ URLs no configuradas. Configura BASE_URL y FRONTEND_URL');
}

console.log('');
console.log('💳 Información sobre Comisiones:');
console.log('');
console.log('💰 Argentina:');
console.log('   Por transacción: 3.49% + $6.50');
console.log('   Ejemplo: Usuario paga $9.99 → Recibes ~$9.64');
console.log('');
console.log('🔄 Transferencia a banco:');
console.log('   Desde MercadoPago a tu cuenta bancaria');
console.log('   Tiempo: 1-2 días hábiles');
console.log('   Sin costo adicional');

console.log('');
console.log('📋 Pasos siguientes:');
console.log('');
console.log('1. ✅ Crea cuenta empresarial en MercadoPago');
console.log('2. ✅ Obtén credenciales de producción');
console.log('3. ✅ Configura variables de entorno');
console.log('4. ✅ Configura webhook en MercadoPago');
console.log('5. ✅ Configura URLs de retorno');
console.log('6. ✅ Prueba con tarjetas reales');

console.log('');
console.log('🔍 Para verificar configuración actual:');
console.log('');
console.log('✅ Backend corriendo:', process.env.NODE_ENV === 'production' ? 'PRODUCCIÓN' : 'DESARROLLO');
console.log('✅ Puerto:', process.env.PORT || 3001);

console.log('');
console.log('🎉 ¡Una vez configurado, recibirás dinero real por cada compra!');


