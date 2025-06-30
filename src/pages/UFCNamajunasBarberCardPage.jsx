import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

// Imágenes de ejemplo para peleadores
const fighterImages = {
  "Rose Namajunas": "https://static.ufcstats.com/images/athlete/Rose-Namajunas.png",
  "Maycee Barber": "https://static.ufcstats.com/images/athlete/Maycee-Barber.png",
  // ... existing code ...
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
    left: { name: "Rose Namajunas", flag: "🇺🇸", rank: null },
    right: { name: "Maycee Barber", flag: "🇺🇸", rank: null },
    weight: "Peso mosca"
  }
];

const prelims = [
  {
    left: { name: "Placeholder Fighter 1", flag: "🇺🇸", rank: null },
    right: { name: "Placeholder Fighter 2", flag: "🇧🇷", rank: null },
    weight: "Peso pluma"
  },
  {
    left: { name: "Placeholder Fighter 3", flag: "🇺🇸", rank: null },
    right: { name: "Placeholder Fighter 4", flag: "🇺🇸", rank: null },
    weight: "Peso gallo femenino"
  },
];

const eventImage = "https://images.unsplash.com/photo-1696407254550-989e4543dc11"; // Puedes cambiar esta imagen por una específica del evento
const eventTime = "7:00 PM (hora local)";

const UFCNamajunasBarberCardPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="bg-black/80 border border-gray-800 shadow-lg backdrop-blur-sm">
          {/* Imagen destacada */}
          <div className="relative h-56 md:h-72 w-full overflow-hidden rounded-t-lg">
            <img
              src={eventImage}
              alt={t('event.arena')}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </div>
          <CardHeader className="text-center border-b border-gray-700 pb-4">
            <CardTitle className="text-3xl font-black uppercase text-red-500 tracking-wider">
              {t('event.title.namajunas_barber')}
            </CardTitle>
            <div className="text-gray-300 mt-2 text-lg">{t('event.date_location.namajunas_barber')}</div>
            <div className="text-yellow-400 font-bold text-lg mt-1">{t('event.time', { time: eventTime })}</div>
          </CardHeader>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">{t('main_card')}</h2>
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
                      <span className="text-gray-200 text-lg md:text-2xl font-black tracking-wider">{t('vs')}</span>
                    </div>
                    {/* Derecha */}
                    <div className="col-span-5 flex items-center justify-start gap-2">
                      <span className="text-white text-base md:text-lg font-bold drop-shadow text-left">{fight.right.name}</span>
                      <span className="text-white text-base md:text-lg font-bold drop-shadow">{fight.right.flag}</span>
                      <img src={fighterImages[fight.right.name]} alt={fight.right.name} className="w-11 h-11 rounded-full object-cover border-2 border-gray-700 bg-black" />
                    </div>
                  </div>
                  <div className="w-full text-center mt-2">
                    <span className="text-xs text-blue-300 font-semibold">{t('weight.fly')}</span>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="text-xl font-bold text-blue-400 mb-4 text-center">{t('prelims')}</h2>
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
                      <span className="text-gray-200 text-base md:text-xl font-black tracking-wider">{t('vs')}</span>
                    </div>
                    {/* Derecha */}
                    <div className="col-span-5 flex items-center justify-start gap-2">
                      <span className="text-white text-sm md:text-base font-bold drop-shadow text-left">{fight.right.name}</span>
                      <span className="text-white text-sm md:text-base font-bold drop-shadow">{fight.right.flag}</span>
                      <img src={fighterImages[fight.right.name]} alt={fight.right.name} className="w-9 h-9 rounded-full object-cover border-2 border-gray-700 bg-black" />
                    </div>
                  </div>
                  <div className="w-full text-center mt-2">
                    <span className="text-xs text-yellow-300 font-semibold">{t('weight.feather')}{fight.weight === 'Peso pluma' ? '' : fight.weight === 'Peso gallo femenino' ? t('weight.bantam_female') : ''}</span>
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

export default UFCNamajunasBarberCardPage; 