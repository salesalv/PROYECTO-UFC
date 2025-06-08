import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Ticket } from "lucide-react";

// Placeholder event data
const upcomingEvents = [
  {
    id: 1,
    title: "UFC 303: McGregor vs. Chandler",
    date: "2025-06-29",
    location: "Las Vegas, NV",
    mainEvent: "Conor McGregor vs. Michael Chandler",
    coMainEvent: "Jamahal Hill vs. Khalil Rountree Jr.",
    venue: "T-Mobile Arena",
    imageSlug: "arena-lights-crowd",
    altText: "Brightly lit arena packed with spectators for a UFC event"
  },
  {
    id: 2,
    title: "UFC Fight Night: Namajunas vs. Barber",
    date: "2025-07-13",
    location: "Denver, CO",
    mainEvent: "Rose Namajunas vs. Maycee Barber",
    coMainEvent: "TBD",
    venue: "Ball Arena",
    imageSlug: "octagon-side-view",
    altText: "Side view of the UFC octagon during a fight"
  },
  {
    id: 3,
    title: "UFC 304: Edwards vs. Muhammad 2",
    date: "2025-07-27",
    location: "Manchester, England",
    mainEvent: "Leon Edwards vs. Belal Muhammad",
    coMainEvent: "Tom Aspinall vs. Curtis Blaydes",
    venue: "Co-op Live",
    imageSlug: "fighters-staredown",
    altText: "Two fighters facing off intensely before a match"
  },
   {
    id: 4,
    title: "UFC Fight Night: Sandhagen vs. Nurmagomedov",
    date: "2025-08-03",
    location: "Abu Dhabi, UAE",
    mainEvent: "Cory Sandhagen vs. Umar Nurmagomedov",
    coMainEvent: "TBD",
    venue: "Etihad Arena",
    imageSlug: "fighter-celebrating-victory",
    altText: "A victorious fighter celebrating in the octagon"
  },
];

const EventsPage = () => {
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
          Próximos Eventos
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="bg-black/60 border-gray-800 shadow-lg overflow-hidden backdrop-blur-sm h-full flex flex-col card-hover">
                <div className="relative h-48 md:h-56">
                  <img 
                    className="w-full h-full object-cover"
                    alt={event.altText}
                   src="https://images.unsplash.com/photo-1696407254550-989e4543dc11" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                   <div className="absolute bottom-4 left-4">
                     <h2 className="text-2xl font-bold text-white shadow-text">{event.title}</h2>
                   </div>
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <div className="space-y-3 text-gray-300 mb-5 flex-grow">
                    <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-red-500" /> {new Date(event.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-red-500" /> {event.location} ({event.venue})</p>
                    <p className="flex items-start"><Users className="w-4 h-4 mr-2 mt-1 text-red-500 flex-shrink-0" /> <span className="font-semibold">Pelea Principal:</span>&nbsp;{event.mainEvent}</p>
                    {event.coMainEvent !== "TBD" && <p className="flex items-start"><Users className="w-4 h-4 mr-2 mt-1 text-red-500 flex-shrink-0" /> <span className="font-semibold">Co-Estelar:</span>&nbsp;{event.coMainEvent}</p>}
                  </div>
                  <div className="mt-auto flex justify-end">
                    {event.title === "UFC 303: McGregor vs. Chandler" ||
                     event.title === "UFC Fight Night: Namajunas vs. Barber" ||
                     event.title === "UFC 304: Edwards vs. Muhammad 2" ||
                     event.title === "UFC Fight Night: Sandhagen vs. Nurmagomedov" ? (
                      <Button className="bg-red-600 hover:bg-red-700" asChild>
                        <a href={
                          event.title === "UFC 303: McGregor vs. Chandler" ? "/ufc303" :
                          event.title === "UFC Fight Night: Namajunas vs. Barber" ? "/ufcnamajunasbarber" :
                          event.title === "UFC 304: Edwards vs. Muhammad 2" ? "/ufc304" :
                          "/ufcsandhagennurmagomedov"
                        }>
                          <Ticket className="w-4 h-4 mr-2" />
                          Ver Detalles / Comprar
                        </a>
                      </Button>
                    ) : (
                      <Button className="bg-red-600 hover:bg-red-700">
                        <Ticket className="w-4 h-4 mr-2" />
                        Ver Detalles / Comprar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EventsPage;
