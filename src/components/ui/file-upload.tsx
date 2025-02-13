'use client'

import * as React from "react"
import { UploadCloud, X, FileIcon, File } from "lucide-react"
import { formatBytes } from "@/lib/utils"
import { Button } from "./button"

interface FileUploadProps {
  value: File | null
  onChange: (file: File | null) => void
  onSizeChange?: (size: string) => void
  onTypeChange?: (type: string) => void
  accept?: string
  maxSize?: number // in bytes
}

export function FileUpload({
  value,
  onChange,
  onSizeChange,
  onTypeChange,
  accept,
  maxSize = 50 * 1024 * 1024 // 50MB default
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = React.useState(false)
  const [error, setError] = React.useState<string>("")

  const handleFile = React.useCallback((file: File | null) => {
    if (!file) {
      onChange(null)
      onSizeChange?.("")
      onTypeChange?.("")
      return
    }

    // Check file size
    if (maxSize && file.size > maxSize) {
      setError(`File size must be less than ${formatBytes(maxSize)}`)
      return
    }

    // Check file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(",").map(type => type.trim())
      const fileType = file.type || `application/${file.name.split('.').pop()}`
      if (!acceptedTypes.some(type => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        if (type.endsWith("/*")) {
          return fileType.startsWith(type.slice(0, -2))
        }
        return type === fileType
      })) {
        setError(`File type must be ${accept}`)
        return
      }
    }

    setError("")
    onChange(file)
    onSizeChange?.(formatBytes(file.size))
    onTypeChange?.(file.type || file.name.split('.').pop()?.toUpperCase() || '')
  }, [maxSize, accept, onChange, onSizeChange, onTypeChange])

  const handleDrag = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [handleFile])

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }, [handleFile])

  const removeFile = React.useCallback(() => {
    handleFile(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [handleFile])

  return (
    <div className="w-full">
      <div
        className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors
          ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${error ? 'border-destructive' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept={accept}
        />

        {value ? (
          <div className="flex items-center gap-2 text-sm">
            <FileIcon className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">{value.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatBytes(value.size)}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                removeFile()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag & drop or click to upload
            </p>
            {accept && (
              <p className="text-xs text-muted-foreground mt-1">
                Accepted formats: {accept}
              </p>
            )}
            {maxSize && (
              <p className="text-xs text-muted-foreground">
                Max size: {formatBytes(maxSize)}
              </p>
            )}
          </>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  )
} 