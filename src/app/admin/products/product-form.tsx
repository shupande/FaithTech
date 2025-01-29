'use client'

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { DialogForm } from "@/components/ui/dialog-form"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichEditor } from "@/components/ui/rich-editor"

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  status: z.enum(["Active", "Coming Soon", "Discontinued"]),
  description: z.string().min(1, "Description is required"),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProductFormValues) => void
  initialData?: Partial<ProductFormValues>
}

export function ProductForm({ isOpen, onClose, onSubmit, initialData }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || "",
      price: initialData?.price || "",
      status: initialData?.status || "Active",
      description: initialData?.description || "",
    },
  })

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      await onSubmit(data)
      form.reset()
      onClose()
    } catch (error) {
      console.error("Failed to save product:", error)
    }
  }

  return (
    <DialogForm
      title={initialData ? "Edit Product" : "Add Product"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={form.handleSubmit(handleSubmit)}
      isSubmitting={form.formState.isSubmitting}
    >
      <FormField
        label="Name"
        error={form.formState.errors.name?.message}
        required
      >
        <Input {...form.register("name")} />
      </FormField>

      <FormField
        label="Category"
        error={form.formState.errors.category?.message}
        required
      >
        <Input {...form.register("category")} />
      </FormField>

      <FormField
        label="Price"
        error={form.formState.errors.price?.message}
        required
      >
        <Input {...form.register("price")} />
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
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Coming Soon">Coming Soon</SelectItem>
            <SelectItem value="Discontinued">Discontinued</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <FormField
        label="Description"
        error={form.formState.errors.description?.message}
        required
      >
        <RichEditor
          content={form.watch("description")}
          onChange={(value) => form.setValue("description", value)}
        />
      </FormField>
    </DialogForm>
  )
} 