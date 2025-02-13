'use client'

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { MediaAPI } from "@/lib/api/services"
import type { MediaCategory } from "@/types/media"

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryFormProps {
  category?: MediaCategory | null
  onSubmit: () => void
  onCancel: () => void
}

export function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [loading, setLoading] = React.useState(false)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  })

  const handleSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true)

      if (category) {
        await MediaAPI.updateCategory(category.id, data)
      } else {
        await MediaAPI.createCategory(data)
      }

      onSubmit()
    } catch (error) {
      console.error('Failed to save category:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Card className="p-6 space-y-4">
        <FormField
          label="Name"
          error={form.formState.errors.name?.message}
          required
        >
          <Input {...form.register("name")} />
        </FormField>

        <FormField
          label="Description"
          error={form.formState.errors.description?.message}
        >
          <Textarea {...form.register("description")} />
        </FormField>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {category ? 'Update' : 'Create'}
              </>
            )}
          </Button>
        </div>
      </Card>
    </form>
  )
} 