'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Save, Trash2, Link as LinkIcon, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichEditor } from "@/components/ui/rich-editor"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const solutionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["Featured", "Active", "Draft"]),
  summary: z.string().min(1, "Summary is required").max(200, "Summary should be less than 200 characters"),
  description: z.string().min(1, "Description is required"),
  features: z.array(z.object({
    title: z.string().min(1, "Feature title is required"),
    description: z.string().min(1, "Feature description is required"),
  })).min(1, "At least one feature is required"),
  coverImage: z.object({
    url: z.string(),
    alt: z.string(),
  }).optional(),
  caseStudies: z.array(z.object({
    title: z.string(),
    url: z.string(),
  })).optional(),
})

type SolutionFormValues = z.infer<typeof solutionSchema>

// 模拟数据 - 之后会替换为API调用
const mockSolution = {
  id: "1",
  title: "Enterprise Solution",
  slug: "enterprise-solution",
  category: "Enterprise",
  status: "Active" as const,
  summary: "Comprehensive enterprise solution for large organizations",
  description: "Detailed description of the enterprise solution",
  features: [
    {
      title: "Scalability",
      description: "Handles millions of users and transactions"
    }
  ],
  coverImage: undefined,
  caseStudies: [] as { title: string; url: string }[],
}

export default function SolutionEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)
  const [selectedCoverImage, setSelectedCoverImage] = React.useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = React.useState<string>("")
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false)

  const form = useForm<SolutionFormValues>({
    resolver: zodResolver(solutionSchema),
    defaultValues: mockSolution,
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

  // 添加新特点
  const addFeature = () => {
    const features = form.watch("features") || []
    form.setValue("features", [
      ...features,
      { title: "", description: "" }
    ])
  }

  // 移除特点
  const removeFeature = (index: number) => {
    const features = form.watch("features")
    form.setValue("features", features.filter((_, i) => i !== index))
  }

  // 添加案例研究
  const addCaseStudy = () => {
    const caseStudies = form.watch("caseStudies") || []
    form.setValue("caseStudies", [
      ...caseStudies,
      { title: "", url: "" }
    ])
  }

  // 移除案例研究
  const removeCaseStudy = (index: number) => {
    const caseStudies = form.watch("caseStudies") || []
    form.setValue("caseStudies", caseStudies.filter((_, i) => i !== index))
  }

  // 处理保存
  const handleSubmit = async (data: SolutionFormValues) => {
    try {
      setIsLoading(true)
      // TODO: 实现文件上传和数据保存
      console.log('Saving solution:', data)
      console.log('Cover image to upload:', selectedCoverImage)
      
      setIsDirty(false)
      router.push('/admin/solutions')
    } catch (error) {
      console.error('Failed to save solution:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 处理删除
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this solution?')) return
    
    try {
      setIsLoading(true)
      // TODO: 实现删除逻辑
      router.push('/admin/solutions')
    } catch (error) {
      console.error('Failed to delete solution:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 处理返回
  const handleBack = () => {
    if (isDirty && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return
    }
    router.push('/admin/solutions')
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
            {params.id === 'new' ? 'Add Solution' : 'Edit Solution'}
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
                      <SelectItem value="Featured">Featured</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <FormField
                label="Summary"
                error={form.formState.errors.summary?.message}
                required
              >
                <Input {...form.register("summary")} />
              </FormField>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <FormField
              label="Description"
              error={form.formState.errors.description?.message}
              required
            >
              <RichEditor
                content={form.watch("description")}
                onChange={(content) => form.setValue("description", content)}
              />
            </FormField>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Key Features</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={addFeature}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>
            <div className="space-y-4">
              {form.watch("features")?.map((_, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-medium">Feature {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <FormField
                      label="Title"
                      error={form.formState.errors.features?.[index]?.title?.message}
                      required
                    >
                      <Input {...form.register(`features.${index}.title`)} />
                    </FormField>
                    <FormField
                      label="Description"
                      error={form.formState.errors.features?.[index]?.description?.message}
                      required
                    >
                      <Input {...form.register(`features.${index}.description`)} />
                    </FormField>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Case Studies</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={addCaseStudy}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Case Study
              </Button>
            </div>
            <div className="space-y-4">
              {form.watch("caseStudies")?.map((_, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-medium">Case Study {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCaseStudy(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <FormField
                      label="Title"
                      error={form.formState.errors.caseStudies?.[index]?.title?.message}
                    >
                      <Input {...form.register(`caseStudies.${index}.title`)} />
                    </FormField>
                    <FormField
                      label="URL"
                      error={form.formState.errors.caseStudies?.[index]?.url?.message}
                    >
                      <Input {...form.register(`caseStudies.${index}.url`)} />
                    </FormField>
                  </div>
                </Card>
              ))}
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
                      Click to upload cover image
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
        </div>
      </div>
    </div>
  )
} 