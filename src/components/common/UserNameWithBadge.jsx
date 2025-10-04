import React, { useState, useEffect } from 'react';
import { useEquippedBadge } from '@/hooks/useEquippedBadge';
import EquippedBadgeDisplay from '@/components/badges/EquippedBadgeDisplay';
import { getUserIdFromUsername } from '@/services/userService';

/**
 * Componente para mostrar el nombre del usuario con su insignia equipada
 * Se usa en chat, foro, y otras interfaces donde se muestra el nombre del usuario
 */
const UserNameWithBadge = ({ 
  userId, 
  username, 
  className = '', 
  showBadge = true,
  badgePosition = 'right' // 'right' o 'below'
}) => {
  const [numericUserId, setNumericUserId] = useState(userId);
  const { equippedBadge } = useEquippedBadge(numericUserId);

  // Si no tenemos userId pero sí username, intentar obtener el ID numérico
  useEffect(() => {
    const fetchUserId = async () => {
      if (!userId && username) {
        const id = await getUserIdFromUsername(username);
        setNumericUserId(id);
      } else {
        setNumericUserId(userId);
      }
    };

    fetchUserId();
  }, [userId, username]);

  if (!username) return null;

  if (!showBadge || !equippedBadge) {
    return <span className={className}>{username}</span>;
  }

  if (badgePosition === 'below') {
    return (
      <div className={`flex flex-col space-y-1 ${className}`}>
        <span>{username}</span>
        <EquippedBadgeDisplay 
          equippedBadge={equippedBadge} 
          className="self-start"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span>{username}</span>
      <EquippedBadgeDisplay 
        equippedBadge={equippedBadge} 
        className="flex-shrink-0"
      />
    </div>
  );
};

export default UserNameWithBadge;
