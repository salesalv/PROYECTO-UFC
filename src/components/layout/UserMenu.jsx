import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle, LogOut, Award, BarChart2, Star, Coins, Crown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "@/db";
import { useUser } from "@/context/UserContext";
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UserMenu = () => {
  const navigate = useNavigate();
  const { user: userData, loading, refreshUser } = useUser();
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'es');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      const { data } = await supabase
        .from('usuario')
        .select('*')
        .eq('correo', user.email)
        .single();
      if (data) setUserData(data);
    };
    fetchUserData();
    const onStorage = () => fetchUserData();
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  const handleLogout = async () => {
    await supabase.auth.signOut({ redirectTo: window.location.origin + '/login' });
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    sessionStorage.clear();
    if (refreshUser) refreshUser();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <UserCircle className="h-8 w-8" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end">
        <div className="p-4 bg-gradient-to-br from-red-900/20 to-black border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={userData?.avatar || "/pain.png"}
                alt={userData?.nombre_usuario || t('user.default')}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-red-600"
              />
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {userData?.nivel || 1}
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-lg font-bold text-white">{userData?.nombre_usuario || t('user.default')}</p>
              <p className="text-xs text-gray-400">{userData?.correo || "-"}</p>
              <div className="flex items-center space-x-2">
                <Coins className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-400">{userData?.saldo?.toLocaleString() || 0} Monedas</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 p-3 bg-gray-900/50">
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-800/50">
            <BarChart2 className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-gray-400">{t('user.win_rate')}</p>
              <p className="text-sm font-medium text-white">{userData?.winRate || "-"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-800/50">
            <Star className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-400">{t('user.predictions')}</p>
              <p className="text-sm font-medium text-white">{userData?.predictions || "-"}</p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>{t('user.profile')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/coins" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md">
              <Coins className="mr-2 h-4 w-4 text-yellow-400" />
              <span>{t('nav.buy_coins')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/rewards" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md">
              <Crown className="mr-2 h-4 w-4 text-purple-400" />
              <span>{t('nav.rewards')}</span>
            </Link>
          </DropdownMenuItem>
          <div className="mt-3 px-2">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                <SelectValue>{t('profile.language')}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <DropdownMenuItem className="text-red-500 hover:text-red-400 hover:bg-red-900/20 rounded-md" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('auth.logout')}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu; 