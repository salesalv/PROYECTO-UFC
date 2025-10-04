import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';
const EMAIL = 'test@example.com';
const PASSWORD = 'password123'; // También es necesario tener un token válido

let authToken = null;
let userId = null;

// Función para hacer login y obtener token
async function login() {
  try {
    console.log('🔐 Iniciando sesión...');
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: EMAIL,
        password: PASSWORD
      })
    });

    const data = await response.json();
    
    if (data.success) {
      authToken = data.token;
      userId = data.user.id;
      console.log('✅ Login exitoso');
      return true;
    } else {
      console.error('❌ Error de login:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error de login:', error.message);
    return false;
  }
}

// Función para obtener catálogo de insignias
async function obtenerCatalogoInsignias() {
  try {
    console.log('📋 Obteniendo catálogo de insignias...');
    const response = await fetch(`${API_BASE}/recompensas/catalogo/insignias`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Catálogo obtenido: ${data.insignias.length} insignias disponibles`);
      data.insignias.forEach(insignia => {
        console.log(`  - ${insignia.nombre} (${insignia.precio} monedas, ${insignia.rareza})`);
      });
      return data.insignias;
    } else {
      console.error('❌ Error obteniendo catálogo:', data.error);
      return [];
    }
  } catch (error) {
    console.error('❌ Error obteniendo catálogo:', error.message);
    return [];
  }
}

// Función para obtener saldo del usuario
async function obtenerSaldo() {
  try {
    console.log('💰 Obteniendo saldo del usuario...');
    const response = await fetch(`${API_BASE}/compras/saldo`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Saldo actual: ${data.saldo} monedas`);
      return data.saldo;
    } else {
      console.error('❌ Error obteniendo saldo:', data.error);
      return 0;
    }
  } catch (error) {
    console.error('❌ Error obteniendo saldo:', error.message);
    return 0;
  }
}

// Función para comprar una insignia
async function comprarInsignia(recompensaId, nombre) {
  try {
    console.log(`🛒 Comprando insignia: ${nombre}...`);
    const response = await fetch(`${API_BASE}/recompensas/canjear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        recompensaId: recompensaId
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Insignia comprada exitosamente: ${nombre}`);
      console.log(`   Nuevo saldo: ${data.nuevoSaldo} monedas`);
      return true;
    } else {
      console.error(`❌ Error comprando insignia: ${data.error}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error comprando insignia:`, error.message);
    return false;
  }
}

// Función para obtener insignias del usuario
async function obtenerInsigniasUsuario() {
  try {
    console.log('🏆 Obteniendo insignias del usuario...');
    const response = await fetch(`${API_BASE}/recompensas/usuario/insignias`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Insignias del usuario obtenidas: ${data.insignias.length} insignias`);
      data.insignias.forEach(insignia => {
        console.log(`  - ${insignia.recompensa?.nombre} (obtenida el ${new Date(insignia.fecha_canje).toLocaleDateString()})`);
      });
      return data.insignias;
    } else {
      console.error('❌ Error obteniendo insignias del usuario:', data.error);
      return [];
    }
  } catch (error) {
    console.error('❌ Error obteniendo insignias del usuario:', error.message);
    return [];
  }
}

// Función para equipar una insignia
async function equiparInsignia(recompensaId, nombre) {
  try {
    console.log(`⚔️ Equipando insignia: ${nombre}...`);
    const response = await fetch(`${API_BASE}/recompensas/equipar-insignia`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        recompensaId: recompensaId
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`_______ Insignia equipada exitosamente: ${nombre}`);
      return true;
    } else {
      console.error(`___ Error equipando insignia: ${data.error}`);
      return false;
    }
  } catch (error) {
    console.error(`___ Error equipando insignia:`, error.message);
    return false;
  }
}

// Función para obtener insignia equipada
async function obtenerInsigniaEquipada() {
  try {
    console.log('🔍 Verificando insignia equipada...');
    const response = await fetch(`${API_BASE}/recompensas/usuario/insignia-equipada`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    const data = await response.json();
    
    if (data.success && data.insigniaEquipada) {
      console.log(`✅ Insignia equipada: ${data.insigniaEquipada.recompensa?.nombre}`);
      return data.insigniaEquipada;
    } else {
      console.log('ℹ️ No hay insignia equipada');
      return null;
    }
  } catch (error) {
    console.error('❌ Error obteniendo insignia equipada:', error.message);
    return null;
  }
}

// Función para desequipar insignia
async function desequiparInsignia() {
  try {
    console.log('🔓 Desequipando insignia...');
    const response = await fetch(`${API_BASE}/recompensas/desequipar-insignia`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Insignia desequipada exitosamente');
      return true;
    } else {
      console.error(`❌ Error desequipando insignia: ${data.error}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error desequipando insignia:', error.message);
    return false;
  }
}

// Ejecución de todas las pruebas
async function ejecutarPruebas() {
  console.log('🚀 Iniciando pruebas del sistema de insignias...\n');
  
  // Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ No se pudo continuar sin autenticación');
    return;
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Obtener catálogo
  const insignias = await obtenerCatalogoInsignias();
  if (insignias.length === 0) {
    console.log('❌ No se pudo obtener el catálogo de insignias');
    return;
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Obtener saldo
  const saldo = await obtenerSaldo();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Comprar la primera insignia disponible
  const insigniaParaComprar = insignias[0];
  if (saldo >= insigniaParaComprar.precio) {
    await comprarInsignia(insigniaParaComprar.id, insigniaParaComprar.nombre);
  } else {
    console.log(`⚠️ Saldo insuficiente para comprar ${insigniaParaComprar.nombre}`);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Obtener insignias del usuario
  const insigniasUsuario = await obtenerInsigniasUsuario();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Equipar una insignia si el usuario tiene alguna
  if (insigniasUsuario.length > 0) {
    await equiparInsignia(insigniasUsuario[0].recompensa_id, insigniasUsuario[0].recompensa?.nombre);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Verificar insignia equipada
  await obtenerInsigniaEquipada();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Desequipar insignia
  await desequiparInsignia();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Verificar que ya no hay insignia equipada
  await obtenerInsigniaEquipada();
  
  console.log('\n🎉 Pruebas completadas exitosamente!');
}

// Ejecutar las pruebas
if (process.env.NODE_ENV !== 'test') {
  ejecutarPruebas().catch(console.error);
}

export { ejecutarPruebas };
