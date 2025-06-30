import React from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Target, ChevronsDown, CheckCircle, XCircle, CalendarCheck, Users } from "lucide-react";
import {
  PredictionFighterOptions,
  PredictionMethodSelect,
  PredictionRoundSlider,
  PredictionYesNo,
  PredictionBetAmount
} from "@/components/predictions/PredictionFormComponents"; // Reverted to alias path
import { useTranslation } from 'react-i18next';

const PredictionForm = ({
  predictions,
  betAmount,
  potentialWinnings,
  userBalance,
  fightDetails,
  updatePrediction,
  handleSliderChange,
  handleBetChange,
  handleSubmit,
}) => {
  const { t } = useTranslation();
  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="pt-6 space-y-8">
        {/* Main Predictions */}
        <PredictionFighterOptions predictionKey="winner" value={predictions.winner} onChange={updatePrediction} fighters={fightDetails} label={t('prediction.who_wins')} icon={Award} iconColor="text-yellow-400" />
        <PredictionMethodSelect value={predictions.method} onChange={updatePrediction} />
        <PredictionRoundSlider value={predictions.round} onChange={handleSliderChange} maxRounds={fightDetails.rounds} />

        {/* Separator */}
        <hr className="border-gray-700" />

        {/* Additional Predictions */}
        <h3 className="text-xl font-semibold text-center text-gray-300 pt-2 mb-6">{t('prediction.additional_predictions')}</h3>
        <div className="space-y-6">
          <PredictionFighterOptions predictionKey="firstStrike" value={predictions.firstStrike} onChange={updatePrediction} fighters={fightDetails} label={t('prediction.first_strike')} icon={Target} iconColor="text-blue-400" />
          <PredictionFighterOptions predictionKey="firstTakedown" value={predictions.firstTakedown} onChange={updatePrediction} fighters={fightDetails} label={t('prediction.first_takedown')} icon={ChevronsDown} iconColor="text-green-400" />

          <div className="space-y-4 rounded-md border border-gray-700 p-4 bg-gray-900/30">
              <PredictionYesNo predictionKey="willBeKO" value={predictions.willBeKO} onChange={updatePrediction} label={t('prediction.will_be_ko')} icon={XCircle} />
              <PredictionYesNo predictionKey="willBeSub" value={predictions.willBeSub} onChange={updatePrediction} label={t('prediction.will_be_sub')} icon={CheckCircle} />
              <PredictionYesNo predictionKey="goToDecision" value={predictions.goToDecision} onChange={updatePrediction} label={t('prediction.go_to_decision')} icon={CalendarCheck} />
          </div>

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
        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-lg py-3 font-bold uppercase tracking-wider" disabled={!betAmount || parseInt(betAmount, 10) <= 0}>
          {t('prediction.send')}
        </Button>
      </CardFooter>
    </form>
  );
};

export default PredictionForm;
