
import React from "react";
import { motion } from "framer-motion";

const StatsCard = ({ icon: Icon, title, value, color = "red", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative overflow-hidden bg-black/50 p-6 rounded-lg backdrop-blur-sm border border-gray-800 group hover:border-red-600/50 transition-all duration-300"
    >
      <div className="absolute -right-6 -top-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <h4 className={`text-lg font-semibold mb-2 text-${color}-500 flex items-center gap-2`}>
          <Icon className="h-5 w-5" />
          {title}
        </h4>
        <p className="text-4xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
