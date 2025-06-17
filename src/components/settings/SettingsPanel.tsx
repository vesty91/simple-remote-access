
import React, { useState } from 'react';
import { Settings, Shield, User, Monitor, Bell, Lock, Key, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    twoFactorAuth: true,
    autoConnect: false,
    fileTransfer: true,
    chatEnabled: true,
    notifications: true,
    recordSessions: false,
    quality: 'high',
    theme: 'auto'
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
        <p className="text-gray-600 dark:text-gray-400">Configurez votre expérience RemoteControl Pro</p>
      </div>

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="connection" className="flex items-center space-x-2">
            <Monitor className="w-4 h-4" />
            <span>Connexion</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Compte</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Authentification</span>
              </CardTitle>
              <CardDescription>Configurez vos paramètres de sécurité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Double authentification (2FA)</Label>
                  <p className="text-sm text-gray-500">Ajouter une couche de sécurité supplémentaire</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => updateSetting('twoFactorAuth', checked)}
                />
              </div>

              <div className="space-y-3">
                <Label>Changer le mot de passe</Label>
                <div className="space-y-3">
                  <Input type="password" placeholder="Mot de passe actuel" />
                  <Input type="password" placeholder="Nouveau mot de passe" />
                  <Input type="password" placeholder="Confirmer le mot de passe" />
                  <Button className="w-full">Mettre à jour le mot de passe</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="w-5 h-5" />
                <span>Sessions et accès</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enregistrer les sessions</Label>
                  <p className="text-sm text-gray-500">Conserver un historique vidéo des connexions</p>
                </div>
                <Switch
                  checked={settings.recordSessions}
                  onCheckedChange={(checked) => updateSetting('recordSessions', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Durée d'expiration des codes temporaires</Label>
                <Select defaultValue="10">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de connexion</CardTitle>
              <CardDescription>Configurez la qualité et les options de connexion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Qualité de l'image</Label>
                <Select 
                  value={settings.quality} 
                  onValueChange={(value) => updateSetting('quality', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible (économise la bande passante)</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute (recommandé)</SelectItem>
                    <SelectItem value="ultra">Ultra (pour connexion rapide)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Connexion automatique</Label>
                  <p className="text-sm text-gray-500">Se connecter automatiquement aux appareils de confiance</p>
                </div>
                <Switch
                  checked={settings.autoConnect}
                  onCheckedChange={(checked) => updateSetting('autoConnect', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Transfert de fichiers</Label>
                  <p className="text-sm text-gray-500">Autoriser l'échange de fichiers pendant les sessions</p>
                </div>
                <Switch
                  checked={settings.fileTransfer}
                  onCheckedChange={(checked) => updateSetting('fileTransfer', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Chat intégré</Label>
                  <p className="text-sm text-gray-500">Activer la messagerie instantanée</p>
                </div>
                <Switch
                  checked={settings.chatEnabled}
                  onCheckedChange={(checked) => updateSetting('chatEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>Choisissez quand recevoir des notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notifications générales</Label>
                  <p className="text-sm text-gray-500">Recevoir toutes les notifications</p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => updateSetting('notifications', checked)}
                />
              </div>

              <div className="space-y-3">
                <Label>Types de notifications</Label>
                <div className="space-y-3">
                  {[
                    'Nouvelles connexions entrantes',
                    'Tentatives de connexion échouées',
                    'Transferts de fichiers terminés',
                    'Mises à jour de sécurité',
                    'Rapports d\'activité hebdomadaires'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label className="text-sm">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
              <CardDescription>Gérez vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input defaultValue="+33 6 12 34 56 78" />
                </div>
                <div className="space-y-2">
                  <Label>Entreprise</Label>
                  <Input defaultValue="Mon Entreprise" />
                </div>
              </div>
              
              <div className="pt-4">
                <Button>Sauvegarder les modifications</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thème</CardTitle>
              <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Mode d'affichage</Label>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value) => updateSetting('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="auto">Automatique (système)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Zone de danger</CardTitle>
              <CardDescription>Actions irréversibles sur votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                Supprimer tous les appareils
              </Button>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                Supprimer l'historique des connexions
              </Button>
              <Button variant="destructive">
                Supprimer définitivement le compte
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPanel;
