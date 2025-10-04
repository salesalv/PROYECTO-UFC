-- Tabla para registrar recompensas de usuarios
CREATE TABLE IF NOT EXISTS recompensas_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
    recompensa_id VARCHAR(100) NOT NULL,
    fecha_canje TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    precio_pagado INTEGER NOT NULL,
    -- Índice único para evitar compras duplicadas
    UNIQUE(usuario_id, recompensa_id)
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_recompensas_usuario_id ON recompensas_usuario(usuario_id);
CREATE INDEX IF NOT EXISTS idx_recompensas_fecha ON recompensas_usuario(fecha_canje);
CREATE INDEX IF NOT EXISTS idx_recompensas_recompensa_id ON recompensas_usuario(recompensa_id);

-- Tabla para catálogo de recompensas (opcional, para manejo dinámico desde BD)
CREATE TABLE IF NOT EXISTS recompensas_catalogo (
    id VARCHAR(100) PRIMARY KEY,
    categoria VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio INTEGER NOT NULL,
    icono VARCHAR(10),
    rareza VARCHAR(20) DEFAULT 'comun',
    disponible BOOLEAN DEFAULT true,
    limitada BOOLEAN DEFAULT false,
    fecha_limite DATE,
    contenido JSONB, -- Para contenido dinámico
    beneficios JSONB -- Para beneficios especiales
);

-- Insertar recompensas del catálogo
INSERT INTO recompensas_catalogo (id, categoria, tipo, nombre, descripcion, precio, icono, rareza, disponible) VALUES
-- Insignias Básicas
('badge_bronce', 'insignias', 'badge', 'Insignia de Bronce', 'Insignia básica de bronce para tu perfil', 100, '🥉', 'comun', true),
('badge_plata', 'insignias', 'badge', 'Insignia de Plata', 'Insignia elegante de plata para tu perfil', 150, '🥈', 'comun', true),
('badge_oro', 'insignias', 'badge', 'Insignia de Oro', 'Insignia premium de oro para tu perfil', 250, '🥇', 'comun', true),
-- Insignias Especiales
('badge_cinturon', 'insignias', 'badge', 'Cinturón de Campeón', 'Insignia especial del cinturón de campeón', 500, '🏆', 'rara', true),
('badge_guantes', 'insignias', 'badge', 'Guantes de Guerrero', 'Insignia especial de guantes de pelea', 600, '🥊', 'rara', true),
('badge_fuego', 'insignias', 'badge', 'Llama del Combate', 'Insignia especial con efectos de fuego', 700, '🔥', 'rara', true),
('badge_aguila', 'insignias', 'badge', 'Águila Dominante', 'Insignia especial del águila dominante', 800, '🦅', 'rara', true),
-- Insignias Exclusivas
('badge_campeon_octubre_2026', 'insignias', 'badge', 'Campeón Octubre 2026', 'Insignia exclusiva de temporada - Campeón de Octubre 2026', 1000, '👑', 'legendaria', true),
-- Contenido Premium
('documental_exclusivo', 'contenido', 'documental', 'Documentales Exclusivos', 'Acceso completo a documentales exclusivos de peleadores', 700, '🎥', 'rara', true),
('clips_destacados', 'contenido', 'acceso', 'Clips Destacados Premium', 'Acceso ilimitado a clips destacados exclusivos', 300, '⭐', 'comun', true)
ON CONFLICT (id) DO NOTHING; -- Ignorar si ya existen

-- Agregar comentarios a las tablas
COMMENT ON TABLE recompensas_usuario IS 'Registro de recompensas canjeadas por usuarios';
COMMENT ON TABLE recompensas_catalogo IS 'Catálogo dinámico de recompensas disponibles';
COMMENT ON COLUMN recompensas_catalogo.contenido IS 'JSON con elementos incluidos en la recompensa';
COMMENT ON COLUMN recompensas_catalogo.beneficios IS<｜tool▁call▁begin｜>JSON con beneficios especiales de la recompensa';
