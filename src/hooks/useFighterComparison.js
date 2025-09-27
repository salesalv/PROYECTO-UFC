import { useState, useEffect, useCallback } from 'react';
import { getAllFighters, compareFighters, getFightersByDivision, searchFighters } from '@/services/fighterService';

/**
 * Hook para manejar la lista de peleadores
 */
export function useFighters() {
  const [fighters, setFighters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFighters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllFighters();
      setFighters(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching fighters:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFighters();
  }, [fetchFighters]);

  return {
    fighters,
    loading,
    error,
    refetch: fetchFighters
  };
}

/**
 * Hook para manejar la comparación de peleadores
 */
export function useFighterComparison() {
  const [fighter1, setFighter1] = useState(null);
  const [fighter2, setFighter2] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const compareFightersData = useCallback(async (fighter1Id, fighter2Id) => {
    if (!fighter1Id || !fighter2Id) {
      setComparison(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await compareFighters(fighter1Id, fighter2Id);
      setComparison(result);
    } catch (err) {
      setError(err.message);
      console.error('Error comparing fighters:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectFighter1 = useCallback((fighter) => {
    setFighter1(fighter);
    if (fighter2) {
      compareFightersData(fighter.id, fighter2.id);
    }
  }, [fighter2, compareFightersData]);

  const selectFighter2 = useCallback((fighter) => {
    setFighter2(fighter);
    if (fighter1) {
      compareFightersData(fighter1.id, fighter.id);
    }
  }, [fighter1, compareFightersData]);

  const clearComparison = useCallback(() => {
    setFighter1(null);
    setFighter2(null);
    setComparison(null);
    setError(null);
  }, []);

  return {
    fighter1,
    fighter2,
    comparison,
    loading,
    error,
    selectFighter1,
    selectFighter2,
    clearComparison,
    compareFighters: compareFightersData
  };
}

/**
 * Hook para buscar peleadores
 */
export function useFighterSearch() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await searchFighters(searchTerm);
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
      console.error('Error searching fighters:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    loading,
    error,
    search,
    clearSearch
  };
}

/**
 * Hook para obtener peleadores por división
 */
export function useFightersByDivision(divisionId) {
  const [fighters, setFighters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFighters = useCallback(async () => {
    if (!divisionId) {
      setFighters([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getFightersByDivision(divisionId);
      setFighters(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching fighters by division:', err);
    } finally {
      setLoading(false);
    }
  }, [divisionId]);

  useEffect(() => {
    fetchFighters();
  }, [fetchFighters]);

  return {
    fighters,
    loading,
    error,
    refetch: fetchFighters
  };
}

/**
 * Hook para formatear estadísticas de peleadores para la comparación
 */
export function useFighterStatsFormat() {
  const formatStats = useCallback((fighter) => {
    if (!fighter?.estadisticas?.[0]) {
      return {
        strikesLanded: 0,
        accuracy: 0,
        takedowns: 0,
        defense: 0,
        avgFightTime: 0
      };
    }

    const stats = fighter.estadisticas[0];
    return {
      strikesLanded: stats.golpes_por_minuto || 0,
      accuracy: stats.precision_golpes || 0,
      takedowns: stats.takedowns_por_15_min || 0,
      defense: stats.precision_defensa || 0,
      avgFightTime: stats.tiempo_promedio_pelea || 0
    };
  }, []);

  const getStatComparison = useCallback((statKey, fighter1Stats, fighter2Stats, higherIsBetter = true) => {
    const val1 = fighter1Stats[statKey] || 0;
    const val2 = fighter2Stats[statKey] || 0;
    
    if (val1 === val2) return 'none';
    
    if (higherIsBetter) {
      return val1 > val2 ? 'better' : 'worse';
    } else {
      return val1 < val2 ? 'better' : 'worse';
    }
  }, []);

  return {
    formatStats,
    getStatComparison
  };
}
