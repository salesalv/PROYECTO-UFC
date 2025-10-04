/**
 * Script para verificar que las tablas de insignias estén configuradas correctamente
 * Ejecutar con: node verificar_insignias_db.js
 */

import supabase from './src/db.js';

async function verificarInsignias() {
  console.log('🔍 Verificando configuración de insignias...\n');

  // Verificar columna insignia_actual en tabla usuario
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('insignia_actual, insignias_mostradas')
      .limit(1);
    
    if (error) {
      console.log('❌ Error accediendo columnas de insignias en usuario:', error.message);
      
      if (error.message.includes('column "insignia_actual" does not exist')) {
        console.log('💡 SOLUCIÓN: Ejecuta este SQL en Supabase Dashboard:');
        console.log('   ALTER TABLE usuario ADD COLUMN insignia_actual VARCHAR(100) DEFAULT NULL;');
        console.log('   ALTER TABLE usuario ADD COLUMN insignias_mostradas JSONB DEFAULT \'{}\';');
      }
    } else {
      console.log('✅ Columnas de insignias existentes en tabla usuario');
    }
  } catch (error) {
    console.log('❌ Error verificando usuario:', error.message);
  }

  // Verificar tabla historial de insignias
  try {
    const { data, error } = await supabase
      .from('usuario_insignias_historial')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ Error accediendo tabla historial:', error.message);
      
      if (error.code === 'PGRST116') {
        console.log('💡 SOLUCIÓN: Crea esta tabla en Supabase Dashboard:');
        console.log(`
CREATE TABLE usuario_insignias_historial (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
    insignia_id VARCHAR(100) NOT NULL,
    fecha_equipada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_desequipada TIMESTAMP DEFAULT NULL,
    tiempo_equipada INTEGER DEFAULT 0
);

CREATE INDEX idx_usuario_insignias_usuario_id ON usuario_insignias_historial(usuario_id);
CREATE INDEX idx_usuario_insignias_fecha ON usuario_insignias_historial(fecha_equipada);
        `);
      }
    } else {
      console.log('✅ Tabla historial de insignias existente');
    }
  } catch (error) {
    console.log('❌ Error verificando historial:', error.message);
  }

  // Verificar tabla recompensas_usuario
  try {
    const { data, error } = await supabase
      .from('recompensas_usuario')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ Error accediendo recompensas_usuario:', error.message);
    } else {
      console.log('✅ Tabla recompensas_usuario existente');
    }
  } catch (error) {
    console.log('❌ Error verificando recompensas_usuario:', error.message);
  }

  // Verificar tabla usuario
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('id, nombre_usuario')
      .limit(1);
    
    if (error) {
      console.log('❌ Error accediendo usuario:', error.message);
    } else {
      console.log('✅ Tabla usuario existente');
    }
  } catch (error) {
    console.log('❌ Error verificando usuario:', error.message);
  }

  console.log('\n📝 RESUMEN:');
  console.log('   Para que el sistema de insignias funcione necesitas:');
  console.log('   1. Columnas insignia_actual y insignias_mostradas en tabla usuario');
  console.log('   2. Tabla usuario_insignias_historial');
  console.log('   3. Tabla recompensas_usuario (ya debería existir)');
  console.log('   4. Tabla usuario (ya debería existir)');
}

// Ejecutar
verificarInsignias().catch(console.error);
