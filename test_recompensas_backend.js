/**
 * Script de prueba para el backend de recompensas
 * Ejecutar con: node test_recompensas_backend.js
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api/recompensas';

// Color para logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(endpoint, method = 'GET', body = null, expectedStatus = 200) {
  try {
    log('cyan', `\n🔍 Probando: ${method} ${endpoint}`);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();

    if (response.status === expectedStatus) {
      log('green', `✅ Éxito (${response.status})`);
      if (data.success !== undefined) {
        log('bright', `📋 Respuesta: ${data.success ? 'Success' : 'Failed'}`);
      }
      if (data.recompensas) {
        log('bright', `📋 Recompensas encontradas: ${data.recompensas.length}`);
      }
      if (data.recompensa) {
        log('bright', `📋 Recompensa: ${data.recompensa.nombre}`);
      }
      return data;
    } else {
      log('red', `❌ Error (${response.status})`);
      log('red', `❌ Mensaje: ${data.error || 'Error desconocido'}`);
      return null;
    }
  } catch (error) {
    log('red', `❌ Error de conexión: ${error.message}`);
    return null;
  }
}

async function runTests() {
  log('magenta', '🚀 Iniciando pruebas del backend de recompensas...');
  
  // Test 1: Obtener catálogo completo
  await testEndpoint('/catalogo');
  
  // Test 2: Obtener catálogo por categoría
  await testEndpoint('/catalogo?categoria=insignias');
  
  // Test 3: Obtener recompensa específica
  await testEndpoint('/catalogo/badge_bronce');
  
  // Test 4: Recompensa inexistente
  await testEndpoint('/catalogo/badge_inexistente', 'GET', null, 404);
  
  // Test 5: Sin autenticación (debería fallar)
  log('yellow', '\n⚠️  Probando endpoints que requieren autenticación...');
  await testEndpoint('/usuario', 'GET', null, 401);
  await testEndpoint('/estadisticas', 'GET', null, 401);
  await testEndpoint('/canjear', 'POST', { recompensaId: 'badge_bronce' }, 401);

  log('green', '\n🎉 Pruebas completadas!');
  log('yellow', '\n📝 Nota: Para probar endpoints autenticados, necesitas:');
  log('yellow', '   1. Servidor corriendo en puerto 3001');
  log('yellow', '   2. Token de JWT válido');
  log('yellow', '   3. Base de datos configurada');
}

// Ejecutar las pruebas
runTests().catch(error => {
  log('red', `❌ Error ejecutando pruebas: ${error.message}`);
});
