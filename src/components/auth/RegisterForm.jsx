
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  return (
    <Card className="w-full max-w-md bg-black/80 border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl text-red-600">Crear Cuenta</CardTitle>
        <CardDescription className="text-gray-400">Completa el formulario para registrarte.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="space-y-2">
          <Label htmlFor="username">Nombre de Usuario</Label>
          <Input id="username" placeholder="TuUsuario" required className="bg-gray-900 border-gray-700 focus:ring-red-600" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input id="email" type="email" placeholder="tu@email.com" required className="bg-gray-900 border-gray-700 focus:ring-red-600" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" required className="bg-gray-900 border-gray-700 focus:ring-red-600" />
        </div>
         <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
          <Input id="confirm-password" type="password" required className="bg-gray-900 border-gray-700 focus:ring-red-600" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
          Registrarse
        </Button>
         <p className="text-sm text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-red-500 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
