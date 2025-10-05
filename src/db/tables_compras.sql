-- Tabla para registrar compras de monedas virtuales
CREATE TABLE IF NOT EXISTS compras_monedas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
    paquete_id VARCHAR(50) NOT NULL, -- ID del paquete comprado
    monedas INTEGER NOT NULL, -- Cantidad de monedas compradas
    precio DECIMAL(10,2) NOT NULL, -- Precio en pesos argentinos
    payment_id VARCHAR(255) UNIQUE NOT NULL, -- ID del pago de MercadoPago
    estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'completado', 'rechazado'
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    procesado_at TIMESTAMP -- Cuando se procesó el pago
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_compras_usuario_id ON compras_monedas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_compras_fecha ON compras_monedas(fecha);
CREATE INDEX IF NOT EXISTS idx_compras_estado ON compras_monedas(estado);

-- Tabla para definir paquetes de monedas (opcional, para configuración dinámica)
CREATE TABLE IF NOT EXISTS paquetes_monedas (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    monedas INTEGER NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(5,2) DEFAULT 0, -- Porcentaje de descuento
    popular BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    orden INTEGER DEFAULT 0 -- Para ordenar los paquetes
);

-- Insertar datos por defecto de paquetes
INSERT INTO paquetes_monedas (id, nombre, monedas, precio, descuento, popular, orden) VALUES
('basico', 'Paquete Básico', 100, 2.99, 0, false, 1),
('estandar', 'Paquete Estándar', 500, 9.99, 17, true, 2),
('premium', 'Paquete Premium', 1200, 19.99, 33, false, 3),
('pro', 'Paquete Pro', 2500, 34.99, 44, false, 4)
ON CONFLICT (id) DO NOTHING; -- Ignorar si ya existen

-- Agregar comentarios a las tablas
COMMENT ON TABLE compras_monedas IS 'Registro de todas las compras de monedas virtuales realizadas por los usuarios';
COMMENT ON TABLE paquetes_monedas IS 'Catálogo de paquetes de monedas virtuales disponibles';
COMMENT ON COLUMN compras_monedas.payment_id IS 'ID único del pago proporcionado por MercadoPago';
COMMENT ON COLUMN compras_monedas.estado IS 'Estado del pago: pendiente, completado, rechazado';


