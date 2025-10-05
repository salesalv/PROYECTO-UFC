/**
 * Script de prueba para el backend de compras
 * Ejecutar: node test_compras.js
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001/api/compras';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'; // Token de ejemplo

// Función para hacer requests con headers por defecto
async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TEST_TOKEN}`,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`📡 ${method} ${endpoint}`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('---');
    
    return { response, data };
  } catch (error) {
    console.error(`❌ Error en ${method} ${endpoint}:`, error.message);
    return null;
  }
}

async function testComprasAPI() {
  console.log('🧪 Iniciando pruebas del API de compras...\n');

  // 1. Obtener paquetes disponibles
  console.log('1️⃣ Probando obtención de paquetes:');
  await apiRequest('/paquetes');

  // 2. Obtener saldo del usuario
  console.log('2️⃣ Probando obtención de saldo:');
  await apiRequest('/saldo');

  // 3. Crear intención de pago
  console.log('3️⃣ Probando creación de pago:');
  await apiRequest('/crear-pago', 'POST', {
    paqueteId: 'estandar'
  });

  // 4. Obtener historial de compras
  console.log('4️⃣ Probando historial de compras:');
  await apiRequest('/historial');

  // 5. Obtener transacciones
  console.log('5️⃣ Probando transacciones:');
  await apiRequest('/transacciones');

  console.log('✅ Pruebas completadas!');
}

// Función para probar endpoints sin autenticación
async function testPublicEndpoints() {
  console.log('\n🌐 Probando endpoints públicos...\n');

  try {
    const response = await fetch(`${BASE_URL}/paquetes`);
    const data = await response.json();
    console.log('✅ Endpoint público /paquetes funciona:', data);
  } catch (error) {
    console.error('❌ Error en endpoint público:', error.message);
  }
}

// Función para simular un pago de prueba
async function simulatePayment() {
  console.log('\n🎮 Simulando pago de prueba...\n');

  try {
    const response = await fetch(`${BASE_URL}/test-payment/test_123456`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log('✅ Simulación de pago:', data);
  } catch (error) {
    console.error('❌ Error en simulación:', error.message);
  }
}

// Ejecutar pruebas
async function runTests() {
  await testPublicEndpoints();
  await testComprasAPI();
  await simulatePayment();
  
  console.log('\n🎉 Todas las pruebas terminadas!');
  console.log('\n💡 Nota: Asegúrate de tener el servidor corriendo en puerto 3001');
  console.log('Ejecuta: npm run server');
}

// Verificar si el servidor está corriendo antes de empezar
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/paquetes`);
    if (response.ok) {
      console.log('✅ Servidor detectado en puerto 3001');
      return true;
    }
  } catch (error) {
    console.log('❌ Servidor no detectado. Asegúrate de ejecutar "npm run server" primero');
    return false;
  }
}

// Ejecutar solo si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  checkServer().then(isRunning => {
    if (isRunning) {
      runTests();
    }
  });
}


