
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
  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="pt-6 space-y-8">
        {/* Main Predictions */}
        <PredictionFighterOptions predictionKey="winner" value={predictions.winner} onChange={updatePrediction} fighters={fightDetails} label="¿Quién ganará la pelea?" icon={Award} iconColor="text-yellow-400" />
        <PredictionMethodSelect value={predictions.method} onChange={updatePrediction} />
        <PredictionRoundSlider value={predictions.round} onChange={handleSliderChange} maxRounds={fightDetails.rounds} />

        {/* Separator */}
        <hr className="border-gray-700" />

        {/* Additional Predictions */}
        <h3 className="text-xl font-semibold text-center text-gray-300 pt-2 mb-6">Predicciones Adicionales</h3>
        <div className="space-y-6">
          <PredictionFighterOptions predictionKey="firstStrike" value={predictions.firstStrike} onChange={updatePrediction} fighters={fightDetails} label="¿Primer golpe significativo?" icon={Target} iconColor="text-blue-400" />
          <PredictionFighterOptions predictionKey="firstTakedown" value={predictions.firstTakedown} onChange={updatePrediction} fighters={fightDetails} label="¿Primer derribo?" icon={ChevronsDown} iconColor="text-green-400" />

          <div className="space-y-4 rounded-md border border-gray-700 p-4 bg-gray-900/30">
              <PredictionYesNo predictionKey="willBeKO" value={predictions.willBeKO} onChange={updatePrediction} label="¿Habrá KO/TKO?" icon={XCircle} />
              <PredictionYesNo predictionKey="willBeSub" value={predictions.willBeSub} onChange={updatePrediction} label="¿Habrá Sumisión?" icon={CheckCircle} />
              <PredictionYesNo predictionKey="goToDecision" value={predictions.goToDecision} onChange={updatePrediction} label="¿Llegará a Decisión?" icon={CalendarCheck} />
          </div>

          <PredictionFighterOptions predictionKey="mostSignificantStrikes" value={predictions.mostSignificantStrikes} onChange={updatePrediction} fighters={fightDetails} label="¿Más golpes significativos?" icon={Users} iconColor="text-purple-400" />
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
          Enviar Predicción y Apuesta
        </Button>
      </CardFooter>
    </form>
  );
};

export default PredictionForm;
