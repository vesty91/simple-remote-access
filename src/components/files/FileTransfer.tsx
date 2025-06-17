
import React, { useState } from 'react';
import { Upload, Download, FileText, Image, File, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const FileTransfer = () => {
  const [transfers, setTransfers] = useState([
    { id: 1, name: 'Document.pdf', size: '2.3 MB', progress: 100, type: 'download', status: 'completed' },
    { id: 2, name: 'Presentation.pptx', size: '15.7 MB', progress: 75, type: 'upload', status: 'transferring' },
    { id: 3, name: 'Image.jpg', size: '4.1 MB', progress: 100, type: 'upload', status: 'completed' },
  ]);

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return FileText;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return Image;
      default:
        return File;
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Simulation d'un nouvel upload
    const newTransfer = {
      id: transfers.length + 1,
      name: 'Nouveau-fichier.txt',
      size: '1.2 MB',
      progress: 0,
      type: 'upload',
      status: 'transferring'
    };
    setTransfers([...transfers, newTransfer]);
    
    // Simulation progression
    setTimeout(() => {
      setTransfers(prev => prev.map(t => 
        t.id === newTransfer.id 
          ? { ...t, progress: 100, status: 'completed' }
          : t
      ));
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transfert de fichiers</h1>
          <p className="text-gray-600 dark:text-gray-400">Échangez des fichiers avec les appareils connectés</p>
        </div>
        <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
          <FolderOpen className="w-4 h-4 mr-2" />
          Parcourir
        </Button>
      </div>

      {/* Drop Zone */}
      <Card 
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors duration-200"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <CardContent className="p-12 text-center">
          <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Glissez-déposez vos fichiers ici
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            ou cliquez pour sélectionner des fichiers à transférer
          </p>
          <Button variant="outline" className="mx-auto">
            Sélectionner des fichiers
          </Button>
        </CardContent>
      </Card>

      {/* Active Transfers */}
      <Card>
        <CardHeader>
          <CardTitle>Transferts en cours</CardTitle>
          <CardDescription>Suivi de vos transferts de fichiers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transfers.map((transfer) => {
              const FileIcon = getFileIcon(transfer.name);
              return (
                <div key={transfer.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <FileIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{transfer.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{transfer.size}</span>
                        {transfer.type === 'upload' ? (
                          <Upload className="w-4 h-4 text-green-500" />
                        ) : (
                          <Download className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                    
                    {transfer.status === 'transferring' ? (
                      <div className="space-y-1">
                        <Progress value={transfer.progress} className="w-full" />
                        <p className="text-xs text-gray-500">
                          {transfer.progress}% - {transfer.type === 'upload' ? 'Envoi' : 'Réception'} en cours...
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-green-600 dark:text-green-400">
                        ✓ {transfer.type === 'upload' ? 'Envoyé' : 'Reçu'} avec succès
                      </p>
                    )}
                  </div>
                  
                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Transfer History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des transferts</CardTitle>
          <CardDescription>Vos derniers transferts de fichiers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Rapport-Q4.xlsx', size: '8.2 MB', time: '10:30', type: 'download', device: 'PC-Bureau-01' },
              { name: 'Logo-Company.png', size: '1.5 MB', time: '09:15', type: 'upload', device: 'Laptop-Marie' },
              { name: 'Backup.zip', size: '125 MB', time: '08:45', type: 'download', device: 'Serveur-Prod' },
            ].map((file, index) => {
              const FileIcon = getFileIcon(file.name);
              return (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <FileIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {file.size} • {file.device}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{file.time}</p>
                    <div className="flex items-center space-x-1">
                      {file.type === 'upload' ? (
                        <Upload className="w-3 h-3 text-green-500" />
                      ) : (
                        <Download className="w-3 h-3 text-blue-500" />
                      )}
                      <span className="text-xs text-gray-400">
                        {file.type === 'upload' ? 'Envoyé' : 'Reçu'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileTransfer;
