import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import supabase from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupRecompensasTables() {
  try {
    console.log('🚀 Iniciando configuración de tablas de recompensas...');

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'setup_recompensas.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Ejecutar el SQL usando Supabase
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('❌ Error ejecutando SQL:', error);
      
      // Si falla el método RPC, intentar crear las tablas directamente
      console.log('🔄 Intentando crear tablas directamente...');
      await createTablesDirectly();
    } else {
      console.log('✅ Tablas de recompensas creadas exitosamente');
    }

    // Verificar que las tablas existen
    console.log('🔍 Verificando tablas creadas...');
    await verifyTables();

  } catch (error) {
    console.error('❌ Error configurando tablas de recompensas:', error);
    console.log('📋 Por favor ejecuta manualmente en Supabase Dashboard:');
    console.log('   copia el contenido de src/db/setup_recompensas.sql');
    throw error;
  }
}

async function createTablesDirectly() {
  try {
    // Primero verificar si las tablas existen intentando hacer un select
    const { error: recompensasError } = await supabase
      .from('recompensas_usuario')
      .select('*')
      .limit(1);

    if (recompensasError && recompensasError.code === 'PGRST116') {
      console.log('ℹ️  Tabla recompensas_usuario no existe. Necesita ser creada manualmente.');
      console.log('📋 Ejecutar este SQL en Supabase Dashboard:');
      console.log(`
        CREATE TABLE recompensas_usuario (
          id SERIAL PRIMARY KEY,
          usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
          recompensa_id VARCHAR(100) NOT NULL,
          fecha_canje TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          precio_pagado INTEGER NOT NULL,
          UNIQUE(usuario_id, recompensa_id)
        );
        
        CREATE INDEX idx_recompensas_usuario_id ON recompensas_usuario(usuario_id);
        CREATE INDEX idx_recompensas_fecha ON recompensas_usuario(fecha_canje);
      `);
    } else {
      console.log('✅ Tabla recompensas_usuario ya existe');
    }

    const { error: catalogoError } = await supabase
      .from('recompensas_catalogo')
      .select('*')
      .limit(1);

    if (catalogoError && catalogoError.code === 'PGRST116') {
      console.log('ℹ️  Tabla recompensas_catalogo no existe. Necesita ser creada manualmente.');
      console.log('📋 Ejecutar este SQL en Supabase Dashboard:');
      console.log(`
        CREATE TABLE recompensas_catalogo (
          id VARCHAR(100) PRIMARY KEY,
          categoria VARCHAR(50) NOT NULL,
          tipo VARCHAR(50) NOT NULL,
          nombre VARCHAR(100) NOT NULL,
          descripcion TEXT,
          precio INTEGER NOT NULL,
          icono VARCHAR(10),
          rareza VARCHAR(20) DEFAULT 'comun',
          disponible BOOLEAN DEFAULT true,
          limitada BOOLEAN DEFAULT false,
          fecha_limite DATE,
          contenido JSONB,
          beneficios JSONB
        );
      `);
    } else {
      console.log('✅ Tabla recompensas_catalogo ya existe');
    }

  } catch (error) {
    console.log('ℹ️  No se pudieron verificar las tablas:', error.message);
  }
}

async function verifyTables() {
  try {
    // Verificar tabla recompensas_usuario
    const { data: testRewards, error: rewardsError } = await supabase
      .from('recompensas_usuario')
      .select('count')
      .limit(1);

    if (rewardsError) {
      console.log('❌ Tabla recompensas_usuario no accesible:', rewardsError.message);
    } else {
      console.log('✅ Tabla recompensas_usuario funcionando');
    }

    // Verificar tabla recompensas_catalogo
    const { data: testCatalog, error: catalogError } = await supabase
      .from('recompensas_catalogo')
      .select('id')
      .limit(1);

    if (catalogError) {
      console.log('❌ Tabla recompensas_catalogo no accesible:', catalogError.message);
    } else {
      console.log('✅ Tabla recompensas_catalogo funcionando');
    }

  } catch (error) {
    console.log('ℹ️  Error verificando tablas:', error.message);
  }
}

// Exportar función para uso externo
export default setupRecompensasTables;

// Si se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  setupRecompensasTables()
    .then(() => {
      console.log('🎉 Configuración completa');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
}
