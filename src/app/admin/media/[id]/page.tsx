'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Save, Upload, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { MediaAPI } from "@/lib/api/services"
import type { MediaAsset, MediaCategory, UpdateMediaAssetDTO } from "@/types/media"

const editSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["Active", "Archived", "Deleted"]),
})

type EditFormValues = z.infer<typeof editSchema>

interface PageProps {
  params: {
    id: string
  }
}

export default function EditAssetPage({ params }: PageProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [asset, setAsset] = React.useState<MediaAsset | null>(null)
  const [categories, setCategories] = React.useState<MediaCategory[]>([])
  const [showVersionUpload, setShowVersionUpload] = React.useState(false)
  const [uploadingVersion, setUploadingVersion] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
  })

  // 加载资源和分类
  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [assetResponse, categoriesResponse] = await Promise.all([
          MediaAPI.getAsset(params.id),
          MediaAPI.listCategories(),
        ])

        const assetData = assetResponse.data.data
        setAsset(assetData)
        setCategories(categoriesResponse.data.data)

        // 设置表单默认值
        form.reset({
          name: assetData.name,
          description: assetData.description,
          type: assetData.type,
          category: assetData.category,
          subCategory: assetData.subCategory,
          tags: assetData.tags || [],
          status: assetData.status as 'Active' | 'Archived' | 'Deleted',
        })
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id, form])

  // 处理表单提交
  const onSubmit = async (data: EditFormValues) => {
    try {
      setSaving(true)

      const updateData: UpdateMediaAssetDTO = {
        ...data,
      }

      await MediaAPI.updateAsset(params.id, updateData)
      router.push('/admin/media')
    } catch (error) {
      console.error('Failed to update asset:', error)
    } finally {
      setSaving(false)
    }
  }

  // 处理版本上传
  const handleVersionUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploadingVersion(true)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('assetId', params.id)
      formData.append('version', new Date().toISOString())

      await MediaAPI.createVersion(formData)

      // 重新加载资源数据
      const response = await MediaAPI.getAsset(params.id)
      setAsset(response.data.data)
      setShowVersionUpload(false)
    } catch (error) {
      console.error('Failed to upload version:', error)
    } finally {
      setUploadingVersion(false)
    }
  }

  // 处理删除
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this asset?')) {
      return
    }

    try {
      await MediaAPI.deleteAsset(params.id)
      router.push('/admin/media')
    } catch (error) {
      console.error('Failed to delete asset:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading asset...</p>
        </div>
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Asset not found</p>
          <Button
            className="mt-4"
            onClick={() => router.push('/admin/media')}
          >
            Back to Media Library
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin/media')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Edit Asset</h1>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="aspect-video relative mb-4">
              <img
                src={asset.type === 'image' ? asset.path : '/placeholder.png'}
                alt={asset.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {asset.type} • {(asset.size / 1024).toFixed(1)} KB
                </div>
                <a
                  href={asset.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View File
                </a>
              </div>
              <div className="text-sm text-muted-foreground">
                Uploaded on {new Date(asset.createdAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {asset.downloads} downloads
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Versions</h2>
            <div className="space-y-4">
              {asset.versions.map((version) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <div className="font-medium">Version {version.version}</div>
                    <div className="text-sm text-muted-foreground">
                      {(version.size / 1024).toFixed(1)} KB •{" "}
                      {new Date(version.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <a
                    href={version.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
            {showVersionUpload ? (
              <div className="mt-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleVersionUpload}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={uploadingVersion}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadingVersion ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Select File
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full mt-2"
                  onClick={() => setShowVersionUpload(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setShowVersionUpload(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload New Version
              </Button>
            )}
          </Card>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6 space-y-4">
            <FormField
              label="Name"
              error={form.formState.errors.name?.message}
              required
            >
              <Input {...form.register("name")} />
            </FormField>

            <FormField
              label="Description"
              error={form.formState.errors.description?.message}
              required
            >
              <Textarea {...form.register("description")} />
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Type"
                error={form.formState.errors.type?.message}
                required
              >
                <Select
                  value={form.watch("type")}
                  onValueChange={(value) => form.setValue("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="archive">Archive</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

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
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

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
                  <SelectItem value="Deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/media')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
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
        </form>
      </div>
    </div>
  )
} 