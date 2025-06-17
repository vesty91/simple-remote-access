
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone, Monitor, Server, Plus, Trash2, Edit, Wifi, WifiOff, Shield, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Device {
  id: string;
  name: string;
  device_type: string;
  operating_system: string;
  ip_address: string;
  is_online: boolean;
  is_permanent: boolean;
  agent_installed: boolean;
  last_seen: string;
  access_code: string;
  description: string;
}

const DeviceManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [newDevice, setNewDevice] = useState({
    name: '',
    device_type: 'desktop',
    operating_system: '',
    ip_address: '',
    description: '',
    is_permanent: false
  });

  // Fetch devices
  const { data: devices = [], isLoading, error } = useQuery({
    queryKey: ['devices', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Add device mutation
  const addDeviceMutation = useMutation({
    mutationFn: async (device: typeof newDevice) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('devices')
        .insert([{
          ...device,
          user_id: user.id,
          access_code: Math.random().toString(36).substring(2, 15)
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setIsAddDialogOpen(false);
      setNewDevice({
        name: '',
        device_type: 'desktop',
        operating_system: '',
        ip_address: '',
        description: '',
        is_permanent: false
      });
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

  // Delete device mutation
  const deleteDeviceMutation = useMutation({
    mutationFn: async (deviceId: string) => {
      const { error } = await supabase
        .from('devices')
        .delete()
        .eq('id', deviceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast({
        title: "Appareil supprimé",
        description: "L'appareil a été supprimé avec succès"
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
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'server':
        return <Server className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (device: Device) => {
    if (device.is_online) {
      return <Badge className="bg-green-100 text-green-800"><Wifi className="w-3 h-3 mr-1" />En ligne</Badge>;
    }
    return <Badge variant="secondary"><WifiOff className="w-3 h-3 mr-1" />Hors ligne</Badge>;
  };

  const handleAddDevice = () => {
    addDeviceMutation.mutate(newDevice);
  };

  const handleDeleteDevice = (deviceId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet appareil ?')) {
      deleteDeviceMutation.mutate(deviceId);
    }
  };

  if (!user) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Vous devez être connecté pour gérer vos appareils.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement des appareils : {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestion des appareils
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gérez et surveillez tous vos appareils connectés
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un appareil
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel appareil</DialogTitle>
              <DialogDescription>
                Configurez un nouvel appareil pour le contrôle à distance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de l'appareil</Label>
                <Input
                  id="name"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  placeholder="Mon ordinateur portable"
                />
              </div>
              
              <div>
                <Label htmlFor="device_type">Type d'appareil</Label>
                <Select
                  value={newDevice.device_type}
                  onValueChange={(value) => setNewDevice({ ...newDevice, device_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desktop">Ordinateur de bureau</SelectItem>
                    <SelectItem value="laptop">Ordinateur portable</SelectItem>
                    <SelectItem value="server">Serveur</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="operating_system">Système d'exploitation</Label>
                <Input
                  id="operating_system"
                  value={newDevice.operating_system}
                  onChange={(e) => setNewDevice({ ...newDevice, operating_system: e.target.value })}
                  placeholder="Windows 11, macOS, Ubuntu..."
                />
              </div>
              
              <div>
                <Label htmlFor="ip_address">Adresse IP (optionnel)</Label>
                <Input
                  id="ip_address"
                  value={newDevice.ip_address}
                  onChange={(e) => setNewDevice({ ...newDevice, ip_address: e.target.value })}
                  placeholder="192.168.1.100"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newDevice.description}
                  onChange={(e) => setNewDevice({ ...newDevice, description: e.target.value })}
                  placeholder="Description de l'appareil..."
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_permanent"
                  checked={newDevice.is_permanent}
                  onCheckedChange={(checked) => setNewDevice({ ...newDevice, is_permanent: checked })}
                />
                <Label htmlFor="is_permanent">Accès permanent</Label>
              </div>
              
              <Button onClick={handleAddDevice} className="w-full" disabled={addDeviceMutation.isPending}>
                {addDeviceMutation.isPending ? 'Ajout...' : 'Ajouter l\'appareil'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {devices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Monitor className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun appareil configuré
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
              Commencez par ajouter votre premier appareil pour pouvoir le contrôler à distance.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <Card key={device.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getDeviceIcon(device.device_type)}
                    <div>
                      <CardTitle className="text-lg">{device.name}</CardTitle>
                      <CardDescription>{device.operating_system}</CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditingDevice(device)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteDevice(device.id)}
                      disabled={deleteDeviceMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Statut</span>
                  {getStatusBadge(device)}
                </div>
                
                {device.ip_address && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">IP</span>
                    <span className="text-sm font-mono">{device.ip_address}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Agent</span>
                  <Badge variant={device.agent_installed ? "default" : "secondary"}>
                    <Shield className="w-3 h-3 mr-1" />
                    {device.agent_installed ? 'Installé' : 'Non installé'}
                  </Badge>
                </div>
                
                {device.access_code && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Code</span>
                    <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {device.access_code}
                    </span>
                  </div>
                )}
                
                {device.last_seen && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Dernière vue</span>
                    <span className="text-sm flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(device.last_seen).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
                
                {device.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    {device.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeviceManager;
