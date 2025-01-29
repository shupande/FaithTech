'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Save, Trash2, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

const menuItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  path: z.string().min(1, "Path is required"),
  type: z.enum(["page", "section", "link"]),
  isVisible: z.boolean().default(true),
  order: z.number().min(1),
  parentId: z.string().optional(),
  openInNewTab: z.boolean().default(false),
  children: z.array(z.object({
    id: z.string(),
    title: z.string(),
    path: z.string(),
    isVisible: z.boolean(),
  })).optional(),
})

type MenuItemFormValues = z.infer<typeof menuItemSchema>

// Mock data - will be replaced with API calls
const mockMenuItem = {
  id: "2",
  title: "Products",
  path: "/products",
  type: "section" as const,
  isVisible: true,
  order: 2,
  openInNewTab: false,
  children: [
    {
      id: "2-1",
      title: "Product A",
      path: "/products/product-a",
      isVisible: true,
    },
    {
      id: "2-2",
      title: "Product B",
      path: "/products/product-b",
      isVisible: true,
    }
  ]
}

const types = ["page", "section", "link"]

export default function MenuItemEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: mockMenuItem,
  })

  // Watch form changes
  React.useEffect(() => {
    const subscription = form.watch(() => setIsDirty(true))
    return () => subscription.unsubscribe()
  }, [form.watch])

  // Handle save
  const handleSubmit = async (data: MenuItemFormValues) => {
    try {
      setIsLoading(true)
      // TODO: Implement save logic
      console.log('Saving menu item:', data)
      
      setIsDirty(false)
      router.push('/admin/navigation')
    } catch (error) {
      console.error('Failed to save menu item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this menu item?')) return
    
    try {
      setIsLoading(true)
      // TODO: Implement delete logic
      router.push('/admin/navigation')
    } catch (error) {
      console.error('Failed to delete menu item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle back
  const handleBack = () => {
    if (isDirty && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return
    }
    router.push('/admin/navigation')
  }

  // Handle add child
  const handleAddChild = () => {
    const children = form.watch('children') || []
    form.setValue('children', [
      ...children,
      {
        id: `${Date.now()}`,
        title: '',
        path: '',
        isVisible: true,
      }
    ])
  }

  // Handle remove child
  const handleRemoveChild = (index: number) => {
    const children = form.watch('children') || []
    form.setValue('children', children.filter((_, i) => i !== index))
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
            {params.id === 'new' ? 'Add Menu Item' : 'Edit Menu Item'}
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

      <div className="grid gap-6">
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
              label="Path"
              error={form.formState.errors.path?.message}
              required
            >
              <Input {...form.register("path")} />
            </FormField>

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
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Visibility</label>
                <div className="text-sm text-muted-foreground">
                  Show this item in the navigation menu
                </div>
              </div>
              <Switch
                checked={form.watch("isVisible")}
                onCheckedChange={(checked) => form.setValue("isVisible", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Open in New Tab</label>
                <div className="text-sm text-muted-foreground">
                  Open this link in a new browser tab
                </div>
              </div>
              <Switch
                checked={form.watch("openInNewTab")}
                onCheckedChange={(checked) => form.setValue("openInNewTab", checked)}
              />
            </div>
          </div>
        </Card>

        {form.watch("type") === "section" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Child Items</h2>
              <Button onClick={handleAddChild}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            <div className="space-y-4">
              {(form.watch("children") || []).map((child, index) => (
                <div key={child.id} className="flex gap-4">
                  <div className="flex-1 space-y-4">
                    <FormField
                      label="Title"
                      error={form.formState.errors.children?.[index]?.title?.message}
                      required
                    >
                      <Input
                        value={child.title}
                        onChange={(e) => {
                          const children = form.watch("children") || []
                          children[index].title = e.target.value
                          form.setValue("children", children)
                        }}
                      />
                    </FormField>

                    <FormField
                      label="Path"
                      error={form.formState.errors.children?.[index]?.path?.message}
                      required
                    >
                      <Input
                        value={child.path}
                        onChange={(e) => {
                          const children = form.watch("children") || []
                          children[index].path = e.target.value
                          form.setValue("children", children)
                        }}
                      />
                    </FormField>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Visibility</label>
                        <div className="text-sm text-muted-foreground">
                          Show this item in the navigation menu
                        </div>
                      </div>
                      <Switch
                        checked={child.isVisible}
                        onCheckedChange={(checked) => {
                          const children = form.watch("children") || []
                          children[index].isVisible = checked
                          form.setValue("children", children)
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveChild(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
} 