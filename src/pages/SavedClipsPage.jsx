import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Clock, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useClips } from "@/context/ClipsContext";
import { useTranslation } from 'react-i18next';

const SavedClipsPage = () => {
  const { savedClips, deleteClip } = useClips();
  const { t } = useTranslation();
  const [downloadStates, setDownloadStates] = useState({});

  const downloadClip = async (url, title, clipId) => {
    // Validar URL
    if (!url || !url.startsWith('http')) {
      setDownloadStates(prev => ({ ...prev, [clipId]: 'error' }));
      setTimeout(() => {
        setDownloadStates(prev => ({ ...prev, [clipId]: null }));
      }, 3000);
      return;
    }

    try {
      // Marcar como descargando
      setDownloadStates(prev => ({ ...prev, [clipId]: 'downloading' }));

      // Crear elemento de descarga
      const a = document.createElement('a');
      a.href = url;
      
      // Determinar extensión basada en la URL o tipo MIME
      const urlExtension = url.split('.').pop().toLowerCase();
      const validExtensions = ['mp4', 'webm', 'avi', 'mov', 'mkv'];
      const extension = validExtensions.includes(urlExtension) ? urlExtension : 'webm';
      
      a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.${extension}`;
      a.target = '_blank';
      
      // Agregar al DOM temporalmente
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Simular tiempo de descarga para feedback visual
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Marcar como exitoso
      setDownloadStates(prev => ({ ...prev, [clipId]: 'success' }));
      
      // Limpiar estado después de 2 segundos
      setTimeout(() => {
        setDownloadStates(prev => ({ ...prev, [clipId]: null }));
      }, 2000);

    } catch (error) {
      console.error('Error al descargar:', error);
      setDownloadStates(prev => ({ ...prev, [clipId]: 'error' }));
      
      // Limpiar estado después de 3 segundos
      setTimeout(() => {
        setDownloadStates(prev => ({ ...prev, [clipId]: null }));
      }, 3000);
    }
  };

  const shareClip = (url) => {
    if (navigator.share) {
      navigator.share({
        title: t('clips.clip_title'),
        url: url
      });
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(url);
      alert(t('clips.url_copied'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-6xl"
      >
        <Card className="bg-black/70 border border-gray-800 shadow-lg shadow-red-900/10 backdrop-blur-sm">
          <CardHeader className="text-center border-b border-gray-700 pb-4">
            <CardTitle className="text-2xl sm:text-3xl font-black uppercase text-red-500 tracking-wider">
              {t('clips.saved_clips')}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            {savedClips.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">{t('clips.no_clips')}</p>
                <p className="text-gray-500 mt-2">{t('clips.hint_record')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedClips.map((clip) => (
                  <motion.div
                    key={clip.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="bg-black/60 border-gray-800 shadow-lg overflow-hidden backdrop-blur-sm">
                      <div className="relative aspect-video">
                        <video
                          src={clip.video_url}
                          className="w-full h-full object-cover"
                          controls
                        />
                        <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs flex items-center text-gray-300">
                          <Clock className="w-3 h-3 mr-1 text-red-500" />
                          {clip.duration_seconds}s
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-bold mb-2 text-white">{clip.title}</h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Grabado el {new Date(clip.created_at).toLocaleString()}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className={`flex-1 border-red-600 text-red-500 hover:bg-red-600 hover:text-white ${
                              downloadStates[clip.id] === 'downloading' ? 'opacity-75 cursor-not-allowed' : ''
                            } ${
                              downloadStates[clip.id] === 'success' ? 'border-green-600 text-green-500' : ''
                            } ${
                              downloadStates[clip.id] === 'error' ? 'border-red-600 text-red-500' : ''
                            }`}
                            onClick={() => downloadClip(clip.video_url, clip.title, clip.id)}
                            disabled={downloadStates[clip.id] === 'downloading'}
                          >
                            {downloadStates[clip.id] === 'downloading' ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : downloadStates[clip.id] === 'success' ? (
                              <CheckCircle className="w-4 h-4 mr-2" />
                            ) : downloadStates[clip.id] === 'error' ? (
                              <XCircle className="w-4 h-4 mr-2" />
                            ) : (
                              <Download className="w-4 h-4 mr-2" />
                            )}
                            {downloadStates[clip.id] === 'downloading' 
                              ? t('clips.downloading')
                              : downloadStates[clip.id] === 'success' 
                                ? t('clips.downloaded')
                                : downloadStates[clip.id] === 'error'
                                  ? t('clips.download_error')
                                  : t('clips.download')
                            }
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                            onClick={() => shareClip(clip.video_url)}
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            {t('clips.share')}
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                            onClick={() => deleteClip(clip.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SavedClipsPage; 