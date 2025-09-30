# Sistema de Monedas Virtuales - SMASH UFC

## Descripción
Sistema completo de monedas virtuales para la plataforma SMASH UFC, que permite a los usuarios comprar, gastar y gestionar monedas virtuales para participar en predicciones, apuestas y otras actividades de la plataforma.

## Características Implementadas

### 🏗️ Arquitectura
- **Frontend**: React con Vite
- **Backend**: Supabase
- **Pagos**: Integración preparada para MercadoPago
- **Internacionalización**: Soporte para ES, EN, PT

### 💰 Funcionalidades Principales

#### 1. Compra de Monedas
- **4 Paquetes disponibles**:
  - Básico: 100 monedas - $2.99
  - Estándar: 500 monedas - $9.99 (17% descuento) - ⭐ Más Popular
  - Premium: 1200 monedas - $19.99 (33% descuento) - 💎 Mejor Valor
  - Pro: 2500 monedas - $34.99 (44% descuento)

#### 2. Gestión de Saldo
- Visualización del saldo actual
- Historial de transacciones
- Actualización en tiempo real

#### 3. Sistema de Transacciones
- Registro automático de ingresos y egresos
- Historial detallado con fechas y motivos
- Trazabilidad completa

## 📁 Estructura de Archivos

```
src/
├── services/
│   └── coinService.js              # Lógica de negocio para monedas
├── components/coins/
│   ├── CoinPurchaseCard.jsx        # Tarjeta de paquete de monedas
│   ├── TransactionHistory.jsx      # Historial de transacciones
│   └── CoinBalance.jsx            # Componente de saldo
├── pages/
│   └── CoinPurchasePage.jsx        # Página principal de compra
├── hooks/
│   └── useCoinPurchase.js          # Hook personalizado para compras
├── context/
│   └── UserContext.jsx            # Contexto actualizado con funciones de monedas
└── locales/
    ├── es.json                    # Traducciones en español
    ├── en.json                    # Traducciones en inglés
    └── pt.json                    # Traducciones en portugués
```

## 🚀 Componentes Principales

### CoinPurchasePage
Página principal que incluye:
- Selección de paquetes de monedas
- Información de seguridad y métodos de pago
- Historial de transacciones
- Beneficios de la compra

### CoinPurchaseCard
Tarjeta individual para cada paquete con:
- Información del paquete (precio, monedas, descuento)
- Botón de compra
- Estados de carga
- Indicadores visuales (popular, mejor valor)

### TransactionHistory
Componente para mostrar:
- Lista de transacciones recientes
- Filtros por tipo (ingreso/egreso)
- Fechas y motivos
- Estados de carga

## 🔧 Servicios y Hooks

### coinService.js
Funciones principales:
- `agregarMonedas()` - Agregar monedas al usuario
- `gastarMonedas()` - Gastar monedas del usuario
- `obtenerSaldo()` - Consultar saldo actual
- `obtenerHistorialTransacciones()` - Obtener historial
- `crearPreferenciaMercadoPago()` - Crear preferencia de pago
- `procesarPagoExitoso()` - Procesar pago completado

### useCoinPurchase Hook
Hook personalizado que proporciona:
- `purchaseCoins()` - Función para iniciar compra
- `handlePaymentSuccess()` - Manejar pago exitoso
- Estados de carga y autenticación
- Manejo de errores integrado

### UserContext Actualizado
Nuevas funciones disponibles:
- `addCoins()` - Agregar monedas
- `spendCoins()` - Gastar monedas
- `hasEnoughCoins()` - Verificar saldo suficiente
- `updateUserBalance()` - Actualizar saldo

## 🎨 Diseño y UX

### Características Visuales
- **Tema oscuro** consistente con la plataforma
- **Gradientes** y efectos visuales atractivos
- **Iconografía** clara con Lucide React
- **Responsive design** para todos los dispositivos

### Estados de Interacción
- Estados de carga durante el proceso de compra
- Feedback visual inmediato
- Mensajes de éxito y error
- Animaciones suaves

## 🔐 Seguridad

### Medidas Implementadas
- Validación de autenticación antes de compras
- Verificación de saldo suficiente antes de gastos
- Registro completo de transacciones
- Manejo seguro de errores

### Preparado para MercadoPago
- Estructura lista para integración real
- Manejo de webhooks de pago
- Procesamiento de confirmaciones
- Gestión de estados de pago

## 🌐 Internacionalización

### Idiomas Soportados
- **Español** (ES) - Idioma principal
- **Inglés** (EN) - Idioma secundario
- **Portugués** (PT) - Idioma adicional

### Traducciones Incluidas
- Textos de la interfaz de compra
- Mensajes de error y éxito
- Información de paquetes
- Historial de transacciones

## 📱 Navegación Integrada

### Puntos de Acceso
- **Header**: Botón prominente para usuarios autenticados
- **UserMenu**: Enlace en el menú desplegable del usuario
- **Sidebar**: Enlace en la navegación móvil
- **Ruta directa**: `/coins`

## 🔄 Flujo de Compra

1. **Selección**: Usuario elige paquete de monedas
2. **Autenticación**: Verificación de usuario logueado
3. **Pago**: Redirección a MercadoPago (simulado)
4. **Procesamiento**: Confirmación de pago
5. **Actualización**: Saldo actualizado en tiempo real
6. **Notificación**: Confirmación de compra exitosa

## 🛠️ Próximos Pasos para Backend

### Integración MercadoPago
1. Configurar credenciales de MercadoPago
2. Implementar creación real de preferencias
3. Configurar webhooks para confirmación de pagos
4. Manejar estados de pago (pendiente, aprobado, rechazado)

### Base de Datos
1. Crear tabla `compras_monedas` para registro de compras
2. Implementar triggers para actualización automática de saldo
3. Configurar índices para consultas optimizadas
4. Implementar backup y recuperación

### Seguridad Adicional
1. Implementar rate limiting para compras
2. Validación de montos mínimos/máximos
3. Auditoría completa de transacciones
4. Detección de fraudes

## 📊 Métricas y Analytics

### Datos Disponibles
- Historial completo de transacciones
- Patrones de compra por usuario
- Conversión por paquete
- Tiempo de procesamiento de pagos

## 🧪 Testing

### Casos de Prueba Sugeridos
- Compra exitosa de diferentes paquetes
- Manejo de errores de pago
- Verificación de actualización de saldo
- Validación de autenticación
- Responsive design en diferentes dispositivos

---

**Nota**: Este sistema está completamente preparado para la integración con el backend real. Solo requiere la configuración de MercadoPago y la implementación de los webhooks correspondientes.
