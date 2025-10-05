import supabase from '../db.js';

async function setupComprasTables() {
  try {
    console.log('🚀 Iniciando configuración de tablas de compras...');

    // Crear tabla compras_monedas usando SQL directo
    const comprasQuery = `
      CREATE TABLE IF NOT EXISTS compras_monedas (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
        paquete_id VARCHAR(50) NOT NULL,
        monedas INTEGER NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        payment_id VARCHAR(255) UNIQUE NOT NULL,
        estado VARCHAR(20) DEFAULT 'pendiente',
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        procesado_at TIMESTAMP
      )
    `;

    // Intentar crear la tabla directamente
    try {
      const { data: comprasData, error: comprasError } = await supabase
        .from('compras_monedas')
        .select('*')
        .limit(1);
      
      if (comprasError && comprasError.code === 'PGRST116') {
        console.log('ℹ️  Tabla compras_monedas necesita ser creada manualmente en Supabase');
        console.log('📋 Ejecutar este SQL en Supabase Dashboard:');
        console.log(comprasQuery);
      } else if (!comprasError) {
        console.log('✅ Tabla compras_monedas ya existe');
      }
    } catch (error) {
      console.log('ℹ️  Tabla compras_monedas necesita configuración manual');
    }

    // Intentar crear tabla paquetes_monedas
    try {
      const { data: paquetesData, error: paquetesError } = await supabase
        .from('paquetes_monedas')
        .select('*')
        .limit(1);
      
      if (paquetesError && paquetesError.code === 'PGRST116') {
        console.log('ℹ️  Tabla paquetes_monedas necesita ser creada manualmente en Supabase');
        console.log('📋 Ejecutar este SQL en Supabase Dashboard:');
        
        const paquetesQuery = `
          CREATE TABLE paquetes_monedas (
            id VARCHAR(50) PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            monedas INTEGER NOT NULL,
            precio DECIMAL(10,2) NOT NULL,
            descuento DECIMAL(5,2) DEFAULT 0,
            popular BOOLEAN DEFAULT FALSE,
            activo BOOLEAN DEFAULT TRUE,
            orden INTEGER DEFAULT 0
          )
        `;
        console.log(paquetesQuery);
      } else if (!paquetesError) {
        console.log('✅ Tabla paquetes_monedas ya existe');
      }
    } catch (error) {
      console.log('ℹ️  Tabla paquetes_monedas necesita configuración manual');
    }

    console.log('\n✨ Configuración completada!');
    console.log('\n📝 Pasos siguientes:');
    console.log('1. Ve a tu dashboard de Supabase');
    console.log('2. Ve a SQL Editor');
    console.log('3. Ejecuta los comandos SQL mostrados arriba');
    console.log('4. Ejecuta: npm run server');
    
  } catch (error) {
    console.error('❌ Error configurando compras:', error);
  }
}

setupComprasTables();


