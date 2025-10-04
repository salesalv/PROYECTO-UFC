-- Tabla para el catálogo de recompensas/insignias
CREATE TABLE IF NOT EXISTS recompensas_catalogo (
    id VARCHAR(100) PRIMARY KEY,
    categoria VARCHAR(50) NOT NULL, -- 'insignias', 'contenido'
    tipo VARCHAR(50) NOT NULL, -- 'badge', 'documental', 'acceso'
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    icono VARCHAR(10), -- Emoji o código de icono
    rareza VARCHAR(20) DEFAULT 'comun', -- 'comun', 'rara', 'legendaria'
    disponible BOOLEAN DEFAULT TRUE,
    limitada BOOLEAN DEFAULT FALSE,
    fecha_limite DATE NULL,
    contenido JSONB NULL, -- Para contenido específico como documentales
    beneficios JSONB NULL, -- Para beneficios específicos
    orden INTEGER DEFAULT 0,
    creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para las recompensas compradas por los usuarios
CREATE TABLE IF NOT EXISTS recompensas_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    recompensa_id VARCHAR(100) NOT NULL REFERENCES recompensas_catalogo(id) ON DELETE CASCADE,
    fecha_canje TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    precio_pagado DECIMAL(10,2) NOT NULL,
    equipado BOOLEAN DEFAULT FALSE, -- Para insignias equipadas
    UNIQUE(usuario_id, recompensa_id)
);

-- Tabla para las insignias equipadas (solo una insignia por usuario)
CREATE TABLE IF NOT EXISTS insignias_equipadas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER UNIQUE REFERENCES usuario(id) ON DELETE CASCADE,
    recompensa_id VARCHAR(100) REFERENCES recompensas_catalogo(id) ON DELETE CASCADE,
    fecha_equipado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Insertar datos iniciales del catálogo de recompensas
INSERT INTO recompensas_catalogo (id, categoria, tipo, nombre, descripcion, precio, icono, rareza, disponible, orden) VALUES
-- Insignias Básicas
('badge_bronce', 'insignias', 'badge', 'Insignia de Bronce', 'Insignia básica de bronce para tu perfil', 100, '🥉', 'comun', true, 1),
('badge_plata', 'insignias', 'badge', 'Insignia de Plata', 'Insignia elegante de plata para tu perfil', 150, '🥈', 'comun', true, 2),
('badge_oro', 'insignias', 'badge', 'Insignia de Oro', 'Insignia premium de oro para tu perfil', 250, '🥇', 'comun', true, 3),

-- Insignias Especiales
('badge_cinturon', 'insignias', 'badge', 'Cinturón de Campeón', 'Insignia especial del cinturón de campeón', 500, '🏆', 'rara', true, 4),
('badge_guantes', 'insignias', 'badge', 'Guantes de Guerrero', 'Insignia especial de guantes de pelea', 600, '🥊', 'rara', true, 5),
('badge_fuego', 'insignias', 'badge', 'Llama del Combate', 'Insignia especial con efectos de fuego', 700, '🔥', 'rara', true, 6),
('badge_aguila', 'insignias', 'badge', 'Águila Dominante', 'Insignia especial del águila dominante', 800, '🦅', 'rara', true, 7),

-- Insignias Exclusivas de Temporada
('badge_campeon_octubre_2026', 'insignias', 'badge', 'Campeón Octubre 2026', 'Insignia exclusiva de temporada - Campeón de Octubre 2026', 1000, '👑', 'legendaria', true, 8),

-- Documentales Exclusivos
('documental_exclusivo', 'contenido', 'documental', 'Documentales Exclusivos', 'Acceso completo a documentales exclusivos de peleadores', 700, '🎥', 'rara', true, 9),

-- Acceso a Clips Destacados
('clips_destacados', 'contenido', 'acceso', 'Clips Destacados Premium', 'Acceso ilimitado a clips destacados exclusivos', 300, '⭐', 'comun', true, 10)

ON CONFLICT (id) DO NOTHING;

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_recompensas_categoria ON recompensas_catalogo(categoria);
CREATE INDEX IF NOT EXISTS idx_recompensas_disponible ON recompensas_catalogo(disponible);
CREATE INDEX IF NOT EXISTS idx_recompensas_usuario_id ON recompensas_usuario(usuario_id);
CREATE INDEX IF NOT EXISTS idx_recompensas_fecha ON recompensas_usuario(fecha_canje);
CREATE INDEX IF NOT EXISTS idx_recompensas_equipado ON recompensas_usuario(equipado);
CREATE INDEX IF NOT EXISTS idx_insignias_usuario_id ON insignias_equipadas(usuario_id);

-- Agregar comentarios
COMMENT ON TABLE recompensas_catalogo IS 'Catálogo de todas las recompensas e insignias disponibles';
COMMENT ON TABLE recompensas_usuario IS 'Recompensas compradas por los usuarios';
COMMENT ON TABLE insignias_equipadas IS 'Insignias actualmente equipadas por los usuarios';
COMMENT ON COLUMN recompensas_usuario.equipado IS 'Si la insignia está equipada actualmente';
COMMENT ON COLUMN insignias_equipadas.recompensa_id IS 'La insignia que tiene equipada el usuario';
