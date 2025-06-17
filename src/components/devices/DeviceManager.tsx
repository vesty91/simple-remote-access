
import React, { useState } from 'react';
import { Monitor, Smartphone, Server, Plus, Settings, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const DeviceManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [newDevice, setNewDevice] = useState({ 
    name: '', 
    ip_address: '', 
    description: '',
    device_type: 'desktop',
    operating_system: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch devices from Supabase
  const { data: devices, isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Add device mutation
  const addDeviceMutation = useMutation({
    mutationFn: async (deviceData: typeof newDevice) => {
      const { data, error } = await supabase
        .from('devices')
        .insert([{
          ...deviceData,
          user_id: user?.id,
          access_code: Math.random().toString(36).substring(2, 15)
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setNewDevice({ 
        name: '', 
        ip_address: '', 
        description: '',
        device_type: 'desktop',
        operating_system: ''
      });
      setIsDialogOpen(false);
      toast({
        title: "Appareil ajouté",
        description: "L'appareil a été ajouté avec succès"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  });

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

  const getStatusColor = (status: boolean | null) => {
    return status ? 'bg-green-500' : 'bg-gray-400';
  };

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDevice.name && newDevice.ip_address) {
      addDeviceMutation.mutate(newDevice);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Erreur lors du chargement des appareils</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mes Appareils</h1>
          <p className="text-gray-600 dark:text-gray-400">Gérez vos appareils connectés</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <form onSubmit={handleAddDevice} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'appareil</Label>
                <Input
                  id="name"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  placeholder="Mon PC Bureau"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ip">Adresse IP</Label>
                <Input
                  id="ip"
                  value={newDevice.ip_address}
                  onChange={(e) => setNewDevice({ ...newDevice, ip_address: e.target.value })}
                  placeholder="192.168.1.100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="os">Système d'exploitation</Label>
                <Input
                  id="os"
                  value={newDevice.operating_system}
                  onChange={(e) => setNewDevice({ ...newDevice, operating_system: e.target.value })}
                  placeholder="Windows 11"
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
              <Button type="submit" className="w-full" disabled={addDeviceMutation.isPending}>
                {addDeviceMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ajout...
                  </>
                ) : (
                  "Ajouter l'appareil"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices?.map((device) => {
          const DeviceIcon = getDeviceIcon(device.device_type);
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
                      <CardDescription>{device.operating_system || 'Système inconnu'}</CardDescription>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(device.is_online)}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    <Badge variant={device.is_online ? 'default' : 'secondary'}>
                      {device.is_online ? 'En ligne' : 'Hors ligne'}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">IP:</span>
                    <span className="font-mono">{device.ip_address}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Code d'accès:</span>
                    <span className="font-mono text-xs">{device.access_code}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Dernière activité:</span>
                    <span>{device.last_seen ? new Date(device.last_seen).toLocaleDateString() : 'Jamais'}</span>
                  </div>
                  
                  <div className="flex space-x-2 pt-3">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      disabled={!device.is_online}
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

      {devices?.length === 0 && (
        <div className="text-center py-12">
          <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucun appareil configuré
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Commencez par ajouter votre premier appareil pour la prise de contrôle à distance
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un appareil
          </Button>
        </div>
      )}
    </div>
  );
};

export default DeviceManager;
