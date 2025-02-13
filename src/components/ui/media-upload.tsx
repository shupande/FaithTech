'use client'

import * as React from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface MediaData {
  url: string
  type: 'image' | 'video'
  thumbnail?: string
  duration?: number
}

interface MediaUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onMediaChange: (media: MediaData) => void
  currentMedia?: MediaData | string | null
  className?: string
}

export function MediaUpload({
  onMediaChange,
  currentMedia,
  className,
  ...props
}: MediaUploadProps) {
  // 确保 preview 数据始终是 MediaData 类型或 null
  const [preview, setPreview] = React.useState<MediaData | null>(() => {
    if (!currentMedia) return null
    if (typeof currentMedia === 'string') {
      try {
        return JSON.parse(currentMedia)
      } catch (e) {
        console.error('Error parsing media data:', e)
        return null
      }
    }
    return currentMedia as MediaData
  })
  
  const [isUploading, setIsUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  // 生成视频缩略图
  const generateVideoThumbnail = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      // 设置视频属性
      video.autoplay = true
      video.muted = true
      video.preload = 'metadata'

      // 监听视频加载
      video.onloadedmetadata = () => {
        // 设置视频到特定时间点（例如1秒）以确保获取到有效帧
        video.currentTime = 1
      }

      // 当视频seek完成后捕获画面
      video.onseeked = () => {
        try {
          // 设置画布尺寸为视频的尺寸
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          
          // 绘制视频帧
          context?.drawImage(video, 0, 0, canvas.width, canvas.height)
          
          // 转换为 base64
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8)

          // 清理资源
          URL.revokeObjectURL(video.src)
          video.remove()
          
          resolve(thumbnail)
        } catch (error) {
          reject(error)
        }
      }

      video.onerror = () => {
        URL.revokeObjectURL(video.src)
        reject(new Error('Failed to load video'))
      }

      // 创建视频源URL
      const videoUrl = URL.createObjectURL(file)
      video.src = videoUrl
    })
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      
      // 更新文件类型验证
      const isVideo = file.type.startsWith('video/') || file.name.endsWith('.ts')
      const fileType = file.type.startsWith('image/') ? 'image' as const : 
                      isVideo ? 'video' as const : null
      
      if (!fileType) {
        throw new Error('Invalid file type. Please upload an image or video.')
      }

      // Create FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', fileType)

      // 如果是视频，生成并上传缩略图
      if (fileType === 'video') {
        try {
          console.log('Generating video thumbnail...')
          const thumbnailBase64 = await generateVideoThumbnail(file)
          console.log('Thumbnail generated successfully')
          
          // 将 base64 转换为文件
          const thumbnailFile = await fetch(thumbnailBase64)
            .then(res => res.blob())
            .then(blob => new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' }))
          
          formData.append('thumbnail', thumbnailFile)
        } catch (error) {
          console.error('Failed to generate video thumbnail:', error)
        }
      }

      // Upload the file
      console.log('Uploading file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file')
      }

      const data = await response.json();
      console.log('Upload response:', data);

      // 如果是视频，获取时长并更新
      if (fileType === 'video' && data.url) {
        const video = document.createElement('video')
        video.src = data.url
        
        await new Promise((resolve, reject) => {
          video.addEventListener('loadedmetadata', async () => {
            try {
              const duration = video.duration
              console.log('Video duration:', duration)
              
              // 更新视频时长
              const updateResponse = await fetch(`/api/uploads/update-duration`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  url: data.url,
                  duration: duration
                }),
              })

              if (!updateResponse.ok) {
                console.error('Failed to update video duration')
              } else {
                const updatedData = await updateResponse.json()
                data.duration = updatedData.duration
              }
              resolve(null)
            } catch (error) {
              reject(error)
            }
          })
          
          video.addEventListener('error', (e) => {
            reject(new Error('Failed to load video metadata'))
          })
        })
      }

      const mediaData = {
        url: data.url,
        type: data.type,
        thumbnail: data.thumbnail,
        duration: data.duration
      };
      
      setPreview(mediaData)
      onMediaChange(mediaData)
    } catch (error) {
      console.error('Failed to upload media:', error)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <input
        type="file"
        accept="image/*,video/*,.ts"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
        {...props}
      />

      {preview ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
          {preview.type === 'video' ? (
            <div className="relative w-full h-full">
              {preview.thumbnail ? (
                <Image
                  src={preview.thumbnail}
                  alt="Video thumbnail"
                  fill
                  className="object-cover"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={preview.url}
                  className="w-full h-full object-cover"
                  onLoadedData={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0
                      videoRef.current.pause()
                    }
                  }}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                  <div className="w-0 h-0 border-l-[20px] border-l-white border-y-[12px] border-y-transparent ml-1" />
                </div>
              </div>
            </div>
          ) : (
            <Image
              src={preview.url}
              alt="Preview"
              fill
              className="object-cover"
            />
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full aspect-video relative"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Upload className="h-8 w-8" />
            <div className="text-sm">
              {isUploading ? 'Uploading...' : 'Upload Image or Video'}
              <p className="text-xs text-muted-foreground mt-1">
                Supports: JPG, PNG, GIF, MP4, WebM
              </p>
            </div>
          </div>
        </Button>
      )}
    </div>
  )
} 