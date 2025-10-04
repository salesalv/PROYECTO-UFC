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