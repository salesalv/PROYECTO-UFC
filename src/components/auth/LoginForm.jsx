import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Aquí iría la lógica de autenticación
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <Card className="w-full max-w-md bg-black/80 border-gray-800 text-white backdrop-blur-sm shadow-xl">
      <CardHeader className="space-y-3">
        <CardTitle className="text-3xl font-black text-red-600 tracking-wider">INICIAR SESIÓN</CardTitle>
        <CardDescription className="text-gray-400 text-base">
          Ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-300">Correo Electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input 
                id="email" 
                type="email" 
                placeholder="tu@email.com" 
                required 
                className="pl-10 bg-gray-900/50 border-gray-700 focus:ring-red-600 focus:border-red-600" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-300">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                required 
                className="pl-10 bg-gray-900/50 border-gray-700 focus:ring-red-600 focus:border-red-600" 
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
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="rounded border-gray-700 bg-gray-900/50 text-red-600 focus:ring-red-600"
              />
              <label htmlFor="remember" className="text-gray-400">Recordarme</label>
            </div>
            <Link to="/forgot-password" className="text-red-500 hover:text-red-400 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-red-500 hover:text-red-400 hover:underline font-medium">
                Regístrate aquí
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              Al iniciar sesión, aceptas nuestros{" "}
              <Link to="/terms" className="text-gray-400 hover:text-gray-300 hover:underline">
                Términos y Condiciones
              </Link>
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
