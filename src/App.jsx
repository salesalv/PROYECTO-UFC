import React from "react";
import MainLayout from "./components/layout/MainLayout";
import AppRoutes from './routes/AppRoutes';
import './index.css';

const App = () => {
  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
};

export default App;
