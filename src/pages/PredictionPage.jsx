import React, { useState, useEffect } from "react";
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
import supabase from "@/db";
import { useUser } from "@/context/UserContext";
import { gastarMonedas, agregarMonedas } from "@/services/coinService";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Datos dinámicos - se cargarán desde la base de datos
const defaultFightDetails = {
  id: 1,
  fighter1: "Conor McGregor",
  fighter2: "Michael Chandler",
  event: "UFC 302: McGregor vs. Chandler",
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
  const { user, refreshUser } = useUser();
  const [fightDetails, setFightDetails] = useState(defaultFightDetails);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [predictions, setPredictions] = useState({
    winner: undefined,
    method: undefined,
    round: [Math.ceil(defaultFightDetails.rounds / 2)],
    firstStrike: undefined,
    firstTakedown: undefined,
    willBeKO: undefined,
    willBeSub: undefined,
    goToDecision: undefined,
    mostSignificantStrikes: undefined,
  });
  const [betAmount, setBetAmount] = useState('');
  const [potentialWinnings, setPotentialWinnings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userPredictions, setUserPredictions] = useState([]);
  const [eventPrediction, setEventPrediction] = useState(null); // NUEVO: predicción para este evento

  // Estado para marcar si la apuesta fue finalizada
  const [apuestaFinalizada, setApuestaFinalizada] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  // Cargar datos del evento
  useEffect(() => {
    const loadEventData = async () => {
      try {
        setLoadingEvent(true);
        const events = await getAllEvents();
        const currentEvent = events[0]; // Usar el primer evento por defecto
        
        if (currentEvent) {
          const fighters = currentEvent.pelea_principal_participantes?.split(' vs ') || ['TBD', 'TBD'];
          setFightDetails({
            id: currentEvent.id,
            fighter1: fighters[0]?.trim() || 'TBD',
            fighter2: fighters[1]?.trim() || 'TBD',
            event: currentEvent.titulo,
            rounds: 5, // Por defecto 5 rounds para peleas principales
          });
        }
      } catch (err) {
        console.error('Error loading event data:', err);
      } finally {
        setLoadingEvent(false);
      }
    };

    loadEventData();
  }, []);
  // Estado para bloquear el formulario si la apuesta ya fue pagada para el evento actual
  const [apuestaPagada, setApuestaPagada] = useState(false);

  // Estado para mostrar el modal de resultado solo una vez
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultType, setResultType] = useState(""); // "success" o "fail"
  const [ultimaApuestaPagada, setUltimaApuestaPagada] = useState(() => {
    // Persistencia en localStorage para evitar mostrar el modal varias veces
    return localStorage.getItem('ultimaApuestaPagada') || null;
  });

  // Sincroniza el saldo local con el usuario
  useEffect(() => {
    setBetAmount('');
    setPotentialWinnings(0);
  }, [user]);

  // Buscar predicción del usuario para este evento
  useEffect(() => {
    const fetchUserPredictions = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('predicciones')
        .select('*')
        .eq('user_id', user.auth.id)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setUserPredictions(data);
        // Buscar predicción para este evento
        const eventoActual = `${fightDetails.event}: ${fightDetails.fighter1} vs. ${fightDetails.fighter2}`;
        const pred = data.find(p => p.evento === eventoActual);
        setEventPrediction(pred || null);
      }
    };
    fetchUserPredictions();
  }, [user, loading]);

  // Al inicio:
  useEffect(() => {
    // Cuando se actualizan las predicciones del usuario, verifica si hay alguna ganadora no pagada
    const pagarApuestasGanadoras = async () => {
      if (!userPredictions || !user) return;
      for (const pred of userPredictions) {
        // Si ya está pagada, no hacer nada
        if (pred.pagada) {
          // Si la apuesta pagada es del evento actual, bloquear el formulario
          if (pred.evento === `${fightDetails.event}: ${fightDetails.fighter1} vs. ${fightDetails.fighter2}`) {
            setApuestaPagada(true);
          }
          continue;
        }
        // Si no hay resultados, no hacer nada
        if (!pred.resultados_prediccion) continue;
        // Si alguna predicción no es true, no pagar
        const resultados = Object.values(pred.resultados_prediccion);
        if (resultados.length === 0) continue;
        const todasAcertadas = resultados.every(r => r === true);
        try {
          if (todasAcertadas) {
            // Solo paga si no está pagada y no se pagó antes
            if (ultimaApuestaPagada !== String(pred.id)) {
              await agregarMonedas(user.id, pred.ganancia_potencial, "ganancia_apuesta");
              await supabase.from('predicciones').update({ pagada: true }).eq('id', pred.id);
              await refreshUser();
              setResultMessage(`¡Felicidades! Acertaste TODAS las predicciones y ganaste ${pred.ganancia_potencial} monedas.`);
              setResultType("success");
              setShowResultModal(true);
              setUltimaApuestaPagada(String(pred.id));
              localStorage.setItem('ultimaApuestaPagada', String(pred.id));
            }
            if (pred.evento === `${fightDetails.event}: ${fightDetails.fighter1} vs. ${fightDetails.fighter2}`) {
              setApuestaPagada(true);
            }
          } else {
            if (ultimaApuestaPagada !== String(pred.id)) {
              await supabase.from('predicciones').update({ pagada: true }).eq('id', pred.id);
              setResultMessage("No acertaste todas las predicciones. ¡Suerte para la próxima!");
              setResultType("fail");
              setShowResultModal(true);
              setUltimaApuestaPagada(String(pred.id));
              localStorage.setItem('ultimaApuestaPagada', String(pred.id));
            }
            if (pred.evento === `${fightDetails.event}: ${fightDetails.fighter1} vs. ${fightDetails.fighter2}`) {
              setApuestaPagada(true);
            }
          }
        } catch (err) {
          console.error('Error al pagar apuesta:', err);
        }
      }
    };
    pagarApuestasGanadoras();
    // eslint-disable-next-line
  }, [userPredictions, user]);

  // Determina la cuota principal según la predicción principal seleccionada
  const getMainPredictionType = () => {
    if (predictions.winner) return 'winner';
    if (predictions.method) return 'method';
    if (predictions.round) return 'round';
    return 'winner';
  };

  const calculateWinnings = (amount, currentPredictions) => {
    const mainType = getMainPredictionType();
    const odds = predictionOdds[mainType] || 1;
    if (!amount || amount <= 0) return 0;
    return Math.floor(amount * odds);
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
      const validAmount = Math.min(numericAmount, user?.saldo ?? 0);
      const betValue = validAmount > 0 ? validAmount.toString() : '';
      setBetAmount(betValue);
      setPotentialWinnings(calculateWinnings(validAmount, predictions));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (eventPrediction) {
      alert('Ya tienes una apuesta para este evento. Elimínala si quieres cambiarla.');
      return;
    }
    const finalBetAmount = parseInt(betAmount, 10) || 0;
    if (finalBetAmount <= 0) {
      alert(t('prediction.alert_invalid_bet'));
      return;
    }
    if (finalBetAmount > (user?.saldo ?? 0)) {
      alert(t('prediction.alert_no_coins'));
      return;
    }
    if (!user) {
      alert('Debes iniciar sesión para apostar.');
      return;
    }
    setLoading(true);
    try {
      await gastarMonedas(user.id, finalBetAmount, "apuesta");
      const mainType = getMainPredictionType();
      const odds = predictionOdds[mainType] || 1;
      const gananciaPotencial = calculateWinnings(finalBetAmount, predictions);
      const prediccionData = {
        winner: predictions.winner,
        method: predictions.method,
        round: predictions.round,
        firstStrike: predictions.firstStrike,
        firstTakedown: predictions.firstTakedown,
        mostSignificantStrikes: predictions.mostSignificantStrikes,
      };
      const { error } = await supabase.from('predicciones').insert([
        {
          user_id: user.auth.id,
          evento: `${fightDetails.event}: ${fightDetails.fighter1} vs. ${fightDetails.fighter2}`,
          prediccion: prediccionData,
          monto_apuesta: finalBetAmount,
          cuota: odds,
          ganancia_potencial: gananciaPotencial,
          pagada: false // <-- importante
        }
      ]);
      if (error) {
        alert('Error al guardar la predicción: ' + error.message);
        setLoading(false);
        return;
      }
      await refreshUser(); // Refresca el usuario y el saldo
      setBetAmount('');
      setPotentialWinnings(0);
    } catch (err) {
      alert('Error al apostar: ' + err.message);
    }
    setLoading(false);
  };

  // Elimina la función handleDeletePrediction anterior y reemplázala por una versión que reciba el id de la predicción
  const handleDeletePrediction = async (prediccionId, montoApuesta) => {
    setLoading(true);
    try {
      // Devolver monedas apostadas
      await agregarMonedas(user.id, montoApuesta, "cancelacion_apuesta");
      const { error } = await supabase
        .from('predicciones')
        .delete()
        .eq('id', prediccionId);
      setLoading(false);
      if (error) {
        alert('Error al borrar la apuesta: ' + error.message);
        return;
      }
      await refreshUser();
      setEventPrediction(null);
      setBetAmount('');
      setPotentialWinnings(0);
      setApuestaFinalizada(false);
      setApuestaPagada(false); // Desbloquear si se elimina la apuesta anterior
    } catch (err) {
      setLoading(false);
      alert('Error al cancelar la apuesta: ' + err.message);
    }
  };

  // Simulación: función para determinar si la apuesta fue acertada
  const esApuestaGanada = () => {
    // Aquí deberías poner la lógica real de validación
    // Por ahora, simula que siempre se acierta si el método es 'Submission'
    return eventPrediction?.prediccion?.method === 'Submission';
  };

  const handleConfirmarApuesta = async () => {
    if (!eventPrediction || apuestaFinalizada) return;
    setConfirmando(true);
    try {
      if (esApuestaGanada()) {
        await agregarMonedas(user.id, eventPrediction.ganancia_potencial, "ganancia_apuesta");
        alert('¡Apuesta acertada! Ganaste ' + eventPrediction.ganancia_potencial + ' monedas.');
      } else {
        alert('No acertaste la apuesta. ¡Suerte para la próxima!');
      }
      setApuestaFinalizada(true);
      await refreshUser();
    } catch (err) {
      alert('Error al confirmar apuesta: ' + err.message);
    }
    setConfirmando(false);
  };

  // Icono de resultado individual
  const ResultIcon = ({ value }) => {
    if (value === true) return <CheckCircle className="inline w-5 h-5 text-green-500 ml-1" title="¡Acertaste!" />;
    if (value === false) return <XCircle className="inline w-5 h-5 text-red-500 ml-1" title="No acertaste" />;
    return <span className="inline text-gray-400 text-xs ml-1">Pendiente</span>;
  };

  if (loadingEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-500 mr-4" />
            <span className="text-gray-400">Cargando datos del evento...</span>
          </div>
        </div>
      </div>
    );
  }

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
            {apuestaPagada ? (
              <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-800 mb-2 text-center">
                <div className="text-lg font-bold text-yellow-400 mb-2">Ya participaste en este evento</div>
                <div className="text-gray-300 mb-2">No puedes realizar otra apuesta para este evento.</div>
                {/* Mostrar la apuesta anterior */}
                {eventPrediction && (
                  <div>
                    <div className="font-semibold text-white mb-1">{eventPrediction.evento}</div>
                    <div className="text-gray-400 text-sm mb-1">Apuesta: <span className="text-yellow-400 font-bold">{eventPrediction.monto_apuesta}</span> | Ganancia: <span className="text-green-400 font-bold">{eventPrediction.ganancia_potencial}</span></div>
                    <div className="text-gray-500 text-xs mb-2">{new Date(eventPrediction.created_at).toLocaleString()}</div>
                    <div className="flex flex-wrap gap-3 items-center text-sm mb-4">
                      {eventPrediction.prediccion?.winner && (
                        <span className="flex items-center"><span className="text-white">Ganador:</span> <span className="ml-1 font-bold text-white">{eventPrediction.prediccion.winner}</span></span>
                      )}
                      {eventPrediction.prediccion?.method && (
                        <span className="flex items-center"><span className="text-white">Método:</span> <span className="ml-1 font-bold text-white">{eventPrediction.prediccion.method}</span></span>
                      )}
                      {eventPrediction.prediccion?.round && (
                        <span className="flex items-center"><span className="text-white">Round:</span> <span className="ml-1 font-bold text-white">{Array.isArray(eventPrediction.prediccion.round) ? eventPrediction.prediccion.round[0] : eventPrediction.prediccion.round}</span></span>
                      )}
                      {eventPrediction.prediccion?.firstStrike && (
                        <span className="flex items-center"><span className="text-white">1er Golpe:</span> <span className="ml-1 font-bold text-white">{eventPrediction.prediccion.firstStrike}</span></span>
                      )}
                      {eventPrediction.prediccion?.firstTakedown && (
                        <span className="flex items-center"><span className="text-white">1er Derribo:</span> <span className="ml-1 font-bold text-white">{eventPrediction.prediccion.firstTakedown}</span></span>
                      )}
                      {eventPrediction.prediccion?.mostSignificantStrikes && (
                        <span className="flex items-center"><span className="text-white">Más Golpes:</span> <span className="ml-1 font-bold text-white">{eventPrediction.prediccion.mostSignificantStrikes}</span></span>
                      )}
                    </div>
                    {/* Botón de cancelar apuesta solo si la apuesta NO está pagada */}
                    {eventPrediction && eventPrediction.pagada !== true && !eventPrediction.resultados_prediccion && (
                      <Button onClick={() => handleDeletePrediction(eventPrediction.id, eventPrediction.monto_apuesta)} className="bg-red-700 hover:bg-red-800 w-full" disabled={loading}>
                        {loading ? 'Eliminando...' : 'Cancelar apuesta'}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Main Predictions */}
                <PredictionFighterOptions predictionKey="winner" value={predictions.winner} onChange={updatePrediction} fighters={fightDetails} label={t('prediction.who_wins')} icon={Award} iconColor="text-yellow-400" />
                <PredictionMethodRadio value={predictions.method} onChange={updatePrediction} />
                <PredictionRoundSlider value={predictions.round} onChange={handleSliderChange} maxRounds={fightDetails.rounds} />
                <hr className="border-gray-700" />
                <h3 className="text-xl font-semibold text-center text-gray-300 pt-2 mb-6">Predicciones Adicionales</h3>
                <div className="space-y-6">
                  <PredictionFighterOptions predictionKey="firstStrike" value={predictions.firstStrike} onChange={updatePrediction} fighters={fightDetails} label={t('prediction.first_strike')} icon={Target} iconColor="text-blue-400" />
                  <PredictionFighterOptions predictionKey="firstTakedown" value={predictions.firstTakedown} onChange={updatePrediction} fighters={fightDetails} label={t('prediction.first_takedown')} icon={ChevronsDown} iconColor="text-green-400" />
                  <PredictionFighterOptions predictionKey="mostSignificantStrikes" value={predictions.mostSignificantStrikes} onChange={updatePrediction} fighters={fightDetails} label={t('prediction.most_significant_strikes')} icon={Users} iconColor="text-purple-400" />
                </div>
                <hr className="border-gray-700 mt-8" />
                <PredictionBetAmount
                  betAmount={betAmount}
                  balance={user?.saldo ?? 0}
                  potentialWinnings={potentialWinnings}
                  onBetChange={handleBetChange}
                />
                <CardFooter className="border-t border-gray-700 pt-6">
                  <Button type="submit" onClick={handleSubmit} className="w-full bg-red-600 hover:bg-red-700 text-lg py-3 font-bold uppercase tracking-wider" disabled={!betAmount || parseInt(betAmount, 10) <= 0 || loading}>
                    {loading ? t('prediction.sending') || 'Enviando...' : t('prediction.send')}
                  </Button>
                </CardFooter>
              </>
            )}
          </CardContent>

          {/* Historial de predicciones */}
          {userPredictions.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-bold text-gray-200 mb-4">Historial de Predicciones</h3>
              <div className="space-y-4">
                {userPredictions.map(pred => (
                  <div key={pred.id} className="bg-gray-900/60 rounded-lg p-4 border border-gray-800 mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="font-semibold text-white mb-1">{pred.evento}</div>
                      <div className="text-gray-400 text-sm mb-1">Apuesta: <span className="text-yellow-400 font-bold">{pred.monto_apuesta}</span> | Ganancia: <span className="text-green-400 font-bold">{pred.ganancia_potencial}</span></div>
                      <div className="text-gray-500 text-xs mb-2">{new Date(pred.created_at).toLocaleString()}</div>
                      <div className="flex flex-wrap gap-3 items-center text-sm">
                        {/* Mostrar cada predicción y su resultado */}
                        {pred.prediccion?.winner && (
                          <span className="flex items-center"><span className="text-white">Ganador:</span> <span className="ml-1 font-bold text-white">{pred.prediccion.winner}</span> <ResultIcon value={pred.resultados_prediccion?.winner} /></span>
                        )}
                        {pred.prediccion?.method && (
                          <span className="flex items-center"><span className="text-white">Método:</span> <span className="ml-1 font-bold text-white">{pred.prediccion.method}</span> <ResultIcon value={pred.resultados_prediccion?.method} /></span>
                        )}
                        {pred.prediccion?.round && (
                          <span className="flex items-center"><span className="text-white">Round:</span> <span className="ml-1 font-bold text-white">{Array.isArray(pred.prediccion.round) ? pred.prediccion.round[0] : pred.prediccion.round}</span> <ResultIcon value={pred.resultados_prediccion?.round} /></span>
                        )}
                        {pred.prediccion?.firstStrike && (
                          <span className="flex items-center"><span className="text-white">1er Golpe:</span> <span className="ml-1 font-bold text-white">{pred.prediccion.firstStrike}</span> <ResultIcon value={pred.resultados_prediccion?.firstStrike} /></span>
                        )}
                        {pred.prediccion?.firstTakedown && (
                          <span className="flex items-center"><span className="text-white">1er Derribo:</span> <span className="ml-1 font-bold text-white">{pred.prediccion.firstTakedown}</span> <ResultIcon value={pred.resultados_prediccion?.firstTakedown} /></span>
                        )}
                        {pred.prediccion?.mostSignificantStrikes && (
                          <span className="flex items-center"><span className="text-white">Más Golpes:</span> <span className="ml-1 font-bold text-white">{pred.prediccion.mostSignificantStrikes}</span> <ResultIcon value={pred.resultados_prediccion?.mostSignificantStrikes} /></span>
                        )}
                      </div>
                    </div>
                    {/* Botón de cancelar apuesta solo si la apuesta NO está pagada y no tiene resultados */}
                    {pred.pagada !== true && !pred.resultados_prediccion && (
                      <Button onClick={() => handleDeletePrediction(pred.id, pred.monto_apuesta)} className="bg-red-700 hover:bg-red-800 w-full sm:w-auto mt-4 sm:mt-0">
                        {loading ? 'Eliminando...' : 'Cancelar apuesta'}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Modal de resultado de apuesta */}
      <Dialog open={showResultModal} onOpenChange={(open) => {
        setShowResultModal(open);
        if (!open) {
          // Al cerrar, limpia el control para evitar que se repita en la misma sesión
          // (pero no borra localStorage, así no se repite en recarga)
        }
      }}>
        <DialogContent className="max-w-md mx-auto text-center bg-black border border-gray-700">
          <DialogTitle className={resultType === "success" ? "text-green-400" : "text-red-400"}>
            {resultType === "success" ? "¡Apuesta Ganada!" : "Apuesta No Acertada"}
          </DialogTitle>
          <DialogDescription className="text-lg mt-2 mb-4 text-white">
            {resultMessage}
          </DialogDescription>
          <Button onClick={() => setShowResultModal(false)} className="mt-2 w-full bg-red-700 hover:bg-red-800">
            Cerrar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PredictionPage;
