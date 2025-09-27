import supabase from "@/db";

/**
 * Obtener todos los peleadores activos con sus estadísticas
 */
export async function getAllFighters() {
  const { data, error } = await supabase
    .from('peleador')
    .select(`
      *,
      estadisticas:peleador_estadisticas(*)
    `)
    .eq('activo', true)
    .order('nombre', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

/**
 * Obtener un peleador específico por ID con sus estadísticas
 */
export async function getFighterById(fighterId) {
  const { data, error } = await supabase
    .from('peleador')
    .select(`
      *,
      estadisticas:peleador_estadisticas(*)
    `)
    .eq('id', fighterId)
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Obtener peleadores por división
 */
export async function getFightersByDivision(divisionName) {
  const { data, error } = await supabase
    .from('peleador')
    .select(`
      *,
      estadisticas:peleador_estadisticas(*)
    `)
    .eq('division', divisionName)
    .eq('activo', true)
    .order('puntos', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

/**
 * Buscar peleadores por nombre
 */
export async function searchFighters(searchTerm) {
  const { data, error } = await supabase
    .from('peleador')
    .select(`
      *,
      estadisticas:peleador_estadisticas(*)
    `)
    .ilike('nombre', `%${searchTerm}%`)
    .eq('activo', true)
    .order('nombre', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

/**
 * Obtener todas las divisiones
 */
export async function getAllDivisions() {
  // Divisiones comunes de UFC
  const commonDivisions = [
    'Peso Paja',
    'Peso Mosca',
    'Peso Gallo',
    'Peso Pluma',
    'Peso Ligero',
    'Peso Wélter',
    'Peso Medio',
    'Peso Semipesado',
    'Peso Pesado',
    'Peso Paja Femenino',
    'Peso Mosca Femenino',
    'Peso Gallo Femenino',
    'Peso Pluma Femenino'
  ];

  // Obtener divisiones existentes en la base de datos
  const { data, error } = await supabase
    .from('peleador')
    .select('division')
    .not('division', 'is', null)
    .eq('activo', true);
  
  if (error) throw error;
  
  // Combinar divisiones comunes con las existentes
  const existingDivisions = data.map(fighter => fighter.division);
  const allDivisions = [...new Set([...commonDivisions, ...existingDivisions])];
  
  return allDivisions.map((division, index) => ({ id: index + 1, nombre: division }));
}

/**
 * Crear un nuevo peleador (solo para administradores)
 */
export async function createFighter(fighterData) {
  // Mapear 'estado' a 'status' para compatibilidad con la tabla
  const mappedData = {
    ...fighterData,
    status: fighterData.estado || fighterData.status
  };
  delete mappedData.estado; // Eliminar 'estado' si existe
  
  const { data, error } = await supabase
    .from('peleador')
    .insert([mappedData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Actualizar datos de un peleador (solo para administradores)
 */
export async function updateFighter(fighterId, fighterData) {
  // Mapear 'estado' a 'status' para compatibilidad con la tabla
  const mappedData = {
    ...fighterData,
    status: fighterData.estado || fighterData.status
  };
  delete mappedData.estado; // Eliminar 'estado' si existe
  
  const { data, error } = await supabase
    .from('peleador')
    .update(mappedData)
    .eq('id', fighterId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Crear o actualizar estadísticas de un peleador (solo para administradores)
 */
export async function upsertFighterStats(fighterId, statsData) {
  // Primero verificar si ya existen estadísticas
  const { data: existingStats } = await supabase
    .from('peleador_estadisticas')
    .select('id')
    .eq('peleador_id', fighterId)
    .single();

  if (existingStats) {
    // Actualizar estadísticas existentes
    const { data, error } = await supabase
      .from('peleador_estadisticas')
      .update({
        ...statsData,
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('peleador_id', fighterId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    // Crear nuevas estadísticas
    const { data, error } = await supabase
      .from('peleador_estadisticas')
      .insert([{
        peleador_id: fighterId,
        ...statsData
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

/**
 * Eliminar un peleador (solo para administradores)
 */
export async function deleteFighter(fighterId) {
  const { error } = await supabase
    .from('peleador')
    .delete()
    .eq('id', fighterId);
  
  if (error) throw error;
}

/**
 * Comparar estadísticas entre dos peleadores
 */
export async function compareFighters(fighter1Id, fighter2Id) {
  const [fighter1, fighter2] = await Promise.all([
    getFighterById(fighter1Id),
    getFighterById(fighter2Id)
  ]);

  if (!fighter1 || !fighter2) {
    throw new Error('Uno o ambos peleadores no fueron encontrados');
  }

  const stats1 = fighter1.estadisticas?.[0] || {};
  const stats2 = fighter2.estadisticas?.[0] || {};

  // Función para comparar estadísticas
  const compareStat = (statKey, higherIsBetter = true) => {
    const val1 = stats1[statKey] || 0;
    const val2 = stats2[statKey] || 0;
    
    if (val1 === val2) return 'tie';
    if (higherIsBetter) {
      return val1 > val2 ? 'fighter1' : 'fighter2';
    } else {
      return val1 < val2 ? 'fighter1' : 'fighter2';
    }
  };

  return {
    fighter1,
    fighter2,
    comparison: {
      golpes_por_minuto: compareStat('golpes_por_minuto'),
      precision_golpes: compareStat('precision_golpes'),
      precision_defensa: compareStat('precision_defensa'),
      takedowns_por_15_min: compareStat('takedowns_por_15_min'),
      precision_takedowns: compareStat('precision_takedowns'),
      defensa_takedowns: compareStat('defensa_takedowns'),
      tiempo_promedio_pelea: compareStat('tiempo_promedio_pelea', false), // Menor tiempo es mejor
      kos_por_pelea: compareStat('kos_por_pelea'),
      decisiones_ganadas: compareStat('decisiones_ganadas')
    }
  };
}

/**
 * Obtener peleadores más populares (por puntos o ranking)
 */
export async function getTopFighters(limit = 10) {
  const { data, error } = await supabase
    .from('peleador')
    .select(`
      *,
      division:division_id(nombre),
      estadisticas:peleador_estadisticas(*)
    `)
    .eq('activo', true)
    .order('puntos', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}
