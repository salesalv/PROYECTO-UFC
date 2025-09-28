import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Award } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link
import { useTranslation } from 'react-i18next';

const CommunitySection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl md:text-4xl font-black mb-4 uppercase text-white tracking-wider"
        >
          {t('home.join_title')} <span className="text-red-500">SMASH</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
        >
          {t('home.join_desc')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg w-full sm:w-auto" asChild>
            <Link to="/forum">
              <MessageSquare className="w-5 h-5 mr-2" />
              {t('home.join_community')}
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-lg border-red-500 text-red-500 hover:bg-red-900/20 hover:text-red-400 w-full sm:w-auto" asChild>
             {/* Changed Button to Link for navigation */}
            <Link to="/predict">
              <Award className="w-5 h-5 mr-2" />
              {t('home.learn_more')}
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
