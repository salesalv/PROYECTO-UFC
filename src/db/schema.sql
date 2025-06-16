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