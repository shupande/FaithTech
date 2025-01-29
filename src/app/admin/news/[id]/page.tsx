'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Save, Trash2, Link as LinkIcon, Plus, X, Image as ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichEditor } from "@/components/ui/rich-editor"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const newsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["Draft", "Published", "Archived"]),
  author: z.string().min(1, "Author is required"),
  publishDate: z.string().min(1, "Publish date is required"),
  excerpt: z.string().min(1, "Excerpt is required").max(200, "Excerpt should be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.object({
    url: z.string(),
    alt: z.string(),
  }).optional(),
  featured: z.boolean().default(false),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    ogImage: z.string().optional(),
  }).optional(),
  tags: z.array(z.string()).default([]),
})

type NewsFormValues = z.infer<typeof newsSchema>

// 模拟数据 - 之后会替换为API调用
const mockArticle = {
  id: "1",
  title: "New Product Launch",
  slug: "new-product-launch",
  category: "Product",
  status: "Published" as const,
  author: "John Doe",
  publishDate: "2024-03-15",
  excerpt: "Announcing our latest product innovation that will revolutionize the industry",
  content: "Detailed content about the new product launch",
  coverImage: undefined,
  featured: false,
  seo: {
    title: "",
    description: "",
    keywords: "",
    ogImage: "",
  },
  tags: ["product", "launch", "innovation"],
}

export default function NewsEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false)
  const [selectedCoverImage, setSelectedCoverImage] = React.useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = React.useState<string>("")
  const [newTag, setNewTag] = React.useState("")

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: mockArticle,
  })

  // 监听表单变化
  React.useEffect(() => {
    const subscription = form.watch(() => setIsDirty(true))
    return () => subscription.unsubscribe()
  }, [form.watch])

  // 自动生成 slug
  React.useEffect(() => {
    if (!isSlugManuallyEdited) {
      const title = form.watch("title")
      if (title) {
        const generatedSlug = slugify(title)
        form.setValue("slug", generatedSlug)
      }
    }
  }, [form.watch("title"), isSlugManuallyEdited])

  // 处理封面图片预览
  const handleCoverImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedCoverImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        setCoverImagePreview(preview)
      }
      reader.readAsDataURL(file)
    }
  }

  // 添加标签
  const addTag = () => {
    if (!newTag) return
    const currentTags = form.watch("tags") || []
    if (!currentTags.includes(newTag)) {
      form.setValue("tags", [...currentTags, newTag])
    }
    setNewTag("")
  }

  // 移除标签
  const removeTag = (tag: string) => {
    const currentTags = form.watch("tags")
    form.setValue("tags", currentTags.filter(t => t !== tag))
  }

  // 处理保存
  const handleSubmit = async (data: NewsFormValues) => {
    try {
      setIsLoading(true)
      // TODO: 实现文件上传和数据保存
      console.log('Saving article:', data)
      console.log('Cover image to upload:', selectedCoverImage)
      
      setIsDirty(false)
      router.push('/admin/news')
    } catch (error) {
      console.error('Failed to save article:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 处理删除
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?')) return
    
    try {
      setIsLoading(true)
      // TODO: 实现删除逻辑
      router.push('/admin/news')
    } catch (error) {
      console.error('Failed to delete article:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 处理返回
  const handleBack = () => {
    if (isDirty && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return
    }
    router.push('/admin/news')
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold">
            {params.id === 'new' ? 'Add Article' : 'Edit Article'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {params.id !== 'new' && (
            <Button variant="outline" onClick={handleDelete} disabled={isLoading}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <Button onClick={form.handleSubmit(handleSubmit)} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <FormField
                label="Title"
                error={form.formState.errors.title?.message}
                required
              >
                <Input {...form.register("title")} />
              </FormField>

              <FormField
                label="URL Slug"
                error={form.formState.errors.slug?.message}
                required
              >
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...form.register("slug")}
                    className="pl-9"
                    onChange={(e) => {
                      setIsSlugManuallyEdited(true)
                      form.setValue("slug", e.target.value)
                    }}
                  />
                </div>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Category"
                  error={form.formState.errors.category?.message}
                  required
                >
                  <Input {...form.register("category")} />
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
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Author"
                  error={form.formState.errors.author?.message}
                  required
                >
                  <Input {...form.register("author")} />
                </FormField>

                <FormField
                  label="Publish Date"
                  error={form.formState.errors.publishDate?.message}
                  required
                >
                  <Input
                    type="date"
                    {...form.register("publishDate")}
                  />
                </FormField>
              </div>

              <FormField
                label="Excerpt"
                error={form.formState.errors.excerpt?.message}
                required
              >
                <Textarea
                  {...form.register("excerpt")}
                  placeholder="Brief summary of the article"
                />
              </FormField>

              <div className="flex items-center gap-2">
                <Switch
                  checked={form.watch("featured")}
                  onCheckedChange={(checked) => form.setValue("featured", checked)}
                />
                <span className="text-sm">Featured Article</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Content</h2>
            <FormField
              label="Article Content"
              error={form.formState.errors.content?.message}
              required
            >
              <RichEditor
                content={form.watch("content")}
                onChange={(content) => form.setValue("content", content)}
              />
            </FormField>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Tags</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button
                  variant="outline"
                  onClick={addTag}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch("tags")?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Cover Image</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                {coverImagePreview ? (
                  <div className="relative">
                    <img
                      src={coverImagePreview}
                      alt="Cover preview"
                      className="rounded-lg max-w-full h-auto"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setSelectedCoverImage(null)
                        setCoverImagePreview("")
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageSelect}
                      className="hidden"
                      id="cover-image"
                    />
                    <label
                      htmlFor="cover-image"
                      className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="h-8 w-8" />
                        <span>Click to upload cover image</span>
                      </div>
                    </label>
                  </div>
                )}
              </div>
              {selectedCoverImage && (
                <FormField
                  label="Image Alt Text"
                  error={form.formState.errors.coverImage?.alt?.message}
                >
                  <Input
                    value={form.watch("coverImage.alt")}
                    onChange={(e) => form.setValue("coverImage.alt", e.target.value)}
                    placeholder="Describe the image"
                  />
                </FormField>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>
            <div className="space-y-4">
              <FormField
                label="SEO Title"
                error={form.formState.errors.seo?.title?.message}
              >
                <Input
                  value={form.watch("seo.title")}
                  onChange={(e) => form.setValue("seo.title", e.target.value)}
                  placeholder="Override page title for search engines"
                />
              </FormField>

              <FormField
                label="Meta Description"
                error={form.formState.errors.seo?.description?.message}
              >
                <Textarea
                  value={form.watch("seo.description")}
                  onChange={(e) => form.setValue("seo.description", e.target.value)}
                  placeholder="Brief description for search results"
                />
              </FormField>

              <FormField
                label="Keywords"
                error={form.formState.errors.seo?.keywords?.message}
              >
                <Input
                  value={form.watch("seo.keywords")}
                  onChange={(e) => form.setValue("seo.keywords", e.target.value)}
                  placeholder="Comma-separated keywords"
                />
              </FormField>

              <FormField
                label="Social Image URL"
                error={form.formState.errors.seo?.ogImage?.message}
              >
                <Input
                  value={form.watch("seo.ogImage")}
                  onChange={(e) => form.setValue("seo.ogImage", e.target.value)}
                  placeholder="Image URL for social sharing"
                />
              </FormField>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 