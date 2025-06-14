import React from "react";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ListOrdered, ShieldCheck, BarChartHorizontalBig, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Assuming Badge component exists or create it
import ModalPeleador from "@/components/ui/ModalPeleador";
import HoverCardPeleador from "@/components/ui/ModalPeleador";

// Placeholder fighter data
const fightersData = [
  { rank: 1, name: "Jon Jones", division: "Peso Pesado", record: "27-1-0 (1 NC)", points: 2850, status: "Campeón", pais: "Estados Unidos", foto: "https://static.ufcstats.com/images/athlete/Jon-Jones.png", datoExtra: "Considerado uno de los mejores peleadores libra por libra de la historia." },
  { rank: 2, name: "Islam Makhachev", division: "Peso Ligero", record: "25-1-0", points: 2780, status: "Campeón", pais: "Rusia", foto: "https://static.ufcstats.com/images/athlete/Islam-Makhachev.png", datoExtra: "Discípulo de Khabib Nurmagomedov, gran dominio en lucha y sumisiones." },
  { rank: 3, name: "Alexander Volkanovski", division: "Peso Pluma", record: "26-4-0", points: 2750, status: "Top Contender", pais: "Australia", foto: "https://static.ufcstats.com/images/athlete/Alexander-Volkanovski.png", datoExtra: "Exjugador de rugby, famoso por su cardio y presión constante." },
  { rank: 4, name: "Leon Edwards", division: "Peso Wélter", record: "22-3-0 (1 NC)", points: 2710, status: "Campeón", pais: "Reino Unido", foto: "https://static.ufcstats.com/images/athlete/Leon-Edwards.png", datoExtra: "Conocido por su striking técnico y defensa sólida." },
  { rank: 5, name: "Alex Pereira", division: "Peso Semipesado", record: "10-2-0", points: 2690, status: "Campeón", pais: "Brasil", foto: "https://static.ufcstats.com/images/athlete/Alex-Pereira.png", datoExtra: "Excampeón de kickboxing, famoso por su poder de nocaut." },
  { rank: 6, name: "Ilia Topuria", division: "Peso Pluma", record: "15-0-0", points: 2650, status: "Campeón", pais: "España / Georgia", foto: "https://static.ufcstats.com/images/athlete/Ilia-Topuria.png", datoExtra: "Invicto, gran pegada y jiu-jitsu de alto nivel." },
  { rank: 7, name: "Sean O'Malley", division: "Peso Gallo", record: "18-1-0 (1 NC)", points: 2620, status: "Campeón", pais: "Estados Unidos", foto: "https://static.ufcstats.com/images/athlete/Sean-OMalley.png", datoExtra: "Estilo único y creativo, gran precisión en el golpeo." },
  { rank: 8, name: "Charles Oliveira", division: "Peso Ligero", record: "34-10-0 (1 NC)", points: 2600, status: "Top Contender", pais: "Brasil", foto: "https://static.ufcstats.com/images/athlete/Charles-Oliveira.png", datoExtra: "Récord de finalizaciones en UFC, experto en sumisiones." },
  { rank: 9, name: "Dricus du Plessis", division: "Peso Mediano", record: "21-2-0", points: 2580, status: "Campeón", pais: "Sudáfrica", foto: "https://static.ufcstats.com/images/athlete/Dricus-DuPlessis.png", datoExtra: "Gran resistencia y agresividad en el octágono." },
  { rank: 10, name: "Alexandre Pantoja", division: "Peso Mosca", record: "27-5-0", points: 2550, status: "Campeón", pais: "Brasil", foto: "https://static.ufcstats.com/images/athlete/Alexandre-Pantoja.png", datoExtra: "Especialista en grappling y sumisiones rápidas." },
];

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "Campeón":
      return "destructive"; // Red for champion
    case "Top Contender":
      return "secondary"; // Greyish for contender
    default:
      return "outline";
  }
};

const CARD_HEIGHT = 340; // px, altura estimada del hover card
const HOVERCARD_FIXED_POSITION = { top: 40, left: 40 };

const FightersPage = () => {
  const [peleadorSeleccionado, setPeleadorSeleccionado] = React.useState(null);
  const [hoveredFighter, setHoveredFighter] = React.useState(null);
  const [hoverPosition, setHoverPosition] = React.useState({ top: 0, left: 0 });
  const [showCard, setShowCard] = React.useState(false);

  React.useEffect(() => {
    if (!showCard) return;
    const handleClickOutside = (e) => {
      // Si el click no es en el hover card ni en el nombre, ocultar
      if (!e.target.closest('.hovercard-peleador') && !e.target.closest('.peleador-nombre')) {
        setShowCard(false);
        setHoveredFighter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCard]);

  const handleMouseEnter = (fighter, event) => {
    setHoveredFighter(fighter);
    setShowCard(true);
  };

  const handleMouseLeave = () => {
    setHoveredFighter(null);
    setShowCard(false);
  };

  const handleClick = (fighter) => {
    setHoveredFighter(fighter);
    setShowCard(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-6xl" // Wider container
      >
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-center uppercase text-red-500 tracking-wider flex items-center justify-center">
          <ListOrdered className="w-10 h-10 mr-4 text-yellow-400" />
          Ranking Oficial de Peleadores (P4P)
        </h1>

        <div className="bg-black/70 rounded-lg border border-gray-800 shadow-lg overflow-hidden backdrop-blur-sm">
           {typeof Table !== 'undefined' && typeof Badge !== 'undefined' ? (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-800/50">
                  <TableHead className="w-[80px] text-center font-bold text-red-500">Rank</TableHead>
                  <TableHead className="font-bold text-red-500">Nombre</TableHead>
                  <TableHead className="font-bold text-red-500 hidden md:table-cell">División</TableHead>
                  <TableHead className="font-bold text-red-500 hidden lg:table-cell">Récord</TableHead>
                  <TableHead className="text-center font-bold text-red-500">Status</TableHead>
                  <TableHead className="text-right font-bold text-red-500">Puntos <Star className="inline w-4 h-4 mb-1 ml-1 text-yellow-400"/></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fightersData.map((fighter) => (
                  <TableRow key={fighter.rank} className="border-gray-800 hover:bg-gray-700/50 transition-colors cursor-pointer">
                    <TableCell className="text-center font-medium">{fighter.rank}</TableCell>
                    <TableCell
                      className="font-semibold relative peleador-nombre"
                      onMouseEnter={e => handleMouseEnter(fighter, e)}
                      onMouseMove={e => handleMouseEnter(fighter, e)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleClick(fighter)}
                      tabIndex={0}
                      style={{ outline: 'none' }}
                    >
                      {fighter.name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-400">{fighter.division}</TableCell>
                    <TableCell className="hidden lg:table-cell text-gray-400">{fighter.record}</TableCell>
                    <TableCell className="text-center">
                       <Badge variant={getStatusBadgeVariant(fighter.status)} className="uppercase text-xs px-2 py-0.5">
                         {fighter.status === "Campeón" && <ShieldCheck className="w-3 h-3 mr-1 inline"/>}
                         {fighter.status}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-yellow-300">{fighter.points.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
           ) : (
             <p className="p-6 text-center text-gray-400">Componentes de Tabla o Badge no encontrados. Por favor, créalos si no existen.</p>
           )}
        </div>
         <p className="text-center text-gray-500 mt-6 text-sm">
           Ranking Libra por Libra (P4P) basado en el rendimiento y dominio divisional.
         </p>
      </motion.div>
      <ModalPeleador peleador={peleadorSeleccionado} onClose={() => setPeleadorSeleccionado(null)} />
      <HoverCardPeleador peleador={hoveredFighter} visible={showCard && !!hoveredFighter} position={HOVERCARD_FIXED_POSITION} className="hovercard-peleador" />
    </div>
  );
};

export default FightersPage;
