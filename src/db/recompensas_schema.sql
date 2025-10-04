-- Esquema para sistema de recompensas premium
-- Tabla para almacenar recompensas compradas por usuarios

CREATE TABLE IF NOT EXISTS recompensas_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    tipo_recompensa VARCHAR(50) NOT NULL, -- 'acceso_clips_destacados', etc.
    precio_pagado INTEGER NOT NULL,
    fecha_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_recompensas_usuario_id ON recompensas_usuario(usuario_id);
CREATE INDEX IF NOT EXISTS idx_recompensas_tipo ON recompensas_usuario(tipo_recompensa);
CREATE INDEX IF NOT EXISTS idx_recompensas_activa ON recompensas_usuario(activa);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_recompensas_usuario_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE TRIGGER trigger_update_recompensas_usuario_updated_at
    BEFORE UPDATE ON recompensas_usuario
    FOR EACH ROW
    EXECUTE FUNCTION update_recompensas_usuario_updated_at();

-- Comentarios para documentación
COMMENT ON TABLE recompensas_usuario IS 'Tabla para almacenar recompensas premium compradas por usuarios';
COMMENT ON COLUMN recompensas_usuario.tipo_recompensa IS 'Tipo de recompensa: acceso_clips_destacados, etc.';
COMMENT ON COLUMN recompensas_usuario.precio_pagado IS 'Precio pagado en monedas por la recompensa';
COMMENT ON COLUMN recompensas_usuario.activa IS 'Si la recompensa está activa o ha sido revocada';
