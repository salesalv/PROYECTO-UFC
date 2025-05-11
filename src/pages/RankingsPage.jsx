import React from "react";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Assuming table exists
import { Trophy, Star } from "lucide-react";

// Placeholder data
const rankingsData = [
  { rank: 1, user: "MMA_Master", points: 15200, streak: 5 },
  { rank: 2, user: "StrikerSupreme", points: 14850, streak: 3 },
  { rank: 3, user: "GrappleGod", points: 14500, streak: 0 },
  { rank: 4, user: "NostradamusUFC", points: 13900, streak: 8 },
  { rank: 5, user: "KOPredictor", points: 13550, streak: 2 },
  { rank: 6, user: "You", points: 12500, streak: 1 }, // Example user highlight
  { rank: 7, user: "CageWizard", points: 12100, streak: 0 },
  { rank: 8, user: "FightFanatic", points: 11800, streak: 4 },
  { rank: 9, user: "SubmissionSavvy", points: 11500, streak: 0 },
  { rank: 10, user: "OctagonOracle", points: 11200, streak: 6 },
];

const RankingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-4xl"
      >
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-center uppercase text-red-500 tracking-wider flex items-center justify-center">
          <Trophy className="w-10 h-10 mr-4 text-yellow-400" />
          Ranking Global de Predicciones
        </h1>

        <div className="bg-black/70 rounded-lg border border-gray-800 shadow-lg overflow-hidden backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-800/50">
                  <TableHead className="w-[80px] text-center font-bold text-red-500">Rank</TableHead>
                  <TableHead className="font-bold text-red-500">Usuario</TableHead>
                  <TableHead className="text-right font-bold text-red-500">Puntos</TableHead>
                  <TableHead className="text-center font-bold text-red-500">Racha <Star className="inline w-4 h-4 mb-1 ml-1 text-yellow-400"/></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankingsData.map((user) => (
                  <TableRow key={user.rank} className={`border-gray-800 hover:bg-gray-700/50 transition-colors ${user.user === 'You' ? 'bg-red-900/30 font-bold text-yellow-300' : ''}`}>
                    <TableCell className="text-center font-medium">{user.rank}</TableCell>
                    <TableCell>{user.user}</TableCell>
                    <TableCell className="text-right">{user.points.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{user.streak > 0 ? `${user.streak} 🔥` : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>
         <p className="text-center text-gray-500 mt-6 text-sm">
           El ranking se actualiza después de cada evento principal. ¡Sigue prediciendo!
         </p>
      </motion.div>
    </div>
  );
};

export default RankingsPage;
