import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming Textarea exists or create it
import { MessageSquare, Search, PlusCircle, Users, TrendingUp, Rss } from "lucide-react";
import ThreadButton from '../components/ThreadButton'; // Import ThreadButton
import { Link } from 'react-router-dom'; // Import Link
import { useTranslation } from 'react-i18next';
import { getCategories, getRecentThreads } from '../services/forumService';

const ForumPage = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [recentThreads, setRecentThreads] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
    getRecentThreads(10).then(setRecentThreads); // Trae los 10 hilos más recientes de todas las categorías
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-7xl"
      >
        <h1 className="text-4xl md:text-5xl font-black mb-6 text-center uppercase text-red-500 tracking-wider flex items-center justify-center">
          <MessageSquare className="w-10 h-10 mr-4 text-yellow-400" />
          {t('forum.title')}
        </h1>

        {/* Search and New Post */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Input type="text" placeholder={t('forum.search_placeholder')} className="pl-10 bg-gray-900/50 border-gray-700 focus:border-red-500 focus:ring-red-500" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
          <ThreadButton categoryId={categories[0]?.id} onThreadCreated={thread => setRecentThreads([thread, ...recentThreads])} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold text-red-400 mb-4">{t('forum.categories')}</h2>
            {categories.map(category => (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link to={`/category/${category.id}`}> {/* Link to category page */}
                  <Card className="bg-black/60 border-gray-800 hover:border-red-600/50 transition-colors duration-200 cursor-pointer">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <MessageSquare className="w-6 h-6 text-red-500" />
                      <CardTitle className="text-lg text-white">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-400">{category.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Recent Threads */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-red-400 mb-4">{t('forum.recent_threads')}</h2>
            <Card className="bg-black/60 border-gray-800 shadow-lg backdrop-blur-sm">
              <CardContent className="p-0">
                <ul className="divide-y divide-gray-800">
                  {recentThreads.map(thread => (
                    <li key={thread.id} className="p-4 hover:bg-gray-800/50 transition-colors duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <Link to={`/thread/${thread.id}`} className="text-lg font-semibold text-white hover:text-red-400 transition-colors">{thread.title}</Link>
                        <p className="text-sm text-gray-500">
                          {t('forum.by')} <span className="font-medium text-gray-400">{thread.username}</span>
                          {thread.forum_categories?.name && (
                            <>
                              {" "}{t('forum.in')} <span className="text-red-400">{thread.forum_categories.name}</span>
                            </>
                          )}
                          {" - "}{new Date(thread.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-sm text-gray-400 mt-2 sm:mt-0 text-right flex-shrink-0">
                        <Link to={`/thread/${thread.id}`}>
                          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center">
                            Ver Hilo
                          </button>
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForumPage;
