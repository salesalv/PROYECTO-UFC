-- Migración para agregar estadísticas de peleadores
-- Ejecutar este SQL en Supabase para agregar las nuevas columnas y tabla

-- Agregar columnas adicionales a la tabla peleador existente
ALTER TABLE peleador 
ADD COLUMN IF NOT EXISTS imagen VARCHAR(255),
ADD COLUMN IF NOT EXISTS altura DECIMAL(4,2), -- en metros
ADD COLUMN IF NOT EXISTS peso DECIMAL(5,2), -- en kg
ADD COLUMN IF NOT EXISTS alcance DECIMAL(4,2), -- en metros
ADD COLUMN IF NOT EXISTS edad INTEGER,
ADD COLUMN IF NOT EXISTS nacionalidad VARCHAR(100),
ADD COLUMN IF NOT EXISTS estilo_lucha VARCHAR(100),
ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE,
ADD COLUMN IF NOT EXISTS ciudad VARCHAR(100),
ADD COLUMN IF NOT EXISTS estado VARCHAR(100);

-- Crear tabla para estadísticas detalladas de peleadores
CREATE TABLE IF NOT EXISTS peleador_estadisticas (
    id SERIAL PRIMARY KEY,
    peleador_id INTEGER REFERENCES peleador(id) ON DELETE CASCADE,
    
    -- Estadísticas de golpes
    golpes_por_minuto DECIMAL(4,2) DEFAULT 0,
    precision_golpes DECIMAL(5,2) DEFAULT 0, -- porcentaje
    golpes_recibidos_por_minuto DECIMAL(4,2) DEFAULT 0,
    precision_defensa DECIMAL(5,2) DEFAULT 0, -- porcentaje
    
    -- Estadísticas de takedowns
    takedowns_por_15_min DECIMAL(4,2) DEFAULT 0,
    precision_takedowns DECIMAL(5,2) DEFAULT 0, -- porcentaje
    defensa_takedowns DECIMAL(5,2) DEFAULT 0, -- porcentaje
    
    -- Estadísticas de sumisiones
    sumisiones_intentadas DECIMAL(4,2) DEFAULT 0,
    precision_sumisiones DECIMAL(5,2) DEFAULT 0, -- porcentaje
    
    -- Estadísticas de tiempo
    tiempo_promedio_pelea DECIMAL(4,2) DEFAULT 0, -- en minutos
    
    -- Estadísticas de KO/TKO
    kos_por_pelea DECIMAL(4,2) DEFAULT 0,
    
    -- Estadísticas de decisión
    decisiones_ganadas DECIMAL(4,2) DEFAULT 0,
    
    -- Metadatos
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fuente_datos VARCHAR(100) DEFAULT 'UFC Stats'
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_peleador_activo ON peleador(activo);
CREATE INDEX IF NOT EXISTS idx_peleador_division ON peleador(division_id);
CREATE INDEX IF NOT EXISTS idx_peleador_estadisticas_peleador ON peleador_estadisticas(peleador_id);

-- Insertar algunos peleadores de ejemplo con estadísticas
INSERT INTO division (nombre) VALUES 
('Peso Pesado'),
('Peso Semipesado'),
('Peso Medio'),
('Peso Wélter'),
('Peso Ligero'),
('Peso Pluma'),
('Peso Gallo'),
('Peso Mosca'),
('Peso Paja')
ON CONFLICT DO NOTHING;

-- Insertar peleadores de ejemplo (solo si no existen)
INSERT INTO peleador (nombre, record, puntos, estado, rango, division_id, imagen, altura, peso, alcance, edad, nacionalidad, estilo_lucha, activo, fecha_nacimiento, ciudad, estado) VALUES 
('Jon Jones', '27-1-0', 1000, 'Activo', 1, 1, 'https://images.unsplash.com/photo-1545191488-2682adc1dfe4', 1.93, 113.4, 2.15, 36, 'Estados Unidos', 'Jiu-Jitsu Brasileño, Kickboxing', true, '1987-07-19', 'Rochester', 'Nueva York'),
('Khabib Nurmagomedov', '29-0-0', 950, 'Retirado', 0, 5, 'https://images.unsplash.com/photo-1656968385791-eff0b664d0ba', 1.75, 70.3, 1.78, 35, 'Rusia', 'Sambo, Wrestling', false, '1988-09-20', 'Makhachkala', 'Daguestán'),
('Conor McGregor', '22-6-0', 800, 'Activo', 0, 5, 'https://images.unsplash.com/photo-1680022702604-292f21514497', 1.75, 70.3, 1.88, 35, 'Irlanda', 'Boxeo, Kickboxing', true, '1988-07-14', 'Dublín', 'Irlanda'),
('Israel Adesanya', '24-3-0', 900, 'Activo', 0, 3, 'https://images.unsplash.com/photo-1692264895705-27017e9cf1be', 1.93, 84.0, 2.03, 34, 'Nigeria', 'Kickboxing, Boxeo', true, '1989-07-22', 'Lagos', 'Nigeria')
ON CONFLICT DO NOTHING;

-- Insertar estadísticas de ejemplo para los peleadores
INSERT INTO peleador_estadisticas (peleador_id, golpes_por_minuto, precision_golpes, golpes_recibidos_por_minuto, precision_defensa, takedowns_por_15_min, precision_takedowns, defensa_takedowns, sumisiones_intentadas, precision_sumisiones, tiempo_promedio_pelea, kos_por_pelea, decisiones_ganadas) VALUES 
((SELECT id FROM peleador WHERE nombre = 'Jon Jones'), 12.5, 55.0, 2.1, 95.0, 2.8, 45.0, 85.0, 0.2, 25.0, 18.2, 0.8, 0.6),
((SELECT id FROM peleador WHERE nombre = 'Khabib Nurmagomedov'), 4.1, 48.0, 1.2, 65.0, 5.3, 75.0, 90.0, 0.1, 15.0, 14.5, 0.3, 0.7),
((SELECT id FROM peleador WHERE nombre = 'Conor McGregor'), 5.3, 50.0, 4.2, 55.0, 0.7, 20.0, 60.0, 0.0, 0.0, 8.1, 1.2, 0.3),
((SELECT id FROM peleador WHERE nombre = 'Israel Adesanya'), 3.9, 49.0, 2.8, 85.0, 0.0, 0.0, 70.0, 0.0, 0.0, 17.8, 0.4, 0.8)
ON CONFLICT DO NOTHING;
