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

async function verificarUsuarioInsignias() {
  console.log('🔍 Verificando datos del usuario y sus insignias...');
  
  try {
    // Buscar usuario Martin (RUGAL44)
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuario')
      .select('*')
      .eq('nombre', 'Martin')
      .limit(1);
    
    if (usuariosError) {
      console.error('❌ Error buscando usuario:', usuariosError);
      return;
    }
    
    if (!usuarios || usuarios.length === 0) {
      console.log('❌ No se encontró usuario Martin');
      return;
    }
    
    const usuario = usuarios[0];
    console.log('👤 Usuario encontrado:');
    console.log(`   ID: ${usuario.id}`);
    console.log(`   Nombre: ${usuario.nombre}`);
    console.log(`   Email: ${usuario.email}`);
    console.log(`   Insignia actual: ${usuario.insignia_actual || 'Ninguna'}`);
    
    // Buscar las insignias compradas
    const { data: insigniasCompradas, error: insigniasError } = await supabase
      .from('recompensas_usuario') 
      .select('*, recompensas_catalogo(*)')
      .eq('usuario_id', usuario.id)
      .eq('recompensas_catalogo.categoria', 'insignia');
    
    if (insigniasError) {
      console.error('❌ Error buscando insignias:', insigniasError);
      return;
    }
    
    console.log(`🎖️ Insignias compradas: ${insigniasCompradas?.length || 0}`);
    
    if (insigniasCompradas && insigniasCompradas.length > 0) {
      console.log('\n📋 Detalles de las insignias:');
      insigniasCompradas.forEach((insignia, index) => {
        console.log(`   ${index + 1}. ${insignia.recompensas_catalogo?.nombre}`);
        console.log(`      └─ Equipada: ${insignia.recompensa_id === usuario.insignia_actual ? 'SÍ' : 'NO'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error en verificación:', error);
  }
}

verificarUsuarioInsignias();
