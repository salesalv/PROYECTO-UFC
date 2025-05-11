import React from "react";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16 relative auth-container overflow-hidden">
      {/* Background Image */}
      <img 
        className="absolute inset-0 w-full h-full object-cover opacity-60 blur-sm scale-105 select-none pointer-events-none"
        alt="Fondo UFC login"
        src="https://images.unsplash.com/photo-1680022548963-1d8e630a272b" />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-gray-900/80 z-0" />
      {/* Login Form */}
      <div className="z-10">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
