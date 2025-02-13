'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { MediaUpload } from "@/components/ui/media-upload"
import { FileUpload } from "@/components/ui/file-upload"
import { handleApiError } from "@/lib/api/error"

interface DownloadItem {
  id?: string
  title: string
  description: string
  category: string
  version?: string | null
  fileUrl: string
  fileSize?: string | null
  fileType?: string | null
  thumbnail?: string | null
  featured: boolean
  downloads?: number
  status: string
}

interface DownloadFormProps {
  download?: DownloadItem
  isEdit?: boolean
}

export function DownloadForm({ download: initialDownload, isEdit }: DownloadFormProps) {
  const router = useRouter()
  const [download, setDownload] = React.useState<DownloadItem>(() => {
    return initialDownload || {
      title: '',
      description: '',
      category: '',
      version: '',
      fileUrl: '',
      fileSize: '',
      fileType: '',
      thumbnail: '',
      featured: false,
      status: 'Active'
    }
  })
  const [file, setFile] = React.useState<File | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)

  // 处理文件上传，自动填充标题
  const handleFileChange = React.useCallback((file: File | null) => {
    setFile(file)
    if (file) {
      // 从文件名中提取标题（去掉扩展名）
      const title = file.name.replace(/\.[^/.]+$/, "")
      // 如果标题为空或者是从之前的文件名生成的，则更新标题
      setDownload(prev => ({
        ...prev,
        title: title,
        fileSize: '',  // 清除旧的文件大小
        fileType: ''   // 清除旧的文件类型
      }))
    }
  }, [])

  // 处理文件大小变化
  const handleFileSizeChange = React.useCallback((size: string) => {
    setDownload(prev => ({
      ...prev,
      fileSize: size
    }))
  }, [])

  // 处理文件类型变化
  const handleFileTypeChange = React.useCallback((type: string) => {
    setDownload(prev => ({
      ...prev,
      fileType: type
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // 验证必填字段
    if (!download.title.trim()) {
      toast.error('Title is required')
      return
    }
    if (!download.category.trim()) {
      toast.error('Category is required')
      return
    }
    if (!file && !download.fileUrl) {
      toast.error('File is required')
      return
    }

    try {
      setIsSaving(true)

      // 首先上传文件
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('name', file.name)
        formData.append('description', download.description || file.name)
        formData.append('type', file.type.split('/')[0])
        formData.append('category', download.category)

        const uploadResponse = await fetch('/api/media/assets', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.message || 'Failed to upload file')
        }

        const uploadData = await uploadResponse.json()
        if (!uploadData.success || !uploadData.data) {
          throw new Error('Invalid upload response')
        }

        // 更新下载项的文件信息
        download.fileUrl = uploadData.data.path
        download.fileSize = `${(uploadData.data.size / 1024).toFixed(1)} KB`
        download.fileType = uploadData.data.mimeType
      }

      // 然后创建或更新下载项
      const response = await fetch(
        isEdit ? `/api/downloads/${download.id}` : '/api/downloads',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(download),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || data.message || 'Failed to save download')
      }

      toast.success(isEdit ? 'Download updated successfully' : 'Download created successfully')
      router.push('/admin/downloads')
      router.refresh()
    } catch (error) {
      console.error(isEdit ? 'Failed to update download:' : 'Failed to create download:', error)
      handleApiError(error, isEdit ? 'Failed to update download' : 'Failed to create download')
    } finally {
      setIsSaving(false)
    }
  }

  const handleMediaChange = (media: { url: string }) => {
    setDownload(prev => ({
      ...prev,
      thumbnail: media.url
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label>File *</Label>
            <FileUpload
              value={file}
              onChange={handleFileChange}
              onSizeChange={handleFileSizeChange}
              onTypeChange={handleFileTypeChange}
              maxSize={100 * 1024 * 1024} // 100MB
            />
            {!file && download.fileUrl && (
              <p className="text-sm text-muted-foreground">
                Current file: {download.fileUrl.split('/').pop()}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={download.title}
              onChange={(e) => setDownload({ ...download, title: e.target.value })}
              placeholder="Download Title"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={download.description}
              onChange={(e) => setDownload({ ...download, description: e.target.value })}
              placeholder="Enter a description..."
            />
            <p className="text-sm text-muted-foreground">
              Optional: Provide a brief description of the download
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={download.category}
              onChange={(e) => setDownload({ ...download, category: e.target.value })}
              placeholder="e.g., Software, Documentation"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              value={download.version || ''}
              onChange={(e) => setDownload({ ...download, version: e.target.value })}
              placeholder="e.g., 1.0.0"
            />
            <p className="text-sm text-muted-foreground">
              Optional: Specify the version number
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Thumbnail</Label>
            <MediaUpload
              currentMedia={download.thumbnail ? { url: download.thumbnail, type: 'image' } : null}
              onMediaChange={handleMediaChange}
            />
            <p className="text-sm text-muted-foreground">
              Optional: Add a thumbnail image for the download
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="featured">Featured</Label>
              <p className="text-sm text-muted-foreground">
                Display this download prominently
              </p>
            </div>
            <Switch
              id="featured"
              checked={download.featured}
              onCheckedChange={(checked) => setDownload({ ...download, featured: checked })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={download.status}
              onChange={(e) => setDownload({ ...download, status: e.target.value })}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/downloads')}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Download')}
        </Button>
      </div>
    </form>
  )
} 