import React from "react";
import StatsCard from "@/components/StatsCard";
import { Target, Coins, Trophy, Star } from "lucide-react";
import { useTranslation } from 'react-i18next';

const StatsSection = () => {
  const { t } = useTranslation();
  const stats = [
    {
      icon: Target,
      title: t('stats.accurate_predictions'),
      value: "85%",
      delay: 0.1,
    },
    {
      icon: Coins,
      title: t('stats.coins_won'),
      value: "2,500",
      delay: 0.2,
    },
    {
      icon: Trophy,
      title: t('stats.global_ranking'),
      value: "#156",
      delay: 0.3,
    },
    {
      icon: Star,
      title: t('stats.next_level'),
      value: "750 pts",
      delay: 0.4,
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOTEzOS0xLjc5MDg2MS00LTQtNHMtNCAxLjc5MDg2MS00IDQgMS43OTA4NjEgNCA0IDQgNC0xLjc5MDg2MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10" />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
