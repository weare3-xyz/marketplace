'use client'

import { useState, useRef, DragEvent } from 'react'

interface ImageUploadProps {
  onImageUploaded: (ipfsUrl: string) => void
  currentImage?: string
  className?: string
}

export default function ImageUpload({ onImageUploaded, currentImage, className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setError(null)
    setUploading(true)

    try {
      // Validate file before upload
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file')
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB')
      }

      // Create preview immediately
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Upload to IPFS
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      console.log('Upload successful:', result)

      // Update with IPFS URL
      setPreview(result.ipfsUrl)
      onImageUploaded(result.ipfsUrl)

      // Cleanup object URL
      URL.revokeObjectURL(previewUrl)

    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Upload failed')
      setPreview(currentImage || null) // Reset to original image
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0])
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto h-32 w-32 object-cover rounded-full border-4 border-white shadow-lg"
            />
            {!uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200">
                <span className="text-white text-sm font-medium">Click to change</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="text-lg font-medium mb-2">Upload Avatar</p>
            <p className="text-sm">Click to browse or drag and drop</p>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Upload Status */}
      {uploading && (
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-sm font-medium">Uploading to IPFS...</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm font-medium">❌ {error}</p>
        </div>
      )}

      {/* Success Message */}
      {preview && preview.includes('ipfs') && !uploading && !error && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-600 text-sm font-medium">✅ Image uploaded to IPFS successfully!</p>
          <p className="text-green-500 text-xs mt-1">Your image is now stored permanently on the decentralized web</p>
        </div>
      )}

      {/* IPFS Info */}
      {preview && preview.includes('ipfs') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-700 text-sm font-medium">🔗 IPFS Storage</p>
          <p className="text-blue-600 text-xs mt-1 break-all font-mono">{preview}</p>
        </div>
      )}
    </div>
  )
}