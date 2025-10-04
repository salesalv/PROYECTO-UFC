import React from 'react';
import { Crown } from 'lucide-react';

const EquippedBadgeDisplay = ({ equippedBadge, className = '' }) => {
  if (!equippedBadge?.insignias_catalogo) {
    return null;
  }

  const badge = equippedBadge.insignias_catalogo;

  const getRarityStyles = (rareza) => {
    switch (rareza) {
      case 'comun':
        return 'border-gray-500 shadow-gray-500/20';
      case 'rara':
        return 'border-blue-500 shadow-blue-500/20';
      case 'legendaria':
        return 'border-yellow-500 shadow-yellow-500/20';
      default:
        return 'border-gray-500 shadow-gray-500/20';
    }
  };

  return (
    <div 
      className={`inline-flex items-center justify-center bg-gradient-to-r from-gray-900/80 to-gray-800/80 border rounded-full p-1 shadow-lg ${getRarityStyles(badge.rareza)} ${className}`}
      title={`${badge.nombre} - ${badge.descripcion}`}
    >
      <span className="text-lg animate-glow">{badge.icono}</span>
    </div>
  );
};

export default EquippedBadgeDisplay;
