import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Coins } from "lucide-react";
import { useTranslation } from 'react-i18next';

const PredictionBetAmount = ({ betAmount, balance, potentialWinnings, onBetChange }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <Label htmlFor="betAmount" className="text-lg font-semibold flex items-center text-gray-200">
        <Coins className="w-5 h-5 mr-2 text-yellow-500" /> {t('prediction.bet_amount')}
      </Label>
      <div className="relative">
        <Input
          type="text"
          id="betAmount"
          value={betAmount}
          onChange={onBetChange}
          placeholder="0"
          className="w-full bg-gray-900/50 border-gray-700 pl-4 pr-24 text-lg text-white" // Increased right padding
          inputMode="numeric"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400 font-bold">{t('prediction.coins')}</span>
      </div>
       <div className="flex justify-between items-center text-sm mt-2">
           <p className="text-gray-400">{t('prediction.balance')}: <span className="font-semibold text-gray-200">{balance.toLocaleString()}</span> <Coins className="inline h-3 w-3 ml-0.5 text-yellow-400" /></p>
           <p className="text-gray-400">{t('prediction.potential_win')}: <span className="font-bold text-green-400">{potentialWinnings.toLocaleString()}</span> <Coins className="inline h-4 w-4 ml-1 text-yellow-400" /></p>
       </div>
    </div>
  );
};

export default PredictionBetAmount;
