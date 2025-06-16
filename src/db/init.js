import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import supabase from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  try {
    // Leer el archivo schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Ejecutar el schema usando Supabase
    const { error } = await supabase.rpc('exec_sql', { sql: schema });
    
    if (error) {
      throw error;
    }
    
    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

initializeDatabase(); 