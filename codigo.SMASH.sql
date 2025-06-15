-- Eliminar tablas en el orden correcto
DROP TABLE IF EXISTS prediccion CASCADE;
DROP TABLE IF EXISTS pelea CASCADE;
DROP TABLE IF EXISTS evento CASCADE;
DROP TABLE IF EXISTS peleador CASCADE;
DROP TABLE IF EXISTS ranking_global CASCADE;
DROP TABLE IF EXISTS division CASCADE;
DROP TABLE IF EXISTS "usuario" CASCADE;

-- Crear tablas nuevamente
CREATE TABLE "usuario" (
    id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    fecha_registro DATE NOT NULL,
    puntos INT DEFAULT 0,
    rango VARCHAR(50),
    avatar VARCHAR(255),
    notificaciones BOOLEAN DEFAULT TRUE,
    tema VARCHAR(20),
    contraseña VARCHAR(100) NOT NULL,
    saldo INT DEFAULT 0
);

-- Tabla de division
CREATE TABLE division (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla de peleador
CREATE TABLE peleador (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    record VARCHAR(50),
    puntos INT,
    estado VARCHAR(50),
    rango INT,
    division_id INT REFERENCES division(id)
);

-- Tabla de evento
CREATE TABLE evento (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100),
    fecha DATE,
    ubicacion VARCHAR(100),
    sede VARCHAR(100),
    imagen VARCHAR(255),
    texto_alternativo VARCHAR(255)
);

-- Tabla de pelea
CREATE TABLE pelea (
    id SERIAL PRIMARY KEY,
    evento_id INT REFERENCES evento(id),
    peleador1_id INT REFERENCES peleador(id),
    peleador2_id INT REFERENCES peleador(id),
    pelea_principal BOOLEAN DEFAULT FALSE,
    pelea_coestelar BOOLEAN DEFAULT FALSE,
    rounds INT
);

-- Tabla de prediccion
CREATE TABLE prediccion (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES "usuario"(id),
    pelea_id INT REFERENCES pelea(id),
    ganador_id INT REFERENCES peleador(id),
    metodo VARCHAR(50),
    round VARCHAR(10),
    primer_golpe_id INT REFERENCES peleador(id),
    primer_takedown_id INT REFERENCES peleador(id),
    sera_ko BOOLEAN,
    sera_sumision BOOLEAN,
    ira_a_decision BOOLEAN,
    mas_golpes_significativos_id INT REFERENCES peleador(id),
    apuesta INT,
    ganancia_potencial INT,
    resultado VARCHAR(50)
);

-- Tabla de ranking_global
CREATE TABLE ranking_global (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES "usuario"(id),
    puntos INT DEFAULT 0,
    racha INT DEFAULT 0
);
