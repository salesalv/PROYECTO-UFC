import React from "react";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ListOrdered, ShieldCheck, BarChartHorizontalBig, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Assuming Badge component exists or create it
import ModalPeleador from "@/components/ui/ModalPeleador";
import HoverCardPeleador from "@/components/ui/ModalPeleador";
import supabase from "@/db";
import { useTranslation } from 'react-i18next';

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "Campeón":
      return "destructive";
    case "Top Contender":
      return "secondary";
    default:
      return "outline";
  }
};

const CARD_HEIGHT = 340; // px, altura estimada del hover card
const HOVERCARD_FIXED_POSITION = { top: 40, left: 40 };

const FightersPage = () => {
  const { t } = useTranslation();
  const [peleadorSeleccionado, setPeleadorSeleccionado] = React.useState(null);
  const [hoveredFighter, setHoveredFighter] = React.useState(null);
  const [hoverPosition, setHoverPosition] = React.useState({ top: 0, left: 0 });
  const [showCard, setShowCard] = React.useState(false);
  const [peleadores, setPeleadores] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchPeleadores = async () => {
      const { data, error } = await supabase
        .from('peleador')
        .select('*')
        .order('puntos', { ascending: false });
      if (error) {
        setError(error.message || 'Error al cargar peleadores');
        setPeleadores([]);
      } else {
        setPeleadores(data);
      }
    };
    fetchPeleadores();
  }, []);

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
          {t('fighters.title')}
        </h1>

        <div className="bg-black/70 rounded-lg border border-gray-800 shadow-lg overflow-hidden backdrop-blur-sm">
           {error ? (
             <p className="p-6 text-center text-red-500">{error}</p>
           ) : peleadores.length === 0 ? (
             <p className="p-6 text-center text-gray-400">{t('fighters.no_table')}</p>
           ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableHead className="w-[60px] sm:w-[80px] text-center font-bold text-red-500">{t('fighters.rank')}</TableHead>
                    <TableHead className="font-bold text-red-500 min-w-[120px]">{t('fighters.name')}</TableHead>
                    <TableHead className="font-bold text-red-500 hidden md:table-cell">{t('fighters.division')}</TableHead>
                    <TableHead className="font-bold text-red-500 hidden lg:table-cell">{t('fighters.record')}</TableHead>
                    <TableHead className="text-center font-bold text-red-500">{t('fighters.status_col')}</TableHead>
                    <TableHead className="text-right font-bold text-red-500">{t('fighters.points_col')} <Star className="inline w-4 h-4 mb-1 ml-1 text-yellow-400"/></TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {peleadores.map((fighter, idx) => (
                  <TableRow key={fighter.id || idx} className="border-gray-800 hover:bg-gray-700/50 transition-colors cursor-pointer">
                    <TableCell className="text-center font-medium">{idx + 1}</TableCell>
                    <TableCell
                      className="font-semibold relative peleador-nombre"
                      onMouseEnter={e => handleMouseEnter(fighter, e)}
                      onMouseMove={e => handleMouseEnter(fighter, e)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleClick(fighter)}
                      tabIndex={0}
                      style={{ outline: 'none' }}
                    >
                      {fighter.nombre}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-400">{t(`weight.${fighter.division}`)}</TableCell>
                    <TableCell className="hidden lg:table-cell text-gray-400">{fighter.record}</TableCell>
                    <TableCell className="text-center">
                       <Badge variant={getStatusBadgeVariant(fighter.status)} className="uppercase text-xs px-2 py-0.5">
                         {fighter.status === "Campeón" && <ShieldCheck className="w-3 h-3 mr-1 inline"/>}
                         {t(`fighters.status.${fighter.status}`)}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-yellow-300">{fighter.puntos?.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
           )}
        </div>
         <p className="text-center text-gray-500 mt-6 text-sm">
           {t('fighters.note')}
         </p>
      </motion.div>
      <HoverCardPeleador peleador={hoveredFighter} visible={showCard && !!hoveredFighter} position={HOVERCARD_FIXED_POSITION} className="hovercard-peleador" />
    </div>
  );
};

export default FightersPage;
