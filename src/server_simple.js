import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import comprasRoutes from './routes/compras.js';
// Temporalmente comentar las rutas problemáticas
// import recompensasRoutes from './routes/recompensas.js';
// import insigniasRoutes from './routes/insignias.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/compras', comprasRoutes);
// Temporalmente comentado
// app.use('/api/recompensas', recompensasRoutes);
// app.use('/api/insignias', insigniasRoutes);

// Rutas temporales para testing
app.use('/api/recompensas', (req, res) => {
  res.json({ message: 'API de recompensas temporal' });
});

app.use('/api/insignias', (req, res) => {
  res.json({ message: 'API de insignias temporal' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
