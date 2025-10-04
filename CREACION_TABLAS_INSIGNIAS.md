# Configuración Manual de Tablas de Insignias en Supabase

## Paso 1: Crear las tablas en Supabase Studio

Ve a tu proyecto de Supabase y ejecuta las siguientes consultas SQL en el editor SQL:

### 1. Tabla de Catálogo de Insignias

```sql
CREATE TABLE IF NOT EXISTS insignias_catalogo (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(100) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio INTEGER NOT NULL DEFAULT 0,
    icono VARCHAR(10) NOT NULL,
    categoria VARCHAR(50) DEFAULT 'normal',
    rareza VARCHAR(20) DEFAULT 'comun',
    disponible BOOLEAN DEFAULT true,
    limitada BOOLEAN DEFAULT false,
    fecha_expira TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    orden INTEGER DEFAULT 0
);
```

### 2. Tabla de Insignias del Usuario

```sql
CREATE TABLE IF NOT EXISTS insignias_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
    insignia_id INTEGER REFERENCES insignias_catalogo(id) ON DELETE CASCADE,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    precio_pagado INTEGER NOT NULL,
    fecha_expira TIMESTAMP NULL,
    equipada BOOLEAN DEFAULT false,
    UNIQUE(usuario_id, insignia_id)
);
```

### 3. Tabla de Transacciones de Insignias

```sql
CREATE TABLE IF NOT EXISTS transacciones_insignias (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
    insignia_id INTEGER REFERENCES insignias_catalogo(id) ON DELETE SET NULL,
    tipo VARCHAR(20) NOT NULL,
    cantidad INTEGER DEFAULT 1,
    precio_insignia INTEGER DEFAULT 0,
    fecha_transaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo TEXT
);
```

### 4. Insertar Datos Iniciales

```sql
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
```

### 5. Índices para Optimización

```sql
CREATE INDEX IF NOT EXISTS idx_insignias_usuario_user_id ON insignias_usuario(usuario_id);
CREATE INDEX IF NOT EXISTS idx_insignias_usuario_badge_id ON insignias_usuario(insignia_id);
CREATE INDEX IF NOT EXISTS idx_insignias_usuario_equipada ON insignias_usuario(equipada);
CREATE INDEX IF NOT EXISTS idx_transacciones_insignias_user_id ON transacciones_insignias(usuario_id);
CREATE INDEX IF NOT EXISTS idx_insignias_catalogo_disponible ON insignias_catalogo(disponible);
```

## Paso 2: Configurar Políticas de Seguridad (RLS)

Después de crear las tablas, habilita Row Level Security y configura las políticas:

### Habilitar RLS:

```sql
ALTER TABLE insignias_catalogo ENABLE ROW LEVEL SECURITY;
ALTER TABLE insignias_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacciones_insignias ENABLE ROW LEVEL SECURITY;
```

### Políticas para insignias_catalogo:

```sql
-- Todos pueden ver las insignias disponibles
CREATE POLICY "Cualquiera puede ver insignias disponibles" ON insignias_catalogo
    FOR SELECT USING (true);
```

### Políticas para insignias_usuario:

```sql
-- Los usuarios pueden ver sus propias insignias
CREATE POLICY "Los usuarios pueden ver sus insignias" ON insignias_usuario
    FOR SELECT USING (usuario_id = auth.uid()::text::int OR usuario_id IN (
        SELECT id FROM usuario WHERE correo = auth.email()
    ));

-- Los usuarios pueden insertar sus propias insignias (al comprar)
CREATE POLICY "Los usuarios pueden comprar insignias" ON insignias_usuario
    FOR INSERT WITH CHECK (usuario_id IN (
        SELECT id FROM usuario WHERE correo = auth.email()
    ));

-- Los usuarios pueden actualizar sus propias insignias (equipar/desequipar)
CREATE POLICY "Los usuarios pueden equipar insignias" ON insignias_usuario
    FOR UPDATE USING (usuario_id IN (
        SELECT id FROM usuario WHERE correo = auth.email()
    ));
```

### Políticas para transacciones_insignias:

```sql
-- Los usuarios pueden ver sus propias transacciones
CREATE POLICY "Los usuarios pueden ver sus transacciones" ON transacciones_insignias
    FOR SELECT USING (usuario_id IN (
        SELECT id FROM usuario WHERE correo = auth.email()
    ));

-- El sistema puede insertar transacciones
CREATE POLICY "Sistema puede crear transacciones" ON transacciones_insignias
    FOR INSERT WITH CHECK (true);
```

## Verificación

Después de ejecutar todos los pasos, verifica que todo funcione correctamente:

1. Ve a `/badges` en tu aplicación para acceder a la tienda de insignias
2. Ve a `/profile` para ver las insignias en tu perfil
3. Prueba comprar una insignia (asegúrate de tener monedas suficientes)
4. Prueba equipar y desequipar insignias

## Estado del Sistema

✅ **Completado:**
- Servicio de insignias con Supabase
- Componente BadgeManager para el perfil
- Página BadgesShopPage para la tienda
- Hook useBadgePurchase para compras
- Integración en UserProfilePage
- Rutas configuradas (/badges)

✅ **Pendiente (Manual):**
- Creación de tablas en Supabase
- Configuración de políticas RLS
- Datos iniciales de insignias

El sistema está completamente implementado en el frontend y backend. Solo necesitas ejecutar estas consultas SQL en Supabase para que funcione.
