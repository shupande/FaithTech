'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Save, Trash2, Link as LinkIcon, Eye, Globe } from "lucide-react"
import { toast } from "sonner"
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 动态导入 Quill 编辑器以避免 SSR 问题
const QuillEditor = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
})

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
  hero: z.object({
    badge: z.object({
      text: z.string(),
      action: z.object({
        text: z.string(),
        href: z.string(),
      }),
    }).optional(),
    title: z.string(),
    description: z.string(),
    actions: z.array(z.object({
      text: z.string(),
      href: z.string(),
      variant: z.enum(["default", "glow"]).optional(),
    })),
    image: z.object({
      light: z.string(),
      dark: z.string(),
      alt: z.string(),
    }),
  }).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    ogImage: z.string().optional(),
  }).optional(),
  settings: z.object({
    showInNavigation: z.boolean().default(true),
    allowComments: z.boolean().default(false),
    password: z.string().optional(),
  }).optional(),
})

type PageFormValues = z.infer<typeof pageSchema>

interface PageData {
  id: string
  title: string
  slug: string
  status: "Draft" | "Published"
  content: string
  hero: string | null
  seo: string | null
  createdAt: string
  updatedAt: string
}

export default function PageEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)
  const [isPathManuallyEdited, setIsPathManuallyEdited] = React.useState(false)

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: "",
      path: "",
      type: "page",
      status: "Draft",
      content: "",
      isHomePage: false,
      hero: {
        badge: {
          text: "",
          action: {
            text: "",
            href: "",
          },
        },
        title: "",
        description: "",
        actions: [],
        image: {
          light: "",
          dark: "",
          alt: "",
        },
      },
      seo: {
        title: "",
        description: "",
        keywords: [],
        ogImage: "",
      },
      settings: {
        showInNavigation: true,
        allowComments: false,
        password: "",
      },
    },
  })

  // Load page data
  React.useEffect(() => {
    async function loadPage() {
      if (params.id === 'new') return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/pages/${params.id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load page')
        }

        if (!data.success || !data.data) {
          throw new Error('Invalid response format')
        }

        const pageData = data.data as PageData
        let hero = null
        let seo = null

        try {
          hero = pageData.hero ? (typeof pageData.hero === 'string' ? JSON.parse(pageData.hero) : pageData.hero) : null
          seo = pageData.seo ? (typeof pageData.seo === 'string' ? JSON.parse(pageData.seo) : pageData.seo) : null
        } catch (error) {
          console.error('Failed to parse hero or seo data:', error)
          // If parsing fails, use null values
          hero = null
          seo = null
        }

        form.reset({
          title: pageData.title,
          path: '/' + pageData.slug,
          type: "page",
          status: pageData.status,
          content: pageData.content,
          isHomePage: false,
          hero: hero ? {
            badge: hero.badge || {
              text: '',
              action: {
                text: '',
                href: '',
              },
            },
            title: hero.title || '',
            description: hero.description || '',
            actions: Array.isArray(hero.actions) ? hero.actions : [],
            image: hero.image || {
              light: '',
              dark: '',
              alt: '',
            },
          } : undefined,
          seo: {
            title: seo?.title || '',
            description: seo?.description || '',
            keywords: Array.isArray(seo?.keywords) ? seo.keywords : [],
            ogImage: seo?.ogImage || '',
          },
          settings: {
            showInNavigation: true,
            allowComments: false,
            password: '',
          },
        })

        setIsDirty(false)
      } catch (error) {
        console.error('Failed to load page:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to load page')
        router.push('/admin/pages')
      } finally {
        setIsLoading(false)
      }
    }

    loadPage()
  }, [params.id, form, router])

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
  }, [form.watch("title"), isPathManuallyEdited, form])

  // Handle submit
  const handleSubmit = async (data: PageFormValues) => {
    try {
      setIsLoading(true)

      const submitData = {
        title: data.title,
        slug: data.path.slice(1), // Remove leading slash
        status: data.status,
        content: data.content,
        hero: data.hero,
        seo: {
          ...data.seo,
          keywords: data.seo?.keywords || [],
        },
      }

      const response = await fetch(
        params.id === 'new' ? '/api/pages' : `/api/pages/${params.id}`,
        {
          method: params.id === 'new' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save page')
      }

      toast.success('Page saved successfully')
      setIsDirty(false)
      router.push('/admin/pages')
    } catch (error) {
      console.error('Failed to save page:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save page')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this page?')) return
    
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/pages/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete page')
      }

      toast.success('Page deleted successfully')
      router.push('/admin/pages')
    } catch (error) {
      console.error('Failed to delete page:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete page')
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

  if (isLoading && params.id !== 'new') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
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

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card className="p-6">
            <div className="grid gap-4">
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
                <Input
                  {...form.register("path")}
                  onChange={(e) => {
                    setIsPathManuallyEdited(true)
                    form.setValue("path", e.target.value)
                  }}
                />
              </FormField>

              <FormField
                label="Status"
                error={form.formState.errors.status?.message}
                required
              >
                <Select
                  value={form.watch("status")}
                  onValueChange={(value) => form.setValue("status", value as "Draft" | "Published")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Content"
                error={form.formState.errors.content?.message}
                required
              >
                <QuillEditor
                  theme="snow"
                  modules={editorModules}
                  value={form.watch("content")}
                  onChange={(content) => form.setValue("content", content)}
                  className="min-h-[200px]"
                />
              </FormField>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card className="p-6">
            <div className="grid gap-4">
              <FormField
                label="SEO Title"
                error={form.formState.errors.seo?.title?.message}
              >
                <Input
                  value={form.watch("seo.title") || ""}
                  onChange={(e) => form.setValue("seo.title", e.target.value)}
                />
              </FormField>

              <FormField
                label="SEO Description"
                error={form.formState.errors.seo?.description?.message}
              >
                <Input
                  value={form.watch("seo.description") || ""}
                  onChange={(e) => form.setValue("seo.description", e.target.value)}
                />
              </FormField>

              <FormField
                label="Keywords"
                error={form.formState.errors.seo?.keywords?.message}
              >
                <Input
                  value={form.watch("seo.keywords")?.join(", ") || ""}
                  onChange={(e) => {
                    const keywords = e.target.value.split(",").map(k => k.trim()).filter(Boolean)
                    form.setValue("seo.keywords", keywords)
                  }}
                  placeholder="Comma-separated keywords"
                />
              </FormField>

              <FormField
                label="Open Graph Image"
                error={form.formState.errors.seo?.ogImage?.message}
              >
                <Input
                  value={form.watch("seo.ogImage") || ""}
                  onChange={(e) => form.setValue("seo.ogImage", e.target.value)}
                  placeholder="URL of the Open Graph image"
                />
              </FormField>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6">
            <div className="grid gap-4">
              <FormField
                label="Show in Navigation"
                error={form.formState.errors.settings?.showInNavigation?.message}
              >
                <Switch
                  checked={form.watch("settings.showInNavigation")}
                  onCheckedChange={(checked) => form.setValue("settings.showInNavigation", checked)}
                />
              </FormField>

              <FormField
                label="Allow Comments"
                error={form.formState.errors.settings?.allowComments?.message}
              >
                <Switch
                  checked={form.watch("settings.allowComments")}
                  onCheckedChange={(checked) => form.setValue("settings.allowComments", checked)}
                />
              </FormField>

              <FormField
                label="Password Protection"
                error={form.formState.errors.settings?.password?.message}
              >
                <Input
                  type="password"
                  value={form.watch("settings.password") || ""}
                  onChange={(e) => form.setValue("settings.password", e.target.value)}
                  placeholder="Leave empty for no password protection"
                />
              </FormField>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 