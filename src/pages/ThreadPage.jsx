import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

// Este comentario se añade para asegurar que Vite compile el archivo de nuevo.

const ThreadPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  // Placeholder data for all threads
  const allThreads = [
    {
      id: '1',
      title: "¿Quién gana en UFC 303?",
      author: "FanUFC_123",
      authorAvatar: "https://github.com/shadcn.png",
      time: "hace 2 horas",
      content: "¡Hola a todos! Con UFC 303 a la vuelta de la esquina, me pregunto cuáles son sus predicciones para las peleas principales. \¿Creen que habrá alguna sorpresa? ¿Quién creen que se llevará la victoria en el evento principal?\n\n¡Compartan sus pensamientos y análisis!",
      replies: [
        { id: '1', author: "MMA_Guru", authorAvatar: "https://github.com/shadcn.png", time: "hace 1 hora", content: "Creo que el evento principal será más reñido de lo que la gente espera. Mi predicción es..." },
        { id: '2', author: "PredictionPro", authorAvatar: "https://github.com/shadcn.png", time: "hace 30 minutos", content: "¡Definitivamente una sorpresa en la co-estelar! No me fío de las cuotas." },
        { id: '3', author: "CasualFan", authorAvatar: "https://github.com/shadcn.png", time: "hace 15 minutos", content: "Yo solo espero nocauts espectaculares. \ud83d\ude0e" },
      ],
    },
    {
      id: '2',
      title: "El legado de Khabib",
      author: "MMA_Guru",
      authorAvatar: "https://github.com/shadcn.png",
      time: "hace 5 horas",
      content: "¿Cuál creen que es el verdadero legado de Khabib Nurmagomedov en el UFC? ¿Es el mejor de todos los tiempos en su categoría? ¡Debatamos!",
      replies: [
        { id: '1', author: "Fan_Histórico", authorAvatar: "https://github.com/shadcn.png", time: "hace 2 horas", content: "Invicto y dominante, no hay duda. Su impacto fue enorme." },
        { id: '2', author: "AnalistaPro", authorAvatar: "https://github.com/shadcn.png", time: "hace 1 hora", content: "Su control en el suelo era inigualable. Pocos podrían compararse." },
      ],
    },
    {
      id: '3',
      title: "Posible regreso de GSP",
      author: "NostalgicFan",
      authorAvatar: "https://github.com/shadcn.png",
      time: "hace 1 día",
      content: "He escuchado rumores sobre un posible regreso de Georges St-Pierre. ¿Creen que GSP podría volver al octágono y tener éxito a su edad?",
      replies: [
        { id: '1', author: "OldSchoolMMA", authorAvatar: "https://github.com/shadcn.png", time: "hace 12 horas", content: "Sería emocionante, pero el nivel actual es muy alto." },
        { id: '2', author: "TrueFan", authorAvatar: "https://github.com/shadcn.png", time: "hace 8 horas", content: "GSP siempre se mantuvo en forma. Podría sorprender a muchos." },
      ],
    },
    {
      id: '4',
      title: "Top 5 Peso Pluma Actual",
      author: "AnalistaX",
      authorAvatar: "https://github.com/shadcn.png",
      time: "hace 1 día",
      content: "Quiero armar mi top 5 de peleadores de peso pluma actuales. ¿Quiénes creen que deberían estar en la lista y por qué? ¡Compartan sus opiniones!",
      replies: [
        { id: '1', author: "FightFanatic", authorAvatar: "https://github.com/shadcn.png", time: "hace 10 horas", content: "Volkanovski, sin duda. Luego, Holloway." },
        { id: '2', author: "StatsMan", authorAvatar: "https://github.com/shadcn.png", time: "hace 6 horas", content: "Consideren a Topuria, está en ascenso." },
      ],
    },
    {
      id: '101',
      title: "¿Opiniones sobre el último evento?",
      author: "UFC_Fanatic",
      authorAvatar: "https://github.com/shadcn.png",
      time: "hace 3 horas",
      content: "¿Qué les pareció el último evento de UFC? ¿Hubo alguna pelea que les sorprendió o decepcionó?",
      replies: [
        { id: '1', author: "MMA_Expert", authorAvatar: "https://github.com/shadcn.png", time: "hace 1 hora", content: "La pelea co-estelar fue fantástica, superó mis expectativas." },
        { id: '2', author: "FightWatcher", authorAvatar: "https://github.com/shadcn.png", time: "hace 30 minutos", content: "Pensé que el evento principal sería mejor, pero aun así fue sólido." },
      ],
    },
    {
      id: '102',
      title: "Debate: ¿Es Jon Jones el GOAT?",
      author: "MMA_Historian",
      authorAvatar: "https://github.com/shadcn.png",
      time: "hace 1 día",
      content: "Con la trayectoria de Jon Jones, ¿lo consideran el 'Greatest Of All Time' en el MMA? ¿Por qué sí o por qué no?",
      replies: [
        { id: '1', author: "Argumentador", authorAvatar: "https://github.com/shadcn.png", time: "hace 10 horas", content: "Sus logros son innegables, pero las controversias..." },
        { id: '2', author: "Fanatico_JJ", authorAvatar: "https://github.com/shadcn.png", time: "hace 5 horas", content: "Pura dominación, no hay quien se le compare en su prime." },
      ],
    },
    {
      id: '201',
      title: "Mis picks para el UFC 303",
      author: "BettingGuru",
      authorAvatar: "https://github.com/shadcn.png",
      time: "hace 1 hora",
      content: "¡Es hora de hacer mis predicciones para el UFC 303! Comparto mis favoritos y por qué creo que ganarán. ¿Cuáles son sus picks?",
      replies: [
        { id: '1', author: "HighStakes", authorAvatar: "https://github.com/shadcn.png", time: "hace 30 minutos", content: "Coincido con el evento principal, pero la segunda pelea me parece un riesgo." },
      ],
    },
    {
      id: '202',
      title: "Análisis de cuotas para la pelea estelar",
      author: "OddsMaster",
      authorAvatar: "https://github.com/shadcn.png",
      time: "hace 6 horas",
      content: "He analizado las cuotas para la pelea estelar del próximo evento. Les doy mis perspectivas y dónde creo que hay valor.",
      replies: [
        { id: '1', author: "PunterPro", authorAvatar: "https://github.com/shadcn.png", time: "hace 2 horas", content: "Buen análisis, creo que el underdog tiene más chances de lo que indican." },
      ],
    },
    {
      id: '301',
      title: "Últimos rumores de lesiones",
      author: "Insider_Info",
      authorAvatar: "https://github.com/shadcn.png",
      time: "hace 2 horas",
      content: "Se rumorea que X peleador podría estar lesionado y salir del próximo cartel. ¿Qué han oído ustedes?",
      replies: [
        { id: '1', author: "NewsHound", authorAvatar: "https://github.com/shadcn.png", time: "hace 1 hora", content: "Ojalá que no sea cierto, esa pelea es clave." },
      ],
    },
    {
      id: '302',
      title: "Posibles peleas para fin de año",
      author: "FightNews",
      authorAvatar: "https://github.com/shadcn.png",
      time: "hace 1 día",
      content: "Con el año llegando a su fin, ¿qué peleas soñadas les gustaría ver concretadas antes de 2025?",
      replies: [
        { id: '1', author: "DreamMatch", authorAvatar: "https://github.com/shadcn.png", time: "hace 8 horas", content: "Me encantaría ver A vs B en peso ligero." },
      ],
    },
    {
      id: '401',
      title: "Mejores strikers en Peso Ligero",
      author: "StrikingFan",
      authorAvatar: "https://github.com/shadcn.png",
      time: "hace 4 horas",
      content: "Abro debate: ¿Quiénes son los 5 mejores strikers de la división de peso ligero actualmente en el UFC?",
      replies: [
        { id: '1', author: "Kickboxer", authorAvatar: "https://github.com/shadcn.png", time: "hace 2 horas", content: "Dustin Poirier tiene manos increíbles." },
      ],
    },
    {
      id: '402',
      title: "Comparativa de grappling en Peso Welter",
      author: "GrapplingKing",
      authorAvatar: "https://github.com/shadcn.png",
      time: "hace 1 día",
      content: "Hagamos una comparativa de los mejores grapplers en la división de peso wélter. ¿Quién creen que tiene el mejor jiu-jitsu o lucha?",
      replies: [
        { id: '1', author: "BJJ_Lover", authorAvatar: "https://github.com/shadcn.png", time: "hace 9 horas", content: "Belal Muhammad ha mejorado mucho su lucha." },
      ],
    },
  ];

  // Find the current thread based on the ID from the URL
  const thread = allThreads.find(t => t.id === id);

  if (!thread) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold text-red-500">{t('thread.not_found')}</h1>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        {/* Thread Title Section */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-red-500 mb-2">{thread.title}</CardTitle>
            <p className="text-sm text-gray-400">
              {t('thread.by')} <span className="font-medium text-red-400">{thread.author}</span> - {thread.time}
            </p>
          </CardHeader>
        </Card>

        {/* Initial Post */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={thread.authorAvatar} alt={thread.author} />
                <AvatarFallback>{thread.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-white">{thread.author}</p>
                <p className="text-xs text-gray-500">{thread.time}</p>
              </div>
            </div>
            <p className="text-gray-300 whitespace-pre-line">{thread.content}</p>
          </CardContent>
        </Card>

        {/* Replies Section */}
        <h2 className="text-2xl font-bold text-red-400 mb-4">{t('thread.replies', { count: thread.replies.length })}</h2>
        <div className="space-y-4 mb-6">
          {thread.replies.map((reply) => (
            <Card key={reply.id} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarImage src={reply.authorAvatar} alt={reply.author} />
                    <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white">{reply.author}</p>
                    <p className="text-xs text-gray-500">{reply.time}</p>
                  </div>
                </div>
                <p className="text-gray-300 whitespace-pre-line">{reply.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reply Input */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">Deja tu respuesta</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Escribe tu respuesta aquí..."
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 mb-4 focus:border-red-500 focus:ring-red-500"
              rows={5}
            />
            <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">Enviar Respuesta</Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ThreadPage; 