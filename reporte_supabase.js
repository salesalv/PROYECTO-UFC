/**
 * Script para generar reporte de tu configuración Supabase
 * Ejecutar y compartir resultado: node reporte_supabase.js
 */

import supabase from './src/db.js';

async function generarReporte() {
  console.log('📊 GENERANDO REPORTE DE SUPABASE...\n');
  console.log('═'.repeat(50));

  // Verificar conexión básica
  try {
    console.log('1️⃣ VERIFICANDO CONEXIÓN...');
    const { data, error } = await supabase
      .from('usuario')
      .select('id, nombre_usuario')
      .limit(1);
    
    if (error) {
      console.log('❌ Error de conexión:', error.message);
    } else {
      console.log('✅ Conexión exitosa');
      console.log(`👤 Usuarios encontrados: ${data?.length || 0}`);
    }
  } catch (err) {
    console.log('❌ Error general:', err.message);
  }

  console.log('\n2️⃣ VERIFICANDO TABLAS REQUERIDAS...');
  await verificarTabla('usuario', 'Tabla de usuarios');
  await verificarTabla('recompensas_usuario', 'Tabla de recompensas compradas');
  await verificarColumna('usuario', 'insignia_actual', 'Insignia equipada');
  await verificarColumna('usuario', 'insignias_mostradas', 'Configuración de visualización');
  await verificarTabla('usuario_insignias_historial', 'Historial de insignias');

  console.log('\n3️⃣ DATOS DE RECOMPENSAS...');
  await contarRegistros('recompensas_usuario');

  console.log('\n"═'.repeat(50));
  console.log('📋 RESUMEN:');
  console.log('   Si ves ❌, necesitas crear esa tabla/columna');
  console.log('   Si ves ✅, ya está configurado');
  console.log('   Comparte este resultado para asistencia específica');
}

async function verificarTabla(tabla, descripcion) {
  try {
    const { data, error } = await supabase
      .from(tabla)
      .select('*')
      .limit(1);
    
    if (error) {
      console.log(`❌ ${descripcion}: NO EXISTE`);
      console.log(`   Error: ${error.message}`);
    } else {
      console.log(`✅ ${descripcion}: EXISTE`);
    }
  } catch (error) {
    console.log(`❌ ${descripcion}: ERROR`);
    console.log(`   ${error.message}`);
  }
}

async function verificarColumna(tabla, columna, descripcion) {
  try {
    const { data, error } = await supabase
      .from(tabla)
      .select(columna)
      .limit(1);
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log(`❌ ${descripcion}: COLUMNA FALTANTE`);
        console.log(`   Tabla "${tabla}" existe pero falta columna "${columna}"`);
      } else {
        console.log(`❌ ${descripcion}: ERROR`);
        console.log(`   ${error.message}`);
      }
    } else {
      console.log(`✅ ${descripcion}: DISPONIBLE`);
    }
  } catch (error) {
    console.log(`❌ ${descripcion}: ERROR`);
    console.log(`   ${error.message}`);
  }
}

async function contarRegistros(tabla) {
  try {
    const { data, error } = await supabase
      .from(tabla)
      .select('*', { count: 'exact' });
    
    if (error) {
      console.log(`❌ Tabla ${tabla}: ${error.message}`);
    } else {
      console.log(`📊 ${tabla}: ${data?.length || 0} registros`);
    }
  } catch (error) {
    console.log(`❌ Error contando ${tabla}: ${error.message}`);
  }
}

generarReporte().catch(console.error);
