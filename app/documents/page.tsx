'use client'

import { useState, useEffect } from 'react'
import { Upload, Share2, X, FileText, AlertCircle, Lock } from 'lucide-react'
import Header from '../components/Header'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import ShareFiles from '../components/ShareFiles'
import UserLimitsDisplay from '../components/UserLimitsDisplay'

export default function Documents() {
  const router = useRouter()
  const { isAuthenticated, deviceId } = useAuth()
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isLimitReached, setIsLimitReached] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!isLimitReached) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (isLimitReached) {
      return
    }
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(prevFiles => [...prevFiles, ...droppedFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && !isLimitReached) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(prevFiles => [...prevFiles, ...selectedFiles])
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
  }

  const handleLimitReached = () => {
    setIsLimitReached(true)
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <Header />
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">File Sharing</h1>
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#4d7cfe]/10 to-[#00c2ff]/10 text-[#4d7cfe] text-sm">
                ID: {deviceId}
              </div>
            </div>
          </div>
          
          {/* Display limits */}
          {deviceId && (
            <div className="mb-8">
              <UserLimitsDisplay userId={deviceId} onLimitReached={handleLimitReached} />
            </div>
          )}
          
          {/* Main drop zone */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            <div
              className={`relative border-2 border-dashed rounded-xl p-4 md:p-8 text-center transition-all duration-300 min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center
                ${isDragging 
                  ? 'border-[#4d7cfe] bg-gradient-to-r from-[#4d7cfe]/5 to-[#00c2ff]/5' 
                  : isLimitReached
                    ? 'border-red-500/50 bg-red-500/5 cursor-not-allowed'
                    : 'border-gray-600 hover:border-gray-500'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isLimitReached ? (
                <div className="flex flex-col items-center justify-center p-4">
                  <Lock className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 text-red-500" />
                  <p className="text-lg md:text-xl font-medium mb-2 md:mb-3 text-red-400">
                    Daily limit reached
                  </p>
                  <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6 text-center">
                    You have reached your sharing limit for today
                  </p>
                  <button 
                    onClick={() => router.push('/pricing')}
                    className="w-full md:w-auto bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] hover:from-[#3d6df0] hover:to-[#00b2ff] px-6 py-3 rounded-xl transition-all duration-300 font-medium"
                  >
                    Upgrade to a higher plan
                  </button>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-r from-[#4d7cfe]/5 to-[#00c2ff]/5 animate-pulse"></div>
                  </div>
                  
                  <Upload className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 text-[#4d7cfe]" />
                  <p className="text-lg md:text-xl font-medium mb-2 md:mb-3">
                    Drag and drop your files here
                  </p>
                  <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">
                    or
                  </p>
                  <label className="w-full md:w-auto bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] hover:from-[#3d6df0] hover:to-[#00b2ff] px-6 py-3 rounded-xl cursor-pointer transition-all duration-300 font-medium">
                    Select files
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                  
                  <div className="mt-6 md:mt-8 text-xs md:text-sm text-gray-400">
                    <p>Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG</p>
                    <p>Maximum size: 100 MB</p>
                  </div>
                </>
              )}
            </div>

            {/* File list */}
            <div className="bg-[#1a1d24] rounded-xl p-4 md:p-6 border border-gray-800/30">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#4d7cfe]" />
                  <h2 className="text-lg md:text-xl font-semibold">Selected Files</h2>
                </div>
                {files.length > 0 && !isLimitReached && (
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] hover:from-[#3d6df0] hover:to-[#00b2ff] px-3 md:px-4 py-2 rounded-lg transition-all duration-300 text-sm md:text-base"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden md:inline">Share</span>
                  </button>
                )}
              </div>

              {files.length === 0 ? (
                <div className="text-center py-8 md:py-12 text-gray-400">
                  <AlertCircle className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm md:text-base">No files selected</p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3 max-h-[300px] md:max-h-[500px] overflow-y-auto pr-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-[#232730] p-3 md:p-4 rounded-xl group hover:bg-[#282d36] transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-[#4d7cfe]/10 to-[#00c2ff]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 md:w-5 md:h-5 text-[#4d7cfe]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-sm md:text-base">{file.name}</p>
                          <p className="text-xs md:text-sm text-gray-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFiles(files.filter((_, i) => i !== index))}
                        className="ml-2 md:ml-4 p-1.5 md:p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

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
