# 🚀 Configuración Completa de MercadoPago

## 📋 Paso 1: Crear Cuenta de MercadoPago

1. Ve a [mercadopago.com.ar](https://mercadopago.com.ar)
2. **Crear cuenta empresarial**:
   - Selecciona "Para negocios"
   - Completa datos de empresa
   - Sube documentación necesaria
3. **Verificar identidad** (requerido para recibir pagos)

## 🔑 Paso 2: Obtener Credenciales

### En tu Dashboard de MercadoPago:

1. Ve a **"Desarrolladores"** → **"Tus integraciones"**
2. Selecciona tu aplicación
3. Ve a **"Credenciales de producción"**

### Credenciales necesarias:
```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR_xxxxxxxxxxxxxxxxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## ⚙️ Paso 3: Configurar Variables de Entorno

Crea archivo `.env` en la raíz del proyecto:

```env
# Configuración MercadoPago (PRODUCCIÓN)
MERCADOPAGO_ACCESS_TOKEN=APP_USR_xxxxxxxxxxxxxxxxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# URLs de tu aplicación (PRODUCCIÓN)
BASE_URL=https://tu-dominio.com
FRONTEND_URL=https://tu-dominio.com

# Configuración del servidor
PORT=3001
NODE_ENV=production
JWT_SECRET=tu-jwt-secret-super-seguro-aqui
```

## 🔔 Paso 4: Configurar Webhook

### En MercadoPago Dashboard:

1. Ve a **"Desarrolladores"** → **"Webhooks"**
2. Crear nuevo webhook:
   - **URL**: `https://tu-dominio.com/api/compras/webhook`
   - **Eventos**: Selecciona "Pagos aprobados"
   - **Método**: POST

### Webhook procesará automáticamente:

```javascript
// Cuando MercadoPago envía confirmación:
{
  "type": "payment",
  "data": {
    "id": "123456789"
  }
}

// Tu backend:
// 1. Verifica estado del pago
// 2. Agrega monedas al usuario
// 3. Actualiza estado de compra
// 4. Envía confirmación
```

## 🌐 Paso 5: URLs de Retorno

### Configurar en MercadoPago:

- **Success URL**: `https://tu-dominio.com/comprar-monedas/success`
- **Failure URL**: `https://tu-dominio.com/comprar-monedas/failure`
- **Pending URL**: `https://tu-dominio.com/comprar-monedas/pending`

## 💳 Paso 6: Probar Sistema

### Modo Testing (Sandbox):
```env
MERCADOPAGO_ACCESS_TOKEN=TEST_xxxxxxxxxxxxxxxxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=TEST_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Tarjetas de Prueba:
- **Aprobada**: 4009 1759 9999 5431
- **Rechazada**: 4000 0000 0000 0002
- **Sin fondos**: 4000 0000 0000 0010

## 💰 Comisiones de MercadoPago

### Tarifas por país:

#### 🇦🇷 Argentina:
- **Tarifa por transacción**: 3.49% + $6.50
- **Cuenta digitales**: 0.99% del importe
- **Retiro a cuenta bancaria**: Sin costo

#### 🇨🇱 Chile:
- **Tarifa por transacción**: 3.49% + $300
- **Cuenta digitales**: 0.99% del importe

#### 🇲🇽 México:
- **Tarifa por transacción**: $9.00 + 3.49%
- **Cuenta digitales**: 0.99% del importe

## 📊 Flujo de Dinero

### 1. Usuario Realiza Pago:
```
Cliente paga $9.99 por paquete Estándar
↓
MercadoPago procesa en tiempo real
```

### 2. MercadoPago Retira Comisión:
```
$9.99 - $0.35 (comisión) = $9.64 netos
↓
Dinero disponible en tu cuenta MercadoPago
```

### 3. Transferir a Banco:
```
Desde dashboard MercadoPago
↓
Transferir a cuenta bancaria
↓
Dinero disponible en tu banco (1-2 días hábiles)
```

## 🎯 Implementación en tu Código

### Ya está listo en tu código:

```javascript
// En src/services/mercadopagoService.js
const config = {
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  // MercadoPago usa automáticamente tu cuenta
};

// Al crear preferencia:
const preferenciaData = {
  items: [{
    title: paquete.nombre,
    quantity: 1,
    unit_price: paquete.precio, // Esto va a tu cuenta
    currency_id: 'ARS',
  }],
  // ... resto de configuración
};
```

## 🔒 Seguridad y Compliance

### MercadoPago maneja automáticamente:
- ✅ **Tokenización** de datos sensibles
- ✅ **Codificación PCI DSS** 
- ✅ **Validación** de transacciones
- ✅ **Prevención** de fraudes
- ✅ **Cumplimiento** regulatorio

### Tu responsabilidad:
- ✅ Proteger credenciales de acceso
- ✅ Validar webhooks con firma
- ✅ Implementar logs de transacciones
- ✅ Manejar devoluciones/reversas

## 📈 Reportes y Analytics

### En MercadoPago Dashboard puedes ver:
- **Transacciones** por fecha/período
- **Montos totales** cobrados
- **Comisiones** pagadas
- **Estados** de transacciones
- **Métricas** de conversión

### Integración adicional opcional:
```javascript
// Para reportes automáticos
const reportes = await mercadopago.reports({
  fechaDesde: '2024-01-01',
  fechaHasta: '2024-12-31',
});
```

## 🚨 Consideraciones Importantes

### 1. **Testing Obligatorio**:
- Siempre prueba en sandbox primero
- Usa tarjetas de prueba
- Verifica webhooks locales

### 2. **Procesamiento de Errores**:
- Implementa retry logic
- Maneja pagos rechazados
- Logs de transacciones completos

### 3. **Experiencia de Usuario**:
- URLs de retorno claras
- Confirmaciones de pago
- Soporte al cliente

## 🎉 ¡Resultado Final!

Una vez configurado:

1. **Usuarios pagan** → MercadoPago procesa
2. **Dinero llega** → A tu cuenta MercadoPago  
3. **Monedas virtuales** → Se agregan automáticamente
4. **Transferes fondos** → A tu cuenta bancaria
5. **Comisiones mínimas** → Solo MercadoPago

**¡Tu plataforma podrá recibir pagos reales de usuarios y monetizar el sistema de monedas virtuales!** 🚀💎


