import supabase from '../db.js';

async function setupComprasTables() {
  try {
    console.log('🚀 Iniciando configuración de tablas de compras...');

    // Crear tabla compras_monedas
    const comprasSql = `
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
      );
      
      CREATE INDEX IF NOT EXISTS idx_compras_usuario_id ON compras_monedas(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_compras_fecha ON compras_monedas(fecha);
      CREATE INDEX IF NOT EXISTS idx_compras_estado ON compras_monedas(estado);
    `;

    const { error: comprasError } = await supabase.rpc('exec_sql', {
      sql: comprasSql
    });

    if (comprasError) {
      console.log('ℹ️  tabla compras_monedas podría ya existir');
    } else {
      console.log('✅ Tabla compras_monedas creada exitosamente');
    }

    // Crear tabla paquetes_monedas
    const paquetesSql = `
      CREATE TABLE IF NOT EXISTS paquetes_monedas (
        id VARCHAR(50) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        monedas INTEGER NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        descuento DECIMAL(5,2) DEFAULT 0,
        popular BOOLEAN DEFAULT FALSE,
        activo BOOLEAN DEFAULT TRUE,
        orden INTEGER DEFAULT 0
      );
    `;

    const { error: paquetesError } = await supabase.rpc('exec_sql', {
      sql: paquetesSql
    });

    if (paquetesError) {
      console.log('ℹ️  tabla paquetes_monedas podría ya existir');
    } else {
      console.log('✅ Tabla paquetes_monedas creada exitosamente');
    }

    // Insertar datos por defecto de paquetes
    const insertPaquetesSql = `
      INSERT INTO paquetes_monedas (id, nombre, monedas, precio, descuento, popular, orden) VALUES
      ('basico', 'Paquete Básico', 100, 2.99, 0, false, 1),
      ('estandar', 'Paquete Estándar', 500, 9.99, 17, true, 2),
      ('premium', 'Paquete Premium', 1200, 19.99, 33, false, 3),
      ('pro', 'Paquete Pro', 2500, 34.99, 44, false, 4)
      ON CONFLICT (id) DO NOTHING;
    `;

    const { error: insertError } = await supabase.rpc('exec_sql', {
      sql: insertPaquetesSql
    });

    if (insertError) {
      console.log('ℹ️  Datos de paquetes podrían ya existir');
    } else {
      console.log('✅ Datos de paquetes insertados exitosamente');
    }

    // Verificar que las tablas existen
    const { data: comprasTable, error: comprasCheckError } = await supabase
      .from('compras_monedas')
      .select('*')
      .limit(1);

    if (comprasCheckError) {
      console.log('⚠️  La tabla compras_monedas no está disponible aún');
    } else {
      console.log('✅ Tabla compras_monedas verificada correctamente');
    }

    const { data: paquetesTable, error: paquetesCheckError } = await supabase
      .from('paquetes_monedas')
      .select('*')
      .limit(1);

    if (paquetesCheckError) {
      console.log('⚠️  La tabla paquetes_monedas no está disponible aún');
    } else {
      console.log('✅ Tabla paquetes_monedas verificada correctamente');
    }

    console.log('🎉 Configuración de compras completada exitosamente!');

  } catch (error) {
    console.error('❌ Error configurando compras:', error);
  }
}

// Ejecutar solo si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  setupComprasTables();
}

export default setupComprasTables;
