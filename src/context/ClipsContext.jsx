import React, { createContext, useContext, useState, useEffect } from 'react';

const ClipsContext = createContext();

export const useClips = () => {
  const context = useContext(ClipsContext);
  if (!context) {
    throw new Error('useClips debe ser usado dentro de un ClipsProvider');
  }
  return context;
};

export const ClipsProvider = ({ children }) => {
  const [savedClips, setSavedClips] = useState(() => {
    const savedClipsFromStorage = localStorage.getItem('savedClips');
    return savedClipsFromStorage ? JSON.parse(savedClipsFromStorage) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedClips', JSON.stringify(savedClips));
  }, [savedClips]);

  const addClip = (clip) => {
    setSavedClips(prev => [...prev, {
      id: Date.now(),
      ...clip,
      timestamp: new Date().toISOString()
    }]);
  };

  const deleteClip = (clipId) => {
    setSavedClips(prev => prev.filter(clip => clip.id !== clipId));
  };

  return (
    <ClipsContext.Provider value={{ savedClips, addClip, deleteClip }}>
      {children}
    </ClipsContext.Provider>
  );
};

export default ClipsContext; 