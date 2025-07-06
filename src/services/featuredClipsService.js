import supabase from "@/db";

/**
 * Servicio para manejar clips destacados en Supabase
 * Solo funciones de lectura - Los administradores suben clips desde Supabase Dashboard
 */

// Obtener todos los clips destacados ordenados por fecha de creación
export async function getFeaturedClips() {
  try {
    const { data, error } = await supabase
      .from('featured_clips')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener clips destacados:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error inesperado al obtener clips:', error);
    throw error;
  }
}

// Verifica si el usuario ya vio el clip
export async function hasUserViewedClip(userId, clipId) {
  const { data, error } = await supabase
    .from('clip_views')
    .select('id')
    .eq('user_id', userId)
    .eq('clip_id', clipId)
    .single();
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error al verificar vista única:', error);
    throw error;
  }
  return !!data;
}

// Registra la vista única y suma 1 a las vistas del clip si es la primera vez
export async function registerUniqueView(userId, clipId) {
  // Verificar si ya existe
  const alreadyViewed = await hasUserViewedClip(userId, clipId);
  if (!alreadyViewed) {
    // Insertar vista única
    const { error: insertError } = await supabase
      .from('clip_views')
      .insert([{ user_id: userId, clip_id: clipId }]);
    if (insertError) {
      console.error('Error al registrar vista única:', insertError);
      throw insertError;
    }
    // Sumar 1 a las vistas del clip
    await supabase.rpc('increment_featured_clip_views', { clip_id: clipId });
    return true;
  }
  return false;
}

// Incrementar vistas de un clip (solo para compatibilidad, pero ahora usar registerUniqueView)
export async function incrementClipViews(clipId) {
  const { error } = await supabase
    .rpc('increment_featured_clip_views', { clip_id: clipId });
  if (error) {
    console.error('Error al incrementar vistas:', error);
    throw error;
  }
  return true;
}

// Obtener un clip específico por ID
export async function getFeaturedClipById(clipId) {
  try {
    const { data, error } = await supabase
      .from('featured_clips')
      .select('*')
      .eq('id', clipId)
      .single();

    if (error) {
      console.error('Error al obtener clip por ID:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error inesperado al obtener clip por ID:', error);
    throw error;
  }
}

// Formatear número de vistas para mostrar
export function formatViews(views) {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views?.toString() || '0';
}

// Ejemplo de datos para insertar clips de prueba (solo para referencia)
export const sampleClips = [
  {
    titulo: "KO del año - McGregor vs Aldo",
    descripcion: "El legendario KO de 13 segundos que cambió la historia del UFC",
    url_video: "https://www.youtube.com/watch?v=example1",
    peleadores: ["Conor McGregor", "Jose Aldo"]
  },
  {
    titulo: "Submission épica - Khabib vs McGregor",
    descripcion: "La dominación total de Khabib en UFC 229",
    url_video: "https://www.youtube.com/watch?v=example2",
    peleadores: ["Khabib Nurmagomedov", "Conor McGregor"]
  },
  {
    titulo: "Fight of the Night - Holloway vs Poirier",
    descripcion: "Una guerra de 5 rounds que definió una era",
    url_video: "https://www.youtube.com/watch?v=example3",
    peleadores: ["Max Holloway", "Dustin Poirier"]
  }
];

// Obtener clips destacados con más vistas (top clips)
export async function getTopFeaturedClips(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('featured_clips')
      .select('*')
      .order('vistas', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error al obtener clips top:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error inesperado al obtener clips top:', error);
    throw error;
  }
}

// Buscar clips por título o peleadores
export async function searchFeaturedClips(query) {
  try {
    const { data, error } = await supabase
      .from('featured_clips')
      .select('*')
      .or(`titulo.ilike.%${query}%,peleadores.cs.{${query}}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al buscar clips:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error inesperado al buscar clips:', error);
    throw error;
  }
} 