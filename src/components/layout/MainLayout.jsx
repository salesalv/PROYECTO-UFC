import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Header";
import AppRoutes from "../../routes/AppRoutes";
import { Toaster } from "../ui/toaster";

const MainLayout = () => {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans">
        <Header />
        <main className="pt-16">
          <AppRoutes />
        </main>
        <Toaster />
        {/* Footer can be added here */}
      </div>
    </Router>
  );
};

export default MainLayout;
