import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, MessageSquare } from "lucide-react";
import ThreadButton from '../components/ThreadButton';
import { useTranslation } from 'react-i18next';
import { getCategories, getThreadsByCategory } from '../services/forumService';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Este comentario se añade para asegurar que Vite compile el archivo de nuevo.

const CategoryPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [category, setCategory] = useState(null);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    getCategories().then(cats => {
      const cat = cats.find(c => String(c.id) === String(id));
      setCategory(cat);
    });
    getThreadsByCategory(id).then(setThreads);
  }, [id]);

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
              <ThreadButton categoryId={category.id} onThreadCreated={thread => setThreads([thread, ...threads])} />
            </div>
          </CardHeader>
        </Card>

        {/* Recent Threads in this Category */}
        <h2 className="text-2xl font-bold text-red-400 mb-4">{t('category.threads_in', { category: category.name, count: threads.length })}</h2>
        <Card className="bg-black/60 border-gray-800 shadow-lg backdrop-blur-sm">
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-800">
              {threads.length > 0 ? (
                threads.map(thread => (
                  <li key={thread.id} className="p-4 hover:bg-gray-800/50 transition-colors duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={thread.avatar || 'https://github.com/shadcn.png'} alt={thread.username} />
                        <AvatarFallback>{thread.username?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link to={`/thread/${thread.id}`} className="text-lg font-semibold text-white hover:text-red-400 transition-colors">{thread.title}</Link>
                        <p className="text-sm text-gray-500">
                          {t('forum.by')} <span className="font-medium text-gray-400">{thread.username}</span> {"-"} {new Date(thread.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 mt-2 sm:mt-0 text-right flex-shrink-0">
                      <Link to={`/thread/${thread.id}`}>
                        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Ver hilo
                        </button>
                      </Link>
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