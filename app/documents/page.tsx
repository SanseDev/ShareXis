'use client'

import { useState, useEffect } from 'react'
import { Upload, Share2 } from 'lucide-react'
import Header from '../components/Header'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import ShareFiles from '../components/ShareFiles'

export default function Documents() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(prevFiles => [...prevFiles, ...droppedFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(prevFiles => [...prevFiles, ...selectedFiles])
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <Header />
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Partage de Fichiers</h1>
          </div>
          
          {/* Zone de dépôt */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 mb-8 text-center transition-colors
              ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-2">
              Glissez et déposez vos fichiers ici
            </p>
            <p className="text-sm text-gray-400 mb-4">
              ou
            </p>
            <label className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg cursor-pointer transition-colors">
              Sélectionner des fichiers
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {/* Liste des fichiers */}
          {files.length > 0 && (
            <div className="bg-[#1a1d24] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Fichiers ({files.length})</h2>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Partager
                </button>
              </div>
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#232730] p-4 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                      className="text-red-400 hover:text-red-300 px-3 py-1 rounded"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isShareModalOpen && (
            <ShareFiles
              files={files}
              onClose={() => setIsShareModalOpen(false)}
            />
          )}
        </div>
      </main>
    </div>
  )
}
