
import React, { useState } from 'react';
import { Monitor, Smartphone, Server, Plus, Settings, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DeviceManager = () => {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: 'PC-Bureau-01',
      type: 'desktop',
      status: 'online',
      ip: '192.168.1.10',
      lastSeen: '2 min ago',
      os: 'Windows 11'
    },
    {
      id: 2,
      name: 'Laptop-Marie',
      type: 'laptop',
      status: 'offline',
      ip: '192.168.1.15',
      lastSeen: '1 hour ago',
      os: 'Windows 10'
    },
    {
      id: 3,
      name: 'Serveur-Prod',
      type: 'server',
      status: 'online',
      ip: '10.0.0.5',
      lastSeen: 'Active',
      os: 'Ubuntu 20.04'
    }
  ]);

  const [newDevice, setNewDevice] = useState({ name: '', ip: '', description: '' });

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop':
        return Monitor;
      case 'laptop':
        return Monitor;
      case 'server':
        return Server;
      default:
        return Smartphone;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'online' ? 'bg-green-500' : 'bg-gray-400';
  };

  const addDevice = () => {
    if (newDevice.name && newDevice.ip) {
      const device = {
        id: devices.length + 1,
        name: newDevice.name,
        type: 'desktop',
        status: 'offline',
        ip: newDevice.ip,
        lastSeen: 'Never',
        os: 'Unknown'
      };
      setDevices([...devices, device]);
      setNewDevice({ name: '', ip: '', description: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mes Appareils</h1>
          <p className="text-gray-600 dark:text-gray-400">Gérez vos appareils connectés</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un appareil
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel appareil</DialogTitle>
              <DialogDescription>
                Configurez un nouvel appareil pour la prise de contrôle à distance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'appareil</Label>
                <Input
                  id="name"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  placeholder="Mon PC Bureau"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ip">Adresse IP</Label>
                <Input
                  id="ip"
                  value={newDevice.ip}
                  onChange={(e) => setNewDevice({ ...newDevice, ip: e.target.value })}
                  placeholder="192.168.1.100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optionnel)</Label>
                <Input
                  id="description"
                  value={newDevice.description}
                  onChange={(e) => setNewDevice({ ...newDevice, description: e.target.value })}
                  placeholder="PC principal du bureau"
                />
              </div>
              <Button onClick={addDevice} className="w-full">
                Ajouter l'appareil
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => {
          const DeviceIcon = getDeviceIcon(device.type);
          return (
            <Card key={device.id} className="hover:shadow-lg transition-all duration-200 hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <DeviceIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{device.name}</CardTitle>
                      <CardDescription>{device.os}</CardDescription>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(device.status)}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    <Badge variant={device.status === 'online' ? 'default' : 'secondary'}>
                      {device.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">IP:</span>
                    <span className="font-mono">{device.ip}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Dernière activité:</span>
                    <span>{device.lastSeen}</span>
                  </div>
                  
                  <div className="flex space-x-2 pt-3">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      disabled={device.status === 'offline'}
                    >
                      <Power className="w-4 h-4 mr-1" />
                      Se connecter
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DeviceManager;
