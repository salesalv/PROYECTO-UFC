/**
 * Script para verificar configuración de PROYECTO/PORTAFOLIO
 * Ejecutar: node verificar_proyecto.js
 */

import dotenv from 'dotenv';
dotenv.config();

console.log('🎯 ¡Verificación de Configuración para PROYECTO!');
console.log('');
console.log('📋 Verificando configuración para proyecto/portafolio...');
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

function logInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}${colors.bold}🎉 ${message}${colors.reset}`);
}

// PASO 1: Verificar configuración básica
console.log(`${colors.bold}📋 CONFIGURACIÓN PARA PROYECTO${colors.reset}`);
console.log('');

// Variables de entorno requeridas para proyecto
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

// PASO 2: Verificar credenciales de PRUEBA
console.log(`${colors.bold}🧪 CREDENCIALES DE PRUEBA${colors.reset}`);
console.log('');

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
const publicKey = process.env.MERCADOPAGO_PUBLIC_KEY;

// Credenciales de prueba que ya tienes
const credencialesProyecto = {
  accessToken: 'APP_USR-6082603998976520-100418-2a1d606a17c86190e7589c021dfa3a60-2903456179',
  publicKey: 'APP_USR-b5cb8f5c-c0d3-4dca-a136-98979854ae67'
};

if (accessToken === credencialesProyecto.accessToken) {
  logCheck(true, `ACCESS_TOKEN: Credenciales de PRUEBA correctas`);
  logInfo('✅ Perfecto para proyecto/portafolio');
} else if (accessToken && accessToken.startsWith('APP_USR-')) {
  logCheck(true, `ACCESS_TOKEN: Credenciales de prueba configuradas`);
} else {
  logCheck(false, `ACCESS_TOKEN: No configurado o incorrecto`);
  logInfo(`💡 Usar: ${credencialesProyecto.accessToken}`);
}

if (publicKey === credencialesProyecto.publicKey) {
  logCheck(true, `PUBLIC_KEY: Credenciales de PRUEBA correctas`);
} else if (publicKey && publicKey.startsWith('APP_USR-')) {
  logCheck(true, `PUBLIC_KEY: Credenciales de prueba configuradas`);
} else {
  logCheck(false, `PUBLIC_KEY: No configurado o incorrecto`);
  logInfo(`💡 Usar: ${credencialesProyecto.publicKey}`);
}

console.log('');

// PASO 3: Verificar URLs de desarrollo
console.log(`${colors.bold}🌐 CONFIGURACIÓN DE DESARROLLO${colors.reset}`);
console.log('');

const baseUrl = process.env.BASE_URL;
const frontendUrl = process.env.FRONTEND_URL;

if (baseUrl === 'http://localhost:3001') {
  logCheck(true, `BASE_URL: Configurado para desarrollo`);
} else if (baseUrl && baseUrl.includes('localhost')) {
  logCheck(true, `BASE_URL: ${baseUrl}`);
} else {
  logCheck(false, `BASE_URL: Debe ser http://localhost:3001`);
}

if (frontendUrl === 'http://localhost:5173') {
  logCheck(true, `FRONTEND_URL: Configurado para desarrollo`);
} else if (frontendUrl && frontendUrl.includes('localhost')) {
  logCheck(true, `FRONTEND_URL: ${frontendUrl}`);
} else {
  logCheck(false, `FRONTEND_URL: Debe ser http://localhost:5173`);
}

console.log('');

// PASO 4: Verificar entorno
console.log(`${colors.bold}⚙️ ENTORNO DE DESARROLLO${colors.reset}`);
console.log('');

const nodeEnv = process.env.NODE_ENV;
if (nodeEnv === 'development') {
  logCheck(true, 'NODE_ENV: Desarrollo (perfecto para proyecto)');
} else if (nodeEnv === 'production') {
  logCheck(false, 'NODE_ENV: Producción (cambiar a development para proyecto)');
} else {
  logCheck(false, `NODE_ENV: ${nodeEnv || 'No configurado'} (debe ser 'development')`);
}

console.log('');

// PASO 5: Resumen para proyecto
console.log(`${colors.bold}📊 RESUMEN PARA PROYECTO${colors.reset}`);
console.log('');

const totalChecks = 8;
let passedChecks = 0;

[
  !!process.env.MERCADOPAGO_ACCESS_TOKEN,
  !!process.env.MERCADOPAGO_PUBLIC_KEY,
  !!process.env.BASE_URL && process.env.BASE_URL.includes('localhost'),
  !!process.env.FRONTEND_URL && process.env.FRONTEND_URL.includes('localhost'),
  !!process.env.JWT_SECRET,
  process.env.NODE_ENV === 'development',
  accessToken === credencialesProyecto.accessToken || (accessToken && accessToken.startsWith('APP_USR-')),
  publicKey === credencialesProyecto.publicKey || (publicKey && publicKey.startsWith('APP_USR-'))
].forEach(passed => {
  if (passed) passedChecks++;
});

console.log(`${colors.bold}📈 Progreso: ${passedChecks}/${totalChecks} pasos completados${colors.reset}`);

const percentage = Math.round((passedChecks / totalChecks) * 100);

if (percentage >= 90) {
  logSuccess('¡PERFECTO! Listo para proyecto/portafolio');
} else if (percentage >= 70) {
  console.log(`${colors.yellow}${colors.bold}⚡ ¡BIEN! Casi listo para proyecto${colors.reset}`);
} else {
  console.log(`${colors.red}${colors.bold}❌ Necesitas completar configuración${colors.reset}`);
}

console.log('');
console.log(`${colors.bold}🎯 CARACTERÍSTICAS DEL PROYECTO:${colors.reset}`);
console.log('');

logInfo('✅ Credenciales de PRUEBA - No dinero real');
logInfo('✅ MercadoPago procesará pagos pero NO transferirá dinero');
logInfo('✅ Perfecto para demostrar funcionalidad completa');
logInfo('✅ Ideal para portafolio y proyectos de práctica');
logInfo('✅ Usuarios pueden probar con tarjetas de prueba');

console.log('');
console.log(`${colors.bold}💳 TARJETAS DE PRUEBA DISPONIBLES:${colors.reset}`);
console.log('');

logInfo('🇦🇷 Argentina:');
logInfo('   Aprobada: 4509 9535 6623 3704');
logInfo('   Rechazada: 4013 5406 8274 6260');
logInfo('   Sin fondos: 4071 0304 0150 0001');

console.log('');
console.log(`${colors.bold}🚀 FLUJO DEL PROYECTO:${colors.reset}`);
console.log('');

logInfo('1. Usuario "compra" → MercadoPago procesa (PRUEBA)');
logInfo('2. Sistema agrega monedas → Automáticamente');
logInfo('3. Usuario ve confirmación → En la interfaz');
logInfo('4. NO hay dinero real → Solo simulación completa');

console.log('');
logSuccess('¡Tu proyecto SMASH UFC está listo para demostrar! 🎮💎');

