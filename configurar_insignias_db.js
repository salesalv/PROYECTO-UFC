/**
 * Script para configurar las tablas de insignias en la base de datos
 * Ejecutar con: node configurar_insignias_db.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import supabase from './src/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function configurarTablasInsignias() {
  console.log('🚀 Configurando tablas de insignias...\n');

  try {
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'src/db/setup_insignias.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📋 Ejecutando SQL...');
    console.log('⚠️  Nota: Supabase puede requerir configuración manual');
    
    console.log('\n🔧 Para completar la configuración, ejecuta este SQL en Supabase Dashboard:');
    console.log('━'.repeat(80));
    console.log(sql);
    console.log('━'.repeat(80));

    // Intentar verificar si las tablas ya existen
    await verificarTablasExistentes();

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Instrucciones manuales:');
    console.log('1. Ve a tu Supabase Dashboard');
    console.log('2. Abre el SQL Editor');
    console.log('3. Copia y pega el SQL mostrado arriba');
    console.log('4. Ejecuta el script');
    console.log('5. Ejecuta: node verificar_insignias_db.js');
  }
}

async function verificarTablasExistentes() {
  console.log('\n🔍 Verificando tablas existentes...');

  try {
    // Verificar si existe la columna insignia_actual
    const { data: usuarioCols, error: userError } = await supabase
      .from('usuario')
      .select('insignia_actual')
      .limit(1);

    if (userError && userError.message.includes('column "insignia_actual" does not exist')) {
      console.log('❌ Columna "insignia_actual" no existe en tabla usuario');
      console.log('💡 Necesitas ejecutar el ALTER TABLE manualmente');
    } else {
      console.log('✅ Columna "insignia_actual" existe en tabla usuario');
    }

    // Verificar tabla historial
    const { data: historialCols, error: historialError } = await supabase
      .from('usuario_insignias_historial')
      .select('id')
      .limit(1);

    if (historialError) {
      console.log('❌ Tabla "usuario_insignias_historial" no existe');
      console.log('💡 Necesitas crear esta tabla manualmente');
    } else {
      console.log('✅ Tabla "usuario_insignias_historial" existe');
    }

  } catch (error) {
    console.log('ℹ️  No se pudieron verificar las tablas:', error.message);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  configurarTablasInsignias()
    .then(() => {
      console.log('\n🎉 Configuración completada!');
      console.log('\n📝 Próximos pasos:');
      console.log('   1. Ejecuta el SQL en Supabase Dashboard');
      console.log('   2. Reinicia el servidor: node src/server.js');
      console.log('   3. Prueba las insignias en el perfil');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
}

export default configurarTablasInsignias;
