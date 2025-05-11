
import { useState } from 'react';

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

const calculateWinnings = (amount, currentPredictions) => {
  const selectedCount = Object.values(currentPredictions).filter(p => p !== null && !Array.isArray(p) && p !== '').length + (currentPredictions.round ? 1 : 0);
  if (selectedCount === 0 || !amount || amount <= 0) return 0;

  const avgOdds = Object.entries(predictionOdds)
    .filter(([key]) => currentPredictions[key] !== null && currentPredictions[key] !== undefined && currentPredictions[key] !== '')
    .reduce((sum, [, odd]) => sum + odd, 0) / selectedCount;

  return (amount * (avgOdds || 1)).toFixed(0);
};


export const usePredictionForm = () => {
  const [predictions, setPredictions] = useState({
    winner: null, method: null, round: [Math.ceil(fightDetails.rounds / 2)],
    firstStrike: null, firstTakedown: null, willBeKO: null, willBeSub: null,
    goToDecision: null, mostSignificantStrikes: null,
  });
  const [betAmount, setBetAmount] = useState('');
  const [potentialWinnings, setPotentialWinnings] = useState(0);

  const updatePrediction = (key, value) => {
    setPredictions(prev => {
      const newState = { ...prev, [key]: value };
      setPotentialWinnings(calculateWinnings(parseInt(betAmount, 10) || 0, newState));
      return newState;
    });
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
      alert("Por favor, ingresa un monto válido para apostar."); return;
    }
    if (finalBetAmount > userBalance) {
      alert("No tienes suficientes monedas para esta apuesta."); return;
    }

    console.log("Predicciones enviadas:", predictions);
    console.log("Monto Apostado:", finalBetAmount);
    console.log("Ganancia Potencial:", potentialWinnings);
    alert(`Predicciones enviadas con apuesta de ${finalBetAmount} monedas (ver consola)`);
  };

  return {
    predictions,
    betAmount,
    potentialWinnings,
    userBalance,
    fightDetails,
    updatePrediction,
    handleSliderChange,
    handleBetChange,
    handleSubmit,
  };
};
