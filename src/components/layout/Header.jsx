import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import Sidebar from "@/components/layout/Sidebar";
import { Coins, BarChart2, UserCircle, Calendar, Star, MessageSquare, PlayCircle, Users, GitCompare, User, Mail, Award, Trophy, Edit, Scissors } from "lucide-react";
import UserMenu from "./UserMenu";
import { useUser } from "@/context/UserContext";
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();
  const navItems = [
    { name: t('nav.home'), path: "/", icon: null },
    { name: t('nav.forum'), path: "/forum", icon: MessageSquare },
    { name: t('nav.fighters'), path: "/fighters", icon: Users },
    { name: t('nav.compare'), path: "/compare", icon: GitCompare },
    { name: t('nav.highlights'), path: "/highlights", icon: Star },
    { name: t('nav.events'), path: "/events", icon: Calendar },
    { name: t('nav.saved_clips'), path: "/clips", icon: Scissors },
    { name: t('nav.live'), path: "/live", icon: PlayCircle },
  ];

  const userPoints = 1500;
  const userLevel = 5;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user: userData, loading } = useUser();

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!localStorage.getItem('user'));
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800"
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center">
            <Logo className="h-12 w-auto" />
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                    isActive
                      ? "text-red-500 bg-red-900/20"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`
                }
              >
                {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            {!userData && (
              <>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">{t('auth.login')}</Link>
            </Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700" asChild>
              <Link to="/register">{t('auth.register')}</Link>
            </Button>
              </>
            )}
            <UserMenu />
          </div>

          <div className="lg:hidden">
            <Sidebar 
              trigger={<Button variant="ghost" size="icon"><UserCircle className="h-6 w-6" /></Button>}
              navItems={navItems}
            />
          </div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
