'use client';

/* eslint-disable jsx-a11y/alt-text */
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { File, Image, Video } from 'lucide-react';

export default function FileUploadZone({ userId }: { userId: string }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const supabase = createClientComponentClient();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      for (const [index, file] of acceptedFiles.entries()) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error } = await supabase.storage
          .from('shared-files')
          .upload(filePath, file);

        if (error) throw error;
        
        // Simuler la progression
        setUploadProgress(((index + 1) / acceptedFiles.length) * 100);
      }
      
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    } finally {
      setUploading(false);
    }
  }, [userId, supabase]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.ms-excel': ['.xls', '.xlsx'],
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative p-12
        flex flex-col items-center justify-center
        cursor-pointer transition-all duration-300
        border-2 border-dashed rounded-xl
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50 scale-102' 
          : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
        }
        ${uploading ? 'pointer-events-none' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex space-x-8 mb-6">
        <Image className="w-8 h-8 text-blue-500 animate-bounce" />
        <File className="w-8 h-8 text-green-500 animate-bounce [animation-delay:0.2s]" />
        <Video className="w-8 h-8 text-purple-500 animate-bounce [animation-delay:0.4s]" />
      </div>

      {uploading ? (
        <div className="w-full max-w-xs">
          <div className="text-center mb-2">
            <p className="text-sm font-medium text-gray-900">Téléchargement en cours...</p>
            <p className="text-sm text-gray-500">{Math.round(uploadProgress)}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-base font-medium text-gray-900">
            {isDragActive ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Images, vidéos, documents (max 20MB)
          </p>
        </div>
      )}
    </div>
  );
} 

// goood