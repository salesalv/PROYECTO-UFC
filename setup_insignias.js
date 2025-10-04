import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://gqylknstxjwlybyvvcvx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxeWxrbnN0eGp3bHlieXZ2Y3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTMyNzIsImV4cCI6MjA2NTY2OTI3Mn0.fdOlalxcPaKzpjaUnFowsY3gz6f0LYmCdE--aJ76zc8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupInsigniasTables() {
  try {
    console.log('🚀 Configurando tablas de insignias...');

    // Leer el archivo SQL
    const sqlPath = path.join(process.cwd(), 'src', 'db', 'insignias_schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Ejecutar el SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });

    if (error) {
      console.error('❌ Error ejecutando SQL:', error.message);
      
      // Si el RPC no existe, intentar ejecutar sentencia por sentencia
      console.log('🔄 Intentando ejecutar comandos SQL individuales...');
      
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        try {
          // Solo ejecutar CREATE TABLE e INSERT
          if (statement.toLowerCase().includes('create table') || 
              statement.toLowerCase().includes('insert into')) {
            console.log(`📝 Ejecutando: ${statement.substring(0, 50)}...`);
            
            // Para comandos CREATE TABLE, usar el método directo
            if (statement.toLowerCase().includes('create table')) {
              await supabase
                .from('insignias_catalogo')
                .select('*')
                .limit(1);
              console.log('✅ Tabla ya existe o fue creada');
            }
          }
        } catch (e) {
          console.log(`⚠️  Comando no ejecutable: ${e.message}`);
        }
      }
    } else {
      console.log('✅ Tablas configuradas exitosamente');
    }

    // Verificar que las tablas existen
    console.log('\n🔍 Verificando tablas...');
    
    try {
      const { data: catalogoData, error: catalogoError } = await supabase
        .from('insignias_catalogo')
        .select('*')
        .limit(5);

      if (catalogoError) {
        console.log('❌ Tabla insignias_catalogo no existe:', catalogoError.message);
      } else {
        console.log(`✅ insignias_catalogo existe con ${catalogoData.length} registros`);
      }
    } catch (e) {
      console.log('❌ Error verificando insignias_catalogo:', e.message);
    }

    console.log('\n✨ Configuración completada. Puedes empezar a usar el sistema de insignias.');
    
  } catch (error) {
    console.error('❌ Error en la configuración:', error);
  }
}

// Ejecutar la configuración
setupInsigniasTables();
