'use client'

import * as React from 'react'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

import { Button } from './button'
import { Card } from './card'

interface SingleImageUploadProps {
  value: string
  onChange: (value: string) => void
}

export function SingleImageUpload({ value = '', onChange }: SingleImageUploadProps) {
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleUpload = async (files: FileList) => {
    if (files.length === 0) return

    setUploading(true)
    try {
      const file = files[0] // 只取第一个文件
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
      onChange(data.url)
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    onChange('')
  }

  return (
    <div className="space-y-4">
      <div>
        {value ? (
          <Card className="relative group w-[200px]">
            <div className="aspect-square relative">
              <Image
                src={value}
                alt="Uploaded image"
                fill
                className="object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ) : (
          <Card
            className="relative aspect-square w-[200px] flex items-center justify-center cursor-pointer hover:bg-accent"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
              disabled={uploading}
            />
            <Upload className="h-6 w-6 text-muted-foreground" />
          </Card>
        )}
      </div>
      {uploading && (
        <div className="text-sm text-muted-foreground">
          Uploading image...
        </div>
      )}
    </div>
  )
} 