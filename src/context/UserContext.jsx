import { createContext, useContext, useState, useEffect } from "react";
import supabase from "@/db";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  // Cargar usuario de Supabase Auth y datos personalizados
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from('usuario')
          .select('*')
          .eq('correo', user.email)
          .single();
        setUserData(data);
      } else {
        setUserData(null);
      }
    };
    getUser();
    // Listener para cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, userData, setUser, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 