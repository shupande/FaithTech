'use client'

import * as React from 'react'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

import { Button } from './button'
import { Card } from './card'

interface ImageUploadProps {
  value: Array<{ url: string; alt: string }>
  onChange: (value: Array<{ url: string; alt: string }>) => void
  maxFiles?: number
}

export function ImageUpload({ value = [], onChange, maxFiles = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleUpload = async (files: FileList) => {
    if (value.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images`)
      return
    }

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const data = await response.json()
        return {
          url: data.url,
          alt: file.name,
        }
      })

      const uploadedImages = await Promise.all(uploadPromises)
      onChange([...value, ...uploadedImages])
      toast.success('Images uploaded successfully')
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {value.map((image, index) => (
          <Card key={index} className="relative group">
            <div className="aspect-square relative">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
        {value.length < maxFiles && (
          <Card
            className="relative aspect-square flex items-center justify-center cursor-pointer hover:bg-accent"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
              disabled={uploading}
            />
            <Upload className="h-6 w-6 text-muted-foreground" />
          </Card>
        )}
      </div>
      {uploading && (
        <div className="text-sm text-muted-foreground">
          Uploading images...
        </div>
      )}
    </div>
  )
} 