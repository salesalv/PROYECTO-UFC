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

    console.log('📝 Nota: Para crear las tablas del sistema de recompensas,');
    console.log('   ejecuta el SQL del schema.sql directamente en Supabase.');
    console.log('   O usa el panel de Supabase para ejecutar las consultas CREATE TABLE.');
    
    // Insertar datos iniciales de insignias si las tablas existen
    await insertInsigniasIniciales();
    
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

async function insertInsigniasIniciales() {
  console.log('\n🎯 Insertando insignias iniciales...');
  
  const insignias = [
    {
      id: 'badge_bronce',
      categoria: 'insignias',
      tipo: 'badge',
      nombre: 'Insignia de Bronce',
      descripcion: 'Insignia básica de bronce para tu perfil',
      precio: 100,
      icono: '🥉',
      rareza: 'comun',
      disponible: true,
      orden: 1
    },
    {
      id: 'badge_plata',
      categoria: 'insignias',
      tipo: 'badge',
      nombre: 'Insignia de Plata',
      descripcion: 'Insignia elegante de plata para tu perfil',
      precio: 150,
      icono: '🥈',
      rareza: 'comun',
      disponible: true,
      orden: 2
    },
    {
      id: 'badge_oro',
      categoria: 'insignias',
      tipo: 'badge',
      nombre: 'Insignia de Oro',
      descripcion: 'Insignia premium de oro para tu perfil',
      precio: 250,
      icono: '🥇',
      rareza: 'comun',
      disponible: true,
      orden: 3
    },
    {
      id: 'badge_cinturon',
      categoria: 'insignias',
      tipo: 'badge',
      nombre: 'Cinturón de Campeón',
      descripcion: 'Insignia especial del cinturón de campeón',
      precio: 500,
      icono: '🏆',
      rareza: 'rara',
      disponible: true,
      orden: 4
    },
    {
      id: 'badge_guantes',
      categoria: 'insignias',
      tipo: 'badge',
      nombre: 'Guantes de Guerrero',
      descripcion: 'Insignia especial de guantes de pelea',
      precio: 600,
      icono: '🥊',
      rareza: 'rara',
      disponible: true,
      orden: 5
    },
    {
      id: 'badge_fuego',
      categoria: 'insignias',
      tipo: 'badge',
      nombre: 'Llama del Combate',
      descripcion: 'Insignia especial con efectos de fuego',
      precio: 700,
      icono: '🔥',
      rareza: 'rara',
      disponible: true,
      orden: 6
    },
    {
      id: 'badge_aguila',
      categoria: 'insignias',
      tipo: 'badge',
      nombre: 'Águila Dominante',
      descripcion: 'Insignia especial del águila dominante',
      precio: 800,
      icono: '🦅',
      rareza: 'rara',
      disponible: true,
      orden: 7
    },
    {
      id: 'badge_campeon_octubre_2026',
      categoria: 'insignias',
      tipo: 'badge',
      nombre: 'Campeón Octubre 2026',
      descripcion: 'Insignia exclusiva de temporada - Campeón de Octubre 2026',
      precio: 1000,
      icono: '👑',
      rareza: 'legendaria',
      disponible: true,
      limitada: true,
      fecha_limite: '2026-10-31',
      orden: 8
    }
  ];

  for (const insignia of insignias) {
    try {
      const { error } = await supabase
        .from('recompensas_catalogo')
        .upsert(insignia, { onConflict: 'id' });
      
      if (error) {
        console.log(`⚠️  No se pudo insertar ${insignia.id}: Las tablas aún no existen`);
        console.log('   Ejecuta el SQL del schema.sql en Supabase primero');
        break;
      } else {
        console.log(`✅ ${insignia.nombre} → ${insignia.precio} monedas`);
      }
    } catch (err) {
      console.log(`⚠️  Error con ${insignia.id}: Tablas no creadas aún`);
      break;
    }
  }
}

initializeDatabase(); 