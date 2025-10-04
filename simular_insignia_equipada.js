/**
 * Script para simular una insignia equipada en la base de datos
 * Solo ejecutar DESPUÉS de crear las tablas de insignias
 */

import supabase from './src/db.js';

async function simularInsigniaEquipada() {
  console.log('🎯 Simulando insignia equipada...\n');

  try {
    // Obtener primer usuario
    const { data: usuarios, error: userError } = await supabase
      .from('usuario')
      .select('id, nombre_usuario')
      .limit(1);

    if (userError || !usuarios?.length) {
      console.log('❌ No se encontraron usuarios');
      return;
    }

    const usuario = usuarios[0];
    console.log(`👤 Usuario encontrado: ${usuario.nombre_usuario} (ID: ${usuario.id})`);

    // Verificar si ya tiene insignia equipada
    const { data: usuarioActual, error: checkError } = await supabase
      .from('usuario')
      .select('insignia_actual')
      .eq('id', usuario.id)
      .single();

    if (checkError && !checkError.message.includes('insignia_actual')) {
      console.log('❌ Error verificando usuario:', checkError.message);
      console.log('💡 Necesitas crear las columnas de insignias primero');
      return;
    }

    if (usuarioActual.insignia_actual) {
      console.log(`✅ Usuario ya tiene insignia equipada: ${usuarioActual.insignia_actual}`);
      return;
    }

    // Agregar insignia equipada
    console.log('🔄 Agregando insignia de bronce...');
    const { error: updateError } = await supabase
      .from('usuario')
      .update({ 
        insignia_actual: 'badge_bronce',
        insignias_mostradas: {
          mostrar_insignia: true,
          mostrar_fecha_canje: true
        }
      })
      .eq('id', usuario.id);

    if (updateError) {
      console.log('❌ Error actualizando usuario:', updateError.message);
      return;
    }

    console.log('✅ Insignia equipada exitosamente!');
    console.log('🎮 Ve a tu perfil para ver la insignia');

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

simularInsigniaEquipada().catch(console.error);
