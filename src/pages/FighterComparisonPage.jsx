import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BarChart, Target, Zap, Shield, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import VSBadge from "@/components/VSBadge";

// Placeholder fighter data - replace with actual data fetching later
const allFighters = [
  { id: 'jones', name: 'Jon Jones', image: 'https://images.unsplash.com/photo-1545191488-2682adc1dfe4', stats: { strikesLanded: 12.5, accuracy: 55, takedowns: 2.8, defense: 95, avgFightTime: 18.2 } },
  { id: 'khabib', name: 'Khabib Nurmagomedov', image: 'https://images.unsplash.com/photo-1656968385791-eff0b664d0ba', stats: { strikesLanded: 4.1, accuracy: 48, takedowns: 5.3, defense: 65, avgFightTime: 14.5 } },
  { id: 'mcgregor', name: 'Conor McGregor', image: 'https://images.unsplash.com/photo-1680022702604-292f21514497', stats: { strikesLanded: 5.3, accuracy: 50, takedowns: 0.7, defense: 55, avgFightTime: 8.1 } },
  { id: 'adesanya', name: 'Israel Adesanya', image: 'https://images.unsplash.com/photo-1692264895705-27017e9cf1be', stats: { strikesLanded: 3.9, accuracy: 49, takedowns: 0.0, defense: 85, avgFightTime: 17.8 } },
];

const StatDisplay = ({ icon: Icon, label, value, unit = '', highlight = 'none' }) => {
  const highlightClass = highlight === 'better' ? 'text-green-400' : highlight === 'worse' ? 'text-red-500' : 'text-white';
  const TrendIcon = highlight === 'better' ? TrendingUp : highlight === 'worse' ? TrendingDown : Minus;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded mb-2 border-l-4 border-gray-600">
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-3 text-red-500" />
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      <div className={`flex items-center font-semibold ${highlightClass}`}>
        <TrendIcon className={`w-4 h-4 mr-1 ${highlight === 'none' ? 'opacity-0' : ''}`} />
        {value} {unit}
      </div>
    </div>
  );
};


const FighterComparisonPage = () => {
  const [fighter1, setFighter1] = useState(allFighters[0]); // Default Jon Jones
  const [fighter2, setFighter2] = useState(allFighters[1]); // Default Khabib

  const handleSelectFighter = (fighterId, position) => {
    const selected = allFighters.find(f => f.id === fighterId);
    if (position === 1) {
      setFighter1(selected);
    } else {
      setFighter2(selected);
    }
  };

  const compareStats = (statKey) => {
     if (!fighter1 || !fighter2) return 'none';
     if (fighter1.stats[statKey] > fighter2.stats[statKey]) return 'better';
     if (fighter1.stats[statKey] < fighter2.stats[statKey]) return 'worse';
     return 'none';
  }

   const compareStatsInv = (statKey) => { // For stats where lower is better (e.g., avg fight time if you want fast finishes) - adjust as needed
     if (!fighter1 || !fighter2) return 'none';
     if (fighter1.stats[statKey] < fighter2.stats[statKey]) return 'better';
     if (fighter1.stats[statKey] > fighter2.stats[statKey]) return 'worse';
     return 'none';
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-5xl"
      >
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-center uppercase text-red-500 tracking-wider">
          Comparador de Peleadores
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-10 items-start">
          {/* Fighter 1 Section */}
          <div>
            <Card className="bg-black/70 border border-gray-700 shadow-lg backdrop-blur-sm overflow-hidden">
              <CardHeader className="p-4 bg-gray-900/50 border-b border-gray-700">
                {typeof Select !== 'undefined' ? (
                  <Select key={fighter1?.id} onValueChange={(value) => handleSelectFighter(value, 1)} value={fighter1?.id}>
                    <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white font-bold text-lg">
                      <SelectValue placeholder="Seleccionar Peleador 1" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-gray-700 text-white">
                      {allFighters.map((f) => (
                        <SelectItem key={f.id} value={f.id} disabled={f.id === fighter2?.id}>{f.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : <p className="text-center text-gray-400">Componente Select no encontrado</p> }
              </CardHeader>
              <CardContent className="p-4 text-center">
                {fighter1 && (
                  <>
                    <img  src={fighter1.image} alt={fighter1.name} className="w-48 h-48 mx-auto mb-4 object-cover" /> {/* Removed rounded-full and border */}
                    <h3 className="text-2xl font-bold mb-4">{fighter1.name}</h3>
                    <StatDisplay icon={BarChart} label="Golpes / min" value={fighter1.stats.strikesLanded.toFixed(1)} highlight={compareStats('strikesLanded')} />
                    <StatDisplay icon={Target} label="Precisión (%)" value={fighter1.stats.accuracy} unit="%" highlight={compareStats('accuracy')} />
                    <StatDisplay icon={Zap} label="Derribos / 15min" value={fighter1.stats.takedowns.toFixed(1)} highlight={compareStats('takedowns')} />
                    <StatDisplay icon={Shield} label="Defensa (%)" value={fighter1.stats.defense} unit="%" highlight={compareStats('defense')} />
                    <StatDisplay icon={Clock} label="Tiempo Medio Pelea" value={fighter1.stats.avgFightTime.toFixed(1)} unit="min" highlight={compareStatsInv('avgFightTime')} />
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* VS Badge */}
          <div className="hidden md:flex items-center justify-center h-full pt-24">
            <VSBadge />
          </div>

          {/* Fighter 2 Section */}
          <div>
            <Card className="bg-black/70 border border-gray-700 shadow-lg backdrop-blur-sm overflow-hidden">
              <CardHeader className="p-4 bg-gray-900/50 border-b border-gray-700">
                 {typeof Select !== 'undefined' ? (
                   <Select key={fighter2?.id} onValueChange={(value) => handleSelectFighter(value, 2)} value={fighter2?.id}>
                     <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white font-bold text-lg">
                       <SelectValue placeholder="Seleccionar Peleador 2" />
                     </SelectTrigger>
                     <SelectContent className="bg-black border-gray-700 text-white">
                       {allFighters.map((f) => (
                         <SelectItem key={f.id} value={f.id} disabled={f.id === fighter1?.id}>{f.name}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 ) : <p className="text-center text-gray-400">Componente Select no encontrado</p> }
              </CardHeader>
              <CardContent className="p-4 text-center">
                 {fighter2 && (
                  <>
                    <img  src={fighter2.image} alt={fighter2.name} className="w-48 h-48 mx-auto mb-4 object-cover" /> {/* Removed rounded-full and border */}
                    <h3 className="text-2xl font-bold mb-4">{fighter2.name}</h3>
                     <StatDisplay icon={BarChart} label="Golpes / min" value={fighter2.stats.strikesLanded.toFixed(1)} highlight={compareStats('strikesLanded') === 'better' ? 'worse' : compareStats('strikesLanded') === 'worse' ? 'better' : 'none'} />
                    <StatDisplay icon={Target} label="Precisión (%)" value={fighter2.stats.accuracy} unit="%" highlight={compareStats('accuracy') === 'better' ? 'worse' : compareStats('accuracy') === 'worse' ? 'better' : 'none'} />
                    <StatDisplay icon={Zap} label="Derribos / 15min" value={fighter2.stats.takedowns.toFixed(1)} highlight={compareStats('takedowns') === 'better' ? 'worse' : compareStats('takedowns') === 'worse' ? 'better' : 'none'} />
                    <StatDisplay icon={Shield} label="Defensa (%)" value={fighter2.stats.defense} unit="%" highlight={compareStats('defense') === 'better' ? 'worse' : compareStats('defense') === 'worse' ? 'better' : 'none'} />
                    <StatDisplay icon={Clock} label="Tiempo Medio Pelea" value={fighter2.stats.avgFightTime.toFixed(1)} unit="min" highlight={compareStatsInv('avgFightTime') === 'better' ? 'worse' : compareStatsInv('avgFightTime') === 'worse' ? 'better' : 'none'} />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FighterComparisonPage;
