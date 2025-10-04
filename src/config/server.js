import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Puerto del servidor
  port: process.env.PORT || 3001,
  
  // Entorno
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'mi-secreto-super-seguro-para-jwt',
  
  // MercadoPago
  mercadoPago: {
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST_ACCESS_TOKEN',
    publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || 'TEST_PUBLIC_KEY',
  },
  
  // URLs
  urls: {
    base: process.env.BASE_URL || 'http://localhost:3001',
    frontend: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  
  // Validaciones
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default config;
