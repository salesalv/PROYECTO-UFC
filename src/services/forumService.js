import supabase from "@/db";

// Obtener todas las categorías del foro
export async function getCategories() {
  const { data, error } = await supabase
    .from('forum_categories')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return data || [];
}

// Obtener hilos por categoría
export async function getThreadsByCategory(category_id) {
  const { data, error } = await supabase
    .from('forum_threads')
    .select('*')
    .eq('category_id', category_id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// Crear hilo
export async function createThread({ title, content, user_id, username, category_id }) {
  const { data, error } = await supabase
    .from('forum_threads')
    .insert([{ title, content, user_id, username, category_id }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Obtener hilo por ID
export async function getThreadById(thread_id) {
  const { data, error } = await supabase
    .from('forum_threads')
    .select('*')
    .eq('id', thread_id)
    .single();
  if (error) throw error;
  return data;
}

// Obtener respuestas de un hilo
export async function getRepliesByThread(thread_id) {
  const { data, error } = await supabase
    .from('forum_replies')
    .select('*')
    .eq('thread_id', thread_id)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

// Crear respuesta
export async function createReply({ thread_id, content, user_id, username }) {
  const { data, error } = await supabase
    .from('forum_replies')
    .insert([{ thread_id, content, user_id, username }])
    .select()
    .single();
  if (error) throw error;
  return data;
} 