'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Save, Trash2, Link as LinkIcon, Eye, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichEditor } from "@/components/ui/rich-editor"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const pageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  path: z.string()
    .min(1, "Path is required")
    .regex(/^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/, "Invalid path format"),
  type: z.string().min(1, "Type is required"),
  status: z.enum(["Draft", "Published"]),
  content: z.string().min(1, "Content is required"),
  isHomePage: z.boolean().default(false),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    ogImage: z.string().optional(),
  }).optional(),
  settings: z.object({
    showInNavigation: z.boolean().default(true),
    allowComments: z.boolean().default(false),
    password: z.string().optional(),
  }).optional(),
})

type PageFormValues = z.infer<typeof pageSchema>

// Mock data - will be replaced with API calls
const mockPage = {
  id: "1",
  title: "Home",
  path: "/",
  type: "Landing Page",
  status: "Published" as const,
  content: "<h1>Welcome to our site</h1><p>This is the homepage content.</p>",
  isHomePage: true,
  seo: {
    title: "",
    description: "",
    keywords: "",
    ogImage: "",
  },
  settings: {
    showInNavigation: true,
    allowComments: false,
    password: "",
  },
}

const types = ["Landing Page", "Content Page"]

export default function PageEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)
  const [isPathManuallyEdited, setIsPathManuallyEdited] = React.useState(false)

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: mockPage,
  })

  // Watch form changes
  React.useEffect(() => {
    const subscription = form.watch(() => setIsDirty(true))
    return () => subscription.unsubscribe()
  }, [form.watch])

  // Auto-generate path from title
  React.useEffect(() => {
    if (!isPathManuallyEdited) {
      const title = form.watch("title")
      if (title) {
        const generatedPath = '/' + slugify(title)
        form.setValue("path", generatedPath)
      }
    }
  }, [form.watch("title"), isPathManuallyEdited])

  // Handle save
  const handleSubmit = async (data: PageFormValues) => {
    try {
      setIsLoading(true)
      // TODO: Implement save logic
      console.log('Saving page:', data)
      
      setIsDirty(false)
      router.push('/admin/pages')
    } catch (error) {
      console.error('Failed to save page:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this page?')) return
    
    try {
      setIsLoading(true)
      // TODO: Implement delete logic
      router.push('/admin/pages')
    } catch (error) {
      console.error('Failed to delete page:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle back
  const handleBack = () => {
    if (isDirty && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return
    }
    router.push('/admin/pages')
  }

  // Handle preview
  const handlePreview = () => {
    router.push(`/admin/pages/${params.id}/preview`)
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
            {params.id === 'new' ? 'Add Page' : 'Edit Page'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {params.id !== 'new' && (
            <>
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" onClick={handleDelete} disabled={isLoading}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
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
                label="URL Path"
                error={form.formState.errors.path?.message}
                required
              >
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...form.register("path")}
                    className="pl-9"
                    onChange={(e) => {
                      setIsPathManuallyEdited(true)
                      form.setValue("path", e.target.value)
                    }}
                  />
                </div>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
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
                      {types.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={form.watch("isHomePage")}
                  onCheckedChange={(checked) => form.setValue("isHomePage", checked)}
                />
                <span className="text-sm">Set as Homepage</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Content</h2>
            <FormField
              label="Page Content"
              error={form.formState.errors.content?.message}
              required
            >
              <RichEditor
                content={form.watch("content")}
                onChange={(content) => form.setValue("content", content)}
              />
            </FormField>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Page Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Show in Navigation</label>
                  <div className="text-sm text-muted-foreground">
                    Display this page in the site navigation
                  </div>
                </div>
                <Switch
                  checked={form.watch("settings.showInNavigation")}
                  onCheckedChange={(checked) => form.setValue("settings.showInNavigation", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Allow Comments</label>
                  <div className="text-sm text-muted-foreground">
                    Enable comments on this page
                  </div>
                </div>
                <Switch
                  checked={form.watch("settings.allowComments")}
                  onCheckedChange={(checked) => form.setValue("settings.allowComments", checked)}
                />
              </div>

              <FormField
                label="Password Protection"
                error={form.formState.errors.settings?.password?.message}
              >
                <Input
                  type="password"
                  value={form.watch("settings.password")}
                  onChange={(e) => form.setValue("settings.password", e.target.value)}
                  placeholder="Leave empty for no password"
                />
              </FormField>
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
                <Input
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
                label="Social Image"
                error={form.formState.errors.seo?.ogImage?.message}
              >
                <Input
                  value={form.watch("seo.ogImage")}
                  onChange={(e) => form.setValue("seo.ogImage", e.target.value)}
                  placeholder="URL for social sharing image"
                />
              </FormField>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 