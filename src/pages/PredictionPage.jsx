import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Award, Target, ChevronsDown, CheckCircle, XCircle, CalendarCheck, Users, Coins } from "lucide-react";
import { useTranslation } from 'react-i18next';

// Placeholder data - Move to context or props later if needed
const fightDetails = {
  id: 1,
  fighter1: "Conor McGregor",
  fighter2: "Michael Chandler",
  event: "UFC 303",
  rounds: 5,
};

const userBalance = 5000; // Placeholder

const predictionOdds = { // Example odds - replace with dynamic values
  winner: 1.8, method: 2.5, round: 3.0, firstStrike: 1.5, firstTakedown: 2.0,
  willBeKO: 1.6, willBeSub: 3.5, goToDecision: 2.2, mostSignificantStrikes: 1.9,
};

const validMethods = ["KO/TKO", "Submission", "Decision"];

// --- Sub-components for Prediction Form Sections ---

const PredictionFighterOptions = ({ predictionKey, value, onChange, fighters, label, icon: Icon, iconColor }) => (
  <div className="space-y-3">
    <Label className="text-lg font-semibold flex items-center text-gray-200">
      {Icon && <Icon className={`w-5 h-5 mr-2 ${iconColor || 'text-gray-400'}`} />}
      {label}
    </Label>
    <RadioGroup value={value} onValueChange={(val) => onChange(predictionKey, val)} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 pt-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={fighters.fighter1} id={`${predictionKey}-${fighters.fighter1}`} className="border-gray-600 text-red-500 focus:ring-red-500"/>
        <Label htmlFor={`${predictionKey}-${fighters.fighter1}`} className="text-gray-300">{fighters.fighter1}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={fighters.fighter2} id={`${predictionKey}-${fighters.fighter2}`} className="border-gray-600 text-red-500 focus:ring-red-500"/>
        <Label htmlFor={`${predictionKey}-${fighters.fighter2}`} className="text-gray-300">{fighters.fighter2}</Label>
      </div>
    </RadioGroup>
  </div>
);

const PredictionMethodRadio = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <RadioGroup value={value} onValueChange={(val) => onChange('method', val)} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 pt-1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="KO/TKO" id="method-KO/TKO" className="border-gray-600 text-red-500 focus:ring-red-500"/>
          <Label htmlFor="method-KO/TKO" className="text-gray-300">{t('prediction.ko_tko')}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Submission" id="method-Submission" className="border-gray-600 text-blue-500 focus:ring-blue-500"/>
          <Label htmlFor="method-Submission" className="text-gray-300">{t('prediction.submission')}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Decision" id="method-Decision" className="border-gray-600 text-green-500 focus:ring-green-500"/>
          <Label htmlFor="method-Decision" className="text-gray-300">{t('prediction.decision')}</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

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
          className="w-full bg-gray-900/50 border-gray-700 pl-4 pr-24 text-lg text-white"
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

// --- Main Prediction Page Component ---

const PredictionPage = () => {
  const { t } = useTranslation();
  const [predictions, setPredictions] = useState({
    winner: undefined,
    method: undefined,
    round: [Math.ceil(fightDetails.rounds / 2)],
    firstStrike: undefined,
    firstTakedown: undefined,
    willBeKO: undefined,
    willBeSub: undefined,
    goToDecision: undefined,
    mostSignificantStrikes: undefined,
  });
  const [betAmount, setBetAmount] = useState('');
  const [potentialWinnings, setPotentialWinnings] = useState(0);

  const calculateWinnings = (amount, currentPredictions) => {
    const selectedCount = Object.values(currentPredictions).filter(p => p !== null && !Array.isArray(p)).length + (currentPredictions.round ? 1 : 0);
    if (selectedCount === 0 || !amount || amount <= 0) return 0;

    const avgOdds = Object.entries(predictionOdds)
      .filter(([key]) => currentPredictions[key] !== null && currentPredictions[key] !== undefined)
      .reduce((sum, [, odd]) => sum + odd, 0) / selectedCount;

    return (amount * (avgOdds || 1)).toFixed(0);
  };

  const updatePrediction = (key, value) => {
    try {
      let safeValue = value;
      if (key === 'method' && !validMethods.includes(value)) {
        safeValue = undefined;
        console.warn('Valor de método no válido:', value);
      }
      
      if (key === 'round' && (!Array.isArray(value) || value.length === 0)) {
        safeValue = [Math.ceil(fightDetails.rounds / 2)];
        console.warn('Valor de ronda no válido, usando valor por defecto');
      }

      setPredictions(prev => {
        const newState = { ...prev, [key]: safeValue };
        const betAmountNum = parseInt(betAmount, 10) || 0;
        setPotentialWinnings(calculateWinnings(betAmountNum, newState));
        return newState;
      });
    } catch (error) {
      console.error('Error al actualizar predicción:', error);
      // Mantener el estado anterior en caso de error
      return;
    }
  };

   const handleSliderChange = (value) => {
    updatePrediction('round', value);
   };


  const handleBetChange = (e) => {
    const amount = e.target.value;
    if (/^\d*$/.test(amount)) {
      const numericAmount = parseInt(amount, 10) || 0;
      const validAmount = Math.min(numericAmount, userBalance);
      const betValue = validAmount > 0 ? validAmount.toString() : '';
      setBetAmount(betValue);
      setPotentialWinnings(calculateWinnings(validAmount, predictions));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalBetAmount = parseInt(betAmount, 10) || 0;
    if (finalBetAmount <= 0) {
      alert(t('prediction.alert_invalid_bet')); return;
    }
    if (finalBetAmount > userBalance) {
      alert(t('prediction.alert_no_coins')); return;
    }

    console.log("Predicciones enviadas:", predictions);
    console.log("Monto Apostado:", finalBetAmount);
    console.log("Ganancia Potencial:", potentialWinnings);
    alert(t('prediction.alert_sent', { amount: finalBetAmount }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-2xl"
      >
        <Card className="bg-black/70 border border-gray-800 shadow-lg shadow-red-900/10 backdrop-blur-sm">
          <CardHeader className="text-center border-b border-gray-700 pb-4">
            <CardTitle className="text-2xl sm:text-3xl font-black uppercase text-red-500 tracking-wider">
              {t('prediction.title')}
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-gray-300 mt-1">
              {fightDetails.event}: {fightDetails.fighter1} vs. {fightDetails.fighter2}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-8">
            {/* Main Predictions */}
            <PredictionFighterOptions predictionKey="winner" value={predictions.winner} onChange={updatePrediction} fighters={fightDetails} label={t('prediction.who_wins')} icon={Award} iconColor="text-yellow-400" />
            <PredictionMethodRadio value={predictions.method} onChange={updatePrediction} />
            <PredictionRoundSlider value={predictions.round} onChange={handleSliderChange} maxRounds={fightDetails.rounds} />

            {/* Separator */}
            <hr className="border-gray-700" />

            {/* Additional Predictions */}
            <h3 className="text-xl font-semibold text-center text-gray-300 pt-2 mb-6">Predicciones Adicionales</h3>
            <div className="space-y-6">
              <PredictionFighterOptions predictionKey="firstStrike" value={predictions.firstStrike} onChange={updatePrediction} fighters={fightDetails} label={t('prediction.first_strike')} icon={Target} iconColor="text-blue-400" />
              <PredictionFighterOptions predictionKey="firstTakedown" value={predictions.firstTakedown} onChange={updatePrediction} fighters={fightDetails} label={t('prediction.first_takedown')} icon={ChevronsDown} iconColor="text-green-400" />
              <PredictionFighterOptions predictionKey="mostSignificantStrikes" value={predictions.mostSignificantStrikes} onChange={updatePrediction} fighters={fightDetails} label={t('prediction.most_significant_strikes')} icon={Users} iconColor="text-purple-400" />
            </div>

            {/* Separator */}
            <hr className="border-gray-700 mt-8" />

            {/* Bet Amount */}
            <PredictionBetAmount
              betAmount={betAmount}
              balance={userBalance}
              potentialWinnings={potentialWinnings}
              onBetChange={handleBetChange}
            />
          </CardContent>

          <CardFooter className="border-t border-gray-700 pt-6">
            <Button type="submit" onClick={handleSubmit} className="w-full bg-red-600 hover:bg-red-700 text-lg py-3 font-bold uppercase tracking-wider" disabled={!betAmount || parseInt(betAmount, 10) <= 0}>
              {t('prediction.send')}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default PredictionPage;
