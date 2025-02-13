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
import { NavigationAPI } from "@/lib/api/services"
import { toast } from "sonner"
import type { MenuItem } from "@/lib/api/types"

const menuItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().min(1, "URL is required"),
  icon: z.string().optional(),
  children: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    url: z.string().min(1, "URL is required"),
    icon: z.string().optional(),
  })).optional(),
})

type FormValues = z.infer<typeof menuItemSchema>

const types = ["page", "section", "link"]

export default function MenuItemEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)
  const [isLoadingData, setIsLoadingData] = React.useState(params.id !== 'new')

  const form = useForm<FormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      title: '',
      url: '',
      icon: '',
      children: [],
    }
  })

  // Load menu item data
  React.useEffect(() => {
    async function loadMenuItem() {
      if (params.id === 'new') return

      try {
        const response = await NavigationAPI.get(params.id)
        const menuItem = response.data as unknown as MenuItem
        const formData: FormValues = {
          title: menuItem.title,
          url: menuItem.url,
          icon: menuItem.icon,
          children: menuItem.children?.map(child => ({
            title: child.title,
            url: child.url,
            icon: child.icon,
          })),
        }
        form.reset(formData)
      } catch (error) {
        console.error('Failed to load menu item:', error)
        toast.error('Failed to load menu item')
      } finally {
        setIsLoadingData(false)
      }
    }

    loadMenuItem()
  }, [params.id, form])

  // Watch form changes
  React.useEffect(() => {
    const subscription = form.watch(() => setIsDirty(true))
    return () => subscription.unsubscribe()
  }, [form.watch])

  // Handle save
  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true)
      
      const submitData = {
        ...values,
        children: values.children?.map(child => ({
          ...child,
          createdAt: child.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }))
      }
      
      if (params.id === 'new') {
        await NavigationAPI.create(submitData)
        toast.success('Menu item created successfully')
      } else {
        await NavigationAPI.update(params.id, submitData)
        toast.success('Menu item updated successfully')
      }
      
      setIsDirty(false)
      router.push('/admin/navigation')
    } catch (error) {
      console.error('Failed to save menu item:', error)
      toast.error('Failed to save menu item')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this menu item?')) return
    
    try {
      setIsLoading(true)
      await NavigationAPI.delete(params.id)
      toast.success('Menu item deleted successfully')
      router.push('/admin/navigation')
    } catch (error) {
      console.error('Failed to delete menu item:', error)
      toast.error('Failed to delete menu item')
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
        title: '',
        url: '',
        icon: '',
      }
    ])
  }

  // Handle remove child
  const handleRemoveChild = (index: number) => {
    const children = form.watch('children') || []
    form.setValue('children', children.filter((_, i) => i !== index))
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
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
              label="URL"
              error={form.formState.errors.url?.message}
              required
            >
              <Input {...form.register("url")} />
            </FormField>

            <FormField
              label="Icon"
              error={form.formState.errors.icon?.message}
            >
              <Input {...form.register("icon")} />
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
                      <Input {...form.register(`children.${index}.title`)} />
                    </FormField>

                    <FormField
                      label="URL"
                      error={form.formState.errors.children?.[index]?.url?.message}
                      required
                    >
                      <Input {...form.register(`children.${index}.url`)} />
                    </FormField>

                    <FormField
                      label="Icon"
                      error={form.formState.errors.children?.[index]?.icon?.message}
                    >
                      <Input {...form.register(`children.${index}.icon`)} />
                    </FormField>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Visibility</label>
                        <div className="text-sm text-muted-foreground">
                          Show this item in the navigation menu
                        </div>
                      </div>
                      <Switch
                        checked={form.watch(`children.${index}.isVisible`)}
                        onCheckedChange={(checked) => form.setValue(`children.${index}.isVisible`, checked)}
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