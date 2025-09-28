import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { getAllEvents } from "@/services/eventService";
import { getFightsByEventId, getMainEvent, getCoMainEvent, getMainCardFights, getPreliminaryFights } from "@/services/fightService";
import { Loader2, AlertCircle } from "lucide-react";

// Imágenes de ejemplo para peleadores (puedes reemplazar por las reales)
const fighterImages = {
  "Conor McGregor": "https://static.ufcstats.com/images/athlete/Conor-McGregor.png",
  "Michael Chandler": "https://static.ufcstats.com/images/athlete/Michael-Chandler.png",
  "Jamahal Hill": "https://static.ufcstats.com/images/athlete/Jamahal-Hill.png",
  "Khalil Rountree Jr.": "https://static.ufcstats.com/images/athlete/Khalil-Rountree.png",
  "Rose Namajunas": "https://static.ufcstats.com/images/athlete/Rose-Namajunas.png",
  "Maycee Barber": "https://static.ufcstats.com/images/athlete/Maycee-Barber.png",
  "Leon Edwards": "https://static.ufcstats.com/images/athlete/Leon-Edwards.png",
  "Belal Muhammad": "https://static.ufcstats.com/images/athlete/Belal-Muhammad.png",
  "Tom Aspinall": "https://static.ufcstats.com/images/athlete/Tom-Aspinall.png",
  "Curtis Blaydes": "https://static.ufcstats.com/images/athlete/Curtis-Blaydes.png",
  "Cory Sandhagen": "https://static.ufcstats.com/images/athlete/Cory-Sandhagen.png",
  "Umar Nurmagomedov": "https://static.ufcstats.com/images/athlete/Umar-Nurmagomedov.png",
  "Joe Pyfer": "https://static.ufcstats.com/images/athlete/Joe-Pyfer.png",
  "Michel Pereira": "https://static.ufcstats.com/images/athlete/Michel-Pereira.png",
  "Mayra Bueno Silva": "https://static.ufcstats.com/images/athlete/Mayra-Bueno-Silva.png",
  "Irene Aldana": "https://static.ufcstats.com/images/athlete/Irene-Aldana.png",
  "Ian Machado Garry": "https://static.ufcstats.com/images/athlete/Ian-Garry.png",
  "Michael Page": "https://static.ufcstats.com/images/athlete/Michael-Page.png",
  "Cub Swanson": "https://static.ufcstats.com/images/athlete/Cub-Swanson.png",
  "Andre Fili": "https://static.ufcstats.com/images/athlete/Andre-Fili.png",
  "Jessica Andrade": "https://static.ufcstats.com/images/athlete/Jessica-Andrade.png",
  "Macy Chiasson": "https://static.ufcstats.com/images/athlete/Macy-Chiasson.png",
  "Brandon Royval": "https://static.ufcstats.com/images/athlete/Brandon-Royval.png",
  "Manel Kape": "https://static.ufcstats.com/images/athlete/Manel-Kape.png",
  "Raul Rosas Jr.": "https://static.ufcstats.com/images/athlete/Raul-Rosas-Jr.png",
  "Ricky Turcios": "https://static.ufcstats.com/images/athlete/Ricky-Turcios.png"
};

const mainCard = [
  {
    left: { name: "Conor McGregor", flag: "🇮🇪", rank: null },
    right: { name: "Michael Chandler", flag: "🇺🇸", rank: null },
    weight: "Peso ligero"
  },
  {
    left: { name: "Jamahal Hill", flag: "🇺🇸", rank: null },
    right: { name: "Khalil Rountree Jr.", flag: "🇺🇸", rank: null },
    weight: "Peso semipesado"
  },
  {
    left: { name: "Joe Pyfer", flag: "🇺🇸", rank: null },
    right: { name: "Michel Pereira", flag: "🇧🇷", rank: null },
    weight: "Peso medio"
  },
  {
    left: { name: "Mayra Bueno Silva", flag: "🇧🇷", rank: null },
    right: { name: "Irene Aldana", flag: "🇲🇽", rank: null },
    weight: "Peso gallo femenino"
  },
  {
    left: { name: "Ian Machado Garry", flag: "🇮🇪", rank: null },
    right: { name: "Michael Page", flag: "🇬🇧", rank: null },
    weight: "Peso welter"
  }
];

const prelims = [
  {
    left: { name: "Cub Swanson", flag: "🇺🇸", rank: null },
    right: { name: "Andre Fili", flag: "🇺🇸", rank: null },
    weight: "Peso pluma"
  },
  {
    left: { name: "Jessica Andrade", flag: "🇧🇷", rank: null },
    right: { name: "Macy Chiasson", flag: "🇺🇸", rank: null },
    weight: "Peso gallo femenino"
  },
  {
    left: { name: "Brandon Royval", flag: "🇺🇸", rank: null },
    right: { name: "Manel Kape", flag: "🇦🇴", rank: null },
    weight: "Peso mosca"
  },
  {
    left: { name: "Raul Rosas Jr.", flag: "🇲🇽", rank: null },
    right: { name: "Ricky Turcios", flag: "🇺🇸", rank: null },
    weight: "Peso gallo"
  }
];

const EventCardPage = ({ eventTitle, eventId = null }) => {
  const { t } = useTranslation();
  const { id: urlId } = useParams(); // Obtener ID de la URL
  const [event, setEvent] = useState(null);
  const [mainEvent, setMainEvent] = useState(null);
  const [coMainEvent, setCoMainEvent] = useState(null);
  const [mainCardFights, setMainCardFights] = useState([]);
  const [preliminaryFights, setPreliminaryFights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para dividir los nombres de los peleadores
  const splitFighterNames = (fightersString) => {
    if (!fightersString || fightersString === 'TBD') return ['TBD', 'TBD'];
    
    // Intentar diferentes separadores
    const separators = [' vs ', ' vs', 'vs ', ' vs. ', ' vs.', 'vs. '];
    
    for (const separator of separators) {
      if (fightersString.includes(separator)) {
        const parts = fightersString.split(separator);
        if (parts.length === 2) {
          return [parts[0].trim(), parts[1].trim()];
        }
      }
    }
    
    // Si no se puede dividir, devolver la cadena completa como primer peleador
    return [fightersString.trim(), 'TBD'];
  };

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const events = await getAllEvents();
        let foundEvent;
        
        // Priorizar ID de la URL, luego props, luego título
        const targetId = urlId || eventId;
        
        if (targetId) {
          // Buscar por ID (más confiable)
          foundEvent = events.find(e => e.id === parseInt(targetId));
        } else if (eventTitle) {
          // Buscar por título (menos confiable, pero como fallback)
          foundEvent = events.find(e => e.titulo === eventTitle);
        }
        
        if (foundEvent) {
          setEvent(foundEvent);
          
          // Cargar peleas del evento
          const [mainEventData, coMainEventData, mainCardData, preliminaryData] = await Promise.all([
            getMainEvent(foundEvent.id),
            getCoMainEvent(foundEvent.id),
            getMainCardFights(foundEvent.id),
            getPreliminaryFights(foundEvent.id)
          ]);
          
          setMainEvent(mainEventData);
          setCoMainEvent(coMainEventData);
          setMainCardFights(mainCardData);
          setPreliminaryFights(preliminaryData);
        } else {
          setEvent(null);
        }
      } catch (err) {
        console.error('Error loading event:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [urlId, eventTitle, eventId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-500 mr-4" />
            <span className="text-gray-400">Cargando evento...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Error al cargar evento</h2>
              <p className="text-gray-400">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-400 mb-2">Evento no encontrado</h2>
            <p className="text-gray-500">El evento solicitado no está disponible.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="bg-black/80 border border-gray-800 shadow-lg backdrop-blur-sm">
          {/* Imagen destacada */}
          <div className="relative h-56 md:h-72 w-full overflow-hidden rounded-t-lg">
            <img
              src={event.imagen || "https://images.unsplash.com/photo-1696407254550-989e4543dc11"}
              alt={event.texto_alternativo || event.titulo}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </div>
          <CardHeader className="text-center border-b border-gray-700 pb-4">
            <CardTitle className="text-3xl font-black uppercase text-red-500 tracking-wider">
              {event.titulo}
            </CardTitle>
            <div className="text-gray-300 mt-2 text-lg">
              {formatDate(event.fecha)} - {event.ubicacion} ({event.sede})
            </div>
            <div className="text-yellow-400 font-bold text-lg mt-1">7:00 PM (hora local)</div>
          </CardHeader>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">Cartelera Estelar</h2>
            
            {/* Pelea Principal */}
            {mainEvent && (
              <div className="bg-red-900/20 rounded-lg px-4 py-3 border border-red-700 mb-4">
                <div className="text-center mb-2">
                  <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Pelea Principal</span>
                </div>
                <div className="grid grid-cols-12 items-center gap-2">
                  <div className="col-span-5 flex items-center justify-end gap-2">
                    <span className="text-white text-base md:text-lg font-bold drop-shadow text-right">
                      {mainEvent.peleador_1_nombre}
                    </span>
                    <span className="text-white text-base md:text-lg font-bold drop-shadow">
                      {mainEvent.peleador_1_bandera}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="text-gray-200 text-lg md:text-2xl font-black tracking-wider">VS</span>
                  </div>
                  <div className="col-span-5 flex items-center justify-start gap-2">
                    <span className="text-white text-base md:text-lg font-bold drop-shadow">
                      {mainEvent.peleador_2_bandera}
                    </span>
                    <span className="text-white text-base md:text-lg font-bold drop-shadow text-left">
                      {mainEvent.peleador_2_nombre}
                    </span>
                  </div>
                </div>
                <div className="w-full text-center mt-2">
                  <span className="text-xs text-red-300 font-semibold">{mainEvent.categoria_peso}</span>
                </div>
              </div>
            )}

            {/* Co-Estelar */}
            {coMainEvent && (
              <div className="bg-blue-900/20 rounded-lg px-4 py-3 border border-blue-700 mb-4">
                <div className="text-center mb-2">
                  <span className="text-blue-400 font-bold text-sm uppercase tracking-wider">Co-Estelar</span>
                </div>
                <div className="grid grid-cols-12 items-center gap-2">
                  <div className="col-span-5 flex items-center justify-end gap-2">
                    <span className="text-white text-base md:text-lg font-bold drop-shadow text-right">
                      {coMainEvent.peleador_1_nombre}
                    </span>
                    <span className="text-white text-base md:text-lg font-bold drop-shadow">
                      {coMainEvent.peleador_1_bandera}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="text-gray-200 text-lg md:text-2xl font-black tracking-wider">VS</span>
                  </div>
                  <div className="col-span-5 flex items-center justify-start gap-2">
                    <span className="text-white text-base md:text-lg font-bold drop-shadow">
                      {coMainEvent.peleador_2_bandera}
                    </span>
                    <span className="text-white text-base md:text-lg font-bold drop-shadow text-left">
                      {coMainEvent.peleador_2_nombre}
                    </span>
                  </div>
                </div>
                <div className="w-full text-center mt-2">
                  <span className="text-xs text-blue-300 font-semibold">{coMainEvent.categoria_peso}</span>
                </div>
              </div>
            )}

            <div className="space-y-4 mb-8">
              {mainCardFights.map((fight, idx) => (
                <div key={fight.id} className="bg-gray-900/60 rounded-lg px-4 py-3 border border-gray-700 mb-2">
                  <div className="grid grid-cols-12 items-center gap-2">
                    {/* Izquierda */}
                    <div className="col-span-5 flex items-center justify-end gap-2">
                      <img 
                        src={fighterImages[fight.peleador_1_nombre] || "https://via.placeholder.com/44x44/333/fff?text=?"} 
                        alt={fight.peleador_1_nombre} 
                        className="w-11 h-11 rounded-full object-cover border-2 border-gray-700 bg-black" 
                      />
                      <span className="text-white text-base md:text-lg font-bold drop-shadow">{fight.peleador_1_bandera}</span>
                      <span className="text-white text-base md:text-lg font-bold drop-shadow text-right">{fight.peleador_1_nombre}</span>
                    </div>
                    {/* VS */}
                    <div className="col-span-2 flex items-center justify-center">
                      <span className="text-gray-200 text-lg md:text-2xl font-black tracking-wider">VS</span>
                    </div>
                    {/* Derecha */}
                    <div className="col-span-5 flex items-center justify-start gap-2">
                      <span className="text-white text-base md:text-lg font-bold drop-shadow text-left">{fight.peleador_2_nombre}</span>
                      <span className="text-white text-base md:text-lg font-bold drop-shadow">{fight.peleador_2_bandera}</span>
                      <img 
                        src={fighterImages[fight.peleador_2_nombre] || "https://via.placeholder.com/44x44/333/fff?text=?"} 
                        alt={fight.peleador_2_nombre} 
                        className="w-11 h-11 rounded-full object-cover border-2 border-gray-700 bg-black" 
                      />
                    </div>
                  </div>
                  <div className="w-full text-center mt-2">
                    <span className="text-xs text-blue-300 font-semibold">{fight.categoria_peso}</span>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="text-xl font-bold text-blue-400 mb-4 text-center">Prelims</h2>
            <div className="space-y-3">
              {preliminaryFights.map((fight, idx) => (
                <div key={fight.id} className="bg-gray-900/40 rounded px-4 py-2 border border-gray-800 mb-2">
                  <div className="grid grid-cols-12 items-center gap-2">
                    {/* Izquierda */}
                    <div className="col-span-5 flex items-center justify-end gap-2">
                      <img 
                        src={fighterImages[fight.peleador_1_nombre] || "https://via.placeholder.com/36x36/333/fff?text=?"} 
                        alt={fight.peleador_1_nombre} 
                        className="w-9 h-9 rounded-full object-cover border-2 border-gray-700 bg-black" 
                      />
                      <span className="text-white text-sm md:text-base font-bold drop-shadow">{fight.peleador_1_bandera}</span>
                      <span className="text-white text-sm md:text-base font-bold drop-shadow text-right">{fight.peleador_1_nombre}</span>
                    </div>
                    {/* VS */}
                    <div className="col-span-2 flex items-center justify-center">
                      <span className="text-gray-200 text-base md:text-xl font-black tracking-wider">VS</span>
                    </div>
                    {/* Derecha */}
                    <div className="col-span-5 flex items-center justify-start gap-2">
                      <span className="text-white text-sm md:text-base font-bold drop-shadow text-left">{fight.peleador_2_nombre}</span>
                      <span className="text-white text-sm md:text-base font-bold drop-shadow">{fight.peleador_2_bandera}</span>
                      <img 
                        src={fighterImages[fight.peleador_2_nombre] || "https://via.placeholder.com/36x36/333/fff?text=?"} 
                        alt={fight.peleador_2_nombre} 
                        className="w-9 h-9 rounded-full object-cover border-2 border-gray-700 bg-black" 
                      />
                    </div>
                  </div>
                  <div className="w-full text-center mt-2">
                    <span className="text-xs text-yellow-300 font-semibold">{fight.categoria_peso}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventCardPage;
