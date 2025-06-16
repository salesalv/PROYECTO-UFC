import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  const { nombre_usuario, correo, contraseña } = req.body;

  if (!nombre_usuario || !correo || !contraseña) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    // Verificar si el correo ya existe
    const userExists = await pool.query('SELECT * FROM usuario WHERE correo = $1', [correo]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Verificar si el nombre de usuario ya existe
    const usernameExists = await pool.query('SELECT * FROM usuario WHERE nombre_usuario = $1', [nombre_usuario]);
    if (usernameExists.rows.length > 0) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar el nuevo usuario
    const result = await pool.query(
      `INSERT INTO usuario 
       (nombre_usuario, correo, contraseña, fecha_registro, puntos, rango, notificaciones, tema, saldo) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 0, 'Novato', true, 'dark', 0.00) 
       RETURNING id, nombre_usuario, correo, fecha_registro, puntos, rango, avatar, notificaciones, tema, saldo`,
      [nombre_usuario, correo, hashedPassword]
    );

    const newUser = result.rows[0];

    // Generar token JWT
    const token = jwt.sign(
      { id: newUser.id, correo: newUser.correo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;
  
  if (!correo || !contraseña) {
    return res.status(400).json({ message: 'Correo y contraseña requeridos' });
  }

  try {
    const user = await pool.query(
      'SELECT id, nombre_usuario, correo, fecha_registro, puntos, rango, avatar, notificaciones, tema, contraseña, saldo FROM usuario WHERE correo = $1',
      [correo]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(contraseña, user.rows[0].contraseña);
    
    if (!validPassword) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Create user object without password
    const userData = {
      id: user.rows[0].id,
      nombre_usuario: user.rows[0].nombre_usuario,
      correo: user.rows[0].correo,
      fecha_registro: user.rows[0].fecha_registro,
      puntos: user.rows[0].puntos,
      rango: user.rows[0].rango,
      avatar: user.rows[0].avatar,
      notificaciones: user.rows[0].notificaciones,
      tema: user.rows[0].tema,
      saldo: user.rows[0].saldo
    };

    const token = jwt.sign(
      { id: user.rows[0].id, correo: user.rows[0].correo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: userData
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router; 