import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from "./UserContext";
import supabase from "@/db";

const ClipsContext = createContext();

export const useClips = () => {
  const context = useContext(ClipsContext);
  if (!context) {
    throw new Error('useClips debe ser usado dentro de un ClipsProvider');
  }
  return context;
};

export const ClipsProvider = ({ children }) => {
  const [savedClips, setSavedClips] = useState([]);
  const { user } = useUser();

  const fetchClips = async () => {
    if (!user) {
      setSavedClips([]);
      return;
    }
    const { data, error } = await supabase
      .from('clips')
      .select('*')
      .eq('user_id', user.auth.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setSavedClips(data);
    }
  };

  useEffect(() => {
    fetchClips();
  }, [user]);

  const addClip = async (clipData) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('clips')
      .insert([{ ...clipData, user_id: user.auth.id }])
      .select();
    
    if (!error && data) {
      setSavedClips(prev => [data[0], ...prev]);
    }
    return { data, error };
  };

  const deleteClip = async (clipId) => {
    if (!user) return;
    const { error } = await supabase
      .from('clips')
      .delete()
      .eq('id', clipId)
      .eq('user_id', user.auth.id);

    if (!error) {
    setSavedClips(prev => prev.filter(clip => clip.id !== clipId));
    }
  };

  return (
    <ClipsContext.Provider value={{ savedClips, addClip, deleteClip, fetchClips }}>
      {children}
    </ClipsContext.Provider>
  );
};

export default ClipsContext; 