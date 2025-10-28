export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const paquetes = [
      {
        id: 'basico',
        nombre: 'Paquete Básico',
        monedas: 200,
        precio: 0.01,
        descripcion: 'Perfecto para empezar',
        popular: false
      },
      {
        id: 'estandar',
        nombre: 'Paquete Estándar',
        monedas: 500,
        precio: 9.99,
        descripcion: 'El más elegido',
        popular: true
      },
      {
        id: 'premium',
        nombre: 'Paquete Premium',
        monedas: 1200,
        precio: 19.99,
        descripcion: 'Para usuarios avanzados',
        popular: false
      },
      {
        id: 'pro',
        nombre: 'Paquete Pro',
        monedas: 2500,
        precio: 34.99,
        descripcion: 'Máximo rendimiento',
        popular: false
      }
    ];

    res.json({
      success: true,
      paquetes
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
