'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Save, Plus, X, FileText, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import Image from 'next/image'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { MediaSelector } from "@/components/media-selector"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { CategorySelector } from "@/components/category-selector"
import { ProductsAPI } from "@/lib/api/services"
import type { MediaAsset } from "@/types/media"
import type { Product } from "@/lib/api/types"
import { ImageUpload } from "@/components/ui/image-upload"

// 动态导入 Quill 编辑器以避免 SSR 问题
const QuillEditor = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
})

const editSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  categoryId: z.string().min(1, "Category is required"),
  category: z.string().optional(),
  status: z.enum(["Active", "Coming Soon", "Discontinued"]),
  description: z.string().min(1, "Description is required"),
  features: z.string(),
  specifications: z.string(),
  models: z.string(),
  images: z.array(z.string()),
  files: z.array(z.object({
    name: z.string(),
    url: z.string(),
    size: z.number(),
  })).optional(),
})

type EditFormValues = z.infer<typeof editSchema>

// 确保 ProductFormData 和 EditFormValues 类型一致
type ProductFormData = EditFormValues

interface PageProps {
  params: {
    id: string
  }
}

// Quill 编辑器配置
const editorModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link', 'image'],
    ['clean']
  ],
}

export default function EditProductPage({ params }: PageProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: "",
      slug: "",
      categoryId: "",
      category: "",
      status: "Active",
      description: "",
      features: "",
      specifications: "",
      models: "",
      images: [],
      files: [],
    },
  })

  // 加载产品数据
  React.useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        const response = await ProductsAPI.get(params.id)
        const product = response.data.data
        
        form.reset({
          name: product.name || '',
          slug: product.slug || '',
          categoryId: product.categoryId || '',
          category: product.category || '',
          status: product.status || 'Active',
          description: product.description || '',
          features: product.features || '',
          specifications: product.specifications || '',
          models: product.models || '',
          images: product.images || [],
          files: product.files || [],
        })
      } catch (error) {
        console.error('Failed to load product:', error)
        toast.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    if (params.id !== 'new') {
      loadProduct()
    } else {
      setLoading(false)
    }
  }, [params.id, form])

  // 处理表单提交
  const onSubmit = async (values: ProductFormData) => {
    try {
      setSaving(true)
      
      // 准备产品数据
      const productData = {
        ...values,
        images: JSON.stringify(values.images || []),
        files: JSON.stringify(values.files || []),
        categoryId: values.categoryId || values.category,
      }

      console.log('Form values:', values)
      console.log('Sending product data:', productData)

      const response = await fetch(`/api/products/${params.id === 'new' ? '' : params.id}`, {
        method: params.id === 'new' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (!response.ok) {
        let errorMessage = 'Failed to save product'
        
        if (data.errors) {
          if (Array.isArray(data.errors)) {
            errorMessage = data.errors.join('\n')
          } else if (typeof data.errors === 'object') {
            errorMessage = Object.values(data.errors).join('\n')
          }
        } else if (data.message) {
          errorMessage = data.message
        }
        
        toast.error(errorMessage, {
          duration: 5000,
        })
        return
      }

      toast.success('Product saved successfully')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Failed to save product: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  // 处理文件选择
  const handleFileSelect = (asset: MediaAsset) => {
    const files = form.getValues('files') || []
    form.setValue('files', [
      ...files,
      {
        name: asset.name,
        url: asset.path,
        size: asset.size,
      },
    ])
  }

  // 移除文件
  const handleFileRemove = (index: number) => {
    const files = form.getValues('files') || []
    form.setValue('files', files.filter((_, i) => i !== index))
  }

  // 处理图片选择
  const handleImageSelect = (asset: MediaAsset) => {
    const images = form.getValues('images')
    form.setValue('images', [
      ...images,
      asset.path,
    ])
  }

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed')
      }

      if (!data.url) {
        throw new Error('No URL returned from upload')
      }

      // 更新form中的images数组
      const currentImages = form.getValues('images') || []
      form.setValue('images', [...currentImages, data.url])
      
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading product...</p>
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
              onClick={() => router.push('/admin/products')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">
              {params.id === 'new' ? 'New Product' : 'Edit Product'}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {params.id !== 'new' && (
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!confirm('Are you sure you want to delete this product?')) {
                    return
                  }
                  try {
                    const response = await fetch(`/api/products/${params.id}`, {
                      method: 'DELETE',
                    })

                    if (!response.ok) {
                      throw new Error('Failed to delete product')
                    }

                    toast.success('Product deleted successfully')
                    router.push('/admin/products')
                  } catch (error) {
                    console.error('Error deleting product:', error)
                    toast.error('Failed to delete product')
                  }
                }}
              >
                Delete
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

      {/* 主要内容区域 */}
      <div className="flex-1 space-y-6 p-6">
        <Form {...form}>
          <form id="product-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6 md:grid-cols-6">
              {/* 左侧主要信息 */}
              <div className="md:col-span-4 space-y-6">
                {/* 基本信息卡片 */}
                <Card className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold">Basic Information</h2>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <CategorySelector
                      name="categoryId"
                      control={form.control}
                      label="Category"
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                              <SelectItem value="Discontinued">Discontinued</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>

                {/* Features card */}
                <Card className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold">Features</h2>
                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>

                {/* Specifications card */}
                <Card className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold">Specifications</h2>
                  <FormField
                    control={form.control}
                    name="specifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>

                {/* Models card */}
                <Card className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold">Models</h2>
                  <FormField
                    control={form.control}
                    name="models"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>
              </div>

              {/* Right sidebar */}
              <div className="md:col-span-2 space-y-6">
                {/* Images card */}
                <Card className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Images</h2>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault()
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.multiple = true
                        input.onchange = async (e) => {
                          const files = (e.target as HTMLInputElement).files
                          if (!files?.length) return

                          try {
                            for (const file of Array.from(files)) {
                              await handleImageUpload(file)
                            }
                          } catch (error) {
                            console.error('Upload failed:', error)
                            toast.error('Failed to upload images')
                          }
                        }
                        input.click()
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Images
                    </Button>
                  </div>

                  <div className="grid gap-4 grid-cols-2">
                    {form.watch('images')?.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square group"
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={image}
                            alt={`Product image ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {index > 0 && (
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                const images = [...form.getValues('images')]
                                const temp = images[index]
                                images[index] = images[index - 1]
                                images[index - 1] = temp
                                form.setValue('images', images)
                              }}
                            >
                              ↑
                            </Button>
                          )}
                          {index < form.watch('images').length - 1 && (
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                const images = [...form.getValues('images')]
                                const temp = images[index]
                                images[index] = images[index + 1]
                                images[index + 1] = temp
                                form.setValue('images', images)
                              }}
                            >
                              ↓
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              const images = form.getValues('images').filter((_, i) => i !== index)
                              form.setValue('images', images)
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Files card */}
                <Card className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Files</h2>
                    <MediaSelector
                      onSelect={handleFileSelect}
                      trigger={
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add File
                        </Button>
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    {form.watch('files')?.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleFileRemove(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
} 