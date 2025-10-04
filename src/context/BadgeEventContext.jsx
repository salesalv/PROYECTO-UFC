import { createContext, useContext, useState, useEffect } from 'react';

// Contexto para manejar eventos de insignias
const BadgeEventContext = createContext();

export const BadgeEventProvider = ({ children }) => {
  const [badgeUpdateTrigger, setBadgeUpdateTrigger] = useState(0);

  const triggerBadgeUpdate = () => {
    setBadgeUpdateTrigger(prev => prev + 1);
  };

  return (
    <BadgeEventContext.Provider value={{ triggerBadgeUpdate, badgeUpdateTrigger }}>
      {children}
    </BadgeEventContext.Provider>
  );
};

export const useBadgeEvents = () => {
  const context = useContext(BadgeEventContext);
  if (!context) {
    throw new Error('useBadgeEvents must be used within a BadgeEventProvider');
  }
  return context;
};
