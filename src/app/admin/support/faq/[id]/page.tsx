'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react"

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
  status: z.enum(["Draft", "Published"]),
  order: z.number().min(1, "Order is required"),
})

type FAQFormValues = z.infer<typeof faqSchema>

// Mock data - will be replaced with API calls
const mockFaq = {
  id: "1",
  question: "How do I get started?",
  answer: "Follow our quick start guide to begin using our platform...",
  category: "Getting Started",
  order: 1,
  status: "Published" as const,
}

const categories = ["Getting Started", "Features", "Billing", "Support", "Security", "Integration"]

export default function FAQEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)

  const form = useForm<FAQFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: mockFaq,
  })

  // Watch form changes
  React.useEffect(() => {
    const subscription = form.watch(() => setIsDirty(true))
    return () => subscription.unsubscribe()
  }, [form.watch])

  // Handle save
  const handleSubmit = async (data: FAQFormValues) => {
    try {
      setIsLoading(true)
      // TODO: Implement save logic
      console.log('Saving FAQ:', data)
      
      setIsDirty(false)
      router.push('/admin/support/faq')
    } catch (error) {
      console.error('Failed to save FAQ:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return
    
    try {
      setIsLoading(true)
      // TODO: Implement delete logic
      router.push('/admin/support/faq')
    } catch (error) {
      console.error('Failed to delete FAQ:', error)
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
                    <SelectItem value="Published">Published</SelectItem>
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
                min={1}
                {...form.register("order", { valueAsNumber: true })}
              />
            </FormField>
          </div>
        </Card>
      </div>
    </div>
  )
} 