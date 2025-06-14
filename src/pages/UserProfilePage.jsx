import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, Award, Edit, Trophy, Bell, Shield } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

// Placeholder user data
const userData = {
  username: "Rugal444",
  email: "rugal444@gmail.com",
  joinedDate: "2024-01-15",
  points: 1250,
  rank: "#6",
  avatar: "image.png",
  notifications: true,
  theme: "dark",
  privacy: "public"
};

const UserProfilePage = () => {
  const [notifications, setNotifications] = useState(userData.notifications);
  const [theme, setTheme] = useState(userData.theme);
  const [privacy, setPrivacy] = useState(userData.privacy);
  const [isEditing, setIsEditing] = useState(false);
  const [editableUsername, setEditableUsername] = useState(userData.username);
  const [editableEmail, setEditableEmail] = useState(userData.email);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Aquí iría la lógica para guardar los cambios, por ahora solo alterna
      console.log("Guardando cambios...");
      // En una aplicación real, enviarías editableUsername y editableEmail a una API
    } else {
      // Cuando entras en modo edición, inicializa los valores con los actuales
      setEditableUsername(userData.username);
      setEditableEmail(userData.email);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna Principal */}
          <div className="md:col-span-2">
            <Card className="bg-black/70 border border-gray-800 backdrop-blur-sm shadow-lg">
              <CardHeader className="text-center">
                <div className="relative inline-block mb-4">
                  <img  
                    className="w-32 h-32 rounded-full mx-auto border-4 border-red-600 object-cover"
                    alt="User Avatar"
                    src="/pain.png" />
                  <Button variant="ghost" size="icon" className="absolute bottom-0 right-0 bg-gray-700/80 rounded-full hover:bg-red-600">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-3xl font-black uppercase tracking-wider text-red-500">
                  {userData.username}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Miembro desde {new Date(userData.joinedDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-6 space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <User className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-300">Nombre de Usuario</p>
                    {isEditing ? (
                      <Input
                        className="font-semibold text-white bg-gray-800 border-gray-700"
                        value={editableUsername}
                        onChange={(e) => setEditableUsername(e.target.value)}
                      />
                    ) : (
                      <p className="font-semibold text-white">{userData.username}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <Mail className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-300">Correo Electrónico</p>
                    {isEditing ? (
                      <Input
                        className="font-semibold text-white bg-gray-800 border-gray-700"
                        value={editableEmail}
                        onChange={(e) => setEditableEmail(e.target.value)}
                      />
                    ) : (
                      <p className="font-semibold text-white">{userData.email}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <Award className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-300">Puntos Totales</p>
                      <p className="font-semibold text-xl text-white">{userData.points.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-300">Ranking</p>
                      <p className="font-semibold text-xl text-white">{userData.rank}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  className="bg-red-600 hover:bg-red-700 font-bold uppercase tracking-wider"
                  onClick={handleEditToggle}
                >
                  {isEditing ? "Guardar Cambios" : "Editar Perfil"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Columna Lateral */}
          <div className="space-y-6">
            <Card className="bg-black/70 border border-gray-800 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-white">
                  <Bell className="w-5 h-5 text-red-500" />
                  Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Notificaciones Push</Label>
                  <Slider
                    defaultValue={[50]}
                    max={100}
                    step={1}
                    className="w-[60%]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Correos Electrónicos</Label>
                  <Slider
                    defaultValue={[75]}
                    max={100}
                    step={1}
                    className="w-[60%]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/70 border border-gray-800 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-white">
                  <Shield className="w-5 h-5 text-red-500" />
                  Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Cambiar Contraseña</Label>
                  <Input type="password" placeholder="Nueva contraseña" className="bg-gray-900/50 border-gray-700" />
                </div>
                <Button variant="outline" className="w-full">
                  Actualizar Contraseña
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfilePage;
