import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";
import ThreadButton from '../components/ThreadButton';
import { useTranslation } from 'react-i18next';

// Este comentario se añade para asegurar que Vite compile el archivo de nuevo.

const CategoryPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  // Placeholder data for categories (can be expanded later)
  const categoriesData = [
    { id: '1', name: t('forum.category_general'), description: t('forum.category_general_desc') },
    { id: '2', name: t('forum.category_predictions'), description: t('forum.category_predictions_desc') },
    { id: '3', name: t('forum.category_news'), description: t('forum.category_news_desc') },
    { id: '4', name: t('forum.category_fighters'), description: t('forum.category_fighters_desc'), icon: PlusCircle  },
  ];

  // Placeholder data for threads within each category
  const threadsByCategory = {
    '1': [
      { id: '101', title: "¿Opiniones sobre el último evento?", author: "UFC_Fanatic", replies: 25, time: "hace 3 horas" },
      { id: '102', title: "Debate: ¿Es Jon Jones el GOAT?", author: "MMA_Historian", replies: 80, time: "hace 1 día" },
    ],
    '2': [
      { id: '201', title: "Mis picks para el UFC 303", author: "BettingGuru", replies: 15, time: "hace 1 hora" },
      { id: '202', title: "Análisis de cuotas para la pelea estelar", author: "OddsMaster", replies: 35, time: "hace 6 horas" },
    ],
    '3': [
      { id: '301', title: "Últimos rumores de lesiones", author: "Insider_Info", replies: 10, time: "hace 2 horas" },
      { id: '302', title: "Posibles peleas para fin de año", author: "FightNews", replies: 40, time: "hace 1 día" },
    ],
    '4': [
      { id: '401', title: "Mejores strikers en Peso Ligero", author: "StrikingFan", replies: 50, time: "hace 4 horas" },
      { id: '402', title: "Comparativa de grappling en Peso Welter", author: "GrapplingKing", replies: 20, time: "hace 1 día" },
    ],
  };

  const category = categoriesData.find(cat => cat.id === id);
  const currentThreads = threadsByCategory[id] || [];

  if (!category) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold text-red-500">{t('category.not_found')}</h1>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8 pt-24"
    >
      <div className="max-w-4xl mx-auto">
        {/* Category Header */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl md:text-5xl font-black mb-2 uppercase text-red-500 tracking-wider">
              {category.name}
            </CardTitle>
            <CardDescription className="text-lg text-gray-400 mb-4">
              {category.description}
            </CardDescription>
            {/* Search and New Post for Category */}
            <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
              <div className="relative flex-grow max-w-md">
                <Input type="text" placeholder={t('category.search_placeholder', { category: category.name })} className="pl-10 bg-gray-800 border-gray-700 focus:border-red-500 focus:ring-red-500 text-white" />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
              <Button className="bg-red-600 hover:bg-red-700">
                <PlusCircle className="w-5 h-5 mr-2" />
                {t('forum.create_thread')}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Recent Threads in this Category */}
        <h2 className="text-2xl font-bold text-red-400 mb-4">{t('category.threads_in', { category: category.name, count: currentThreads.length })}</h2>
        <Card className="bg-black/60 border-gray-800 shadow-lg backdrop-blur-sm">
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-800">
              {currentThreads.length > 0 ? (
                currentThreads.map(thread => (
                  <li key={thread.id} className="p-4 hover:bg-gray-800/50 transition-colors duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <Link to={`/thread/${thread.id}`} className="text-lg font-semibold text-white hover:text-red-400 transition-colors">{thread.title}</Link>
                      <p className="text-sm text-gray-500">
                        {t('forum.by')} <span className="font-medium text-gray-400">{thread.author}</span> - {thread.time}
                      </p>
                    </div>
                    <div className="text-sm text-gray-400 mt-2 sm:mt-0 text-right flex-shrink-0">
                      <ThreadButton threadId={thread.id} />
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-4 text-center text-gray-500">
                  {t('category.no_threads')}
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default CategoryPage; 