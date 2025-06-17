import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AppRoutes from './routes/AppRoutes';
import './index.css';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('type') === 'signup' && params.get('access_token')) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
};

export default App;
