
import React, { useState } from 'react';
import { Monitor, Users, Settings, MessageSquare, FileText, Power, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const RemoteConnection = () => {
  const [connectionCode, setConnectionCode] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Support', message: 'Connexion établie avec succès', time: '10:30' },
    { id: 2, user: 'Vous', message: 'Merci, je vois bien votre écran', time: '10:31' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const connectToDevice = () => {
    if (connectionCode.length >= 6) {
      setIsConnected(true);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        user: 'Vous',
        message: newMessage,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Se connecter à un ordinateur</h1>
          <p className="text-gray-600 dark:text-gray-400">Entrez le code de connexion pour prendre le contrôle</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="h-fit">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Connexion rapide</CardTitle>
              <CardDescription>Utilisez un code de connexion temporaire</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Code de connexion</label>
                <Input
                  value={connectionCode}
                  onChange={(e) => setConnectionCode(e.target.value)}
                  placeholder="Entrez le code (ex: 123 456 789)"
                  className="text-center text-lg tracking-widest"
                />
              </div>
              <Button 
                onClick={connectToDevice}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                disabled={connectionCode.length < 6}
              >
                <Users className="w-4 h-4 mr-2" />
                Se connecter
              </Button>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Connexion permanente</CardTitle>
              <CardDescription>Connectez-vous à vos appareils enregistrés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['PC-Bureau-01', 'Laptop-Marie', 'PC-Client-03'].map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Monitor className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{device}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Connecter
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Générer un code de connexion</CardTitle>
            <CardDescription>Permettez à quelqu'un de se connecter à votre ordinateur</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Votre code de connexion temporaire :</p>
                <div className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400 tracking-widest mb-4">
                  987 254 361
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ce code expire dans 10 minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Remote Desktop Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white font-medium">Connecté à PC-Bureau-01</span>
            </div>
            <span className="text-gray-400 text-sm">192.168.1.10</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
              <MessageSquare className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
              <FileText className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
              <Settings className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
              <Maximize className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-red-400 hover:bg-red-900/30"
              onClick={() => setIsConnected(false)}
            >
              <Power className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Remote Desktop View */}
        <div className="flex-1 bg-blue-900/20 flex items-center justify-center">
          <div className="text-center text-white">
            <Monitor className="w-24 h-24 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">Vue de l'écran distant</h3>
            <p className="text-gray-400">L'écran de l'ordinateur distant s'afficherait ici</p>
            <div className="mt-6 bg-black/30 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-4">
                <h4 className="font-semibold mb-2">Bureau Windows</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white/20 rounded p-2 text-xs text-center">
                      App {i}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-800 rounded p-2 flex justify-center">
                <div className="w-12 h-8 bg-blue-500 rounded-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-medium">Chat en temps réel</h3>
          </div>
          
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`p-3 rounded-lg ${
                msg.user === 'Vous' 
                  ? 'bg-blue-600 text-white ml-4' 
                  : 'bg-gray-700 text-white mr-4'
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">{msg.user}</span>
                  <span className="text-xs opacity-70">{msg.time}</span>
                </div>
                <p className="text-sm">{msg.message}</p>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Tapez votre message..."
                className="bg-gray-700 border-gray-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button size="sm" onClick={sendMessage}>
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoteConnection;
