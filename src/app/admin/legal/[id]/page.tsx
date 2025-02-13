'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Save, Trash2, Link as LinkIcon, Eye } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichEditor } from "@/components/ui/rich-editor"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const legalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  type: z.string().min(1, "Type is required"),
  status: z.string().default("Active"),
  content: z.string().min(1, "Content is required"),
  version: z.string().min(1, "Version is required"),
  effectiveDate: z.string().min(1, "Effective date is required"),
  metadata: z.string().optional(),
})

type LegalFormValues = z.infer<typeof legalSchema>

export default function LegalEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isFetching, setIsFetching] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false)
  const [documentId, setDocumentId] = React.useState<string | null>(null)
  const [documentTypes, setDocumentTypes] = React.useState<string[]>([])
  const [customType, setCustomType] = React.useState("")

  const form = useForm<LegalFormValues>({
    resolver: zodResolver(legalSchema),
    defaultValues: {
      title: "",
      slug: "",
      type: "",
      status: "Active",
      content: "",
      version: "1.0",
      effectiveDate: new Date().toISOString().split('T')[0],
      metadata: "",
    }
  })

  // 加载文档类型
  React.useEffect(() => {
    async function loadTypes() {
      try {
        const response = await fetch('/api/legal/types')
        if (response.ok) {
          const data = await response.json()
          // 过滤掉预定义类型，只保留自定义类型
          const customTypes = data
            .map((t: any) => t.type)
            .filter((type: string) => !["privacy", "terms", "cookies"].includes(type))
          setDocumentTypes(customTypes)
        }
      } catch (error) {
        console.error("Error loading document types:", error)
      }
    }
    loadTypes()
  }, [])

  // 加载文档数据
  React.useEffect(() => {
    if (params.id === 'new') {
      // 新建文档时设置默认值
      form.reset({
        title: '',
        slug: '',
        type: '',
        status: 'Active',
        content: '',
        version: '1.0',
        effectiveDate: new Date().toISOString().split('T')[0],
        metadata: '',
      })
      return
    }

    async function loadDocument() {
      try {
        setIsFetching(true)
        // 直接通过 ID 加载文档
        const response = await fetch(`/api/legal?id=${params.id}`)
        
        if (!response.ok) {
          console.error("Failed to fetch document:", response.status, response.statusText)
          throw new Error("Failed to fetch document")
        }
        
        const data = await response.json()
        console.log("Received document data:", data)

        if (!data || (Array.isArray(data) && data.length === 0)) {
          console.error("Document not found")
          toast.error("Document not found")
          router.push('/admin/legal')
          return
        }

        // 如果返回的是数组，取第一个文档
        const doc = Array.isArray(data) ? data[0] : data
        console.log("Selected document:", doc)

        form.reset({
          title: doc.title,
          slug: doc.slug,
          type: doc.type,
          status: doc.status,
          content: doc.content,
          version: doc.version,
          effectiveDate: new Date(doc.effectiveDate).toISOString().split('T')[0],
          metadata: doc.metadata,
        })

        // 保存文档 ID
        setDocumentId(doc.id)
        console.log("Document loaded successfully. ID:", doc.id)
      } catch (error: unknown) {
        console.error("Error loading document:", error)
        const errorMessage = (error as Error).message || "Unknown error occurred"
        toast.error(`Failed to load document: ${errorMessage}`)
      } finally {
        setIsFetching(false)
      }
    }

    loadDocument()
  }, [params.id, form, router])

  // Watch form changes
  React.useEffect(() => {
    const subscription = form.watch(() => setIsDirty(true))
    return () => subscription.unsubscribe()
  }, [form.watch])

  // Auto-generate slug from title
  React.useEffect(() => {
    if (!isSlugManuallyEdited) {
      const title = form.watch("title")
      if (title) {
        const generatedSlug = slugify(title)
        form.setValue("slug", generatedSlug)
      }
    }
  }, [form.watch("title"), isSlugManuallyEdited, form])

  // 当选择预定义类型时自动设置 slug
  React.useEffect(() => {
    if (!isSlugManuallyEdited) {
      const type = form.watch("type")
      if (type === "privacy") {
        form.setValue("slug", "privacy-policy")
      } else if (type === "terms") {
        form.setValue("slug", "terms-of-service")
      } else if (type === "cookies") {
        form.setValue("slug", "cookie-policy")
      }
    }
  }, [form.watch("type"), isSlugManuallyEdited, form])

  // Handle save
  const handleSubmit = async (data: LegalFormValues) => {
    console.log("Submitting data:", data)
    try {
      setIsLoading(true)
      
      const isNew = params.id === 'new'
      const method = isNew ? 'POST' : 'PATCH'
      const url = isNew ? '/api/legal' : `/api/legal?id=${params.id}`
      
      console.log("Preparing to send request:", { 
        method, 
        url, 
        data
      })

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.error || "Failed to save document")
      }
      
      const savedData = await response.json()
      console.log("Document saved successfully:", savedData)
      
      setIsDirty(false)
      toast.success(isNew ? "Document created successfully" : "Document updated successfully")
      router.push('/admin/legal')
    } catch (error) {
      console.error('Failed to save document:', error)
      toast.error(error instanceof Error ? error.message : "Failed to save document")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (params.id === 'new') {
      toast.error("Cannot delete a new document")
      return
    }

    if (!confirm('Are you sure you want to delete this document?')) return
    
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/legal?id=${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error("Failed to delete document")
      
      toast.success("Document deleted successfully")
      router.push('/admin/legal')
    } catch (error) {
      console.error('Failed to delete document:', error)
      toast.error("Failed to delete document")
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle back
  const handleBack = () => {
    if (isDirty && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return
    }
    router.push('/admin/legal')
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
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
            {params.id === 'new' ? 'Add Document' : 'Edit Document'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {params.id !== 'new' && (
            <Button 
              variant="outline" 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="text-red-500 hover:text-red-600"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          )}
          <Button onClick={form.handleSubmit(handleSubmit)} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <FormField
              label="Title"
              error={form.formState.errors.title?.message}
              required
            >
              <Input {...form.register("title")} />
            </FormField>

            <FormField
              label="Slug"
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

            <FormField
              label="Type"
              error={form.formState.errors.type?.message}
              required
            >
              <div className="space-y-2">
                <Select
                  value={form.watch("type")}
                  onValueChange={(value) => {
                    if (value === "custom") {
                      setCustomType("")
                      return
                    }
                    form.setValue("type", value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* 预定义的文档类型 */}
                    <SelectItem value="privacy">Privacy Policy</SelectItem>
                    <SelectItem value="terms">Terms of Service</SelectItem>
                    <SelectItem value="cookies">Cookie Policy</SelectItem>
                    {/* 已存在的自定义类型 */}
                    {documentTypes
                      .filter(type => !["privacy", "terms", "cookies"].includes(type))
                      .map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                    ))}
                    <SelectItem value="custom">Create New Type</SelectItem>
                  </SelectContent>
                </Select>

                {form.watch("type") === "custom" && (
                  <div className="mt-2">
                    <Input
                      placeholder="Enter new document type"
                      value={customType}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase()
                        setCustomType(value)
                        form.setValue("type", value)
                      }}
                    />
                  </div>
                )}
              </div>
            </FormField>

            <FormField
              label="Status"
              error={form.formState.errors.status?.message}
              required
            >
              <Select
                value={form.watch("status")}
                onValueChange={(value) => form.setValue("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <FormField
              label="Version"
              error={form.formState.errors.version?.message}
              required
            >
              <Input {...form.register("version")} placeholder="e.g. 1.0.0" />
            </FormField>

            <FormField
              label="Effective Date"
              error={form.formState.errors.effectiveDate?.message}
              required
            >
              <Input
                type="date"
                {...form.register("effectiveDate")}
              />
            </FormField>
          </div>
        </Card>

        <Card className="p-6">
          <FormField
            label="Content"
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
    </div>
  )
} 