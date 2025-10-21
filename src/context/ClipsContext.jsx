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
    
    try {
      // Primero obtener la información del clip para acceder al archivo
      const { data: clipData, error: fetchError } = await supabase
        .from('clips')
        .select('video_url')
        .eq('id', clipId)
        .eq('user_id', user.auth.id)
        .single();

      if (fetchError) {
        console.error('Error al obtener datos del clip:', fetchError);
        return;
      }

      // Extraer el nombre del archivo de la URL
      let fileName = null;
      if (clipData.video_url) {
        // Si es una URL de Supabase Storage
        if (clipData.video_url.includes('supabase')) {
          const urlParts = clipData.video_url.split('/');
          fileName = urlParts[urlParts.length - 1];
        }
        // Si es una URL de Cloudinary
        else if (clipData.video_url.includes('cloudinary')) {
          // Para Cloudinary, solo eliminamos de la BD ya que no tenemos API key
          console.log('Clip de Cloudinary - solo eliminando de BD');
        }
      }

      // Eliminar archivo del storage si es de Supabase
      if (fileName && clipData.video_url.includes('supabase')) {
        const { error: storageError } = await supabase.storage
          .from('clips')
          .remove([fileName]);

        if (storageError) {
          console.error('Error al eliminar archivo del storage:', storageError);
        }
      }

      // Eliminar registro de la base de datos
      const { error } = await supabase
        .from('clips')
        .delete()
        .eq('id', clipId)
        .eq('user_id', user.auth.id);

      if (!error) {
        setSavedClips(prev => prev.filter(clip => clip.id !== clipId));
        console.log('Clip eliminado exitosamente');
      } else {
        console.error('Error al eliminar clip de la BD:', error);
      }
    } catch (error) {
      console.error('Error general al eliminar clip:', error);
    }
  };

  return (
    <ClipsContext.Provider value={{ savedClips, addClip, deleteClip, fetchClips }}>
      {children}
    </ClipsContext.Provider>
  );
};

export default ClipsContext; 