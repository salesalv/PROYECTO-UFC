import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle, Settings, LogOut, Award, BarChart2, Star, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const userData = {
  username: "MMA_Predictor_Pro",
  email: "predictor.pro@email.com",
  joinedDate: "2024-01-15",
  points: 1250,
  rank: "#6",
  avatar: "https://images.unsplash.com/photo-1545191488-2682adc1dfe4",
  level: 5,
  winRate: "78%",
  predictions: 156
};

const UserMenu = () => {
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
                src={userData.avatar}
                alt={userData.username}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-red-600"
              />
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {userData.level}
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-lg font-bold text-white">{userData.username}</p>
              <p className="text-xs text-gray-400">{userData.email}</p>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-500">{userData.points.toLocaleString()} pts</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 p-3 bg-gray-900/50">
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-800/50">
            <BarChart2 className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-gray-400">Win Rate</p>
              <p className="text-sm font-medium text-white">{userData.winRate}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-800/50">
            <Star className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-400">Predicciones</p>
              <p className="text-sm font-medium text-white">{userData.predictions}</p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/rankings" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md">
              <Trophy className="mr-2 h-4 w-4 text-yellow-500" />
              <span>Ranking Global</span>
              <span className="ml-auto text-xs text-gray-400">#{userData.rank}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <DropdownMenuItem className="text-red-500 hover:text-red-400 hover:bg-red-900/20 rounded-md">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu; 