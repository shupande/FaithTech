'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Save, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { MediaAPI } from "@/lib/api/services"
import type { MediaCategory } from "@/types/media"

const uploadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  tags: z.array(z.string()).optional(),
  file: z.instanceof(File, { message: "File is required" }),
})

type UploadFormValues = z.infer<typeof uploadSchema>

export default function UploadPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [categories, setCategories] = React.useState<MediaCategory[]>([])
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      tags: [],
    },
  })

  // 加载分类
  React.useEffect(() => {
    async function loadCategories() {
      try {
        const response = await MediaAPI.listCategories()
        setCategories(response.data.data)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }

    loadCategories()
  }, [])

  // 处理文件选择
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      form.setValue('file', file)
    }
  }

  // 处理文件拖放
  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
      form.setValue('file', file)
    }
  }

  // 处理表单提交
  const onSubmit = async (data: UploadFormValues) => {
    try {
      setLoading(true)

      // 准备表单数据
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('type', data.type)
      formData.append('category', data.category)
      if (data.subCategory) {
        formData.append('subCategory', data.subCategory)
      }
      if (data.tags && data.tags.length > 0) {
        formData.append('tags', JSON.stringify(data.tags))
      }

      // 上传文件
      await MediaAPI.createAsset(formData)

      // 返回资源库
      router.push('/admin/media')
    } catch (error) {
      console.error('Failed to upload file:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/admin/media')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">Upload File</h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <div className="text-2xl">📎 {selectedFile.name}</div>
                <div className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFile(null)
                    form.setValue('file', undefined as any)
                  }}
                >
                  Change File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg">
                    Drop your file here, or{" "}
                    <span className="text-primary">browse</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Support for a single file upload
                  </p>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
          {form.formState.errors.file && (
            <p className="text-sm text-destructive mt-2">
              {form.formState.errors.file.message}
            </p>
          )}
        </Card>

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
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/media')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 