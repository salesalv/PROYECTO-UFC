import React, { useState, useEffect, useRef } from "react";
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
import supabase from "@/db";
import { useUser } from "@/context/UserContext";

const UserProfilePage = () => {
  const { user: userData, loading, refreshUser } = useUser();
  const [notifications, setNotifications] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [privacy, setPrivacy] = useState('public');
  const [isEditing, setIsEditing] = useState(false);
  const [editableUsername, setEditableUsername] = useState('');
  const fileInputRef = useRef();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      // Buscar datos personalizados en la tabla 'usuario'
      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('correo', user.email)
        .single();
      if (data) {
        setUserData(data);
        setNotifications(data.notificaciones);
        setTheme(data.tema);
        setEditableUsername(data.nombre_usuario);
      }
    };
    fetchUserData();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      let avatarUrl = userData?.avatar;
      let updateError = null;

      if (avatarFile) {
        // Subir imagen a Supabase Storage
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${userData.id}_${Date.now()}.${fileExt}`;
        const { data: storageData, error: storageError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true });
        if (!storageError) {
          const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
          avatarUrl = publicUrlData.publicUrl;
        }
      }

      // Actualizar en Supabase
      const { error } = await supabase
        .from('usuario')
        .update({ nombre_usuario: editableUsername, avatar: avatarUrl })
        .eq('correo', userData.correo);

      if (error) {
        alert('Error al guardar los cambios: ' + error.message);
        updateError = error;
      } else {
        setAvatarFile(null);
        setAvatarPreview(null);
        setIsEditing(false);
        if (refreshUser) refreshUser();
      }
    } else {
      setEditableUsername(userData?.nombre_usuario || '');
      setIsEditing(true);
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
                    src={avatarPreview || userData?.avatar || "/pain.png"} />
                  <Button variant="ghost" size="icon" className="absolute bottom-0 right-0 bg-gray-700/80 rounded-full hover:bg-red-600" onClick={() => fileInputRef.current.click()}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  {isEditing && (
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleAvatarChange}
                    />
                  )}
                </div>
                <CardTitle className="text-3xl font-black uppercase tracking-wider text-red-500">
                  {userData?.nombre_usuario || "Usuario"}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Miembro desde {userData ? new Date(userData.fecha_registro).toLocaleDateString() : "-"}
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
                      <p className="font-semibold text-white">{userData?.nombre_usuario}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <Mail className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-300">Correo Electrónico</p>
                    <p className="font-semibold text-white">{userData?.correo}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <Award className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-300">Puntos Totales</p>
                      <p className="font-semibold text-xl text-white">{userData?.puntos ?? 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-300">Ranking</p>
                      <p className="font-semibold text-xl text-white">{userData?.rango ?? '-'}</p>
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
