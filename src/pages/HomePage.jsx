
import React from "react";
import { motion } from "framer-motion";
import FeaturedFight from "@/components/home/FeaturedFight";
import FeaturedFightsList from "@/components/home/FeaturedFightsList";
// CommunitySection is removed

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-black text-white" // Ensure base background is dark
    >
      <FeaturedFight />
      <FeaturedFightsList />
      {/* CommunitySection removed */}
    </motion.div>
  );
};

export default HomePage;
