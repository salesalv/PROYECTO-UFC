# 🔧 Solución Inmediata: Error "Could not find the table 'recompensas_usuario'"

## 🔍 **Problema Identificado**

El error ocurre porque las siguientes tablas **NO EXISTEN** en tu base de datos Supabase:
- ❌ `recompensas_usuario` 
- ❌ `recompensas_catalogo`

## ⚡ **SOLUCIÓN INMEDIATA**

### Paso 1: Crear Tablas en Supabase Dashboard

1. Ve a tu **Supabase Dashboard** → **SQL Editor**
2. Ejecuta este SQL:

```sql
-- Crear tabla recompensas_usuario
CREATE TABLE recompensas_usuario (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  recompensa_id VARCHAR(100) NOT NULL,
  fecha_canje TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  precio_pagado INTEGER NOT NULL,
  UNIQUE(usuario_id, recompensa_id)
);

-- Crear índices para mejor performance
CREATE INDEX idx_recompensas_usuario_id ON recompensas_usuario(usuario_id);
CREATE INDEX idx_recompensas_fecha ON recompensas_usuario(fecha_canje);
CREATE INDEX idx_recompensas_recompensa_id ON recompensas_usuario(recompensa_id);

-- Opcional: Tabla para catálogo dinámico
CREATE TABLE recompensas_catalogo (
  id VARCHAR(100) PRIMARY KEY,
  categoria VARCHAR(50) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio INTEGER NOT NULL,
  icono VARCHAR(10),
  rareza VARCHAR(20) DEFAULT 'comun',
  disponible BOOLEAN DEFAULT true,
  limitada BOOLEAN DEFAULT false,
  fecha_limite DATE,
  contenido JSONB,
  beneficios JSONB
);
```

### Paso 2: Verificar que las tablas se crearon

Ejecuta este script para verificar:

```bash
node verificar_tablas_recompensas.js
```

Deberías ver:
```
✅ Tabla recompensas_usuario existe
✅ Tabla recompensas_catalogo existe
✅ Tabla usuario existe
```

## 🎯 **¿Por qué pasa esto?**

1. **Compra iniciada**: El botón "Canjear" funciona → descuenta monedas ✅
2. **Registro falla**: Intenta registrar en `recompensas_usuario` → tabla no existe ❌
3. **Error mostrado**: Muestra "Could not find the table" ❌
4. **Sin rollback**: Las monedas ya se descuentaron ❌

## 🔄 **Después de crear las tablas**

El sistema funcionará perfectamente:
- ✅ Canje exitoso de recompensas
- ✅ Registro correcto en la base de datos
- ✅ Balance de monedas actualizado
- ✅ Sin errores

## 📞 **¿Necesitas ayuda?**

Si tienes problemas accediendo a Supabase Dashboard:
1. Verifica tus credenciales de Supabase
2. Asegúrate de estar conectado al proyecto correcto
3. Revisa que tienes permisos de superusuario

---

**Estado**: ⏳ **Pendiente de crear tablas**
**Prioridad**: 🔴 **ALTA** - Sistema bloqueado sin estas tablas
