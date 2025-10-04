import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarTablaUsuario() {
  console.log('🔍 Verificando estructura de la tabla usuario...');
  
  try {
    // Obtener todos los usuarios
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuario')
      .select('*')
      .limit(5);
    
    if (usuariosError) {
      console.error('❌ Error buscando usuarios:', usuariosError);
      return;
    }
    
    console.log(`👥 Usuarios encontrados: ${usuarios?.length || 0}`);
    
    if (usuarios && usuarios.length > 0) {
      console.log('\n📋 Estructura de la tabla usuario:');
      console.log('Columnas disponibles:', Object.keys(usuarios[0]));
      
      console.log('\n🎯 Datos del primer usuario:');
      const primerUsuario = usuarios[0];
      console.log(`   ID: ${primerUsuario.id}`);
      console.log(`   Email: ${primerUsuario.email || 'N/A'}`);
      console.log(`   Nombre/Usuario: ${primerUsuario.username || primerUsuario.nombre || 'N/A'}`);
      console.log(`   Insignia actual: ${primerUsuario.insignia_actual || 'Ninguna'}`);
      
      // Buscar las insignias compradas del primer usuario
      const { data: insigniasCompradas, error: insigniasError } = await supabase
        .from('recompensas_usuario') 
        .select('*, recompensas_catalogo(*)')
        .eq('usuario_id', primerUsuario.id)
        .eq('recompensas_catalogo.categoria', 'insignia');
      
      console.log(`🎖️ Insignias compradas para usuario ${primerUsuario.id}: ${insigniasCompradas?.length || 0}`);
      
      if (insigniasCompradas && insigniasCompradas.length > 0) {
        console.log('\n📋 Detalles de las insignias:');
        insigniasCompradas.forEach((insignia, index) => {
          console.log(`   ${index + 1}. ${insignia.recompensas_catalogo?.nombre}`);
          console.log(`      └─ Equipada: ${insignia.recompensa_id === primerUsuario.insignia_actual ? 'SÍ' : 'NO'}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error en verificación:', error);
  }
}

verificarTablaUsuario();
