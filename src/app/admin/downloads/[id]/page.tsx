'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Save, X, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { MediaSelector } from "@/components/media-selector"
import { DownloadsAPI } from "@/lib/api/services"
import type { Download } from "@/lib/api/types"
import type { MediaAsset } from "@/types/media"

const editSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  version: z.string().min(1, "Version is required"),
  status: z.enum(["Active", "Archived"]),
  file: z.object({
    name: z.string(),
    url: z.string(),
    size: z.number(),
    format: z.string(),
  }),
  thumbnail: z.string().optional(),
})

type EditFormValues = z.infer<typeof editSchema>

interface PageProps {
  params: {
    id: string
  }
}

export default function EditDownloadPage({ params }: PageProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
  })

  // 加载下载数据
  React.useEffect(() => {
    async function loadDownload() {
      try {
        setLoading(true)
        const response = await DownloadsAPI.get(params.id)
        const download = response.data.data

        form.reset({
          ...download,
        })
      } catch (error) {
        console.error('Failed to load download:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDownload()
  }, [params.id, form])

  // 处理表单提交
  const onSubmit = async (data: EditFormValues) => {
    try {
      setSaving(true)
      await DownloadsAPI.update(params.id, data)
      router.push('/admin/downloads')
    } catch (error) {
      console.error('Failed to update download:', error)
    } finally {
      setSaving(false)
    }
  }

  // 处理文件选择
  const handleFileSelect = (asset: MediaAsset) => {
    form.setValue('file', {
      name: asset.name,
      url: asset.path,
      size: asset.size,
      format: asset.mimeType.split('/')[1] || '',
    })
  }

  // 处理缩略图选择
  const handleThumbnailSelect = (asset: MediaAsset) => {
    form.setValue('thumbnail', asset.path)
  }

  // Handle delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this download? This action cannot be undone.')) {
      return
    }

    try {
      setDeleting(true)
      await DownloadsAPI.delete(params.id)
      toast.success('Download deleted successfully')
      router.push('/admin/downloads')
    } catch (error) {
      console.error('Failed to delete download:', error)
      toast.error('Failed to delete download')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading download...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 顶部导航栏 */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/admin/downloads')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">
              {params.id === 'new' ? 'New Download' : 'Edit Download'}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {params.id !== 'new' && (
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            )}
            <Button type="submit" form="product-form" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6 space-y-4">
            <FormField
              label="Title"
              error={form.formState.errors.title?.message}
              required
            >
              <Input {...form.register("title")} />
            </FormField>

            <FormField
              label="Description"
              error={form.formState.errors.description?.message}
              required
            >
              <Textarea {...form.register("description")} />
            </FormField>

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                label="Category"
                error={form.formState.errors.category?.message}
                required
              >
                <Select
                  value={form.watch("category")}
                  onValueChange={(value) => form.setValue("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Documentation">Documentation</SelectItem>
                    <SelectItem value="Tools">Tools</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Version"
                error={form.formState.errors.version?.message}
                required
              >
                <Input {...form.register("version")} />
              </FormField>

              <FormField
                label="Status"
                error={form.formState.errors.status?.message}
                required
              >
                <Select
                  value={form.watch("status")}
                  onValueChange={(value) => form.setValue("status", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">File</h2>
              <MediaSelector
                onSelect={handleFileSelect}
                trigger={
                  <Button variant="outline" size="sm">
                    Select File
                  </Button>
                }
              />
            </div>

            {form.watch('file')?.url && (
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{form.watch('file')?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {(form.watch('file')?.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => form.setValue('file', undefined as any)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Thumbnail</h2>
              <MediaSelector
                type="image"
                onSelect={handleThumbnailSelect}
                trigger={
                  <Button variant="outline" size="sm">
                    Select Image
                  </Button>
                }
              />
            </div>

            {form.watch('thumbnail') && (
              <Card className="relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => form.setValue('thumbnail', undefined)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <img
                  src={form.watch('thumbnail')}
                  alt="Thumbnail"
                  className="w-full aspect-video object-cover rounded-lg"
                />
              </Card>
            )}
          </Card>
        </form>
      </div>
    </div>
  )
} 