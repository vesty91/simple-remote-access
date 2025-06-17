
import React, { useState } from 'react';
import { MessageSquare, Send, User, Users, Search, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MessagingHub = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  
  const conversations = [
    {
      id: 1,
      name: 'Support Technique',
      lastMessage: 'Le problème est résolu, merci !',
      time: '10:30',
      unread: 0,
      avatar: '👨‍💻',
      online: true
    },
    {
      id: 2,
      name: 'Marie Leroy',
      lastMessage: 'Je peux accéder à ton écran maintenant ?',
      time: '09:45',
      unread: 2,
      avatar: '👩‍💼',
      online: true
    },
    {
      id: 3,
      name: 'Équipe Dev',
      lastMessage: 'La nouvelle version est prête',
      time: '08:20',
      unread: 0,
      avatar: '👥',
      online: false
    }
  ];

  const messages = [
    { id: 1, sender: 'Support', message: 'Bonjour ! Comment puis-je vous aider ?', time: '10:25', isMe: false },
    { id: 2, sender: 'Vous', message: 'J\'ai un problème avec la connexion à distance', time: '10:26', isMe: true },
    { id: 3, sender: 'Support', message: 'Je vais vous aider. Pouvez-vous me donner votre code de connexion ?', time: '10:27', isMe: false },
    { id: 4, sender: 'Vous', message: 'Voici le code : 123 456 789', time: '10:28', isMe: true },
    { id: 5, sender: 'Support', message: 'Parfait ! Je me connecte à votre ordinateur maintenant.', time: '10:29', isMe: false },
    { id: 6, sender: 'Support', message: 'Le problème est résolu, merci !', time: '10:30', isMe: false }
  ];

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Logique d'envoi du message
      setNewMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex">
      {/* Conversations List */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Messages</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Rechercher une conversation..."
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedChat(conv.id)}
              className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 ${
                selectedChat === conv.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg">
                    {conv.avatar}
                  </div>
                  {conv.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {conv.name}
                    </p>
                    <span className="text-xs text-gray-500">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="ml-2 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                👨‍💻
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Support Technique</h3>
                <p className="text-sm text-green-500">En ligne</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost">
                <Phone className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Video className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isMe
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className={`text-xs mt-1 ${
                  message.isMe ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingHub;
