import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import supabase from "@/db";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener los datos del usuario autenticado y de la tabla personalizada
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data } = await supabase
        .from('usuario')
        .select('*')
        .eq('correo', authUser.email)
        .single();
      if (data) {
        setUser({ ...data, auth: authUser });
      } else {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUserData();
    // Escuchar cambios de sesión de Supabase
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUserData();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [fetchUserData]);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser: fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); 