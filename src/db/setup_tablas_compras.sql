-- Tabla para rastrear compras de monedas
CREATE TABLE IF NOT EXISTS compras_monedas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuario(id),
  paquete_id VARCHAR(50) NOT NULL,
  monedas INTEGER NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  payment_id VARCHAR(100) NOT NULL,
  external_reference VARCHAR(100) NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente',
  fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_procesado TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_compras_usuario_id ON compras_monedas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_compras_payment_id ON compras_monedas(payment_id);
CREATE INDEX IF NOT EXISTS idx_compras_external_reference ON compras_monedas(external_reference);
CREATE INDEX IF NOT EXISTS idx_compras_estado ON compras_monedas(estado);

-- Tabla para historial de transacciones de monedas
CREATE TABLE IF NOT EXISTS transacciones_moneda (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuario(id),
  cantidad INTEGER NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ingreso', 'egreso')),
  motivo VARCHAR(255) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para transacciones
CREATE INDEX IF NOT EXISTS idx_transacciones_usuario_id ON transacciones_moneda(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_fecha ON transacciones_moneda(fecha);
CREATE INDEX IF NOT EXISTS idx_transacciones_tipo ON transacciones_moneda(tipo);
