import supabase from '@/db';

/**
 * Servicio para manejar eventos de UFC
 * Proporciona funciones para obtener, crear, actualizar y eliminar eventos
 */

/**
 * Obtener todos los eventos activos ordenados por fecha
 * @returns {Promise<Array>} Lista de eventos
 */
export const getAllEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('evento')
      .select('*')
      .eq('activo', true)
      .order('orden_mostrar', { ascending: true })
      .order('fecha', { ascending: true });

    if (error) {
      throw new Error(`Error al obtener eventos: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error en getAllEvents:', error);
    throw error;
  }
};

/**
 * Obtener un evento específico por ID
 * @param {number} eventId - ID del evento
 * @returns {Promise<Object|null>} Datos del evento
 */
export const getEventById = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from('evento')
      .select('*')
      .eq('id', eventId)
      .eq('activo', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Evento no encontrado
      }
      throw new Error(`Error al obtener evento: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error en getEventById:', error);
    throw error;
  }
};

/**
 * Obtener eventos próximos (fecha >= hoy)
 * @returns {Promise<Array>} Lista de eventos próximos
 */
export const getUpcomingEvents = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('evento')
      .select('*')
      .eq('activo', true)
      .gte('fecha', today)
      .order('fecha', { ascending: true })
      .order('orden_mostrar', { ascending: true });

    if (error) {
      throw new Error(`Error al obtener eventos próximos: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error en getUpcomingEvents:', error);
    throw error;
  }
};

/**
 * Obtener eventos pasados (fecha < hoy)
 * @returns {Promise<Array>} Lista de eventos pasados
 */
export const getPastEvents = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('evento')
      .select('*')
      .eq('activo', true)
      .lt('fecha', today)
      .order('fecha', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener eventos pasados: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error en getPastEvents:', error);
    throw error;
  }
};

/**
 * Crear un nuevo evento (solo para administradores)
 * @param {Object} eventData - Datos del evento
 * @returns {Promise<Object>} Evento creado
 */
export const createEvent = async (eventData) => {
  try {
    const { data, error } = await supabase
      .from('evento')
      .insert([eventData])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear evento: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error en createEvent:', error);
    throw error;
  }
};

/**
 * Actualizar un evento existente (solo para administradores)
 * @param {number} eventId - ID del evento
 * @param {Object} eventData - Datos actualizados del evento
 * @returns {Promise<Object>} Evento actualizado
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    const { data, error } = await supabase
      .from('evento')
      .update(eventData)
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar evento: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error en updateEvent:', error);
    throw error;
  }
};

/**
 * Eliminar un evento (solo para administradores)
 * @param {number} eventId - ID del evento
 * @returns {Promise<boolean>} True si se eliminó correctamente
 */
export const deleteEvent = async (eventId) => {
  try {
    const { error } = await supabase
      .from('evento')
      .delete()
      .eq('id', eventId);

    if (error) {
      throw new Error(`Error al eliminar evento: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('Error en deleteEvent:', error);
    throw error;
  }
};

/**
 * Desactivar un evento (soft delete)
 * @param {number} eventId - ID del evento
 * @returns {Promise<Object>} Evento desactivado
 */
export const deactivateEvent = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from('evento')
      .update({ activo: false })
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al desactivar evento: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error en deactivateEvent:', error);
    throw error;
  }
};

/**
 * Buscar eventos por título o ubicación
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Promise<Array>} Lista de eventos encontrados
 */
export const searchEvents = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('evento')
      .select('*')
      .eq('activo', true)
      .or(`titulo.ilike.%${searchTerm}%,ubicacion.ilike.%${searchTerm}%,sede.ilike.%${searchTerm}%`)
      .order('fecha', { ascending: true });

    if (error) {
      throw new Error(`Error al buscar eventos: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error en searchEvents:', error);
    throw error;
  }
};

/**
 * Obtener eventos por rango de fechas
 * @param {string} startDate - Fecha de inicio (YYYY-MM-DD)
 * @param {string} endDate - Fecha de fin (YYYY-MM-DD)
 * @returns {Promise<Array>} Lista de eventos en el rango
 */
export const getEventsByDateRange = async (startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from('evento')
      .select('*')
      .eq('activo', true)
      .gte('fecha', startDate)
      .lte('fecha', endDate)
      .order('fecha', { ascending: true });

    if (error) {
      throw new Error(`Error al obtener eventos por rango de fechas: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error en getEventsByDateRange:', error);
    throw error;
  }
};

