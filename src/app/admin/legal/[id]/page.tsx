'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Save, Trash2, Link as LinkIcon, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichEditor } from "@/components/ui/rich-editor"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
  path: z.string()
    .min(1, "Path is required")
    .regex(/^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/, "Invalid path format"),
  type: z.string().min(1, "Type is required"),
  status: z.enum(["Draft", "Published", "Archived"]),
  content: z.string().min(1, "Content is required"),
  effectiveDate: z.string().optional(),
  version: z.string().min(1, "Version is required"),
  isPublic: z.boolean().default(true),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
  }).optional(),
  metadata: z.object({
    author: z.string().optional(),
    reviewedBy: z.string().optional(),
    approvedBy: z.string().optional(),
    lastReviewDate: z.string().optional(),
  }).optional(),
})

type LegalFormValues = z.infer<typeof legalSchema>

// Mock data - will be replaced with API calls
const mockDocument = {
  id: "1",
  title: "Privacy Policy",
  path: "/privacy-policy",
  type: "Policy",
  status: "Published" as const,
  content: "Our privacy policy details...",
  effectiveDate: "2024-03-20",
  version: "2.1",
  isPublic: true,
  seo: {
    title: "",
    description: "",
    keywords: "",
  },
  metadata: {
    author: "John Doe",
    reviewedBy: "Legal Team",
    approvedBy: "Jane Smith",
    lastReviewDate: "2024-03-15",
  },
}

const types = ["Policy", "Terms", "Guidelines", "Notice", "Agreement"]

export default function LegalEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)
  const [isPathManuallyEdited, setIsPathManuallyEdited] = React.useState(false)

  const form = useForm<LegalFormValues>({
    resolver: zodResolver(legalSchema),
    defaultValues: mockDocument,
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
  const handleSubmit = async (data: LegalFormValues) => {
    try {
      setIsLoading(true)
      // TODO: Implement save logic
      console.log('Saving document:', data)
      
      setIsDirty(false)
      router.push('/admin/legal')
    } catch (error) {
      console.error('Failed to save document:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document?')) return
    
    try {
      setIsLoading(true)
      // TODO: Implement delete logic
      router.push('/admin/legal')
    } catch (error) {
      console.error('Failed to delete document:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle back
  const handleBack = () => {
    if (isDirty && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return
    }
    router.push('/admin/legal')
  }

  // Handle preview
  const handlePreview = () => {
    router.push(`/admin/legal/${params.id}/preview`)
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
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                >
                  <Input
                    type="date"
                    {...form.register("effectiveDate")}
                  />
                </FormField>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={form.watch("isPublic")}
                  onCheckedChange={(checked) => form.setValue("isPublic", checked)}
                />
                <span className="text-sm">Publicly Accessible</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Content</h2>
            <FormField
              label="Document Content"
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
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Document Metadata</h2>
            <div className="space-y-4">
              <FormField
                label="Author"
                error={form.formState.errors.metadata?.author?.message}
              >
                <Input
                  value={form.watch("metadata.author")}
                  onChange={(e) => form.setValue("metadata.author", e.target.value)}
                />
              </FormField>

              <FormField
                label="Reviewed By"
                error={form.formState.errors.metadata?.reviewedBy?.message}
              >
                <Input
                  value={form.watch("metadata.reviewedBy")}
                  onChange={(e) => form.setValue("metadata.reviewedBy", e.target.value)}
                />
              </FormField>

              <FormField
                label="Approved By"
                error={form.formState.errors.metadata?.approvedBy?.message}
              >
                <Input
                  value={form.watch("metadata.approvedBy")}
                  onChange={(e) => form.setValue("metadata.approvedBy", e.target.value)}
                />
              </FormField>

              <FormField
                label="Last Review Date"
                error={form.formState.errors.metadata?.lastReviewDate?.message}
              >
                <Input
                  type="date"
                  value={form.watch("metadata.lastReviewDate")}
                  onChange={(e) => form.setValue("metadata.lastReviewDate", e.target.value)}
                />
              </FormField>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 