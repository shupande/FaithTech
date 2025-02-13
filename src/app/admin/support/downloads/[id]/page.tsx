'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Save, Trash2, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichEditor } from "@/components/ui/rich-editor"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const downloadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().min(1, "Category is required"),
  version: z.string().min(1, "Version is required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().optional(),
  changelog: z.string().optional(),
  file: z.object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
  }).optional(),
})

type DownloadFormValues = z.infer<typeof downloadSchema>

// Mock data - will be replaced with API calls
const mockResource = {
  id: "1",
  name: "Product Manual",
  type: "Documentation",
  category: "User Guide",
  version: "1.2.0",
  description: "Comprehensive guide for using our product",
  requirements: "PDF Reader",
  changelog: "- Added new features\n- Fixed bugs",
  file: undefined,
}

const categories = ["User Guide", "Technical", "Development", "Marketing", "Legal"]
const types = ["Documentation", "Software", "Sample Code", "Marketing Material", "Legal Document"]

export default function DownloadEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

  const form = useForm<DownloadFormValues>({
    resolver: zodResolver(downloadSchema),
    defaultValues: mockResource,
  })

  // Watch form changes
  React.useEffect(() => {
    const subscription = form.watch(() => setIsDirty(true))
    return () => subscription.unsubscribe()
  }, [form.watch])

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      form.setValue("file", {
        name: file.name,
        size: file.size,
        type: file.type,
      })
    }
  }

  // Handle save
  const handleSubmit = async (data: DownloadFormValues) => {
    try {
      setIsLoading(true)
      // TODO: Implement file upload and data save
      console.log('Saving resource:', data)
      console.log('File to upload:', selectedFile)
      
      setIsDirty(false)
      router.push('/admin/support/downloads')
    } catch (error) {
      console.error('Failed to save resource:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this resource?')) return
    
    try {
      setIsLoading(true)
      // TODO: Implement delete logic
      router.push('/admin/support/downloads')
    } catch (error) {
      console.error('Failed to delete resource:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle back
  const handleBack = () => {
    if (isDirty && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return
    }
    router.push('/admin/support/downloads')
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
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
            {params.id === 'new' ? 'Add Resource' : 'Edit Resource'}
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
                label="Name"
                error={form.formState.errors.name?.message}
                required
              >
                <Input {...form.register("name")} />
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
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <FormField
                label="Version"
                error={form.formState.errors.version?.message}
                required
              >
                <Input {...form.register("version")} placeholder="e.g. 1.0.0" />
              </FormField>

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
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
            <div className="space-y-4">
              <FormField
                label="System Requirements"
                error={form.formState.errors.requirements?.message}
              >
                <Textarea
                  {...form.register("requirements")}
                  placeholder="List any system requirements or dependencies"
                />
              </FormField>

              <FormField
                label="Changelog"
                error={form.formState.errors.changelog?.message}
              >
                <Textarea
                  {...form.register("changelog")}
                  placeholder="List changes in this version"
                  rows={5}
                />
              </FormField>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">File Upload</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-4">
                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{selectedFile.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFile(null)
                          form.setValue("file", undefined)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8" />
                        <span>Click to upload file</span>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 