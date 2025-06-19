
import React from 'react';
import { Monitor, Users, Clock, Shield, Activity, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Monitor, label: 'Appareils connectés', value: '5', change: '+2 cette semaine' },
    { icon: Users, label: 'Sessions actives', value: '2', change: 'En cours' },
    { icon: Clock, label: 'Temps total', value: '24h', change: 'Ce mois-ci' },
    { icon: Shield, label: 'Sécurité', value: '100%', change: 'Protégé' },
  ];

  const recentConnections = [
    { device: 'PC-Bureau-01', user: 'John Doe', time: '10:30', status: 'active' },
    { device: 'Laptop-Marie', user: 'Marie L.', time: '09:15', status: 'completed' },
    { device: 'PC-Client-03', user: 'Support', time: '08:45', status: 'completed' },
  ];

  const handleNewDevice = () => {
    navigate('/devices');
  };

  const handleQuickConnect = () => {
    navigate('/connect');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Bienvenue sur RemoteControl Pro</h1>
        <p className="text-blue-100 mb-6">Gérez vos connexions à distance en toute sécurité</p>
        <div className="flex space-x-4">
          <Button 
            className="bg-white text-blue-600 hover:bg-blue-50"
            onClick={handleNewDevice}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel appareil
          </Button>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-white/10"
            onClick={handleQuickConnect}
          >
            Connexion rapide
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Connexions récentes</span>
            </CardTitle>
            <CardDescription>Vos dernières sessions de contrôle à distance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentConnections.map((connection, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      connection.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{connection.device}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">par {connection.user}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{connection.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Sécurité</span>
            </CardTitle>
            <CardDescription>État de la sécurité de vos connexions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Chiffrement</span>
                <span className="text-green-600 dark:text-green-400 text-sm">AES-256 ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Double authentification</span>
                <span className="text-green-600 dark:text-green-400 text-sm">Activée ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Certificat SSL</span>
                <span className="text-green-600 dark:text-green-400 text-sm">Valide ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dernière mise à jour</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">Aujourd'hui</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
