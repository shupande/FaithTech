'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash,
  MoveVertical,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CategoryForm } from './category-form'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  image?: string
  status: string
  order: number
  level: number
  parentId?: string
  children?: Category[]
  _count?: {
    products: number
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isReordering, setIsReordering] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      const response = await fetch('/api/categories?includeInactive=true')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    }
  }

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsFormOpen(true)
  }

  const handleDelete = async (category: Category) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete category')
      }

      toast.success('Category deleted successfully')
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete category')
    }
  }

  const handleStatusToggle = async (category: Category) => {
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: category.status === 'Active' ? 'Inactive' : 'Active'
        })
      })

      if (!response.ok) throw new Error('Failed to update category status')
      
      toast.success('Category status updated successfully')
      fetchCategories()
    } catch (error) {
      console.error('Error updating category status:', error)
      toast.error('Failed to update category status')
    }
  }

  const handleFormSubmit = () => {
    setIsFormOpen(false)
    setSelectedCategory(null)
    fetchCategories()
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setSelectedCategory(null)
  }

  const handleReorderSave = async () => {
    try {
      const response = await fetch('/api/categories/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories })
      })

      if (!response.ok) throw new Error('Failed to reorder categories')
      
      toast.success('Categories reordered successfully')
      setIsReordering(false)
    } catch (error) {
      console.error('Error reordering categories:', error)
      toast.error('Failed to reorder categories')
    }
  }

  const moveCategory = (categoryId: string, direction: 'up' | 'down') => {
    const newCategories = [...categories]
    const index = newCategories.findIndex(c => c.id === categoryId)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === newCategories.length - 1)
    ) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const [removed] = newCategories.splice(index, 1)
    newCategories.splice(newIndex, 0, removed)
    
    // Update order values
    newCategories.forEach((category, i) => {
      category.order = i
    })
    
    setCategories(newCategories)
  }

  const renderCategory = (category: Category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.has(category.id)

    return (
      <div key={category.id} className="category-item">
        <div 
          className={cn(
            "flex items-center gap-2 p-2 hover:bg-gray-50 rounded",
            { "ml-6": level > 0 }
          )}
        >
          {hasChildren && (
            <button
              onClick={() => toggleExpand(category.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}
          
          <span className={cn(
            "flex-1",
            category.status === 'Inactive' && "text-gray-400"
          )}>
            {category.name}
            {category._count && (
              <span className="ml-2 text-sm text-gray-500">
                ({category._count.products} products)
              </span>
            )}
          </span>

          {isReordering ? (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveCategory(category.id, 'up')}
                className="h-8 w-8"
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveCategory(category.id, 'down')}
                className="h-8 w-8"
              >
                ↓
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStatusToggle(category)}
                className="h-8 w-8"
              >
                {category.status === 'Active' ? (
                  <Eye size={16} />
                ) : (
                  <EyeOff size={16} />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(category)}
                className="h-8 w-8"
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(category)}
                className="h-8 w-8 text-red-500 hover:text-red-600"
              >
                <Trash size={16} />
              </Button>
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="category-children">
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Manage your product categories
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {isReordering ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsReordering(false)
                      fetchCategories()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleReorderSave}>
                    Save Order
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsReordering(true)}
                  >
                    <MoveVertical className="mr-2 h-4 w-4" />
                    Reorder
                  </Button>
                  <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="categories-tree">
            {categories.map(category => renderCategory(category))}
          </div>
        </CardContent>
      </Card>

      {isFormOpen && (
        <CategoryForm
          category={selectedCategory}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  )
} 