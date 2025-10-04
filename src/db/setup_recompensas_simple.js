import supabase from '../db.js';

/**
 * Configura la base de datos para el sistema de recompensas e insignias
 * Versión simplificada que funciona directamente con la API de Supabase
 */
async function setupRecompensas() {
  console.log('🚀 Configurando sistema de recompensas...');

  try {
    // Verificar si ya existen las tablas
    await verificarTablas();
    
    // Insertar datos iniciales del catálogo
    await insertarDatosIniciales();
    
    console.log('✅ Sistema de recompensas configurado exitosamente');
  } catch (error) {
    console.error('Error configurando recompensas:', error);
  }
}

/**
 * Verifica que las tablas principales existen
 */
async function verificarTablas() {
  console.log('🔍 Verificando tablas...');
  
  const tablas = ['recompensas_catalogo', 'recompensas_usuario', 'insignias_equipadas'];
  
  for (const tabla of tablas) {
    try {
      const { data, error } = await supabase
        .from(tabla)
        .select('*')
        .limit(1);
      
      if (error) {
        console.warn(`⚠️  Tabla ${tabla} no encontrada o no accesible:`, error.message);
        
        // Solo si es error de tabla no encontrada
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          console.log(`📝 Después de crear la tabla ${tabla}, este script podrá insertar los datos`);
        }
      } else {
        console.log(`✅ Tabla ${tabla} existe y es accesible`);
      }
    } catch (err) {
      console.warn(`⚠️  Error verificando tabla ${tabla}:`, err.message);
    }
  }
}

/**
 * Inserta los datos iniciales del catálogo
 */
async function insertarDatosIniciales() {
  console.log('📥 Insertando datos iniciales del catálogo...');
  
  const datosRecompensas = [
    // Insignias Básicas
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
    // Insignias Especiales
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
    // Insignias Legendarias
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

  for (const recompensa of datosRecompensas) {
    try {
      const { error } = await supabase
        .from('recompensas_catalogo')
        .upsert(recompensa, { onConflict: 'id' });
      
      if (error) {
        console.warn(`Error insertando recompensa ${recompensa.id}:`, error.message);
      } else {
        console.log(`✅ Recompensa ${recompensa.id} insertada/actualizada`);
      }
    } catch (err) {
      console.warn(`Error insertando recompensa ${recompensa.id}:`, err.message);
    }
  }
  
  console.log('🎉 Datos iniciales procesados');
}

/**
 * Función auxiliar para mostrar el estado del sistema
 */
async function mostrarEstado() {
  console.log('\n📊 Estado del sistema de recompensas:');
  
  try {
    // Contar recompensas disponibles
    const { data: recompensas, error: recompensasError } = await supabase
      .from('recompensas_catalogo')
      .select('id', { count: 'exact' })
      .eq('disponible', true);
    
    if (!recompensasError && recompensas) {
      console.log(`  📋 Recompensas disponibles: ${recompensas.length}`);
    }
    
    // Contar usuarios con recompensas
    const { data: usuariosConRecompensas, error: usuariosError } = await supabase
      .from('recompensas_usuario')
      .select('usuario_id', { count: 'exact' });
    
    if (!usuariosError && usuariosConRecompensas) {
      console.log(`  👥 Usuarios con recompensas: ${usuariosConRecompensas.length}`);
    }
    
    // Insignias equipadas
    const { data: insigniasEquipadas, error: insigniasError } = await supabase
      .from('insignias_equipadas')
      .select('id', { count: 'exact' })
      .eq('activo', true);
    
    if (!insigniasError && insigniasEquipadas) {
      console.log(`  🏆 Insignias equipadas: ${insigniasEquipadas.length}`);
    }
    
  } catch (error) {
    console.warn('Error obteniendo estadísticas:', error.message);
  }
}

// Función principal
async function main() {
  try {
    await setupRecompensas();
    await mostrarEstado();
    console.log('\n🎉 Proceso completado!');
    console.log('💡 Para usar el sistema:');
    console.log('   1. Las insignias ya están disponibles en /recompensas');
    console.log('   2. Los usuarios pueden comprarlas con sus monedas');
    console.log('   3. Las insignias aparecen automáticamente en el perfil');
  } catch (error) {
    console.error('💥 Error en el proceso:', error);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { setupRecompensas, insertarDatosIniciales };
