import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

const VSBadge = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center" // Center content vertically
    >
      {/* VS Circle */}
      <div className="relative z-10">
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 rounded-full p-1">
          <div className="bg-black rounded-full p-4">
            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 filter drop-shadow-lg">
              {t('vs')}
            </span>
          </div>
        </div>
      </div>

      {/* Animated Background Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "mirror" // Make it pulse in and out
        }}
        className="absolute inset-x-0 top-0 h-full bg-gradient-to-r from-red-600/20 to-red-800/20 rounded-full blur-xl"
        style={{ top: '-10%', height: '120%' }} // Adjust glow size/position slightly
      />
    </motion.div>
  );
};

export default VSBadge;
