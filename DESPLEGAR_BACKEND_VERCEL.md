# 🚀 DESPLEGAR BACKEND EN VERCEL - PASO A PASO

## 📋 PASO 1: Crear archivo vercel.json

Crear archivo `vercel.json` en la raíz del proyecto:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "src/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## 📋 PASO 2: Crear archivo api/compras.js

Crear carpeta `api` en la raíz y archivo `api/compras.js`:

```javascript
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

const config = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: {
    timeout: 5000,
    idempotencyKey: `mp_${Date.now()}`,
  },
});

const payment = new Payment(config);
const preference = new Preference(config);

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST' && req.url === '/api/compras/webhook') {
      // Procesar webhook
      console.log('Webhook recibido:', req.body);
      
      // Aquí procesarías el pago
      res.status(200).json({ received: true });
    } else if (req.method === 'POST' && req.url === '/api/compras/crear-pago') {
      // Crear preferencia de pago
      const { paqueteId } = req.body;
      
      const paquetes = [
        { id: 'basico', nombre: 'Paquete Básico', monedas: 100, precio: 2.99 },
        { id: 'estandar', nombre: 'Paquete Estándar', monedas: 500, precio: 9.99 },
        { id: 'premium', nombre: 'Paquete Premium', monedas: 1200, precio: 19.99 },
        { id: 'pro', nombre: 'Paquete Pro', monedas: 2500, precio: 34.99 }
      ];
      
      const paquete = paquetes.find(p => p.id === paqueteId);
      if (!paquete) {
        return res.status(400).json({ success: false, error: 'Paquete no encontrado' });
      }

      const preferenciaData = {
        items: [
          {
            id: paquete.id,
            title: paquete.nombre,
            description: `Paquete de ${paquete.monedas} monedas virtuales para SMASH UFC`,
            category_id: 'entertainment',
            quantity: 1,
            currency_id: 'ARS',
            unit_price: paquete.precio,
          },
        ],
        external_reference: `smash_ufc_${paquete.id}_${Date.now()}`,
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12,
        },
        notification_url: `${process.env.BASE_URL}/api/compras/webhook`,
        back_urls: {
          success: `${process.env.FRONTEND_URL}/comprar-monedas/success`,
          failure: `${process.env.FRONTEND_URL}/comprar-monedas/failure`,
          pending: `${process.env.FRONTEND_URL}/comprar-monedas/pending`,
        },
        auto_return: 'approved',
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      const response = await preference.create({ body: preferenciaData });
      
      res.json({
        success: true,
        preference_id: response.id,
        init_point: response.init_point,
        external_reference: response.external_reference,
      });
    } else {
      res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

## 📋 PASO 3: Configurar Variables de Entorno en Vercel

En el dashboard de Vercel:

1. **Ir a**: Tu proyecto → Settings → Environment Variables
2. **Agregar**:
   ```
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-130708112804803-100510-d3ce971c5ac19413518658f868eb33f1-1444955939
   MERCADOPAGO_PUBLIC_KEY=APP_USR-dde802f9-f57a-4d15-bb52-6697acf00b3a
   BASE_URL=https://smashufc-nine.vercel.app
   FRONTEND_URL=https://smashufc-nine.vercel.app
   JWT_SECRET=mi-jwt-super-secreto-de-produccion-smash-ufc-2024
   ```

## 📋 PASO 4: Desplegar

1. **Commit y push** a GitHub
2. **Vercel** desplegará automáticamente
3. **Probar** endpoints:
   - `https://smashufc-nine.vercel.app/api/compras/paquetes`
   - `https://smashufc-nine.vercel.app/api/compras/webhook`

## 🧪 PASO 5: Probar Sistema Completo

1. **Configurar webhook** en MercadoPago
2. **Probar pago** con tarjeta real
3. **Verificar** que funciona el webhook
4. **¡Empezar a recibir dinero!**
