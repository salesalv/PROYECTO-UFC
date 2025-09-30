import { useState, useEffect } from 'react';
import { getAllEvents, getUpcomingEvents, getPastEvents, searchEvents } from '@/services/eventService';

/**
 * Hook personalizado para manejar eventos
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.upcomingOnly - Solo eventos próximos
 * @param {boolean} options.pastOnly - Solo eventos pasados
 * @param {string} options.searchTerm - Término de búsqueda
 * @returns {Object} Estado y funciones de eventos
 */
export const useEvents = (options = {}) => {
  const { upcomingOnly = false, pastOnly = false, searchTerm = '' } = options;
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let eventsData;
      
      if (searchTerm) {
        eventsData = await searchEvents(searchTerm);
      } else if (upcomingOnly) {
        eventsData = await getUpcomingEvents();
      } else if (pastOnly) {
        eventsData = await getPastEvents();
      } else {
        eventsData = await getAllEvents();
      }
      
      setEvents(eventsData);
    } catch (err) {
      console.error('Error loading events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [upcomingOnly, pastOnly, searchTerm]);

  const refreshEvents = () => {
    loadEvents();
  };

  return {
    events,
    loading,
    error,
    refreshEvents
  };
};

export default useEvents;

