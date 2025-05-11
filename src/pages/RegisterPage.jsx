import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage = () => {
  return (
     <div className="min-h-screen flex items-center justify-center pt-16 relative auth-container overflow-hidden">
       {/* Background Image */}
       <img 
         className="absolute inset-0 w-full h-full object-cover opacity-60 blur-sm scale-105 select-none pointer-events-none"
         alt="Fondo UFC registro"
        src="https://images.unsplash.com/photo-1680022702604-292f21514497" />
       {/* Overlay */}
       <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-gray-900/80 z-0" />
        {/* Register Form */}
       <div className="z-10">
         <RegisterForm />
       </div>
    </div>
  );
};

export default RegisterPage;
