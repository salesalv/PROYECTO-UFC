import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Eye } from "lucide-react"; // Changed Trophy to Eye
import { Link } from "react-router-dom"; // Import Link

// Using placeholder data similar to EventsPage for consistency
const previewEvents = [
 {
    id: 1,
    title: "UFC 303: McGregor vs. Chandler",
    date: "2025-06-29",
    fighters: "McGregor vs. Chandler",
    imageSlug: "arena-lights-crowd",
    altText: "Brightly lit arena packed with spectators for a UFC event",
    link: "/ufc303"
  },
  {
    id: 2,
    title: "UFC Fight Night: Namajunas vs. Barber",
    date: "2025-07-13",
    fighters: "Namajunas vs. Barber",
    imageSlug: "octagon-side-view",
    altText: "Side view of the UFC octagon during a fight",
    link: "/ufcnamajunasbarber"
  },
  {
    id: 3,
    title: "UFC 304: Edwards vs. Muhammad 2",
    date: "2025-07-27",
    fighters: "Edwards vs. Muhammad",
    imageSlug: "fighters-staredown",
    altText: "Two fighters facing off intensely before a match",
    link: "/ufc304"
  },
  {
    id: 4,
    title: "UFC Fight Night: Sandhagen vs. Nurmagomedov",
    date: "2025-08-03",
    fighters: "Sandhagen vs. Nurmagomedov",
    imageSlug: "fighter-celebrating-victory",
    altText: "A victorious fighter celebrating in the octagon",
    link: "/ufcsandhagennurmagomedov"
  },
];


const FeaturedFightsList = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-black via-gray-950 to-black"> {/* Added gradient */}
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold flex items-center text-white">
            <Calendar className="mr-3 text-red-500" /> {/* Changed icon */}
            Próximos Eventos
          </h3>
          <Button variant="link" className="text-red-400 hover:text-red-300" asChild>
             <Link to="/events">Ver Todos &rarr;</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewEvents.slice(0, 3).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }} // Faster delay
              className="bg-black/60 rounded-lg overflow-hidden card-hover border border-gray-800 backdrop-blur-sm"
            >
              <div className="relative aspect-video"> {/* Use aspect ratio */}
                <img 
                  className="w-full h-full object-cover"
                  alt={event.altText}
                 src="https://images.unsplash.com/photo-1649190800807-6f1d42a4bc05" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-2 left-3">
                   <h4 className="text-lg font-bold text-white shadow-text">{event.title}</h4>
                </div>
              </div>
              <div className="p-4"> {/* Reduced padding */}
                <div className="flex items-center text-sm text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-red-500" />
                  {new Date(event.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                </div>
                <p className="text-gray-300 mb-3 text-sm flex items-center">
                   <Users className="w-4 h-4 mr-2 text-red-500"/> {event.fighters}
                </p>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-red-900/30" asChild>
                     <Link to={event.link}> {/* Link to events page */}
                       Ver Detalles
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
