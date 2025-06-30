import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Star, Eye } from "lucide-react";
import { useTranslation } from 'react-i18next';

// Placeholder highlight data
const HighlightsPage = () => {
  const { t } = useTranslation();
  const highlightsData = [
    { id: 1, title: t('highlights.ko_epic'), fighters: "McGregor, Aldo", views: "1.2M", imageSlug: "fighter-knockout-punch", altText: t('highlights.alt_ko') },
    { id: 2, title: t('highlights.submission_incredible'), fighters: "Nurmagomedov", views: "980K", imageSlug: "fighter-submission-hold", altText: t('highlights.alt_submission') },
    { id: 3, title: t('highlights.total_war'), fighters: "Jones, Gustafsson", views: "850K", imageSlug: "two-fighters-exchanging-blows", altText: t('highlights.alt_war') },
    { id: 4, title: t('highlights.surprise_kick'), fighters: "Pettis", views: "760K", imageSlug: "fighter-executing-flying-kick", altText: t('highlights.alt_kick') },
    { id: 5, title: t('highlights.comeback'), fighters: "Silva", views: "690K", imageSlug: "fighter-celebrating-comeback-victory", altText: t('highlights.alt_comeback') },
    { id: 6, title: t('highlights.night_ko'), fighters: "Varios", views: "550K", imageSlug: "multiple-fighters-highlight-reel", altText: t('highlights.alt_night') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-7xl"
      >
        <h1 className="text-4xl md:text-5xl font-black mb-10 text-center uppercase text-red-500 tracking-wider flex items-center justify-center">
          <Star className="w-10 h-10 mr-4 text-yellow-400" />
          {t('highlights.title')}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {highlightsData.map((highlight, index) => (
            <motion.div
              key={highlight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="card-hover"
            >
              <Card className="bg-black/60 border-gray-800 shadow-lg overflow-hidden backdrop-blur-sm h-full flex flex-col">
                <div className="relative group aspect-video">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    alt={highlight.altText}
                   src="https://images.unsplash.com/photo-1675023112817-52b789fd2ef0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayCircle className="w-16 h-16 text-white/80 drop-shadow-lg" />
                  </div>
                   <div className="absolute bottom-2 left-3">
                     <h3 className="text-lg font-bold text-white shadow-text">{highlight.title}</h3>
                   </div>
                   <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs flex items-center text-gray-300">
                     <Eye className="w-3 h-3 mr-1 text-red-500"/> {highlight.views}
                   </div>
                </div>
                <CardContent className="p-4 flex-grow flex flex-col">
                  <p className="text-sm text-gray-400 mb-3 flex-grow">{t('highlights.fighters')}: {highlight.fighters}</p>
                  <Button variant="outline" className="w-full border-red-600 text-red-500 hover:bg-red-600 hover:text-white mt-auto">
                    {t('highlights.watch_clip')}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HighlightsPage;
