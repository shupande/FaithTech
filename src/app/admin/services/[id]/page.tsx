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
import { Textarea } from "@/components/ui/textarea"

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  type: z.enum(["Professional", "Support", "Development"]),
  availability: z.enum(["Available", "Limited", "By Request"]),
  team: z.string().min(1, "Team is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().min(1, "Short description is required").max(200, "Short description should be less than 200 characters"),
  details: z.object({
    duration: z.string().optional(),
    location: z.string().optional(),
    deliverables: z.array(z.string()).min(1, "At least one deliverable is required"),
    requirements: z.array(z.string()).optional(),
  }),
  pricing: z.object({
    model: z.enum(["Fixed", "Hourly", "Custom"]),
    rate: z.string().optional(),
    currency: z.string().optional(),
    notes: z.string().optional(),
  }),
  contact: z.object({
    email: z.string().email("Invalid email").optional(),
    phone: z.string().optional(),
    department: z.string().optional(),
  }).optional(),
})

type ServiceFormValues = z.infer<typeof serviceSchema>

// 模拟数据 - 之后会替换为API调用
const mockService = {
  id: "1",
  name: "Technical Consulting",
  slug: "technical-consulting",
  type: "Professional" as const,
  availability: "Available" as const,
  team: "Engineering",
  description: "Detailed description of our technical consulting service",
  shortDescription: "Expert technical consulting services for enterprise clients",
  details: {
    duration: "Variable",
    location: "On-site / Remote",
    deliverables: ["Technical Assessment", "Implementation Plan"],
    requirements: ["Project Scope", "Technical Requirements"],
  },
  pricing: {
    model: "Hourly" as const,
    rate: "$150",
    currency: "USD",
    notes: "Minimum 20 hours",
  },
  contact: {
    email: "consulting@example.com",
    phone: "+1 234 567 890",
    department: "Professional Services",
  },
}

export default function ServiceEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false)

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: mockService,
  })

  // 监听表单变化
  React.useEffect(() => {
    const subscription = form.watch(() => setIsDirty(true))
    return () => subscription.unsubscribe()
  }, [form.watch])

  // 自动生成 slug
  React.useEffect(() => {
    if (!isSlugManuallyEdited) {
      const name = form.watch("name")
      if (name) {
        const generatedSlug = slugify(name)
        form.setValue("slug", generatedSlug)
      }
    }
  }, [form.watch("name"), isSlugManuallyEdited])

  // 添加可交付物
  const addDeliverable = () => {
    const deliverables = form.watch("details.deliverables") || []
    form.setValue("details.deliverables", [...deliverables, ""])
  }

  // 移除可交付物
  const removeDeliverable = (index: number) => {
    const deliverables = form.watch("details.deliverables")
    form.setValue("details.deliverables", deliverables.filter((_, i) => i !== index))
  }

  // 添加要求
  const addRequirement = () => {
    const requirements = form.watch("details.requirements") || []
    form.setValue("details.requirements", [...requirements, ""])
  }

  // 移除要求
  const removeRequirement = (index: number) => {
    const requirements = form.watch("details.requirements") || []
    form.setValue("details.requirements", requirements.filter((_, i) => i !== index))
  }

  // 处理保存
  const handleSubmit = async (data: ServiceFormValues) => {
    try {
      setIsLoading(true)
      // TODO: 实现数据保存
      console.log('Saving service:', data)
      
      setIsDirty(false)
      router.push('/admin/services')
    } catch (error) {
      console.error('Failed to save service:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 处理删除
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      setIsLoading(true)
      // TODO: 实现删除逻辑
      router.push('/admin/services')
    } catch (error) {
      console.error('Failed to delete service:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 处理返回
  const handleBack = () => {
    if (isDirty && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return
    }
    router.push('/admin/services')
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
            {params.id === 'new' ? 'Add Service' : 'Edit Service'}
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
                  label="Type"
                  error={form.formState.errors.type?.message}
                  required
                >
                  <Select
                    value={form.watch("type")}
                    onValueChange={(value) => form.setValue("type", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField
                  label="Availability"
                  error={form.formState.errors.availability?.message}
                  required
                >
                  <Select
                    value={form.watch("availability")}
                    onValueChange={(value) => form.setValue("availability", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Limited">Limited</SelectItem>
                      <SelectItem value="By Request">By Request</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <FormField
                label="Team"
                error={form.formState.errors.team?.message}
                required
              >
                <Input {...form.register("team")} />
              </FormField>

              <FormField
                label="Short Description"
                error={form.formState.errors.shortDescription?.message}
                required
              >
                <Input {...form.register("shortDescription")} />
              </FormField>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <FormField
              label="Full Description"
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
            <h2 className="text-lg font-semibold mb-4">Service Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Duration"
                  error={form.formState.errors.details?.duration?.message}
                >
                  <Input {...form.register("details.duration")} />
                </FormField>

                <FormField
                  label="Location"
                  error={form.formState.errors.details?.location?.message}
                >
                  <Input {...form.register("details.location")} />
                </FormField>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Deliverables</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addDeliverable}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Deliverable
                  </Button>
                </div>
                <div className="space-y-2">
                  {form.watch("details.deliverables")?.map((_, index) => (
                    <div key={index} className="flex gap-2">
                      <Input {...form.register(`details.deliverables.${index}`)} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDeliverable(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Requirements</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addRequirement}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Requirement
                  </Button>
                </div>
                <div className="space-y-2">
                  {form.watch("details.requirements")?.map((_, index) => (
                    <div key={index} className="flex gap-2">
                      <Input {...form.register(`details.requirements.${index}`)} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Pricing</h2>
            <div className="space-y-4">
              <FormField
                label="Pricing Model"
                error={form.formState.errors.pricing?.model?.message}
                required
              >
                <Select
                  value={form.watch("pricing.model")}
                  onValueChange={(value) => form.setValue("pricing.model", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pricing model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed">Fixed Price</SelectItem>
                    <SelectItem value="Hourly">Hourly Rate</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Rate"
                  error={form.formState.errors.pricing?.rate?.message}
                >
                  <Input {...form.register("pricing.rate")} />
                </FormField>

                <FormField
                  label="Currency"
                  error={form.formState.errors.pricing?.currency?.message}
                >
                  <Input {...form.register("pricing.currency")} />
                </FormField>
              </div>

              <FormField
                label="Pricing Notes"
                error={form.formState.errors.pricing?.notes?.message}
              >
                <Textarea {...form.register("pricing.notes")} />
              </FormField>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <FormField
                label="Email"
                error={form.formState.errors.contact?.email?.message}
              >
                <Input {...form.register("contact.email")} type="email" />
              </FormField>

              <FormField
                label="Phone"
                error={form.formState.errors.contact?.phone?.message}
              >
                <Input {...form.register("contact.phone")} />
              </FormField>

              <FormField
                label="Department"
                error={form.formState.errors.contact?.department?.message}
              >
                <Input {...form.register("contact.department")} />
              </FormField>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 