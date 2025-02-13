'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichEditor } from "@/components/ui/rich-editor"
import { Card } from "@/components/ui/card"

const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["Active", "Draft"]),
  order: z.number().min(0, "Order is required"),
})

type FAQFormValues = z.infer<typeof faqSchema>

const categories = ["General", "Technical", "Applications", "Services", "Support"]

export default function FAQEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)

  const form = useForm<FAQFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "General",
      status: "Draft",
      order: 0,
    },
  })

  // 加载 FAQ 数据
  React.useEffect(() => {
    const fetchFAQ = async () => {
      if (params.id === 'new') {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/faq/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch FAQ')
        }
        const result = await response.json()
        if (result.success) {
          form.reset(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch FAQ:', error)
        toast.error('Failed to load FAQ')
        router.push('/admin/support/faq')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFAQ()
  }, [params.id, form, router])

  // Watch form changes
  React.useEffect(() => {
    const subscription = form.watch(() => setIsDirty(true))
    return () => subscription.unsubscribe()
  }, [form.watch])

  // Handle save
  const handleSubmit = async (data: FAQFormValues) => {
    try {
      setIsSaving(true)
      
      const url = params.id === 'new' ? '/api/faq' : `/api/faq/${params.id}`
      const method = params.id === 'new' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save FAQ')
      }

      const result = await response.json()
      if (result.success) {
        toast.success('FAQ saved successfully')
        setIsDirty(false)
        router.push('/admin/support/faq')
      } else {
        throw new Error(result.message || 'Failed to save FAQ')
      }
    } catch (error) {
      console.error('Failed to save FAQ:', error)
      toast.error('Failed to save FAQ')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return
    
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/faq/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete FAQ')
      }

      const result = await response.json()
      if (result.success) {
        toast.success('FAQ deleted successfully')
        router.push('/admin/support/faq')
      } else {
        throw new Error(result.message || 'Failed to delete FAQ')
      }
    } catch (error) {
      console.error('Failed to delete FAQ:', error)
      toast.error('Failed to delete FAQ')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle back
  const handleBack = () => {
    if (isDirty && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return
    }
    router.push('/admin/support/faq')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
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
            {params.id === 'new' ? 'Add FAQ' : 'Edit FAQ'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {params.id !== 'new' && (
            <Button variant="outline" onClick={handleDelete} disabled={isLoading || isSaving}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <Button onClick={form.handleSubmit(handleSubmit)} disabled={isLoading || isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card className="p-6">
          <div className="space-y-4">
            <FormField
              label="Question"
              error={form.formState.errors.question?.message}
              required
            >
              <Input {...form.register("question")} />
            </FormField>

            <FormField
              label="Answer"
              error={form.formState.errors.answer?.message}
              required
            >
              <RichEditor
                content={form.watch("answer")}
                onChange={(content) => form.setValue("answer", content)}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem value="Active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <FormField
              label="Display Order"
              error={form.formState.errors.order?.message}
              required
            >
              <Input
                type="number"
                min={0}
                {...form.register("order", { valueAsNumber: true })}
              />
            </FormField>
          </div>
        </Card>
      </div>
    </div>
  )
} 