import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from 'react-i18next';

const PredictionYesNo = ({ predictionKey, value, onChange, label, icon: Icon }) => {
  const { t } = useTranslation();
  return (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
    <Label className="flex items-center text-base sm:text-lg text-gray-300">
      <Icon className="w-4 h-4 mr-2 text-gray-400" /> {label}
    </Label>
    <RadioGroup value={value} onValueChange={(val) => onChange(predictionKey, val)} className="flex space-x-6 shrink-0">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="yes" id={`${predictionKey}-yes`} className="border-gray-600 text-green-500 focus:ring-green-500"/>
          <Label htmlFor={`${predictionKey}-yes`} className="text-green-400">{t('prediction.yes')}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="no" id={`${predictionKey}-no`} className="border-gray-600 text-red-500 focus:ring-red-500"/>
          <Label htmlFor={`${predictionKey}-no`} className="text-red-500">{t('prediction.no')}</Label>
      </div>
    </RadioGroup>
  </div>
);
};

export default PredictionYesNo;
