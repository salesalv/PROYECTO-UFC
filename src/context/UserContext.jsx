import { createContext, useContext, useState, useEffect } from "react";
import supabase from "@/db";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!isMounted) return;
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

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      getUser();
    });

    return () => {
      isMounted = false;
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