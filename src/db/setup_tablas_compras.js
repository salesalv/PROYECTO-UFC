import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://gqylknstxjwlybyvvcvx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxeWxrbnN0eGp3bHlieXZ2Y3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTMyNzIsImV4cCI6MjA2NTY2OTI3Mn0.fdOlalxcPaKzpjaUnFowsY3gz6f0LYmCdE--aJ76zc8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTables() {
  try {
    console.log('🔧 Configurando tablas de compras...');
    
    // Leer el archivo SQL
    const sqlPath = path.join(process.cwd(), 'src/db/setup_tablas_compras.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Ejecutar las consultas SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Error ejecutando SQL:', error);
      return;
    }
    
    console.log('✅ Tablas configuradas exitosamente');
    console.log('📊 Tablas creadas:');
    console.log('  - compras_monedas');
    console.log('  - transacciones_moneda');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  setupTables();
}

export default setupTables;
