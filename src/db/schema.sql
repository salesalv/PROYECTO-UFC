CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    puntos INTEGER DEFAULT 0,
    rango VARCHAR(50) DEFAULT 'Novato',
    avatar VARCHAR(255),
    notificaciones BOOLEAN DEFAULT true,
    tema VARCHAR(20) DEFAULT 'dark',
    contraseña VARCHAR(255) NOT NULL,
    saldo DECIMAL(10,2) DEFAULT 0.00
); 

-- Tabla para registrar movimientos de monedas virtuales
CREATE TABLE IF NOT EXISTS transacciones_moneda (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuario(id),
    tipo VARCHAR(20), -- 'ingreso' o 'egreso'
    cantidad DECIMAL(10,2) NOT NULL,
    motivo VARCHAR(255), -- ejemplo: 'registro', 'apuesta', 'voto', etc.
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 