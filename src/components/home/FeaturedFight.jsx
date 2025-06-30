import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import VSBadge from "@/components/VSBadge";
import { Trophy, TrendingUp, Award, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

// Simulate fetching initial vote percentages (replace with actual API call later)
const initialVotes = { A: 62, B: 38 };

const FeaturedFight = () => {
  const { t } = useTranslation();
  const [selectedFighter, setSelectedFighter] = useState(null); // null, 'A', or 'B'
  const [votePercentage, setVotePercentage] = useState(initialVotes);
  const [showVotes, setShowVotes] = useState(false);

  const handleMedalClick = (fighter) => {
    const newSelection = selectedFighter === fighter ? null : fighter;
    setSelectedFighter(newSelection);
    setShowVotes(true); // Show percentages when a vote is cast

    // Simulate vote update (replace with actual logic)
    if (newSelection) {
        setVotePercentage(prev => {
            if (newSelection === 'A' && prev.A < 95) return { A: prev.A + 1, B: prev.B - 1 };
            if (newSelection === 'B' && prev.B < 95) return { A: prev.A - 1, B: prev.B + 1 };
            return prev;
        });
    }

    console.log(`Selected fighter: ${newSelection || 'None'}`);
  };

  // Optional: Hide votes again after a delay if nothing is selected
  useEffect(() => {
    let timer;
    if (showVotes && !selectedFighter) {
      timer = setTimeout(() => setShowVotes(false), 3000); // Hide after 3s if deselected
    }
    return () => clearTimeout(timer);
  }, [showVotes, selectedFighter]);

  const videoSrc = 'https://c2nvdxq.fubohd.com/foxsports2/mono.m3u8?token=32c0e7ea94352c73069367d5dbe4557b9ed3ed22-ae-1747765456-1747747456';

  return (
    <section className="relative min-h-[90vh] mt-16 flex items-center justify-center">
      <div className="absolute inset-0">
        <img 
          className="w-full h-full object-cover"
          alt={t('home.featured_fight_bg')}
         src="https://images.unsplash.com/photo-1687519930490-db2e9a2efa03" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      </div>
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-black/70 p-6 md:p-8 rounded-xl backdrop-blur-md border border-gray-800 shadow-lg shadow-red-900/20">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-red-500" />
                <span className="text-lg font-bold tracking-wide uppercase">{t('home.event_principal')}</span>
              </div>
              <div className="flex items-center space-x-2 text-yellow-400 animate-pulse">
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold">{t('home.open_predictions')}</span>
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-black mb-2 text-center uppercase tracking-wider">
              {t('home.ufc_300_title')}
            </h2>
            <p className="text-lg md:text-xl mb-8 text-center text-gray-300 font-light">{t('home.star_fight_description')}</p>

            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 mb-8 items-center">
              {/* Fighter A */}
              <div className="text-center flex flex-col items-center">
                <div className="relative inline-block mb-3">
                   <button
                    onClick={() => handleMedalClick("A")}
                    className={cn(
                      "absolute -top-2 -left-2 z-20 p-1.5 rounded-full bg-gray-800/70 hover:bg-yellow-500/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 ring-offset-2 ring-offset-black/60",
                      selectedFighter === "A" && "medal-selected"
                    )}
                    aria-label={t('home.select_fav_a')}
                  >
                    <Award className="h-7 w-7 md:h-8 md:w-8 text-yellow-500 transition-colors duration-300" />
                  </button>
                  <img 
                    className="w-28 h-28 md:w-60 md:h-40 mx-auto object-contain shadow-md filter drop-shadow-[0_5px_5px_rgba(0,0,0,0.4)]" // Changed to object-contain, added drop-shadow
                    alt={t('home.fighter_a')}
                   src="/foto_jon.png" />
                </div>
                <p className="font-bold text-lg md:text-2xl uppercase">Jon </p>
                <p className="text-gray-400 text-sm mb-2">{t('home.champion')} | 28-0-0</p>
                {/* Vote Percentage Display */}
                <AnimatePresence>
                 {showVotes && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center text-sm text-yellow-400 font-semibold mt-1"
                    >
                      <Users className="w-4 h-4 mr-1.5"/>
                      {votePercentage.A}{t('home.vote_percent')}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* VS Badge - aligned to center using flex justify-center */}
              <div className="flex flex-col items-center justify-center self-center pt-8 md:pt-0">
                <VSBadge />
              </div>

              {/* Fighter B */}
              <div className="text-center flex flex-col items-center">
                 <div className="relative inline-block mb-3">
                   <button
                    onClick={() => handleMedalClick("B")}
                    className={cn(
                      "absolute -top-2 -right-2 z-20 p-1.5 rounded-full bg-gray-800/70 hover:bg-yellow-500/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 ring-offset-2 ring-offset-black/60",
                      selectedFighter === "B" && "medal-selected"
                    )}
                    aria-label={t('home.select_fav_b')}
                  >
                    <Award className="h-7 w-7 md:h-8 md:w-8 text-yellow-500 transition-colors duration-300" />
                   </button>
                  <img 
                    className="w-28 h-28 md:w-60 md:h-40 mx-auto object-contain shadow-md filter drop-shadow-[0_5px_5px_rgba(0,0,0,0.4)]" // Changed to object-contain, added drop-shadow
                    alt={t('home.fighter_b')}
                   src="/foto_khabib.png" />
                </div>
                <p className="font-bold text-lg md:text-2xl uppercase">khabib </p>
                <p className="text-gray-400 text-sm mb-2">{t('home.challenger')} | 25-2-0</p>
                 {/* Vote Percentage Display */}
                 <AnimatePresence>
                  {showVotes && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center text-sm text-yellow-400 font-semibold mt-1"
                    >
                       <Users className="w-4 h-4 mr-1.5"/>
                       {votePercentage.B}{t('home.vote_percent')}
                    </motion.div>
                  )}
                 </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:gap-4 justify-center mt-6">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-base md:text-lg px-6 md:px-8 font-bold uppercase tracking-wider flex-grow sm:flex-grow-0" asChild>
                <Link to="/live">
                  {t('home.see_more')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-base md:text-lg px-6 md:px-8 font-bold uppercase tracking-wider flex-grow sm:flex-grow-0" asChild>
                <Link to="/predict">
                    {t('home.make_prediction')}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedFight;
