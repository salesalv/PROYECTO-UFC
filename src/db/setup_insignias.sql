-- Agregar campos de insignias a la tabla usuario
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS insignia_actual VARCHAR(100) DEFAULT NULL;
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS insignias_mostradas JSONB DEFAULT '{}';

-- Crear tabla para historial de insignias equipadas
CREATE TABLE IF NOT EXISTS usuario_insignias_historial (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
    insignia_id VARCHAR(100) NOT NULL,
    fecha_equipada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_desequipada TIMESTAMP DEFAULT NULL,
    tiempo_equipada INTEGER DEFAULT 0 -- en días
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_usuario_insignias_usuario_id ON usuario_insignias_historial(usuario_id);
CREATE INDEX IF NOT EXISTS idx_usuario_insignias_fecha ON usuario_insignias_historial(fecha_equipada);

-- Agregar comentarios
COMMENT ON COLUMN usuario.insignia_actual IS 'ID de la insignia actualmente equipada por el usuario';
COMMENT ON COLUMN usuario.insignias_mostradas IS 'Configuración JSON de qué insignias mostrar públicamente';
COMMENT ON TABLE usuario_insignias_historial IS 'Historial de insignias equipadas por usuarios';
