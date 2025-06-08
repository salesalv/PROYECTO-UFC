import React from "react";
import Header from "./Header";
import { Toaster } from "../ui/toaster";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header />
      <main className="pt-16">
        {children}
      </main>
      <Toaster />
      {/* Footer can be added here */}
    </div>
  );
};

export default MainLayout;
