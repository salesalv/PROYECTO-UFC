import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Save, X, Loader2 } from 'lucide-react';
import { useFighters } from '@/hooks/useFighterComparison';
import { createFighter, updateFighter, upsertFighterStats, deleteFighter, getAllDivisions } from '@/services/fighterService';

const FighterAdminPanel = () => {
  const { fighters, loading: fightersLoading, refetch: refetchFighters } = useFighters();
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingFighter, setEditingFighter] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    record: '',
    puntos: 0,
    status: 'Activo', // Usar 'status' en lugar de 'estado' para compatibilidad con la tabla
    // rango: 0, // Comentado porque la columna no existe en la tabla actual
    division: '', // Usar 'division' (varchar) en lugar de 'division_id'
    foto: '',
    altura: '',
    peso: '',
    alcance: '',
    edad: '',
    nacionalidad: '',
    estilo_lucha: '',
    activo: true,
    fecha_nacimiento: '',
    ciudad: '',
    estado: '',
    // Estadísticas
    golpes_por_minuto: 0,
    precision_golpes: 0,
    golpes_recibidos_por_minuto: 0,
    precision_defensa: 0,
    takedowns_por_15_min: 0,
    precision_takedowns: 0,
    defensa_takedowns: 0,
    sumisiones_intentadas: 0,
    precision_sumisiones: 0,
    tiempo_promedio_pelea: 0,
    kos_por_pelea: 0,
    decisiones_ganadas: 0
  });

  // Cargar divisiones al montar el componente
  useEffect(() => {
    const loadDivisions = async () => {
      try {
        const data = await getAllDivisions();
        setDivisions(data);
      } catch (err) {
        console.error('Error loading divisions:', err);
      }
    };
    loadDivisions();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      record: '',
      puntos: 0,
      estado: 'Activo',
      rango: 0,
      division: '',
      foto: '',
      altura: '',
      peso: '',
      alcance: '',
      edad: '',
      nacionalidad: '',
      estilo_lucha: '',
      activo: true,
      fecha_nacimiento: '',
      ciudad: '',
      estado: '',
      golpes_por_minuto: 0,
      precision_golpes: 0,
      golpes_recibidos_por_minuto: 0,
      precision_defensa: 0,
      takedowns_por_15_min: 0,
      precision_takedowns: 0,
      defensa_takedowns: 0,
      sumisiones_intentadas: 0,
      precision_sumisiones: 0,
      tiempo_promedio_pelea: 0,
      kos_por_pelea: 0,
      decisiones_ganadas: 0
    });
    setEditingFighter(null);
    setShowAddForm(false);
  };

  const handleEdit = (fighter) => {
    setEditingFighter(fighter);
    setFormData({
      nombre: fighter.nombre || '',
      record: fighter.record || '',
      puntos: fighter.puntos || 0,
      status: fighter.status || 'Activo', // Usar 'status' en lugar de 'estado'
      // rango: fighter.rango || 0, // Comentado porque la columna no existe
      division: fighter.division || '', // Usar 'division' (varchar) en lugar de 'division_id'
      foto: fighter.foto || '',
      altura: fighter.altura || '',
      peso: fighter.peso || '',
      alcance: fighter.alcance || '',
      edad: fighter.edad || '',
      nacionalidad: fighter.nacionalidad || '',
      estilo_lucha: fighter.estilo_lucha || '',
      activo: fighter.activo !== undefined ? fighter.activo : true,
      fecha_nacimiento: fighter.fecha_nacimiento || '',
      ciudad: fighter.ciudad || '',
      estado: fighter.estado || '',
      golpes_por_minuto: fighter.estadisticas?.[0]?.golpes_por_minuto || 0,
      precision_golpes: fighter.estadisticas?.[0]?.precision_golpes || 0,
      golpes_recibidos_por_minuto: fighter.estadisticas?.[0]?.golpes_recibidos_por_minuto || 0,
      precision_defensa: fighter.estadisticas?.[0]?.precision_defensa || 0,
      takedowns_por_15_min: fighter.estadisticas?.[0]?.takedowns_por_15_min || 0,
      precision_takedowns: fighter.estadisticas?.[0]?.precision_takedowns || 0,
      defensa_takedowns: fighter.estadisticas?.[0]?.defensa_takedowns || 0,
      sumisiones_intentadas: fighter.estadisticas?.[0]?.sumisiones_intentadas || 0,
      precision_sumisiones: fighter.estadisticas?.[0]?.precision_sumisiones || 0,
      tiempo_promedio_pelea: fighter.estadisticas?.[0]?.tiempo_promedio_pelea || 0,
      kos_por_pelea: fighter.estadisticas?.[0]?.kos_por_pelea || 0,
      decisiones_ganadas: fighter.estadisticas?.[0]?.decisiones_ganadas || 0
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Separar datos del peleador de las estadísticas
      const fighterData = {
        nombre: formData.nombre,
        record: formData.record,
        puntos: parseInt(formData.puntos),
        status: formData.status, // Usar 'status' en lugar de 'estado'
        // rango: parseInt(formData.rango), // Comentado porque la columna no existe
        division: formData.division, // Usar 'division' (varchar) en lugar de 'division_id'
        foto: formData.foto,
        altura: parseFloat(formData.altura) || null,
        peso: parseFloat(formData.peso) || null,
        alcance: parseFloat(formData.alcance) || null,
        edad: parseInt(formData.edad) || null,
        nacionalidad: formData.nacionalidad,
        estilo_lucha: formData.estilo_lucha,
        activo: formData.activo,
        fecha_nacimiento: formData.fecha_nacimiento || null,
        ciudad: formData.ciudad,
        estado: formData.estado
      };

      const statsData = {
        golpes_por_minuto: parseFloat(formData.golpes_por_minuto) || 0,
        precision_golpes: parseFloat(formData.precision_golpes) || 0,
        golpes_recibidos_por_minuto: parseFloat(formData.golpes_recibidos_por_minuto) || 0,
        precision_defensa: parseFloat(formData.precision_defensa) || 0,
        takedowns_por_15_min: parseFloat(formData.takedowns_por_15_min) || 0,
        precision_takedowns: parseFloat(formData.precision_takedowns) || 0,
        defensa_takedowns: parseFloat(formData.defensa_takedowns) || 0,
        sumisiones_intentadas: parseFloat(formData.sumisiones_intentadas) || 0,
        precision_sumisiones: parseFloat(formData.precision_sumisiones) || 0,
        tiempo_promedio_pelea: parseFloat(formData.tiempo_promedio_pelea) || 0,
        kos_por_pelea: parseFloat(formData.kos_por_pelea) || 0,
        decisiones_ganadas: parseFloat(formData.decisiones_ganadas) || 0
      };

      if (editingFighter) {
        // Actualizar peleador existente
        await updateFighter(editingFighter.id, fighterData);
        await upsertFighterStats(editingFighter.id, statsData);
        setSuccess('Peleador actualizado correctamente');
      } else {
        // Crear nuevo peleador
        const newFighter = await createFighter(fighterData);
        await upsertFighterStats(newFighter.id, statsData);
        setSuccess('Peleador creado correctamente');
      }

      await refetchFighters();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fighterId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este peleador?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteFighter(fighterId);
      setSuccess('Peleador eliminado correctamente');
      await refetchFighters();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-6xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-red-500 tracking-wider">
            Administrar Peleadores
          </h1>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Peleador
          </Button>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-lg">
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {/* Formulario de agregar/editar */}
        {(showAddForm || editingFighter) && (
          <Card className="mb-8 bg-black/70 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex justify-between items-center">
                {editingFighter ? 'Editar Peleador' : 'Agregar Nuevo Peleador'}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="record">Record</Label>
                  <Input
                    id="record"
                    value={formData.record}
                    onChange={(e) => handleInputChange('record', e.target.value)}
                    placeholder="ej: 25-5-0"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="division">División</Label>
                  <Select
                    value={formData.division}
                    onValueChange={(value) => handleInputChange('division', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Seleccionar división" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-gray-700 text-white">
                      {divisions.map((division) => (
                        <SelectItem key={division.id} value={division.nombre}>
                          {division.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="foto">URL de Foto</Label>
                  <Input
                    id="foto"
                    value={formData.foto}
                    onChange={(e) => handleInputChange('foto', e.target.value)}
                    placeholder="https://ejemplo.com/foto.jpg"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              {/* Estadísticas */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-400">Estadísticas de Combate</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="golpes_por_minuto">Golpes por Minuto</Label>
                    <Input
                      id="golpes_por_minuto"
                      type="number"
                      step="0.1"
                      value={formData.golpes_por_minuto}
                      onChange={(e) => handleInputChange('golpes_por_minuto', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="precision_golpes">Precisión de Golpes (%)</Label>
                    <Input
                      id="precision_golpes"
                      type="number"
                      step="0.1"
                      value={formData.precision_golpes}
                      onChange={(e) => handleInputChange('precision_golpes', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="precision_defensa">Precisión de Defensa (%)</Label>
                    <Input
                      id="precision_defensa"
                      type="number"
                      step="0.1"
                      value={formData.precision_defensa}
                      onChange={(e) => handleInputChange('precision_defensa', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="takedowns_por_15_min">Takedowns por 15 min</Label>
                    <Input
                      id="takedowns_por_15_min"
                      type="number"
                      step="0.1"
                      value={formData.takedowns_por_15_min}
                      onChange={(e) => handleInputChange('takedowns_por_15_min', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tiempo_promedio_pelea">Tiempo Promedio de Pelea (min)</Label>
                    <Input
                      id="tiempo_promedio_pelea"
                      type="number"
                      step="0.1"
                      value={formData.tiempo_promedio_pelea}
                      onChange={(e) => handleInputChange('tiempo_promedio_pelea', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {editingFighter ? 'Actualizar' : 'Crear'}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de peleadores */}
        {fightersLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            <span className="ml-2 text-gray-400">Cargando peleadores...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fighters.map((fighter) => (
              <Card key={fighter.id} className="bg-black/70 border border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">{fighter.nombre}</CardTitle>
                      <p className="text-sm text-gray-400">{fighter.division}</p>
                      <p className="text-sm text-gray-300">Record: {fighter.record}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(fighter)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(fighter.id)}
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {fighter.foto && (
                    <img
                      src={fighter.foto}
                      alt={fighter.nombre}
                      className="w-full h-32 object-cover rounded mb-4"
                    />
                  )}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Golpes/min:</span>
                      <span className="text-sm text-white">
                        {fighter.estadisticas?.[0]?.golpes_por_minuto?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Precisión:</span>
                      <span className="text-sm text-white">
                        {fighter.estadisticas?.[0]?.precision_golpes?.toFixed(1) || '0.0'}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Defensa:</span>
                      <span className="text-sm text-white">
                        {fighter.estadisticas?.[0]?.precision_defensa?.toFixed(1) || '0.0'}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant={fighter.activo ? "default" : "secondary"}>
                      {fighter.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FighterAdminPanel;
