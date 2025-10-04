import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import comprasRoutes from './routes/compras.js';
import recompensasRoutes from './routes/recompensas.js';
import insigniasRoutes from './routes/insignias_nueva.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/recompensas', recompensasRoutes);
app.use('/api/insignias', insigniasRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 