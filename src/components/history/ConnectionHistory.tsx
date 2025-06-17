
import React, { useState } from 'react';
import { History, Monitor, Clock, User, Filter, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const ConnectionHistory = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const connections = [
    {
      id: 1,
      device: 'PC-Bureau-01',
      user: 'John Doe',
      type: 'outgoing',
      status: 'completed',
      startTime: '2024-01-15 10:30:00',
      endTime: '2024-01-15 11:15:00',
      duration: '45 min',
      ip: '192.168.1.10',
      filesTransferred: 3,
      bytesTransferred: '15.2 MB'
    },
    {
      id: 2,
      device: 'Laptop-Marie',
      user: 'Marie Leroy',
      type: 'incoming',
      status: 'completed',
      startTime: '2024-01-15 09:15:00',
      endTime: '2024-01-15 09:45:00',
      duration: '30 min',
      ip: '192.168.1.15',
      filesTransferred: 1,
      bytesTransferred: '2.3 MB'
    },
    {
      id: 3,
      device: 'PC-Client-03',
      user: 'Support Tech',
      type: 'outgoing',
      status: 'interrupted',
      startTime: '2024-01-15 08:45:00',
      endTime: '2024-01-15 08:50:00',
      duration: '5 min',
      ip: '10.0.0.25',
      filesTransferred: 0,
      bytesTransferred: '0 B'
    },
    {
      id: 4,
      device: 'Serveur-Prod',
      user: 'Admin System',
      type: 'outgoing',
      status: 'completed',
      startTime: '2024-01-14 16:20:00',
      endTime: '2024-01-14 17:30:00',
      duration: '1h 10min',
      ip: '10.0.0.5',
      filesTransferred: 12,
      bytesTransferred: '125.7 MB'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'interrupted':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'incoming' ? '⬇️' : '⬆️';
  };

  const filteredConnections = connections.filter(conn => {
    const matchesFilter = filter === 'all' || conn.type === filter || conn.status === filter;
    const matchesSearch = searchTerm === '' || 
      conn.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conn.user.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Historique des connexions</h1>
          <p className="text-gray-600 dark:text-gray-400">Consultez vos sessions de contrôle à distance</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <History className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">127</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Temps total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">48h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Monitor className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Appareils uniques</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">15</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Rechercher par appareil ou utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les connexions</SelectItem>
                <SelectItem value="incoming">Connexions entrantes</SelectItem>
                <SelectItem value="outgoing">Connexions sortantes</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
                <SelectItem value="interrupted">Interrompues</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Connections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historique détaillé</CardTitle>
          <CardDescription>
            {filteredConnections.length} connexion(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredConnections.map((connection) => (
              <div
                key={connection.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <span className="text-xl">{getTypeIcon(connection.type)}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {connection.device}
                        </h3>
                        <Badge className={getStatusColor(connection.status)}>
                          {connection.status === 'completed' ? 'Terminée' : 
                           connection.status === 'interrupted' ? 'Interrompue' : 'Active'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {connection.type === 'incoming' ? 'Connexion depuis' : 'Connexion vers'} • {connection.user}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>IP: {connection.ip}</span>
                        <span>Durée: {connection.duration}</span>
                        <span>Fichiers: {connection.filesTransferred}</span>
                        <span>Données: {connection.bytesTransferred}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(connection.startTime).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(connection.startTime).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectionHistory;
