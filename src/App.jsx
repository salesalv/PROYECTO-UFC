import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AppRoutes from './routes/AppRoutes';
import './index.css';
import supabase from "@/db";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('type') === 'signup' && params.get('access_token')) {
      navigate('/login');
    }

    const syncGoogleUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('usuario').insert([
          {
            nombre_usuario: user.user_metadata?.full_name || user.email.split('@')[0],
            correo: user.email,
            fecha_registro: new Date().toISOString(),
            puntos: 0,
            rango: 'Novato',
            avatar: user.user_metadata?.avatar_url || null,
            notificaciones: true,
            tema: 'dark',
            contraseña: '',
            saldo: 0
          }
        ]);
        let intentos = 0;
        let existe = false;
        while (intentos < 5 && !existe) {
          const { data } = await supabase
            .from('usuario')
            .select('*')
            .eq('correo', user.email)
            .single();
          if (data) existe = true;
          else {
            await new Promise(res => setTimeout(res, 500));
            intentos++;
          }
        }
        window.location.reload();
      }
    };
    syncGoogleUser();
  }, [navigate]);

  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
};

export default App;
