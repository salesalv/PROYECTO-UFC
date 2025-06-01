import React from "react";
import { motion } from "framer-motion";
import RegisterForm from "@/components/auth/RegisterForm";
import Logo from "@/components/Logo";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16 relative auth-container overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      >
        <source src="/videos/ufc-background.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/80 to-gray-900/90 z-0" />

      {/* Content */}
      <div className="z-10 w-full max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row items-center justify-between gap-12"
        >
          {/* Left side - Branding */}
          <div className="text-center lg:w-1/2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <Logo className="h-72 w-auto mx-auto" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl md:text-5xl font-black mb-4 text-white"
            >
              Únete a la Comunidad{" "}
              <span className="text-red-600">SMASH</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl text-gray-400 mb-8"
            >
              Crea tu cuenta y empieza a predecir resultados de MMA
            </motion.p>
          </div>

          {/* Right side - Register Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="w-full lg:w-1/2"
          >
            <RegisterForm />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
