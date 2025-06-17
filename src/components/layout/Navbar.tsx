
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Monitor, Settings, History, Users, FileText, MessageSquare, Home, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = ({ isDarkMode, toggleDarkMode }: { isDarkMode: boolean, toggleDarkMode: () => void }) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Accueil', path: '/' },
    { icon: Monitor, label: 'Mes Appareils', path: '/devices' },
    { icon: Users, label: 'Se connecter', path: '/connect' },
    { icon: FileText, label: 'Transfert fichiers', path: '/files' },
    { icon: MessageSquare, label: 'Messagerie', path: '/chat' },
    { icon: History, label: 'Historique', path: '/history' },
    { icon: Settings, label: 'Paramètres', path: '/settings' },
  ];

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RemoteControl Pro
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
            >
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
