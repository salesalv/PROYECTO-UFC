import React from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { User, BarChart2, LogOut, Coins } from "lucide-react"; // Removed unused icons
import { useUser } from "@/context/UserContext";
import supabase from "@/db";
import { useTranslation } from 'react-i18next';

const Sidebar = ({ trigger, navItems }) => {
  const { t } = useTranslation();
  // Placeholder user data
  const userPoints = 1250;

  const { user: userData, refreshUser } = useUser();

  // Combined sidebar links
  const allSidebarLinks = [
    ...(navItems || []).map(item => ({
      icon: item.icon,
      label: item.label || item.name,
      path: item.path,
    })),
    { icon: User, label: t('nav.profile'), path: "/profile" },
    { icon: BarChart2, label: t('nav.my_rankings'), path: "/rankings" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut({ redirectTo: window.location.origin + '/login' });
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    sessionStorage.clear();
    if (refreshUser) refreshUser();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="left" className="bg-black border-gray-800 text-white w-[280px] sm:w-[320px] flex flex-col">
        <SheetHeader className="mb-6 border-b border-gray-700 pb-4">
          <SheetTitle>
            <Link to="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-auto" />
              <span className="font-bold text-xl text-white">SMASH</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full pb-10 overflow-y-auto">
          {/* User Points */}
          <div className="mb-6 px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-700 flex items-center justify-between">
            <span className="font-medium text-gray-300">{t('sidebar.my_points')}</span>
            <div className="flex items-center text-yellow-400 font-bold text-lg">
              <Coins className="h-5 w-5 mr-2" />
              {userPoints.toLocaleString()}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow space-y-1">
            {allSidebarLinks.map((link) => (
              <SheetClose key={link.label} asChild>
                <Link
                  to={link.path}
                  className="flex items-center px-4 py-2.5 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
                >
                  {link.icon && <link.icon className="h-5 w-5 mr-3" />}
                  <span className="font-medium text-sm">{link.label}</span>
                </Link>
              </SheetClose>
            ))}
          </nav>

          {/* Auth Buttons (Mobile) */}
          <div className="mt-auto space-y-2 border-t border-gray-700 pt-4">
            {!userData && (
              <>
             <SheetClose asChild>
               <Button variant="ghost" className="w-full justify-start" asChild>
                 <Link to="/login">{t('auth.login')}</Link>
               </Button>
             </SheetClose>
             <SheetClose asChild>
               <Button className="w-full bg-red-600 hover:bg-red-700" asChild>
                 <Link to="/register">{t('auth.register')}</Link>
               </Button>
             </SheetClose>
              </>
            )}
          </div>

          {/* Logout Button */}
          {userData && (
          <div className="mt-4 border-t border-gray-700 pt-4">
            <SheetClose asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start text-red-500 hover:bg-red-900/50 hover:text-red-400"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span className="font-medium">{t('auth.logout')}</span>
              </Button>
            </SheetClose>
          </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
