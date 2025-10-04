# 🚀 Guía Completa: Configuración de Producción con MercadoPago

## 📋 PASO 1: Cuenta Empresarial de MercadoPago

### 🎯 Crear Cuenta de Negocio:

1. **Ve a**: [mercadopago.com.ar](https://mercadopago.com.ar)
2. **Haz clic en**: "Para negocios"
3. **Selecciona**: "Crear cuenta"
4. **Completa**:
   - Nombre del negocio/comercio
   - Tu nombre completo
   - CUIT/CUIL
   - Email comercial
   - Teléfono

### 📄 Documentación Requerida:

**Para personas físicas:**
- DNI escaneado (frente y dorso)
- Comprobante de ingresos o monotributo
- Comprobante de domicilio (último recibo de servicios)

**Para empresas:**
- Escritura constitutiva
- CUIT/S inscripción en AFIP
- Estados contables
- Documentación del representante legal

### ⏱️ Tiempo de Aprobación:
- **Desarrollo verificado**: Inmediato
- **Cuenta completa**: 24-48 horas
- **Límites altos**: 3-5 días hábiles

---

## 🔑 PASO 2: Obtener Credenciales de Producción

### Una vez aprobada tu cuenta:

1. **Entra a**: [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
2. **Selecciona**: "Tus integraciones"
3. **Haz clic**: "Crear aplicación"
4. **Configura**:
   - Nombre: "SMASH UFC - Sistema de Monedas"
   - Descripción: "Plataforma de monedas virtuales para eventos UFC"
   - Categoría: "Gaming/Entretenimiento"

### 📝 Credenciales que obtienes:

```
🔑 ACCESS TOKEN (Producción):
APP_USR_xxxxxxxxxxxxxxxxxxxxxxxxxxx

🔑 PUBLIC KEY (Producción):
xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

🔑 WEBHOOK SECRET:
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## ⚙️ PASO 3: Configurar Variables de Entorno

### 📁 Crear archivo `.env` en la raíz del proyecto:

```env
# 🌍 CONFIGURACIÓN DE PRODUCCIÓN
NODE_ENV=production

# 🔧 Servidor
PORT=3001
HOST=0.0.0.0

# 🔐 Seguridad JWT
JWT_SECRET=super-secreto-produccion-${Math.random()}-2024

# 💳 MercadoPago (TUS CREDENCIALES REALES)
MERCADOPAGO_ACCESS_TOKEN=APP_USR_xxxxxxxxxxxxxxxxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 🌐 URLs de tu dominio real
BASE_URL=https://tu-dominio.com
FRONTEND_URL=https://tu-dominio.com

# 🗄️ Base de Datos (Si usas otra en producción)
SUPABASE_URL=https://gqylknstxjwlybyvvcvx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxeWxrbnN0eGp3bHlieXZ2Y3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTMyNzIsImV4cCI6MjA2NTY2OTI3Mn0.fdOlalxcPaKzpjaUnFowsY3gz6f0LYmCdE--aJ76zc8
```

---

## 🔗 PASO 4: Configurar Webhook de MercadoPago

### En tu Dashboard de MercadoPago:

1. **Ve a**: Tu aplicación → "Webhooks"
2. **Crea webhook**:
   - **Nombre**: "SMASH UFC - Pagos Completados"
   - **URL**: `https://tu-dominio.com/api/compras/webhook`
   - **Eventos**: Selecciona "Pagos"
   - **Tipo**: HTTP POST

### 🔍 Webhook debe recibir:

```json
{
  "id": 123456789,
  "live_mode": true,
  "type": "payment",
  "date_created": "2024-12-19T15:30:00.000Z",
  "action": "payment.created",
  "data": {
    "id": "123456789"
  }
}
```

### ❗ IMPORTANTE: Verificar firma del webhook:

```javascript
// En tu código webhook:
const signature = headers['x-signature'];
const isValid = mercadopago.validateWebhookSignature(body, signature);
if (!isValid) {
  return res.status(400).json({ error: 'Invalid signature' });
}
```

---

## 🌍 PASO 5: Configurar Dominio para Producción

### Opción A: Vercel (Recomendado - Gratis)

1. **Ve a**: [vercel.com](https://vercel.com)
2. **Conecta**: Tu repositorio de GitHub
3. **Configura**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Opción B: Netlify

1. **Ve a**: [netlify.com](https://netlify.com)
2. **Conecta**: Tu repositorio
3. **Configura**: Similar a Vercel

### Opción C: Servidor Propio (VPS/Cloud)

Para **Ubuntu Server**:
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clonar repo
git clone https://github.com/tu-usuario/smash-ufc.git
cd smash-ufc

# Instalar dependencias
npm install

# Usar pm2 para mantener servidor en línea
sudo npm install -g pm2
pm2 start src/server.js --name "smash-ufc-backend"
pm2 startup
pm2 save
```

---

## 🚀 PASO 6: Desplegar Aplicación

### 🖥️ Frontend (Vercel/Netlify):

1. **Build**: `npm run build`
2. **Deploy**: Automático desde GitHub
3. **Dominio**: `https://tu-app.vercel.app` (personalizable)

### 🔧 Backend (Servidor separado):

**Para Vercel/AWS/Google Cloud:**
```bash
# Crear archivo vercel.json
{
  "functions": {
    "src/server.js": {
      "runtime": "nodejs18.x"
    }
  },
  "routes": [
    { "src": "/api/(.*)", "dest": "/src/server.js" }
  ]
}
```

---

## 🧪 PASO 7: Probar Sistema en Producción

### 1. URLs de Testing Web:

```
🔍 Backend API: https://tu-dominio.com/api/compras/paquetes
🔍 Frontend: https://tu-dominio.com/comprar-monedas
```

### 2. Probar con Tarjetas Reales:

**Para Argentina:**
- **Aprobada**: 4509 9535 6623 3704 (Visa)
- **Rechazada**: 4013 5406 8274 6260 (Visa)
- **Sin fondos**: 4071 0304 0150 0001 (Visa)

**Para México:**
- **Aprobada**: 4017 5613 0100 0014 (Visa)
- **Rechazada**: 4017 5613 0100 0353 (Visa)

### 3. Verificar Webhook:

```bash
# Probar webhook con curl
curl -X POST https://tu-dominio.com/api/compras/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"payment","data":{"id":"123456789"}}'
```

---

## 📊 PASO 8: Monitoreo y Analytics

### Configurar Logs:

```javascript
// En tu servidor de producción
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Dashboard de MercadoPago:

1. **Ingresos**: Ver todos los pagos recibidos
2. **Comisiones**: Registrar comisiones pagadas
3. **Reportes**: Generar reportes mensuales
4. **Estadísticas**: Analizar conversión de ventas

---

## ✅ PASO 9: Checklist Final

### Antes de ir a producción verifica:

- [ ] Cuenta MercadoPago aprobada y verificada
- [ ] Credenciales de producción configuradas
- [ ] Variables de entorno establecidas
- [ ] Webhook funcionando correctamente
- [ ] URLs de retorno configuradas
- [ ] Sistema probado con tarjetas de prueba
- [ ] Logs y monitoreo configurados
- [ ] Dominio SSL (HTTPS) configurado
- [ ] Backup de base de datos configurado
- [ ] Documentación actualizada

---

## 💰 PASO 10: Configurar Transferencias Bancarias

### En MercadoPago:

1. **Ve a**: "Mi dinero" → "Transferencias"
2. **Agrega cuenta bancaria**:
   - CBU/Alias bancario
   - Datos del titular
   - Verificar identidad
3. **Configura transferencias**:
   - Manual: Cuando tú quieras
   - Automática: Diariamente/semanalmente
   - Límites: Según actividad comercial

### Bancos Compatibles (Argentina):
- Banco Santander Río
- Galicia
- BBVA
- HSBC
- Itaú
- Macro
- ICBC
- Banco Nación
- Provincia
- Ciudad

---

## 🎉 ¡RESULTADO FINAL!

### Una vez completado tendrás:

✅ **Sistema funcionando** con pagos reales
✅ **Dinero fluyendo** a tu cuenta cada día
✅ **Comisiones mínimas** (solo MercadoPago)
✅ **Transferencias automáticas** a tu banco
✅ **Reportes completos** de ingresos
✅ **Escalabilidad** para crecer el negocio

### 🏆 Proyección de Ingresos:

**Ejemplo con 100 usuarios activos/mes:**
- Paquetes promedian $12
- 100 usuarios × $12 = $1,200/mes
- Comisiones MercadoPago: ~$60
- **Ingreso neto**: ~$1,140/mes

**¡Tu plataforma SMASH UFC puede ser súper rentable! 🚀💰**
