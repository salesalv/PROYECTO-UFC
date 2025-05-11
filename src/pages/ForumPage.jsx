import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming Textarea exists or create it
import { MessageSquare, Search, PlusCircle, Users, TrendingUp, Rss } from "lucide-react";

// Placeholder forum data
const categories = [
  { id: 1, name: "Discusión General", description: "Habla de todo sobre UFC", icon: MessageSquare },
  { id: 2, name: "Predicciones y Apuestas", description: "Comparte tus pronósticos", icon: TrendingUp },
  { id: 3, name: "Noticias y Rumores", description: "Últimas novedades del octágono", icon: Rss },
  { id: 4, name: "Peleadores y Divisiones", description: "Análisis por categoría", icon: Users },
];

const recentThreads = [
  { id: 1, title: "¿Quién gana en UFC 303?", author: "FanUFC_123", replies: 45, category: "Predicciones", time: "hace 2 horas" },
  { id: 2, title: "El legado de Khabib", author: "MMA_Guru", replies: 102, category: "General", time: "hace 5 horas" },
  { id: 3, title: "Posible regreso de GSP", author: "NostalgicFan", replies: 30, category: "Rumores", time: "hace 1 día" },
  { id: 4, title: "Top 5 Peso Pluma Actual", author: "AnalistaX", replies: 67, category: "Peleadores", time: "hace 1 día" },
];

const ForumPage = () => {
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
          Foro de la Comunidad
        </h1>

        {/* Search and New Post */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Input type="text" placeholder="Buscar en el foro..." className="pl-10 bg-gray-900/50 border-gray-700 focus:border-red-500 focus:ring-red-500" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
            <Button className="bg-red-600 hover:bg-red-700">
              <PlusCircle className="w-5 h-5 mr-2" />
              Crear Nuevo Hilo
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Categorías</h2>
            {categories.map(category => (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-black/60 border-gray-800 hover:border-red-600/50 transition-colors duration-200 cursor-pointer">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <category.icon className="w-6 h-6 text-red-500" />
                    <CardTitle className="text-lg text-white">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400">{category.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Threads */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Hilos Recientes</h2>
            <Card className="bg-black/60 border-gray-800 shadow-lg backdrop-blur-sm">
              <CardContent className="p-0">
                <ul className="divide-y divide-gray-800">
                  {recentThreads.map(thread => (
                    <li key={thread.id} className="p-4 hover:bg-gray-800/50 transition-colors duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <a href="#" className="text-lg font-semibold text-white hover:text-red-400 transition-colors">{thread.title}</a>
                        <p className="text-sm text-gray-500">
                          por <span className="font-medium text-gray-400">{thread.author}</span> en <span className="text-red-400">{thread.category}</span> - {thread.time}
                        </p>
                      </div>
                      <div className="text-sm text-gray-400 mt-2 sm:mt-0 text-right flex-shrink-0">
                        {thread.replies} respuestas
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
