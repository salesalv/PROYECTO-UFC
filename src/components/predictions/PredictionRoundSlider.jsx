import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from 'react-i18next';

const PredictionRoundSlider = ({ value, onChange, maxRounds }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <Label htmlFor="round" className="text-lg font-semibold text-gray-200">{t('prediction.round_label')}</Label>
      <div className="flex items-center space-x-4 pt-1">
        <Slider id="round" min={1} max={maxRounds} step={1} value={value} onValueChange={onChange} className="flex-grow [&>span:first-child]:bg-red-600" />
        <span className="font-bold text-xl text-red-400 w-8 text-center">{value[0]}</span>
      </div>
      <p className="text-xs text-gray-500 text-center">{t('prediction.round_hint')}</p>
    </div>
  );
};

export default PredictionRoundSlider;
