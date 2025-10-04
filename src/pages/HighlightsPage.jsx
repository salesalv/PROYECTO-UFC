import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Star, Eye, Loader2, X } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProtectedContent from "@/components/common/ProtectedContent";
import { 
  getFeaturedClips, 
  registerUniqueView, 
  formatViews 
} from "@/services/featuredClipsService";
import supabase from "@/db";

const HighlightsPage = () => {
  const { t } = useTranslation();
  const [featuredClips, setFeaturedClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClip, setSelectedClip] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Función para obtener clips destacados desde Supabase
  const fetchFeaturedClips = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getFeaturedClips();
      setFeaturedClips(data);
    } catch (err) {
      console.error('Error inesperado:', err);
      setError('Error inesperado al cargar los clips');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el clic en un clip (vistas únicas por usuario logueado)
  const handleClipClick = async (clip) => {
    try {
      // Obtener usuario logueado
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Registrar vista única
        const wasUnique = await registerUniqueView(user.id, clip.id);
        if (wasUnique) {
          // Actualizar el estado local para reflejar el incremento
          setFeaturedClips(prevClips => 
            prevClips.map(c => 
              c.id === clip.id 
                ? { ...c, vistas: c.vistas + 1 }
                : c
            )
          );
        }
      }
      // Abrir modal con el video
      setSelectedClip(clip);
      setIsVideoModalOpen(true);
    } catch (err) {
      console.error('Error al registrar vista única:', err);
      // Abrir modal igual aunque falle la vista
      setSelectedClip(clip);
      setIsVideoModalOpen(true);
    }
  };

  // Cargar clips al montar el componente
  useEffect(() => {
    fetchFeaturedClips();
  }, []);

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-red-500 mx-auto mb-4" />
            <p className="text-xl text-gray-400">{t('highlights.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-xl text-red-500 mb-4">{error}</p>
            <Button 
              onClick={fetchFeaturedClips}
              variant="outline" 
              className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
            >
              {t('highlights.retry')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedContent>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto max-w-7xl"
        >
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-red-500 tracking-wider flex items-center justify-center">
            <Star className="w-10 h-10 mr-4 text-yellow-400" />
            {t('highlights.title')}
          </h1>
          <p className="text-gray-400 mt-4 text-lg">
            Los mejores momentos del UFC, seleccionados por nuestro equipo
          </p>
        </div>

        {featuredClips.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400 mb-4">{t('highlights.no_clips')}</p>
            <Button 
              onClick={fetchFeaturedClips}
              variant="outline" 
              className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
            >
              {t('highlights.refresh')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredClips.map((clip, index) => (
              <motion.div
                key={clip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="card-hover"
              >
                <Card className="bg-black/60 border-gray-800 shadow-lg overflow-hidden backdrop-blur-sm h-full flex flex-col">
                  <div className="relative group aspect-video cursor-pointer" onClick={() => handleClipClick(clip)}>
                    <video
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src={clip.url_video}
                      controls={false}
                      preload="metadata"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <PlayCircle className="w-16 h-16 text-white/80 drop-shadow-lg" />
                    </div>
                    <div className="absolute bottom-2 left-3">
                      <h3 className="text-lg font-bold text-white shadow-text">{clip.titulo}</h3>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs flex items-center text-gray-300">
                      <Eye className="w-3 h-3 mr-1 text-red-500"/> {formatViews(clip.vistas)}
                    </div>
                  </div>
                  <CardContent className="p-4 flex-grow flex flex-col">
                    {clip.descripcion && (
                      <p className="text-sm text-gray-400 mb-3 flex-grow">{clip.descripcion}</p>
                    )}
                    {clip.peleadores && clip.peleadores.length > 0 && (
                      <p className="text-sm text-gray-400 mb-3 flex-grow">
                        {t('highlights.fighters')}: {clip.peleadores.join(', ')}
                      </p>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full border-red-600 text-red-500 hover:bg-red-600 hover:text-white mt-auto"
                      onClick={() => handleClipClick(clip)}
                    >
                      {t('highlights.watch_clip')}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Modal para reproducir video */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-4xl bg-black/90 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">{selectedClip?.titulo}</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70"
              onClick={() => setIsVideoModalOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            {selectedClip && (
              <video
                className="w-full h-auto max-h-[70vh] rounded"
                controls
                autoPlay
                src={selectedClip.url_video}
              >
                Tu navegador no soporta el elemento de video.
              </video>
            )}
            {selectedClip?.descripcion && (
              <p className="text-gray-300 mt-4">{selectedClip.descripcion}</p>
            )}
            {selectedClip?.peleadores && selectedClip.peleadores.length > 0 && (
              <p className="text-gray-400 mt-2">
                <strong>{t('highlights.fighters')}:</strong> {selectedClip.peleadores.join(', ')}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </ProtectedContent>
  );
};

export default HighlightsPage;
