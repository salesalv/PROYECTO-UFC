import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Imágenes de ejemplo para peleadores (puedes reemplazar por las reales)
const fighterImages = {
  "Conor McGregor": "https://static.ufcstats.com/images/athlete/Conor-McGregor.png",
  "Michael Chandler": "https://static.ufcstats.com/images/athlete/Michael-Chandler.png",
  "Jamahal Hill": "https://static.ufcstats.com/images/athlete/Jamahal-Hill.png",
  "Khalil Rountree Jr.": "https://static.ufcstats.com/images/athlete/Khalil-Rountree.png",
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

const eventImage = "https://images.unsplash.com/photo-1696407254550-989e4543dc11";
const eventTime = "7:00 PM (hora local)";

const UFC303CardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="bg-black/80 border border-gray-800 shadow-lg backdrop-blur-sm">
          {/* Imagen destacada */}
          <div className="relative h-56 md:h-72 w-full overflow-hidden rounded-t-lg">
            <img
              src={eventImage}
              alt="UFC 303 Arena"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </div>
          <CardHeader className="text-center border-b border-gray-700 pb-4">
            <CardTitle className="text-3xl font-black uppercase text-red-500 tracking-wider">
              UFC 303: McGregor vs. Chandler
            </CardTitle>
            <div className="text-gray-300 mt-2 text-lg">28 de junio de 2025 - Las Vegas, NV (T-Mobile Arena)</div>
            <div className="text-yellow-400 font-bold text-lg mt-1">{eventTime}</div>
          </CardHeader>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">Cartelera Estelar</h2>
            <div className="space-y-4 mb-8">
              {mainCard.map((fight, idx) => (
                <div key={idx} className="bg-gray-900/60 rounded-lg px-4 py-3 border border-gray-700 mb-2">
                  <div className="grid grid-cols-12 items-center gap-2">
                    {/* Izquierda */}
                    <div className="col-span-5 flex items-center justify-end gap-2">
                      <img src={fighterImages[fight.left.name]} alt={fight.left.name} className="w-11 h-11 rounded-full object-cover border-2 border-gray-700 bg-black" />
                      <span className="text-white text-base md:text-lg font-bold drop-shadow">{fight.left.flag}</span>
                      <span className="text-white text-base md:text-lg font-bold drop-shadow text-right">{fight.left.name}</span>
                    </div>
                    {/* VS */}
                    <div className="col-span-2 flex items-center justify-center">
                      <span className="text-gray-200 text-lg md:text-2xl font-black tracking-wider">VS</span>
                    </div>
                    {/* Derecha */}
                    <div className="col-span-5 flex items-center justify-start gap-2">
                      <span className="text-white text-base md:text-lg font-bold drop-shadow text-left">{fight.right.name}</span>
                      <span className="text-white text-base md:text-lg font-bold drop-shadow">{fight.right.flag}</span>
                      <img src={fighterImages[fight.right.name]} alt={fight.right.name} className="w-11 h-11 rounded-full object-cover border-2 border-gray-700 bg-black" />
                    </div>
                  </div>
                  <div className="w-full text-center mt-2">
                    <span className="text-xs text-blue-300 font-semibold">{fight.weight}</span>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="text-xl font-bold text-blue-400 mb-4 text-center">Preliminares</h2>
            <div className="space-y-3">
              {prelims.map((fight, idx) => (
                <div key={idx} className="bg-gray-900/40 rounded px-4 py-2 border border-gray-800 mb-2">
                  <div className="grid grid-cols-12 items-center gap-2">
                    {/* Izquierda */}
                    <div className="col-span-5 flex items-center justify-end gap-2">
                      <img src={fighterImages[fight.left.name]} alt={fight.left.name} className="w-9 h-9 rounded-full object-cover border-2 border-gray-700 bg-black" />
                      <span className="text-white text-sm md:text-base font-bold drop-shadow">{fight.left.flag}</span>
                      <span className="text-white text-sm md:text-base font-bold drop-shadow text-right">{fight.left.name}</span>
                    </div>
                    {/* VS */}
                    <div className="col-span-2 flex items-center justify-center">
                      <span className="text-gray-200 text-base md:text-xl font-black tracking-wider">VS</span>
                    </div>
                    {/* Derecha */}
                    <div className="col-span-5 flex items-center justify-start gap-2">
                      <span className="text-white text-sm md:text-base font-bold drop-shadow text-left">{fight.right.name}</span>
                      <span className="text-white text-sm md:text-base font-bold drop-shadow">{fight.right.flag}</span>
                      <img src={fighterImages[fight.right.name]} alt={fight.right.name} className="w-9 h-9 rounded-full object-cover border-2 border-gray-700 bg-black" />
                    </div>
                  </div>
                  <div className="w-full text-center mt-2">
                    <span className="text-xs text-yellow-300 font-semibold">{fight.weight}</span>
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

export default UFC303CardPage; 