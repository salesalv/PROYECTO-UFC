import supabase from './src/db.js';

async function verificarTablas() {
  console.log('🔍 Verificando estado de las tablas de recompensas...\n');

  // Verificar tabla recompensas_usuario
  try {
    const { data, error } = await supabase
      .from('recompensas_usuario')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ Tabla recompensas_usuario:', error.message);
      console.log('💡 Necesitas crear esta tabla manualmente en Supabase Dashboard');
    } else {
      console.log('✅ Tabla recompensas_usuario existe');
    }
  } catch (err) {
    console.log('❌ Error accediendo recompensas_usuario:', err.message);
  }

  // Verificar tabla recompensas_catalogo
  try {
    const { data, error } = await supabase
      .from('recompensas_catalogo')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ Tabla recompensas_catalogo:', error.message);
      console.log('💡 Necesitas crear esta tabla manualmente en Supabase Dashboard');
    } else {
      console.log('✅ Tabla recompensas_catalogo existe');
    }
  } catch (err) {
    console.log('❌ Error accediendo recompensas_catalogo:', err.message);
  }

  // Verificar tabla usuario (debería existir)
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ Tabla usuario:', error.message);
    } else {
      console.log('✅ Tabla usuario existe');
    }
  } catch (err) {
    console.log('❌ Error accediendo usuario:', err.message);
  }

  console.log('\n📋 Para solucionar el problema, ejecuta este SQL en Supabase Dashboard:');
  console.log(`
-- Crear tabla recompensas_usuario
CREATE TABLE recompensas_usuario (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  recompensa_id VARCHAR(100) NOT NULL,
  fecha_canje TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  precio_pagado INTEGER NOT NULL,
  UNIQUE(usuario_id, recompensa_id)
);

-- Crear índices
CREATE INDEX idx_recompensas_usuario_id ON recompensas_usuario(usuario_id);
CREATE INDEX idx_recompensas_fecha ON recompensas_usuario(fecha_canje);
CREATE INDEX idx_recompensas_recompensa_id ON recompensas_usuario(recompensa_id);
  `);
}

verificarTablas().catch(console.error);
