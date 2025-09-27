import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BarChart, Target, Zap, Shield, Clock, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import VSBadge from "@/components/VSBadge";
import { useTranslation } from 'react-i18next';
import { useFighters, useFighterComparison, useFighterStatsFormat } from '@/hooks/useFighterComparison';

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
  const { t } = useTranslation();
  const { fighters, loading: fightersLoading, error: fightersError } = useFighters();
  const { 
    fighter1, 
    fighter2, 
    comparison, 
    loading: comparisonLoading, 
    error: comparisonError,
    selectFighter1, 
    selectFighter2 
  } = useFighterComparison();
  const { formatStats, getStatComparison } = useFighterStatsFormat();

  // Comentado: No establecer peleadores por defecto automáticamente
  // useEffect(() => {
  //   if (fighters.length >= 2 && !fighter1 && !fighter2) {
  //     selectFighter1(fighters[0]);
  //     selectFighter2(fighters[1]);
  //   }
  // }, [fighters, fighter1, fighter2, selectFighter1, selectFighter2]);

  const handleSelectFighter = (fighterId, position) => {
    const selected = fighters.find(f => f.id === parseInt(fighterId));
    if (selected) {
      if (position === 1) {
        selectFighter1(selected);
      } else {
        selectFighter2(selected);
      }
    }
  };

  const getFighterStats = (fighter) => {
    return formatStats(fighter);
  };

  const compareStats = (statKey, higherIsBetter = true) => {
    if (!fighter1 || !fighter2) return 'none';
    const stats1 = getFighterStats(fighter1);
    const stats2 = getFighterStats(fighter2);
    return getStatComparison(statKey, stats1, stats2, higherIsBetter);
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-5xl"
      >
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-center uppercase text-red-500 tracking-wider">
          {t('compare.title')}
        </h1>

        {/* Mostrar errores */}
        {(fightersError || comparisonError) && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-400">
              {fightersError || comparisonError}
            </p>
          </div>
        )}

        {/* Mostrar loading */}
        {fightersLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            <span className="ml-2 text-gray-400">Cargando peleadores...</span>
          </div>
        )}

        {!fightersLoading && fighters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No hay peleadores disponibles</p>
          </div>
        )}

        {!fightersLoading && fighters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-10 items-start">
            {/* Fighter 1 Section */}
            <div>
              <Card className="bg-black/70 border border-gray-700 shadow-lg backdrop-blur-sm overflow-hidden">
                <CardHeader className="p-4 bg-gray-900/50 border-b border-gray-700">
                  <Select 
                    key={fighter1?.id} 
                    onValueChange={(value) => handleSelectFighter(value, 1)} 
                    value={fighter1?.id?.toString() || ""}
                  >
                    <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white font-bold text-lg">
                      <SelectValue placeholder="Seleccionar Peleador 1" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-gray-700 text-white">
                      {fighters.map((f) => (
                        <SelectItem 
                          key={f.id} 
                          value={f.id.toString()} 
                          disabled={f.id === fighter2?.id}
                        >
                          {f.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="p-4 text-center">
                  {fighter1 ? (
                    <>
                      <img 
                        src={fighter1.foto || 'https://images.unsplash.com/photo-1545191488-2682adc1dfe4'} 
                        alt={fighter1.nombre} 
                        className="w-48 h-48 mx-auto mb-4 object-cover rounded-lg" 
                      />
                      <h3 className="text-2xl font-bold mb-2">{fighter1.nombre}</h3>
                      {fighter1.division && (
                        <p className="text-sm text-gray-400 mb-4">{fighter1.division}</p>
                      )}
                      {fighter1.record && (
                        <p className="text-sm text-gray-300 mb-4">Record: {fighter1.record}</p>
                      )}
                      {comparisonLoading ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                        </div>
                      ) : (
                        <>
                          <StatDisplay 
                            icon={BarChart} 
                            label={t('compare.strikes_per_min')} 
                            value={getFighterStats(fighter1).strikesLanded.toFixed(1)} 
                            highlight={compareStats('strikesLanded')} 
                          />
                          <StatDisplay 
                            icon={Target} 
                            label={t('compare.accuracy')} 
                            value={getFighterStats(fighter1).accuracy} 
                            unit="%" 
                            highlight={compareStats('accuracy')} 
                          />
                          <StatDisplay 
                            icon={Zap} 
                            label={t('compare.takedowns_per_15')} 
                            value={getFighterStats(fighter1).takedowns.toFixed(1)} 
                            highlight={compareStats('takedowns')} 
                          />
                          <StatDisplay 
                            icon={Shield} 
                            label={t('compare.defense')} 
                            value={getFighterStats(fighter1).defense} 
                            unit="%" 
                            highlight={compareStats('defense')} 
                          />
                          <StatDisplay 
                            icon={Clock} 
                            label={t('compare.avg_fight_time')} 
                            value={getFighterStats(fighter1).avgFightTime.toFixed(1)} 
                            unit="min" 
                            highlight={compareStats('avgFightTime', false)} 
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="w-48 h-48 mx-auto mb-4 bg-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-lg">Selecciona un peleador</span>
                      </div>
                      <p className="text-gray-400">Elige un peleador del menú superior</p>
                    </div>
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
                  <Select 
                    key={fighter2?.id} 
                    onValueChange={(value) => handleSelectFighter(value, 2)} 
                    value={fighter2?.id?.toString() || ""}
                  >
                    <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white font-bold text-lg">
                      <SelectValue placeholder="Seleccionar Peleador 2" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-gray-700 text-white">
                      {fighters.map((f) => (
                        <SelectItem 
                          key={f.id} 
                          value={f.id.toString()} 
                          disabled={f.id === fighter1?.id}
                        >
                          {f.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="p-4 text-center">
                  {fighter2 ? (
                    <>
                      <img 
                        src={fighter2.foto || 'https://images.unsplash.com/photo-1656968385791-eff0b664d0ba'} 
                        alt={fighter2.nombre} 
                        className="w-48 h-48 mx-auto mb-4 object-cover rounded-lg" 
                      />
                      <h3 className="text-2xl font-bold mb-2">{fighter2.nombre}</h3>
                      {fighter2.division && (
                        <p className="text-sm text-gray-400 mb-4">{fighter2.division}</p>
                      )}
                      {fighter2.record && (
                        <p className="text-sm text-gray-300 mb-4">Record: {fighter2.record}</p>
                      )}
                      {comparisonLoading ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                        </div>
                      ) : (
                        <>
                          <StatDisplay 
                            icon={BarChart} 
                            label={t('compare.strikes_per_min')} 
                            value={getFighterStats(fighter2).strikesLanded.toFixed(1)} 
                            highlight={compareStats('strikesLanded') === 'better' ? 'worse' : compareStats('strikesLanded') === 'worse' ? 'better' : 'none'} 
                          />
                          <StatDisplay 
                            icon={Target} 
                            label={t('compare.accuracy')} 
                            value={getFighterStats(fighter2).accuracy} 
                            unit="%" 
                            highlight={compareStats('accuracy') === 'better' ? 'worse' : compareStats('accuracy') === 'worse' ? 'better' : 'none'} 
                          />
                          <StatDisplay 
                            icon={Zap} 
                            label={t('compare.takedowns_per_15')} 
                            value={getFighterStats(fighter2).takedowns.toFixed(1)} 
                            highlight={compareStats('takedowns') === 'better' ? 'worse' : compareStats('takedowns') === 'worse' ? 'better' : 'none'} 
                          />
                          <StatDisplay 
                            icon={Shield} 
                            label={t('compare.defense')} 
                            value={getFighterStats(fighter2).defense} 
                            unit="%" 
                            highlight={compareStats('defense') === 'better' ? 'worse' : compareStats('defense') === 'worse' ? 'better' : 'none'} 
                          />
                          <StatDisplay 
                            icon={Clock} 
                            label={t('compare.avg_fight_time')} 
                            value={getFighterStats(fighter2).avgFightTime.toFixed(1)} 
                            unit="min" 
                            highlight={compareStats('avgFightTime', false) === 'better' ? 'worse' : compareStats('avgFightTime', false) === 'worse' ? 'better' : 'none'} 
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="w-48 h-48 mx-auto mb-4 bg-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-lg">Selecciona un peleador</span>
                      </div>
                      <p className="text-gray-400">Elige un peleador del menú superior</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FighterComparisonPage;
