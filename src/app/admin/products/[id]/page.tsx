'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, Loader2, ArrowLeft, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichEditor } from "@/components/ui/rich-editor"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { handleApiError } from "@/lib/api/error"
import type { Product } from "@/lib/api/types"

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  status: z.enum(["Active", "Coming Soon", "Discontinued"]),
  description: z.string().min(1, "Description is required"),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string(),
  })).min(1, "At least one image is required"),
  files: z.array(z.object({
    name: z.string(),
    url: z.string(),
    size: z.number(),
  })).optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

export default function ProductEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isUploadingImage, setIsUploadingImage] = React.useState(false)
  const [isUploadingFile, setIsUploadingFile] = React.useState(false)
  const [product, setProduct] = React.useState<Product | null>(null)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      price: "",
      status: "Active",
      description: "",
      images: [],
      files: [],
    },
    mode: "onChange",
  })

  // 监听表单状态变化
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      console.log('Form field changed:', name, value)
      // 每次字段变化时检查表单状态
      console.log('Current form state:', {
        values: form.getValues(),
        errors: form.formState.errors,
        isValid: form.formState.isValid,
        isDirty: form.formState.isDirty,
      })
    })
    return () => subscription.unsubscribe()
  }, [form])

  // 加载产品数据
  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }
        const result = await response.json()
        console.log('Product API Response:', result)

        // 确保数据存在且正确
        if (!result || !result.data) {
          throw new Error('No product data received')
        }

        const data = result.data
        console.log('Product data:', data)

        // 保存原始数据
        setProduct(data)

        // 重置表单，确保所有字段都有值
        form.reset({
          name: data.name || '',
          slug: data.slug || '',
          category: data.category || '',
          price: data.price || '',
          status: data.status || 'Active',
          description: data.description || '',
          images: Array.isArray(data.images) ? data.images.map((img: any) => ({
            url: img.url || '',
            alt: img.alt || ''
          })) : [],
          files: Array.isArray(data.files) ? data.files.map((file: any) => ({
            name: file.name || '',
            url: file.url || '',
            size: file.size || 0
          })) : []
        })

        console.log('Form reset with data:', form.getValues())
      } catch (error) {
        console.error('Failed to fetch product:', error)
        handleApiError(error, 'Failed to load product')
        router.push('/admin/products')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id !== 'new') {
      fetchProduct()
    } else {
      setIsLoading(false)
    }
  }, [params.id, form, router])

  // 自动生成 slug
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name') {
        const slug = slugify(value.name || '')
        form.setValue('slug', slug)
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  // 处理图片上传
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

      const images = form.getValues('images') || []
      // 修改图片对象的结构
      form.setValue('images', [...images, {
        url: data.url || data.data?.url,
        alt: file.name
      }])
      event.target.value = ''
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Failed to upload image:', error)
      handleApiError(error, 'Failed to upload image')
    } finally {
      setIsUploadingImage(false)
    }
  }

  // 处理文件上传
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

      const files = form.getValues('files') || []
      // 修改文件对象的结构
      form.setValue('files', [...files, {
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

  // 移除图片
  const handleRemoveImage = (index: number) => {
    const images = form.getValues('images')
    form.setValue('images', images.filter((_, i) => i !== index))
    toast.success('Image removed')
  }

  // 移除文件
  const handleRemoveFile = (index: number) => {
    const currentFiles = form.getValues('files')
    if (!currentFiles) return
    form.setValue('files', currentFiles.filter((_, i) => i !== index))
    toast.success('File removed')
  }

  // 保存产品
  const onSubmit = async (data: ProductFormValues) => {
    console.log('onSubmit called with data:', data)
    
    // 验证图片和文件数据结构
    const validatedData = {
      ...data,
      images: data.images.map(img => ({
        url: img.url || '',
        alt: img.alt || ''
      })),
      files: data.files?.map(file => ({
        name: file.name || '',
        url: file.url || '',
        size: file.size || 0
      })) || []
    }

    try {
      setIsSaving(true)
      const response = await fetch(
        params.id === 'new' ? '/api/products' : `/api/products/${params.id}`,
        {
          method: params.id === 'new' ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(validatedData),
        }
      )

      console.log('Save response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Save error response:', errorData)
        throw new Error(errorData.message || 'Failed to save product')
      }

      const result = await response.json()
      console.log('Save success response:', result)

      toast.success(params.id === 'new' ? 'Product created' : 'Product updated')
      router.push('/admin/products')
    } catch (error) {
      console.error('Failed to save product:', error)
      handleApiError(error, 'Failed to save product')
    } finally {
      setIsSaving(false)
    }
  }

  // 删除产品
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete product')
      }

      toast.success('Product deleted')
      router.push('/admin/products')
    } catch (error) {
      console.error('Failed to delete product:', error)
      handleApiError(error, 'Failed to delete product')
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
    router.push('/admin/products')
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
        
        // 触发所有字段的验证
        const validationResult = await form.trigger()
        console.log('Validation result:', validationResult)
        console.log('Validation errors:', form.formState.errors)
        
        if (!validationResult) {
          console.log('Form validation failed')
          // 显示错误信息
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
              {params.id === 'new' ? 'Add Product' : 'Edit Product'}
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

        {/* 添加表单验证状态显示 */}
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
                  label="Name"
                  error={form.formState.errors.name?.message}
                  required
                >
                  <Input id="name" {...form.register("name")} />
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
                  label="Price"
                  error={form.formState.errors.price?.message}
                  required
                >
                  <Input id="price" {...form.register("price")} />
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
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                      <SelectItem value="Discontinued">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Description</h2>
                <FormField
                  label="Product Description"
                  error={form.formState.errors.description?.message}
                  required
                >
                  <RichEditor
                    content={form.watch("description")}
                    onChange={(value) => form.setValue("description", value)}
                  />
                </FormField>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Images</h2>
                <Alert>
                  <AlertDescription>
                    Upload product images. The first image will be used as the main image.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4">
                  {form.watch("images")?.map((image, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{image.alt}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveImage(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <Input
                    id="image-upload"
                    type="file"
                    onChange={handleImageSelect}
                    disabled={isUploadingImage}
                  />
                  {isUploadingImage && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
                {form.formState.errors.images?.message && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.images.message}
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Files</h2>
                <Alert>
                  <AlertDescription>
                    Upload product related files (e.g., manuals, specifications).
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4">
                  {form.watch("files")?.map((file, index) => (
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