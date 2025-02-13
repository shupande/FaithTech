'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, ArrowLeft, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MediaAPI } from "@/lib/api/services"
import type { MediaCategory } from "@/types/media"
import { CategoryForm } from "./category-form"

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = React.useState<MediaCategory[]>([])
  const [loading, setLoading] = React.useState(true)
  const [editingCategory, setEditingCategory] = React.useState<MediaCategory | null>(null)
  const [showForm, setShowForm] = React.useState(false)

  // 加载分类
  const loadCategories = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await MediaAPI.listCategories()
      setCategories(response.data.data)
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadCategories()
  }, [loadCategories])

  // 处理编辑
  const handleEdit = (category: MediaCategory) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  // 处理删除
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }

    try {
      await MediaAPI.deleteCategory(id)
      await loadCategories()
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  // 处理表单提交
  const handleFormSubmit = async () => {
    await loadCategories()
    setShowForm(false)
    setEditingCategory(null)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/admin/media')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">Categories</h1>
      </div>

      {showForm ? (
        <CategoryForm
          category={editingCategory}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingCategory(null)
          }}
        />
      ) : (
        <>
          <Card className="p-4">
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </Card>

          <div className="space-y-4">
            {loading ? (
              <Card className="p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              </Card>
            ) : categories.length === 0 ? (
              <Card className="p-8">
                <div className="text-center text-muted-foreground">
                  No categories found
                </div>
              </Card>
            ) : (
              categories.map((category) => (
                <Card key={category.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
} 