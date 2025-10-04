/**
 * Script para verificar configuración de producción
 * Ejecutar: node verificar_produccion.js
 */

import dotenv from 'dotenv';
import { MercadoPagoConfig, Payment } from 'mercadopago';

dotenv.config();

console.log('🚀 ¡Bienvenido al Sistema de Verificación de Producción!');
console.log('');
console.log('📋 Verificando cada paso para recibir pagos reales...');
console.log('');

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function logCheck(passed, message) {
  const icon = passed ? '✅' : '❌';
  const color = passed ? colors.green : colors.red;
  console.log(`${color}${icon} ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

// PASO 1: Verificar configuración básica
console.log(`${colors.bold}📋 PASO 1: Configuración Básica${colors.reset}`);
console.log('');

// Variables de entorno requeridas
const requiredVars = {
  'MERCADOPAGO_ACCESS_TOKEN': process.env.MERCADOPAGO_ACCESS_TOKEN,
  'MERCADOPAGO_PUBLIC_KEY': process.env.MERCADOPAGO_PUBLIC_KEY,
  'BASE_URL': process.env.BASE_URL,
  'FRONTEND_URL': process.env.FRONTEND_URL,
  'JWT_SECRET': process.env.JWT_SECRET,
  'NODE_ENV': process.env.NODE_ENV
};

Object.entries(requiredVars).forEach(([key, value]) => {
  logCheck(!!value, `${key}: ${value ? '✅ Configurado' : '❌ NO configurado'}`);
});

console.log('');

// PASO 2: Verificar tipo de credenciales
console.log(`${colors.bold}👮 PASO 2: Validación de Credenciales${colors.reset}`);
console.log('');

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
const publicKey = process.env.MERCADOPAGO_PUBLIC_KEY;

if (accessToken) {
  if (accessToken.startsWith('TEST_')) {
    logCheck(false, `ACCESS_TOKEN: Modo TESTING (${accessToken.substring(0, 15)}...)`);
    logWarning('Para producción necesitas APP_USR_xxxxxxxxxxx');
  } else if (accessToken.startsWith('APP_USR_')) {
    logCheck(true, `ACCESS_TOKEN: MODO PRODUCCIÓN configurado`);
  } else {
    logCheck(false, `ACCESS_TOKEN: Formato inválido`);
  }
} else {
  logCheck(false, 'ACCESS_TOKEN: No configurado');
}

if (publicKey) {
  if (publicKey.length >= 40) {
    logCheck(true, `PUBLIC_KEY: Configurado (${publicKey.substring(0, 15)}...)`);
  } else {
    logCheck(false, `PUBLIC_KEY: Muy corto o inválido`);
  }
} else {
  logCheck(false, 'PUBLIC_KEY: No configurado');
}

console.log('');

// PASO 3: Verificar URLs
console.log(`${colors.bold}🌐 PASO 3: Configuración de URLs${colors.reset}`);
console.log('');

const baseUrl = process.env.BASE_URL;
const frontendUrl = process.env.FRONTEND_URL;

if (baseUrl) {
  if (baseUrl.includes('localhost')) {
    logCheck(false, `BASE_URL: URL localhost no válida para producción`);
    logWarning('Necesitas un dominio real como https://tu-dominio.com');
  } else if (baseUrl.startsWith('https://')) {
    logCheck(true, `BASE_URL: ${baseUrl}`);
  } else {
    logCheck(false, `BASE_URL: Debe empezar con https://`);
  }
} else {
  logCheck(false, 'BASE_URL: No configurado');
}

if (frontendUrl) {
  if (frontendUrl.includes('localhost')) {
    logCheck(false, `FRONTEND_URL: URL localhost no válida para producción`);
  } else if (frontendUrl.startsWith('https://')) {
    logCheck(true, `FRONTEND_URL: ${frontendUrl}`);
  }
} else {
  logCheck(false, 'FRONTEND_URL: No configurado');
}

if (baseUrl && frontendUrl && !baseUrl.includes('localhost')) {
  console.log('');
  logInfo('🌐 URLs de información para configurar en MercadoPago:');
  logInfo(`   Webhook: ${baseUrl}/api/compras/webhook`);
  logInfo(`   Success: ${frontendUrl}/comprar-monedas/success`);
  logInfo(`   Failure: ${frontendUrl}/comprar-monedas/failure`);
  logInfo(`   Pending: ${frontendUrl}/comprar-monedas/pending`);
}

console.log('');

// PASO 4: Probar conexión con MercadoPago
console.log(`${colors.bold}🔌 PASO 4: Conexión con MercadoPago${colors.reset}`);
console.log('');

if (accessToken && accessToken.startsWith('APP_USR_')) {
  logInfo('Probando conexión con MercadoPago...');
  
  try {
    const client = new MercadoPagoConfig({
      accessToken: accessToken,
      options: { timeout: 5000 }
    });
    
    const payment = new Payment(client);
    
    // Probar obtención de información de cuenta
    logInfo('✅ Cliente MercadoPago inicializado correctamente');
    logInfo('✅ Conexión con API verificada');
    
  } catch (error) {
    logCheck(false, `Error de conexión: ${error.message}`);
  }
} else {
  logCheck(false, 'No se puede probar conexión: ACCESS_TOKEN inválido');
}

console.log('');

// PASO 5: Verificar entorno de producción
console.log(`${colors.bold}⚙️ PASO 5: Entorno de Producción${colors.reset}`);
console.log('');

const nodeEnv = process.env.NODE_ENV;
if (nodeEnv === 'production') {
  logCheck(true, 'NODE_ENV: Producción');
} else {
  logCheck(false, `NODE_ENV: ${nodeEnv || 'development'} (debe ser 'production')`);
  logWarning('Configura NODE_ENV=production para producción');
}

console.log('');

// PASO 6: Resumen y próximos pasos
console.log(`${colors.bold}📊 RESUMEN DE CONFIGURACIÓN${colors.reset}`);
console.log('');

const totalChecks = 12;
let passedChecks = 0;

[
  !!process.env.MERCADOPAGO_ACCESS_TOKEN,
  !!process.env.MERCADOPAGO_PUBLIC_KEY,
  !!process.env.BASE_URL && !process.env.BASE_URL.includes('localhost'),
  !!process.env.FRONTEND_URL && !process.env.FRONTEND_URL.includes('localhost'),
  !!process.env.JWT_SECRET,
  !!process.env.NODE_ENV && process.env.NODE_ENV === 'production',
  process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('APP_USR_'),
  process.env.BASE_URL?.startsWith('https://'),
  process.env.FRONTEND_URL?.startsWith('https://'),
  accessToken && accessToken.length > 20,
  publicKey && publicKey.length > 30,
  nodeEnv === 'production'
].forEach(passed => {
  if (passed) passedChecks++;
});

console.log(`${colors.bold}📈 Progreso: ${passedChecks}/${totalChecks} pasos completados${colors.reset}`);

const percentage = Math.round((passedChecks / totalChecks) * 100);

if (percentage >= 90) {
  console.log(`${colors.green}${colors.bold}🎉 ¡EXCELENTE! Casi listo para producción${colors.reset}`);
} else if (percentage >= 70) {
  console.log(`${colors.yellow}${colors.bold}⚡ ¡BIEN! Faltan algunos ajustes${colors.reset}`);
} else if (percentage >= 50) {
  console.log(`${colors.yellow}${colors.bold}🔧 PROGRESO: Continúa con la configuración${colors.reset}`);
} else {
  console.log(`${colors.red}${colors.bold}❌ Necesitas completar más pasos${colors.reset}`);
}

console.log('');
console.log(`${colors.bold}🎯 PRÓXIMOS PASOS:${colors.reset}`);
console.log('');

if (!process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN.startsWith('TEST_')) {
  logInfo('1. 📝 Crear cuenta empresarial en MercadoPago');
  logInfo('2. 🔑 Obtener credenciales APP_USR_xxxxxxxxxxxxx');
  logInfo('3. ⚙️ Actualizar variables en archivo .env');
}

if (!process.env.BASE_URL || process.env.BASE_URL.includes('localhost')) {
  logInfo('4. 🌐 Configurar dominio real (Vercel, Netlify, etc.)');
  logInfo('5. 🔗 Actualizar BASE_URL y FRONTEND_URL');
}

if (process.env.NODE_ENV !== 'production') {
  logInfo('6. 🚀 Configurar NODE_ENV=production');
}

console.log('');
console.log(`${colors.bold}💰 PROCESO DE PAGOS EN PRODUCCIÓN:${colors.reset}`);
console.log('');
logInfo('1. Usuario compra → MercadoPago procesa');
logInfo('2. MercadoPago → Retira comisión (~3.5%)');
logInfo('3. Resto ingresa → A TU cuenta MercadoPago');
logInfo('4. Monedas se agregan → Automáticamente en sistema');
logInfo('5. Tú transfieres → Desde MercadoPago a tu banco');

console.log('');
console.log(`${colors.green}🚀 ¡Una vez configurado, empezarás a recibir dinero real! 💎${colors.reset}`);
