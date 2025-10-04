import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Download, Share2, Clock } from "lucide-react";
import Hls from "hls.js";
import { useClips } from "@/context/ClipsContext";
import { useUser } from "@/context/UserContext";
import supabase from "@/db";
import { useTranslation } from 'react-i18next';
import UserNameWithBadge from '@/components/common/UserNameWithBadge';

const LivePage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const hlsRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);
  const { addClip } = useClips();
  const { user } = useUser();
  const { t } = useTranslation();

  // Simulación de usuario actual (puedes reemplazarlo por el usuario real de tu app)
  const currentUser = {
    name: "UsuarioDemo"
  };

  useEffect(() => {
    const videoSrc = 'https://agvyby.fubohd.com/foxsports2/mono.m3u8?token=d1fc2b72eb241226d14e6f37dca36007fb8dff81-b6-1750547321-1750529321';

    const initPlayer = () => {
      if (Hls.isSupported()) {
        console.log('HLS es soportado en este navegador');
        const hls = new Hls({
          debug: true,
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hlsRef.current = hls;

        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log('Video y HLS están conectados');
          hls.loadSource(videoSrc);
        });

        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          console.log('Manifest cargado, encontrados ' + data.levels.length + ' niveles de calidad');
          videoRef.current.play().catch(e => console.error('Error al reproducir:', e));
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('Error HLS:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Error de red fatal, intentando recuperar...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Error de media fatal, intentando recuperar...');
                hls.recoverMediaError();
                break;
              default:
                console.log('Error fatal no recuperable');
                hls.destroy();
                break;
            }
          }
        });

        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('Navegador soporta HLS nativamente');
        videoRef.current.src = videoSrc;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current.play().catch(e => console.error('Error al reproducir:', e));
        });
      } else {
        console.error('HLS no es soportado en este navegador');
        setError(t('live.error_no_hls'));
      }
    };

    if (videoRef.current) {
      initPlayer();
    }

    return () => {
      if (hlsRef.current) {
        console.log('Limpiando instancia HLS');
        hlsRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Cargar mensajes iniciales
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("live_chat")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error) setChatMessages(data);
    };
    fetchMessages();

    // Suscribirse a nuevos mensajes en tiempo real
    const channel = supabase
      .channel("public:live_chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "live_chat" },
        (payload) => {
          setChatMessages((msgs) => [...msgs, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Scroll automático al enviar mensaje
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const startRecording = () => {
    if (videoRef.current) {
      try {
        const stream = videoRef.current.captureStream();
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 2500000
        });
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const timestamp = new Date().toLocaleTimeString();
          addClip({
            url,
            title: `Clip ${timestamp}`,
            duration: "0:45", // Esto debería calcularse en base a la duración real
            timestamp: new Date().toISOString()
          });
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error al iniciar la grabación:', error);
        setError(t('live.error_record'));
      }
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      mediaRecorderRef.current.onstop = async () => {
        if (!user) {
          setError(t('live.error_login'));
          return;
        }

        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const fileName = `clip_${user.auth.id}_${Date.now()}.webm`;

        // Subir clip a Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('clips')
          .upload(fileName, blob);

        if (uploadError) {
          setError(t('live.error_upload', { message: uploadError.message }));
          return;
        }

        // Obtener URL pública
        const { data: publicUrlData } = supabase.storage
          .from('clips')
          .getPublicUrl(fileName);

        // Insertar en la tabla 'clips'
        await addClip({
          video_url: publicUrlData.publicUrl,
          title: `Clip de ${user.nombre_usuario}`,
          start_time_seconds: videoRef.current?.currentTime || 0
        });
      };
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !user) return;
    await supabase.from("live_chat").insert([
      {
        user_id: user.auth.id,
        username: user.nombre_usuario,
        message: chatInput,
      },
    ]);
    setChatInput("");
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
              {t('live.title')}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <div className="bg-red-900/50 border border-red-800 text-red-200 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Principal */}
              <div className="lg:col-span-2">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    playsInline
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Clock className="w-4 h-4 mr-2 animate-pulse" />
                    {t('live.on_air')}
                  </div>
                </div>

                {/* Controles de Grabación */}
                <div className="mt-4 flex justify-center space-x-4">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={"bg-red-600 hover:bg-red-700 text-white"}
                  >
                    <Scissors className="w-5 h-5 mr-2" />
                    {isRecording ? t('live.stop_record') : t('live.record_clip')}
                  </Button>
                </div>
              </div>

              {/* Panel de Chat en Vivo */}
              <div className="lg:col-span-1 flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-4 text-gray-200">{t('live.chat_title')}</h3>
                <div className="flex-1 overflow-y-auto bg-gray-900/50 rounded-lg p-3 border border-gray-800 mb-2 max-h-96">
                  {chatMessages.length === 0 && (
                    <p className="text-center text-gray-500 py-8">{t('live.no_messages')}</p>
                  )}
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="mb-2">
                      <UserNameWithBadge 
                        username={msg.username}
                        className="font-bold text-red-400 mr-2"
                      />
                      <span className="text-gray-300">{msg.message}</span>
                      <span className="text-xs text-gray-500 ml-2">{new Date(msg.created_at).toLocaleTimeString()}</span>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder={t('live.write_message')}
                    className="flex-1 rounded-md bg-gray-800 text-white px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={!user}
                  />
                  <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-md" disabled={!user}>
                    {t('live.send')}
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LivePage; 