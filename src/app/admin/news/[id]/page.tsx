'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, Loader2, ArrowLeft, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichEditor } from "@/components/ui/rich-editor"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { handleApiError } from "@/lib/api/error"
import type { News } from "@/lib/api/types"

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const newsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["Draft", "Published"]),
  publishDate: z.string().min(1, "Publish date is required"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.object({
    url: z.string(),
    alt: z.string(),
  }).optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    size: z.number(),
  })).optional(),
})

type NewsFormValues = z.infer<typeof newsSchema>

export default function NewsEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isUploadingImage, setIsUploadingImage] = React.useState(false)
  const [isUploadingFile, setIsUploadingFile] = React.useState(false)
  const [news, setNews] = React.useState<News | null>(null)

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      slug: "",
      category: "",
      status: "Draft",
      publishDate: new Date().toISOString().split('T')[0],
      content: "",
      coverImage: undefined,
      attachments: [],
    },
    mode: "onChange",
  })

  // 监听表单状态变化
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      console.log('Form field changed:', name, value)
      console.log('Current form state:', {
        values: form.getValues(),
        errors: form.formState.errors,
        isValid: form.formState.isValid,
        isDirty: form.formState.isDirty,
      })
    })
    return () => subscription.unsubscribe()
  }, [form])

  // 加载新闻数据
  React.useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/news/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }
        const result = await response.json()
        console.log('News API Response:', result)

        if (!result || !result.data) {
          throw new Error('No news data received')
        }

        const data = result.data
        console.log('News data:', data)

        setNews(data)
        form.reset({
          title: data.title || '',
          slug: data.slug || '',
          category: data.category || '',
          status: data.status || 'Draft',
          publishDate: data.publishDate ? new Date(data.publishDate).toISOString().split('T')[0] : '',
          content: data.content || '',
          coverImage: data.coverImage ? {
            url: data.coverImage.url || '',
            alt: data.coverImage.alt || ''
          } : undefined,
          attachments: Array.isArray(data.attachments) ? data.attachments.map((file: any) => ({
            name: file.name || '',
            url: file.url || '',
            size: file.size || 0
          })) : []
        })
      } catch (error) {
        console.error('Failed to fetch news:', error)
        handleApiError(error, 'Failed to load news')
        router.push('/admin/news')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id !== 'new') {
      fetchNews()
    } else {
      setIsLoading(false)
    }
  }, [params.id, form, router])

  // 自动生成 slug
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title') {
        const slug = slugify(value.title || '')
        form.setValue('slug', slug)
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  // 处理封面图片上传
  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploadingImage(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      console.log('Upload image response:', data)

      form.setValue('coverImage', {
        url: data.url || data.data?.url,
        alt: file.name
      })
      event.target.value = ''
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Failed to upload image:', error)
      handleApiError(error, 'Failed to upload image')
    } finally {
      setIsUploadingImage(false)
    }
  }

  // 处理附件上传
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploadingFile(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload file')
      }

      const data = await response.json()
      console.log('Upload file response:', data)

      const attachments = form.getValues('attachments') || []
      form.setValue('attachments', [...attachments, {
        name: file.name,
        url: data.url || data.data?.url,
        size: file.size
      }])
      event.target.value = ''
      toast.success('File uploaded successfully')
    } catch (error) {
      console.error('Failed to upload file:', error)
      handleApiError(error, 'Failed to upload file')
    } finally {
      setIsUploadingFile(false)
    }
  }

  // 移除封面图片
  const handleRemoveImage = () => {
    form.setValue('coverImage', undefined)
    toast.success('Image removed')
  }

  // 移除附件
  const handleRemoveFile = (index: number) => {
    const attachments = form.getValues('attachments')
    if (!attachments) return
    form.setValue('attachments', attachments.filter((_, i) => i !== index))
    toast.success('File removed')
  }

  // 保存新闻
  const onSubmit = async (data: NewsFormValues) => {
    console.log('onSubmit called with data:', data)
    
    try {
      setIsSaving(true)
      const response = await fetch(
        params.id === 'new' ? '/api/news' : `/api/news/${params.id}`,
        {
          method: params.id === 'new' ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )

      console.log('Save response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Save error response:', errorData)
        throw new Error(errorData.message || 'Failed to save news')
      }

      const result = await response.json()
      console.log('Save success response:', result)

      toast.success(params.id === 'new' ? 'News created' : 'News updated')
      router.push('/admin/news')
    } catch (error) {
      console.error('Failed to save news:', error)
      handleApiError(error, 'Failed to save news')
    } finally {
      setIsSaving(false)
    }
  }

  // 删除新闻
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this news?')) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/news/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete news')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete news')
      }

      toast.success('News deleted')
      router.push('/admin/news')
    } catch (error) {
      console.error('Failed to delete news:', error)
      handleApiError(error, 'Failed to delete news')
    } finally {
      setIsDeleting(false)
    }
  }

  // 返回列表
  const handleBack = () => {
    if (form.formState.isDirty) {
      if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return
      }
    }
    router.push('/admin/news')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <form onSubmit={async (e) => {
        e.preventDefault()
        console.log('Form submitted')
        
        const validationResult = await form.trigger()
        console.log('Validation result:', validationResult)
        console.log('Validation errors:', form.formState.errors)
        
        if (!validationResult) {
          console.log('Form validation failed')
          toast.error('Please fill in all required fields')
          return
        }

        const values = form.getValues()
        console.log('Form values:', values)
        
        try {
          await form.handleSubmit(onSubmit)(e)
        } catch (error) {
          console.error('Form submission error:', error)
        }
      }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button type="button" variant="ghost" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold">
              {params.id === 'new' ? 'Add News' : 'Edit News'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={params.id === 'new' || isDeleting}
            >
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button 
              type="submit"
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* 表单验证错误显示 */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="mt-4 p-4 border border-destructive rounded-md">
            <h3 className="text-sm font-medium text-destructive mb-2">Please fix the following errors:</h3>
            <ul className="list-disc pl-4 space-y-1">
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field} className="text-sm text-destructive">
                  {error?.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <FormField
                  label="Title"
                  error={form.formState.errors.title?.message}
                  required
                >
                  <Input id="title" {...form.register("title")} />
                </FormField>

                <FormField
                  label="Slug"
                  error={form.formState.errors.slug?.message}
                  required
                >
                  <Input id="slug" {...form.register("slug")} />
                </FormField>

                <FormField
                  label="Category"
                  error={form.formState.errors.category?.message}
                  required
                >
                  <Input id="category" {...form.register("category")} />
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
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField
                  label="Publish Date"
                  error={form.formState.errors.publishDate?.message}
                  required
                >
                  <Input
                    id="publishDate"
                    type="date"
                    {...form.register("publishDate")}
                  />
                </FormField>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Content</h2>
                <FormField
                  label="News Content"
                  error={form.formState.errors.content?.message}
                  required
                >
                  <RichEditor
                    content={form.watch("content")}
                    onChange={(value) => form.setValue("content", value)}
                  />
                </FormField>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Cover Image</h2>
                <Alert>
                  <AlertDescription>
                    Upload a cover image for the news article.
                  </AlertDescription>
                </Alert>

                {form.watch("coverImage") ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={form.watch("coverImage.url")}
                      alt={form.watch("coverImage.alt")}
                      className="w-40 h-40 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{form.watch("coverImage.alt")}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveImage}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Input
                      id="cover-image"
                      type="file"
                      onChange={handleImageSelect}
                      disabled={isUploadingImage}
                    />
                    {isUploadingImage && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Attachments</h2>
                <Alert>
                  <AlertDescription>
                    Upload related files for the news article.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4">
                  {form.watch("attachments")?.map((file, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileSelect}
                    disabled={isUploadingFile}
                  />
                  {isUploadingFile && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
} 