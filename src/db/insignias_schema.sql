-- Sistema de Insignias SMASH UFC
-- Tablas necesarias para el sistema de recompensas con insignias

-- Tabla principal de insignias disponibles
CREATE TABLE IF NOT EXISTS insignias_catalogo (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(100) UNIQUE NOT NULL, -- código único: 'badge_bronce', 'badge_oro', etc.
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio INTEGER NOT NULL DEFAULT 0, -- precio en monedas
    icono VARCHAR(10) NOT NULL, -- emoji o icono
    categoria VARCHAR(50) DEFAULT 'normal', -- 'normal', 'especial', 'temporada', 'legendaria'
    rareza VARCHAR(20) DEFAULT 'comun', -- 'comun', 'rara', 'legendaria'
    disponible BOOLEAN DEFAULT true,
    limitada BOOLEAN DEFAULT false, -- si es una insignia de tiempo limitado
    fecha_expira TIMESTAMP NULL, -- fecha límite si es limitada
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    orden INTEGER DEFAULT 0 -- orden de aparición en tienda
);

-- Tabla de insignias compradas por usuario
CREATE TABLE IF NOT EXISTS insignias_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
    insignia_id INTEGER REFERENCES insignias_catalogo(id) ON DELETE CASCADE,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    precio_pagado INTEGER NOT NULL,
    fecha_expira TIMESTAMP NULL, -- si la insignia tiene expiración
    equipada BOOLEAN DEFAULT false, -- si está siendo usada actualmente
    UNIQUE(usuario_id, insignia_id) -- un usuario solo puede tener una vez cada insignia
);

-- Tabla para historial de transacciones de insignias
CREATE TABLE IF NOT EXISTS transacciones_insignias (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
    insignia_id INTEGER REFERENCES insignias_catalogo(id) ON DELETE SET NULL,
    tipo VARCHAR(20) NOT NULL, -- 'compra', 'equipar', 'desequipar'
    cantidad INTEGER DEFAULT 1,
    precio_insignia INTEGER DEFAULT 0,
    fecha_transaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo TEXT
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_insignias_usuario_user_id ON insignias_usuario(usuario_id);
CREATE INDEX IF NOT EXISTS idx_insignias_usuario_badge_id ON insignias_usuario(insignia_id);
CREATE INDEX IF NOT EXISTS idx_insignias_usuario_equipada ON insignias_usuario(equipada);
CREATE INDEX IF NOT EXISTS idx_transacciones_insignias_user_id ON transacciones_insignias(usuario_id);
CREATE INDEX IF NOT EXISTS idx_insignias_catalogo_disponible ON insignias_catalogo(disponible);

-- Trigger para registrar transacciones automáticamente
CREATE OR REPLACE FUNCTION registrar_transaccion_insignia()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO transacciones_insignias (
            usuario_id, 
            insignia_id, 
            tipo, 
            cantidad, 
            precio_insignia,
            motivo
        ) VALUES (
            NEW.usuario_id, 
            NEW.insignia_id, 
            'compra', 
            1, 
            NEW.precio_pagado,
            'Compra de insignia: ' || (SELECT nombre FROM insignias_catalogo WHERE id = NEW.insignia_id)
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Registrar cuando se equipa/desequipa una insignia
        IF OLD.equipada != NEW.equipada THEN
            INSERT INTO transacciones_insignias (
                usuario_id, 
                insignia_id, 
                tipo,
                motivo
            ) VALUES (
                NEW.usuario_id, 
                NEW.insignia_id, 
                CASE 
                    WHEN NEW.equipada = true THEN  'equipar'
                    WHEN NEW.equipada = false THEN 'desequipar'
                END,
                CASE 
                    WHEN NEW.equipada = true THEN  'Equipó insignia: ' || (SELECT nombre FROM insignias_catalogo WHERE id = NEW.insignia_id)
                    WHEN NEW.equipada = false THEN 'Desequipó insignia: ' || (SELECT nombre FROM insignias_catalogo WHERE id = NEW.insignia_id)
                END
            );
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Aplicar el trigger a la tabla insignias_usuario
DROP TRIGGER IF EXISTS trigger_transaccion_insignia ON insignias_usuario;
CREATE TRIGGER trigger_transaccion_insignia
    AFTER INSERT OR UPDATE ON insignias_usuario
    FOR EACH ROW EXECUTE FUNCTION registrar_transaccion_insignia();

-- Insertar datos iniciales de insignias
INSERT INTO insignias_catalogo (codigo, nombre, descripcion, precio, icono, categoria, rareza, orden) VALUES
('badge_bronce', 'Insignia de Bronce', 'Insignia básica de bronce para tu perfil', 100, '🥉', 'normal', 'comun', 1),
('badge_plata', 'Insignia de Plata', 'Insignia elegante de plata para tu perfil', 150, '🥈', 'normal', 'comun', 2),
('badge_oro', 'Insignia de Oro', 'Insignia premium de oro para tu perfil', 250, '🥇', 'normal', 'comun', 3),
('badge_cinturon', 'Cinturón de Campeón', 'Insignia especial del cinturón de campeón', 500, '🏆', 'especial', 'rara', 4),
('badge_guantes', 'Guantes de Guerrero', 'Insignia especial de guantes de pelea', 600, '🥊', 'especial', 'rara', 5),
('badge_fuego', 'Llama del Combate', 'Insignia especial con efectos de fuego', 700, '🔥', 'especial', 'rara', 6),
('badge_aguila', 'Águila Dominante', 'Insignia especial del águila dominante', 800, '🦅', 'especial', 'rara', 7),
('badge_corona_premium', 'Corona Premium', 'Insignia legendaria de corona dorada', 1000, '👑', 'legendaria', 'legendaria', 8),
('badge_campeon_temporada', 'Campeón de Temporada', 'Insignia exclusiva de temporada', 1200, '🌟', 'temporada', 'legendaria', 9)
ON CONFLICT (codigo) DO NOTHING;
