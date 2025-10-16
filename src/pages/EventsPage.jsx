import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Ticket, Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { getAllEvents } from "@/services/eventService";

const EventsPage = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const eventsData = await getAllEvents();
        setEvents(eventsData);
      } catch (err) {
        console.error('Error loading events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEventRoute = (event) => {
    // Usar el campo detalles_url de la base de datos, que es más confiable
    // Si no existe, usar una ruta genérica basada en el ID
    return event.detalles_url || `/event/${event.id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-500 mr-4" />
            <span className="text-gray-400">Cargando eventos...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Error al cargar eventos</h2>
              <p className="text-gray-400">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-7xl"
      >
        <h1 className="text-4xl md:text-5xl font-black mb-10 text-center uppercase text-red-500 tracking-wider flex items-center justify-center">
          <Calendar className="w-10 h-10 mr-4 text-yellow-400" />
          {t('events.title')}
        </h1>

        {events.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">No hay eventos disponibles</h2>
            <p className="text-gray-500">Próximamente se agregarán nuevos eventos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="bg-black/60 border-gray-800 shadow-lg overflow-hidden backdrop-blur-sm h-full flex flex-col card-hover">
                  <div className="relative h-40 sm:h-48 md:h-56">
                    <img 
                      className="w-full h-full object-cover"
                      alt={event.texto_alternativo || event.titulo}
                      src={event.imagen || "https://images.unsplash.com/photo-1696407254550-989e4543dc11"} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h2 className="text-2xl font-bold text-white shadow-text">{event.titulo}</h2>
                    </div>
                  </div>
                  <CardContent className="p-4 sm:p-6 flex-grow flex flex-col">
                    <div className="space-y-3 text-gray-300 mb-5 flex-grow">
                      <p className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-red-500" /> 
                        {formatDate(event.fecha)}
                      </p>
                      <p className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-red-500" /> 
                        {event.ubicacion} ({event.sede})
                      </p>
                      <p className="flex items-start">
                        <Users className="w-4 h-4 mr-2 mt-1 text-red-500 flex-shrink-0" /> 
                        <span className="font-semibold">{event.pelea_principal_titulo}:</span>&nbsp;{event.pelea_principal_participantes}
                      </p>
                      {event.pelea_co_estelar_participantes && event.pelea_co_estelar_participantes !== "TBD" && (
                        <p className="flex items-start">
                          <Users className="w-4 h-4 mr-2 mt-1 text-red-500 flex-shrink-0" /> 
                          <span className="font-semibold">{event.pelea_co_estelar_titulo}:</span>&nbsp;{event.pelea_co_estelar_participantes}
                        </p>
                      )}
                    </div>
                    <div className="mt-auto flex justify-end">
                      <Button className="bg-red-600 hover:bg-red-700" asChild>
                        <Link to={getEventRoute(event)}>
                          <Ticket className="w-4 h-4 mr-2" />
                          {t('events.details')}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EventsPage;
