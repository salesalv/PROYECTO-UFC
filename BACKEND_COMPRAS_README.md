# 🔧 Backend de Sistema de Compras - SMASH UFC

## 📋 Descripción
Backend completo para el sistema de compra de monedas virtuales implementado con Express.js, Supabase y MercadoPago.

## 🛠️ Tecnologías Utilizadas
- **Express.js**: Servidor web
- **Supabase**: Base de datos y autenticación
- **MercadoPago**: Procesamiento de pagos
- **JWT**: Autenticación de usuarios
- **Node.js**: Runtime

## 🚀 Configuración e Instalación

### Prerrequisitos
- Node.js v18+
- Cuenta de Supabase
- Cuenta de MercadoPago (testing o producción)

### Instalación
```bash
# Instalar dependencias
npm install

# Configurar base de datos de compras
npm run setup-compras

# Ejecutar servidor de desarrollo
npm run server
```

### Variables de Entorno
Crear archivo `.env` con:
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=tu-jwt-secret-aqui
MERCADOPAGO_ACCESS_TOKEN=TEST_ACCESS_TOKEN
MERCADOPAGO_PUBLIC_KEY=TEST_PUBLIC_KEY
BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
```

## 📡 Endpoints API

### Compras de Monedas

#### `GET /api/compras/paquetes`
Obtiene los paquetes de monedas disponibles.

**Response:**
```json
{
  "success": true,
  "paquetes": [
    {
      "id": "basico",
      "nombre": "Paquete Básico",
      "monedas": 100,
      "precio": 2.99,
      "popular": false
    }
  ]
}
```

#### `GET /api/compras/saldo`
Obtiene el saldo actual del usuario.

**Headers:** `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  "success": true,
  "saldo": 470
}
```

#### `POST /api/compras/crear-pago`
Crea una intención de pago para un paquete de monedas.

**Headers:** `Authorization: Bearer <jwt_token>`

**Body:**
```json
{
  "paqueteId": "estandar"
}
```

**Response:**
```json
{
  "success": true,
  "preference_id": "123456789",
  "checkout_url": "https://mercadopago.com/checkout/...",
  "external_reference": "compra_123_1234567890"
}
```

#### `POST /api/compras/webhook`
Webhook de MercadoPago para procesar pagos aprobados.

**Body:** (Enviado por MercadoPago)
```json
{
  "type": "payment",
  "data": {
    "id": "123456789"
  }
}
```

#### `GET /api/compras/historial`
Obtiene el historial de compras del usuario.

**Headers:** `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  "success": true,
  "compras": [
    {
      "id": 1,
      "paquete_id": "estandar",
      "monedas": 500,
      "precio": 9.99,
      "estado": "completado",
      "fecha": "2024-12-19T10:30:00Z"
    }
  ]
}
```

#### `GET /api/compras/transacciones`
Obtiene el historial de transacciones de monedas.

**Headers:** `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  "success": true,
  "transacciones": [
    {
      "id": 1,
      "tipo": "ingreso",
      "cantidad": 500,
      "motivo": "compra_paquete_estandar_123456789",
      "fecha": "2024-12-19T10:30:00Z"
    }
  ]
}
```

#### `POST /api/compras/test-payment/:paymentId`
Endpoint para testing de pagos en desarrollo.

## 🗄️ Base de Datos

### Tabla: `compras_moned<｜tool▁call▁begin｜>`
```sql
CREATE TABLE compras_monedas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuario(id),
    paquete_id VARCHAR(50) NOT NULL,
    monedas INTEGER NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    payment_id VARCHAR(255) UNIQUE NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    pagina TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cargprocesado_at TIMESTAMP
);
```

### Tabla: `paquetes_monedas`
```sql
CREATE TABLE paquetes_monedas (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    monedas INTEGER NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(5,2) DEFAULT 0,
    popular BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    orden INTEGER DEFAULT 0
);
```

## 🔐 Seguridad

### Autenticación JWT
Todos los endpoints protegidos requieren un token JWT válido en el header `Authorization: Bearer <token>`.

### Validación de Pagos
- Verificación de estado de pago en MercadoPago
- Prevención de procesamiento duplicado
- Validación de metadata del pago

### Middleware de Seguridad
```javascript
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  // Verificación JWT...
};
```

## 🧪 Testing

### Desarrollo
```bash
# Ejecutar servidor en modo desarrollo
npm run server

# Configurar webhook para desarrollo
# URL: http://localhost:3001/api/compras/webhook
```

### MercadoPago Sandbox
1. Usar credenciales de prueba
2. Configurar webhook en dashboard de MercadoPago
3. Usar tarjetas de prueba

## 📊 Flujo de Compra

1. **Crear Pago**: Usuario solicita crear pago
2. **MercadoPago**: Se crea preferencia y devuelve URL
3. **Redirección**: Usuario completa pago en MercadoPago
4. **Webhook**: MercadoPago notifica resultado
5. **Procesamiento**: Se actualiza saldo y estados
6. **Confirmación**: Usuario recibe confirmación

## 🚨 Manejo de Errores

### Estados de Pago
- `pendiente`: Pago creado, esperando confirmación
- `completado`: Pago procesado exitosamente
- `rechazado`: Pago rechazado o cancelado

### Códigos de Error Comunes
- `400`: Datos inválidos o faltantes
- `401`: Token JWT inválido o faltante
- `404`: Paquete no encontrado
- `500`: Error interno del servidor

## 🎯 Características Implementadas

✅ **Sistema de Paquetes**
- 4 paquetes configurables
- Precios con descuentos
- Destacado de paquetes populares

✅ **Procesamiento de Pagos**
- Integración con MercadoPago
- Webhooks para actualización automática
- Estados de transacción

✅ **Gestión de Saldo**
- Actualización automática
- Historial de transacciones
- Prevención de duplicados

✅ **Seguridad**
- Autenticación JWT
- Validación de datos
- Logging de transacciones

## 🔄 Próximas Mejoras

- [ ] Implementar reembolsos
- [ ] Agregar descuentos por volumen
- [ ] Sistema de cupones
- [ ] Analytics de compras
- [ ] Notificaciones push
- [ ] Integración con otros métodos de pago

## 📞 Soporte

Para soporte técnico o consultas:
- Documentación completa en `/docs`
- Logs del servidor para debugging
- Base de datos Supabase para monitoreo


