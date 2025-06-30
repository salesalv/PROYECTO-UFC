import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import supabase from "@/db";
import { useTranslation } from 'react-i18next';

const RegisterForm = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    correo: '',
    contraseña: '',
    confirmar_contraseña: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar que las contraseñas coincidan
    if (formData.contraseña !== formData.confirmar_contraseña) {
      setError(t('auth.passwords_no_match'));
      return;
    }

    setIsLoading(true);
    try {
      // Registro directo con Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.correo,
        password: formData.contraseña,
        options: {
          data: {
            nombre_usuario: formData.nombre_usuario
          }
        }
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      // Si el registro fue exitoso, inserta en la tabla personalizada
      const { user } = data;
      const { error: insertError } = await supabase
        .from('usuario')
        .insert([
          {
            nombre_usuario: formData.nombre_usuario,
            correo: formData.correo,
            fecha_registro: new Date().toISOString(),
            puntos: 0,
            rango: 'Novato',
            avatar: null,
            notificaciones: true,
            tema: 'dark',
            contraseña: '', // No guardar la contraseña aquí
            saldo: 0
          }
        ]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Puedes guardar el usuario en localStorage si lo deseas
      // localStorage.setItem('user', JSON.stringify(data.user));

      // Redirigir al usuario a la página de inicio de sesión
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-black/80 border-gray-800 text-white backdrop-blur-sm shadow-xl">
      <CardHeader className="space-y-3">
        <CardTitle className="text-3xl font-black text-red-600 tracking-wider">{t('auth.create_account')}</CardTitle>
        <CardDescription className="text-gray-400 text-base">
          {t('auth.complete_data_join_community')}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="nombre_usuario" className="text-sm font-medium text-gray-300">{t('auth.username')}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input 
                id="nombre_usuario" 
                name="nombre_usuario"
                placeholder={t('auth.username_placeholder')} 
                required 
                className="pl-10 bg-gray-900/50 border-gray-700 focus:ring-red-600 focus:border-red-600" 
                value={formData.nombre_usuario}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="correo" className="text-sm font-medium text-gray-300">{t('auth.email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input 
                id="correo" 
                name="correo"
                type="email" 
                placeholder={t('auth.email_placeholder')} 
                required 
                className="pl-10 bg-gray-900/50 border-gray-700 focus:ring-red-600 focus:border-red-600" 
                value={formData.correo}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contraseña" className="text-sm font-medium text-gray-300">{t('auth.password')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input 
                id="contraseña" 
                name="contraseña"
                type={showPassword ? "text" : "password"} 
                required 
                className="pl-10 bg-gray-900/50 border-gray-700 focus:ring-red-600 focus:border-red-600 pr-10" 
                value={formData.contraseña}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmar_contraseña" className="text-sm font-medium text-gray-300">{t('auth.confirm_password')}</Label>
            <div className="relative">
               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input 
                id="confirmar_contraseña" 
                name="confirmar_contraseña"
                type={showConfirmPassword ? "text" : "password"} 
                required 
                className="pl-10 bg-gray-900/50 border-gray-700 focus:ring-red-600 focus:border-red-600 pr-10" 
                value={formData.confirmar_contraseña}
                onChange={handleChange}
              />
               <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
           <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-lg py-3 font-bold uppercase tracking-wider"
            disabled={isLoading}
          >
            {isLoading ? t('auth.registering') : t('auth.register')}
          </Button>
           <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">
              {t('auth.already_have_account')}{' '}
              <Link to="/login" className="text-red-500 hover:text-red-400 hover:underline font-medium">
                {t('auth.login_here')}
              </Link>
            </p>
             <p className="text-xs text-gray-500">
              {t('auth.accept_terms')}
              <Link to="/terms" className="text-gray-400 hover:text-gray-300 hover:underline">
                {t('auth.terms_conditions')}
              </Link>
            </p>
           </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
