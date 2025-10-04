# 🏆 Sistema de Insignias para Perfiles - Configuración Requerida

## ✅ **Backend Implementado Completamente**

El sistema de insignias para perfiles está completamente implementado. Solo necesitas crear las tablas faltantes en tu base de datos.

## 🔧 **SOLUCIÓN PASO A PASO**

### **Paso 1: Crear Columnas en Tabla Usuario**

Ejecuta este SQL en **Supabase Dashboard → SQL Editor**:

```sql
-- Agregar campos de insignias a la tabla usuario
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS insignia_actual VARCHAR(100) DEFAULT NULL;
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS insignias_mostradas JSONB DEFAULT '{}';
```

### **Paso 2: Crear Tabla de Historial**

Ejecuta este SQL:

```sql
-- Crear tabla para historial de insignias equipadas
CREATE TABLE usuario_insignias_historial (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
    insignia_id VARCHAR(100) NOT NULL,
    fecha_equipada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_desequipada TIMESTAMP DEFAULT NULL,
    tiempo_equipada INTEGER DEFAULT 0
);

-- Crear índices para mejor performance
CREATE INDEX idx_usuario_insignias_usuario_id ON usuario_insignias_historial(usuario_id);
CREATE INDEX idx_usuario_insignias_usuario_fecha ON usuario_insignias_historial(fecha_equipada);
```

### **Paso 3: Verificar Configuración**

Ejecuta este comando para verificar:

```bash
node verificar_insignias_db.js
```

Deberías ver:
```
✅ Columnas de insignias existentes en tabla usuario
✅ Tabla historial de insignias existente
✅ Tabla recompensas_usuario existente
✅ Tabla usuario existente
```

## 🚀 **Funcionalidades Implementadas**

### **Rutas del Backend** (`/api/insignias/`)
- **GET** `/mis-insignias` - Obtener insignias del usuario autenticado
- **GET** `/perfil/:usuarioId` - Obtener insignias de perfil público
- **POST** `/equipar` - Equipar una insignia
- **POST** `/desequipar` - Desequipar insignia actual
- **GET** `/historial` - Historial de insignias equipadas
- **PUT** `/configuracion` - Configurar visualización de insignias

### **Servicio Frontend** (`src/services/insigniasAPI.js`)
- Funciones completas para gestionar insignias
- Manejo de autenticación automático
- Utilidades para clasificación por rareza

### **Componente Visual** (`src/components/profile/UsuarioInsignia.jsx`)
- Visualización de insignia equipada
- Selector de insignias para el propietario
- Configuración de visualización pública
- Indicadores de rareza y estado

## 🎯 **Cómo Funciona**

1. **Usuario compra insignia** → Se registra en `recompensas_usuario`
2. **Usuario equipa insignia** → Se actualiza `usuario.insignia_actual`
3. **Se registra en historial** → `usuario_insignias_historial`
4. **Perfil muestra insignia** → Visible públicamente
5. **Usuario puede cambiar** → Selector con sus insignias

## 📱 **Integración en Perfil**

Copia este componente en tu página de perfil:

```jsx
import UsuarioInsignia from '@/components/profile/UsuarioInsignia';

// En tu componente de perfil
<UsuarioInsignia 
  userId={usuario.id} 
  esUsuarioActual={esMiPerfil} 
  enPerfilPublico={true} 
/>
```

## 🔐 **Seguridad Implementada**

- ✅ Autenticación JWT requerida para cambios
- ✅ Verificación de propiedad de insignias
- ✅ Validación de tipos de recompensas
- ✅ Manejo de errores con rollback
- ✅ Historial completo de acciones

## ⚡ **Después de Configurar**

1. **Reinicia el servidor**: `node src/server.js`
2. **Ve a /recompensas** y compra una insignia
3. **Ve a tu perfil** y equipa la insignia
4. **Cambia entre insignias** usando el selector
5. **Verifica funcionamiento** completo

---

**Estado**: ⏳ **Pendiente de crear tablas en Supabase**
**Prioridad**: 🟡 **MEDIA** - Sistema implementado, solo falta configuración DB
