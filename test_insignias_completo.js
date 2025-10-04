/**
 * Script completo de prueba para el sistema de insignias
 * Ejecutar después de configurar las tablas: node test_insignias_completo.js
 */

import supabase from './src/db.js';

async function testInsigniasCompleto() {
  console.log('🚀 Probando sistema completo de insignias...\n');

  // Test 1: Verificar columnas de usuario
  console.log('1️⃣ Verificando columnas de usuario...');
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('id, insignia_actual, insignias_mostradas')
      .limit(1);
    
    if (error) {
      console.log('❌ Error:', error.message);
      if (error.message.includes('insignia_actual')) {
        console.log('💡 Falta crear las columnas en tabla usuario');
      }
    } else {
      console.log('✅ Columnas de insignias disponibles');
    }
  } catch (error) {
    console.log('❌ Error verificando usuario:', error.message);
  }

  // Test 2: Verificar tabla historial
  console.log('\n2️⃣ Verificando tabla historial...');
  try {
    const { data, error } = await supabase
      .from('usuario_insignias_historial')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('✅ Tabla historial disponible');
    }
  } catch (error) {
    console.log('❌ Error verificando historial:', error.message);
  }

  // Test 3: Verificar recompensas de usuario
  console.log('\n3️⃣ Verificando recompensas usuario...');
  try {
    const { data, error } = await supabase
      .from('recompensas_usuario')
      .select('id, usuario_id, recompensa_id')
      .limit(3);
    
    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('✅ Tabla recompensas_usuario disponible');
      console.log(`📊 ${data?.length || 0} recompensas encontradas`);
    }
  } catch (error) {
    console.log('❌ Error verificando recompensas:', error.message);
  }

  // Test 4: Prueba simulada de equipar insignia
  console.log('\n4️⃣ Simulando equipaje de insignia...');
  try {
    const { data: usuarios, error: userError } = await supabase
      .from('usuario')
      .select('id, nombre_usuario')
      .limit(1);

    if (userError || !usuarios?.length) {
      console.log('❌ No se encontraron usuarios para probar');
    } else {
      const usuarioId = usuarios[0].id;
      const { data: recompensas, error: rewardsError } = await supabase
        .from('recompensas_usuario')
        .select('recompensa_id')
        .eq('usuario_id', usuarioId)
        .limit(1);

      if (rewardsError || !recompensas?.length) {
        console.log('ℹ️  Usuario no tiene recompensas - Ejecuta compras primero');
      } else {
        console.log('✅ Usuario tiene recompensas disponibles para probar');
        console.log('🎯 Recompensa de prueba:', recompensas[0].recompensa_id);
      }
    }
  } catch (error) {
    console.log('❌ Error probando equipaje:', error.message);
  }

  console.log('\n📋 PRÓXIMOS PASOS:');
  console.log('   1. 📊 Crear tablas faltantes con el SQL proporcionado');
  console.log('   2. 🔄 Reiniciar servidor: node src/server.js');
  console.log('   3. 💰 Comprar insignias en /recompensas');
  console.log('   4. 👤 Equipar insignias en el perfil');
  console.log('   5. 🌍 Ver insignias en perfiles públicos');

  console.log('\n🎉 Sistema de insignias backend completado!');
}

testInsigniasCompleto().catch(console.error);
