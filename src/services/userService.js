import supabase from '@/db';

/**
 * Obtiene el ID numérico del usuario a partir de su UUID de auth
 */
export async function getUserIdFromUuid(uuid) {
  try {
    if (!uuid) return null;
    
    // Buscar usuario por el UUID en la tabla usuario
    const { data: usuario, error } = await supabase
      .from('usuario')
      .select('id')
      .eq('auth_id', uuid)
      .single();

    if (error) {
      console.warn('No se encontró usuario con UUID:', uuid);
      return null;
    }

    return usuario.id;
  } catch (error) {
    console.error('Error obteniendo ID de usuario:', error);
    return null;
  }
}

/**
 * Obtiene el ID numérico del usuario a partir de su nombre de usuario
 */
export async function getUserIdFromUsername(username) {
  try {
    if (!username) return null;
    
    const { data: usuario, error } = await supabase
      .from('usuario')
      .select('id')
      .eq('nombre_usuario', username)
      .single();

    if (error) {
      console.warn('No se encontró usuario con username:', username);
      return null;
    }

    return usuario.id;
  } catch (error) {
    console.error('Error obteniendo ID de usuario:', error);
    return null;
  }
}
