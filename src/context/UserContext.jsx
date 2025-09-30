import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import supabase from "@/db";
import { agregarMonedas, gastarMonedas, obtenerSaldo } from "@/services/coinService";
import { canjearRecompensa, obtenerRecompensasUsuario, obtenerEstadisticasRecompensas } from "@/services/rewardsService";

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

  // Función para actualizar el saldo del usuario
  const updateUserBalance = useCallback(async () => {
    if (user?.id) {
      try {
        const nuevoSaldo = await obtenerSaldo(user.id);
        setUser(prev => prev ? { ...prev, saldo: nuevoSaldo } : null);
      } catch (error) {
        console.error('Error actualizando saldo:', error);
      }
    }
  }, [user?.id]);

  // Función para agregar monedas al usuario
  const addCoins = useCallback(async (cantidad, motivo = "ingreso") => {
    if (!user?.id) {
      throw new Error("Usuario no autenticado");
    }
    
    try {
      const nuevoSaldo = await agregarMonedas(user.id, cantidad, motivo);
      setUser(prev => prev ? { ...prev, saldo: nuevoSaldo } : null);
      return nuevoSaldo;
    } catch (error) {
      console.error('Error agregando monedas:', error);
      throw error;
    }
  }, [user?.id]);

  // Función para gastar monedas del usuario
  const spendCoins = useCallback(async (cantidad, motivo = "egreso") => {
    if (!user?.id) {
      throw new Error("Usuario no autenticado");
    }
    
    try {
      const nuevoSaldo = await gastarMonedas(user.id, cantidad, motivo);
      setUser(prev => prev ? { ...prev, saldo: nuevoSaldo } : null);
      return nuevoSaldo;
    } catch (error) {
      console.error('Error gastando monedas:', error);
      throw error;
    }
  }, [user?.id]);

  // Función para verificar si el usuario tiene suficientes monedas
  const hasEnoughCoins = useCallback((cantidad) => {
    return user?.saldo >= cantidad;
  }, [user?.saldo]);

  // Función para canjear una recompensa
  const redeemReward = useCallback(async (recompensaId) => {
    if (!user?.id) {
      throw new Error("Usuario no autenticado");
    }
    
    try {
      const result = await canjearRecompensa(user.id, recompensaId);
      
      // Actualizar saldo del usuario
      setUser(prev => prev ? { ...prev, saldo: result.nuevoSaldo } : null);
      
      return result;
    } catch (error) {
      console.error('Error canjeando recompensa:', error);
      throw error;
    }
  }, [user?.id]);

  // Función para obtener las recompensas del usuario
  const getUserRewards = useCallback(async () => {
    if (!user?.id) {
      return [];
    }
    
    try {
      return await obtenerRecompensasUsuario(user.id);
    } catch (error) {
      console.error('Error obteniendo recompensas:', error);
      return [];
    }
  }, [user?.id]);

  // Función para obtener estadísticas de recompensas
  const getRewardStatistics = useCallback(async () => {
    if (!user?.id) {
      return {
        totalRecompensas: 0,
        totalGastado: 0,
        promedioPorRecompensa: 0
      };
    }
    
    try {
      return await obtenerEstadisticasRecompensas(user.id);
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        totalRecompensas: 0,
        totalGastado: 0,
        promedioPorRecompensa: 0
      };
    }
  }, [user?.id]);

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

  const contextValue = {
    user,
    loading,
    refreshUser: fetchUserData,
    updateUserBalance,
    addCoins,
    spendCoins,
    hasEnoughCoins,
    redeemReward,
    getUserRewards,
    getRewardStatistics
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); 