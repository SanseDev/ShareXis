'use client';

/* eslint-disable jsx-a11y/alt-text */
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FileIcon, Trash2, Download, Image, Video, FileText } from 'lucide-react';
import { useState } from 'react';

interface FileObject {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
}

export default function FileList({ files, userId }: { files: FileObject[], userId: string }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) {
      return <Image className="w-5 h-5 text-purple-500" />;
    }
    if (['mp4', 'mov', 'avi'].includes(ext || '')) {
      return <Video className="w-5 h-5 text-blue-500" />;
    }
    return <FileText className="w-5 h-5 text-green-500" />;
  };

  const handleDelete = async (fileName: string, fileId: string) => {
    setDeletingId(fileId);
    try {
      const { error } = await supabase.storage
        .from('shared-files')
        .remove([`${userId}/${fileName}`]);

      if (error) throw error;
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('shared-files')
        .download(`${userId}/${fileName}`);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  return (
    <div className="divide-y divide-gray-100">
      {files.length === 0 ? (
        <div className="text-center py-12">
          <FileIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">Aucun fichier partagé</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {files.map((file) => (
            <div 
              key={file.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(file.name)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(file.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(file.name)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(file.name, file.id)}
                  disabled={deletingId === file.id}
                  className={`p-1.5 rounded-lg transition-colors ${
                    deletingId === file.id
                      ? 'text-gray-400 bg-gray-100'
                      : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Trash2 className={`w-5 h-5 ${deletingId === file.id ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 