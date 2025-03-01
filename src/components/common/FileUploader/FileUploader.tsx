'use client'

import { useCallback, useState } from 'react'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  acceptedFileTypes?: string
  maxSize?: number // in bytes
  label?: string
}

export default function FileUploader({
  onFileSelect,
  acceptedFileTypes = '*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  label = 'Upload a file',
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string>('')

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const validateFile = useCallback(
    (file: File) => {
      setError('')

      if (!file) {
        setError('No file selected')
        return false
      }

      if (acceptedFileTypes !== '*' && !file.type.match(acceptedFileTypes)) {
        setError('File type not allowed')
        return false
      }

      if (file.size > maxSize) {
        setError(`File size cannot exceed ${maxSize / (1024 * 1024)}MB`)
        return false
      }

      return true
    },
    [acceptedFileTypes, maxSize]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        onFileSelect(file)
      }
    },
    [onFileSelect, validateFile]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && validateFile(file)) {
        onFileSelect(file)
      }
    },
    [onFileSelect, validateFile]
  )

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload"
        className={`relative block w-full rounded-lg border-2 border-dashed p-12 text-center hover:border-indigo-600 focus:outline-none ${
          isDragging
            ? 'border-indigo-600 bg-indigo-50'
            : 'border-gray-300 bg-white'
        } ${error ? 'border-red-500' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          <ArrowUpTrayIcon className="h-12 w-12 text-gray-400" />
          <span className="mt-2 block text-sm font-semibold text-gray-900">
            {label}
          </span>
          <span className="mt-2 block text-sm text-gray-500">
            Drag and drop or click to select
          </span>
          {error && (
            <span className="mt-2 block text-sm text-red-500">{error}</span>
          )}
        </div>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="hidden"
          accept={acceptedFileTypes}
          onChange={handleFileSelect}
        />
      </label>
    </div>
  )
}
