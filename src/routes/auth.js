import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../db.js';
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
    const { data: existingUser, error: userError } = await supabase
      .from('usuario')
      .select('*')
      .eq('correo', correo)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Verificar si el nombre de usuario ya existe
    const { data: existingUsername, error: usernameError } = await supabase
      .from('usuario')
      .select('*')
      .eq('nombre_usuario', nombre_usuario)
      .single();

    if (existingUsername) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar el nuevo usuario
    const { data: newUser, error: insertError } = await supabase
      .from('usuario')
      .insert([
        {
          nombre_usuario,
          correo,
          contraseña: hashedPassword,
          fecha_registro: new Date().toISOString(),
          puntos: 0,
          rango: 'Novato',
          notificaciones: true,
          tema: 'dark',
          saldo: 0.00
        }
      ])
      .select()
      .single();

    if (insertError) throw insertError;

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
    const { data: user, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('correo', correo)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(contraseña, user.contraseña);
    
    if (!validPassword) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Create user object without password
    const userData = {
      id: user.id,
      nombre_usuario: user.nombre_usuario,
      correo: user.correo,
      fecha_registro: user.fecha_registro,
      puntos: user.puntos,
      rango: user.rango,
      avatar: user.avatar,
      notificaciones: user.notificaciones,
      tema: user.tema,
      saldo: user.saldo
    };

    const token = jwt.sign(
      { id: user.id, correo: user.correo },
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