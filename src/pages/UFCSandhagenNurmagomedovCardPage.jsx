import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

// Imágenes de ejemplo para peleadores
const fighterImages = {
  "Cory Sandhagen": "https://static.ufcstats.com/images/athlete/Cory-Sandhagen.png",
  "Umar Nurmagomedov": "https://static.ufcstats.com/images/athlete/Umar-Nurmagomedov.png",
  // ... existing code ...
  "Conor McGregor": "https://static.ufcstats.com/images/athlete/Conor-McGregor.png",
  "Michael Chandler": "https://static.ufcstats.com/images/athlete/Michael-Chandler.png",
  "Jamahal Hill": "https://ufc.com/fighters/jamahal-hill.png",
  "Khalil Rountree Jr.": "https://ufc.com/fighters/khalil-rountree-jr.png",
  "Joe Pyfer": "https://ufc.com/fighters/joe-pyfer.png",
  "Michel Pereira": "https://ufc.com/fighters/michel-pereira.png",
  "Mayra Bueno Silva": "https://ufc.com/fighters/mayra-bueno-silva.png",
  "Irene Aldana": "https://ufc.com/fighters/irene-aldana.png",
  "Ian Machado Garry": "https://ufc.com/fighters/ian-machado-garry.png",
  "Michael Page": "https://ufc.com/fighters/michael-page.png",
  "Cub Swanson": "https://ufc.com/fighters/cub-swanson.png",
  "Andre Fili": "https://ufc.com/fighters/andre-fili.png",
  "Jessica Andrade": "https://ufc.com/fighters/jessica-andrade.png",
  "Macy Chiasson": "https://ufc.com/fighters/macy-chiasson.png",
  "Brandon Royval": "https://ufc.com/fighters/brandon-royval.png",
  "Manel Kape": "https://ufc.com/fighters/manel-kape.png",
  "Raul Rosas Jr.": "https://ufc.com/fighters/raul-rosas-jr.png",
  "Ricky Turcios": "https://ufc.com/fighters/ricky-turcios.png"
};

const mainCard = [
  {
    left: { name: "Cory Sandhagen", flag: "🇺🇸", rank: null },
    right: { name: "Umar Nurmagomedov", flag: "🇷🇺", rank: null },
    weight: "Peso gallo"
  }
];

const prelims = [
  // Add any preliminary fights here if available
];

const eventImage = "https://images.unsplash.com/photo-1696407254550-989e4543dc11"; // Placeholder, replace with actual image
const eventTime = "7:00 PM (hora local)";

const UFCSandhagenNurmagomedovCardPage = () => {
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
              {t('event.title.sandhagen_nurmagomedov')}
            </CardTitle>
            <div className="text-gray-300 mt-2 text-lg">{t('event.date_location.sandhagen_nurmagomedov')}</div>
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
                    <span className="text-xs text-blue-300 font-semibold">{t('weight.bantam')}</span>
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
                    <span className="text-xs text-yellow-300 font-semibold">{t('weight.bantam')}</span>
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

export default UFCSandhagenNurmagomedovCardPage; 