import supabase from '@/db';

/**
 * Servicio para manejar peleas de UFC
 * Proporciona funciones para obtener, crear, actualizar y eliminar peleas
 */

/**
 * Obtener todas las peleas de un evento específico
 * @param {number} eventId - ID del evento
 * @returns {Promise<Array>} Lista de peleas del evento
 */
export const getFightsByEventId = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from('peleas')
      .select('*')
      .eq('evento_id', eventId)
      .eq('activo', true)
      .order('orden_pelea', { ascending: true });

    if (error) {
      throw new Error(`Error al obtener peleas: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error en getFightsByEventId:', error);
    throw error;
  }
};

/**
 * Obtener peleas por tipo (principal, co-estelar, preliminar, estelar)
 * @param {number} eventId - ID del evento
 * @param {string} tipoPelea - Tipo de pelea
 * @returns {Promise<Array>} Lista de peleas del tipo especificado
 */
export const getFightsByType = async (eventId, tipoPelea) => {
  try {
    const { data, error } = await supabase
      .from('peleas')
      .select('*')
      .eq('evento_id', eventId)
      .eq('tipo_pelea', tipoPelea)
      .eq('activo', true)
      .order('orden_pelea', { ascending: true });

    if (error) {
      throw new Error(`Error al obtener peleas por tipo: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error en getFightsByType:', error);
    throw error;
  }
};

/**
 * Obtener pelea principal de un evento
 * @param {number} eventId - ID del evento
 * @returns {Promise<Object|null>} Pelea principal
 */
export const getMainEvent = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from('peleas')
      .select('*')
      .eq('evento_id', eventId)
      .eq('tipo_pelea', 'principal')
      .eq('activo', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No se encontró pelea principal
      }
      throw new Error(`Error al obtener pelea principal: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error en getMainEvent:', error);
    throw error;
  }
};

/**
 * Obtener pelea co-estelar de un evento
 * @param {number} eventId - ID del evento
 * @returns {Promise<Object|null>} Pelea co-estelar
 */
export const getCoMainEvent = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from('peleas')
      .select('*')
      .eq('evento_id', eventId)
      .eq('tipo_pelea', 'co-estelar')
      .eq('activo', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No se encontró pelea co-estelar
      }
      throw new Error(`Error al obtener pelea co-estelar: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error en getCoMainEvent:', error);
    throw error;
  }
};

/**
 * Obtener peleas estelares de un evento
 * @param {number} eventId - ID del evento
 * @returns {Promise<Array>} Lista de peleas estelares
 */
export const getMainCardFights = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from('peleas')
      .select('*')
      .eq('evento_id', eventId)
      .eq('tipo_pelea', 'estelar')
      .eq('activo', true)
      .order('orden_pelea', { ascending: true });

    if (error) {
      throw new Error(`Error al obtener peleas estelares: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error en getMainCardFights:', error);
    throw error;
  }
};

/**
 * Obtener peleas preliminares de un evento
 * @param {number} eventId - ID del evento
 * @returns {Promise<Array>} Lista de peleas preliminares
 */
export const getPreliminaryFights = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from('peleas')
      .select('*')
      .eq('evento_id', eventId)
      .eq('tipo_pelea', 'preliminar')
      .eq('activo', true)
      .order('orden_pelea', { ascending: true });

    if (error) {
      throw new Error(`Error al obtener peleas preliminares: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error en getPreliminaryFights:', error);
    throw error;
  }
};

/**
 * Crear una nueva pelea (solo para administradores)
 * @param {Object} fightData - Datos de la pelea
 * @returns {Promise<Object>} Pelea creada
 */
export const createFight = async (fightData) => {
  try {
    const { data, error } = await supabase
      .from('peleas')
      .insert([fightData])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear pelea: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error en createFight:', error);
    throw error;
  }
};

/**
 * Actualizar una pelea existente (solo para administradores)
 * @param {number} fightId - ID de la pelea
 * @param {Object} fightData - Datos actualizados de la pelea
 * @returns {Promise<Object>} Pelea actualizada
 */
export const updateFight = async (fightId, fightData) => {
  try {
    const { data, error } = await supabase
      .from('peleas')
      .update(fightData)
      .eq('id', fightId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar pelea: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error en updateFight:', error);
    throw error;
  }
};

/**
 * Eliminar una pelea (solo para administradores)
 * @param {number} fightId - ID de la pelea
 * @returns {Promise<boolean>} True si se eliminó correctamente
 */
export const deleteFight = async (fightId) => {
  try {
    const { error } = await supabase
      .from('peleas')
      .delete()
      .eq('id', fightId);

    if (error) {
      throw new Error(`Error al eliminar pelea: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('Error en deleteFight:', error);
    throw error;
  }
};

/**
 * Desactivar una pelea (soft delete)
 * @param {number} fightId - ID de la pelea
 * @returns {Promise<Object>} Pelea desactivada
 */
export const deactivateFight = async (fightId) => {
  try {
    const { data, error } = await supabase
      .from('peleas')
      .update({ activo: false })
      .eq('id', fightId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al desactivar pelea: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error en deactivateFight:', error);
    throw error;
  }
};
