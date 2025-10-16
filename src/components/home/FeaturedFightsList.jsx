import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { getAllEvents } from "@/services/eventService";


const FeaturedFightsList = (props) => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await getAllEvents();
        setEvents(eventsData.slice(0, 3)); // Solo mostrar los primeros 3
      } catch (err) {
        console.error('Error loading events:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const getEventRoute = (event) => {
    return event.detalles_url || `/event/${event.id}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="container mx-auto">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-500 mr-4" />
            <span className="text-gray-400">Cargando eventos...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-black via-gray-950 to-black"> {/* Added gradient */}
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold flex items-center text-white">
            <Calendar className="mr-3 text-red-500" /> {/* Changed icon */}
            {t('home.upcoming_events')}
          </h3>
          <Button variant="link" className="text-red-400 hover:text-red-300" asChild>
             <Link to="/events">{t('home.see_all')}</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/60 rounded-lg overflow-hidden card-hover border border-gray-800 backdrop-blur-sm"
            >
              <div className="relative aspect-video">
                <img 
                  className="w-full h-full object-cover"
                  alt={event.texto_alternativo || event.titulo}
                  src={event.imagen || "https://images.unsplash.com/photo-1649190800807-6f1d42a4bc05"} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-2 left-3">
                   <h4 className="text-lg font-bold text-white shadow-text">{event.titulo}</h4>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <div className="flex items-center text-sm text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-red-500" />
                  {formatDate(event.fecha)}
                </div>
                <p className="text-gray-300 mb-3 text-sm flex items-center">
                   <Users className="w-4 h-4 mr-2 text-red-500"/> 
                   {event.pelea_principal_participantes || 'TBD'}
                </p>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-red-900/30" asChild>
                     <Link to={getEventRoute(event)}>
                       {t('home.see_details')}
                     </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedFightsList;
