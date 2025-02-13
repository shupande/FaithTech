'use client'

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Plus, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { Product } from "@/lib/api/types"
import Image from 'next/image'

interface Category {
  id: string
  name: string
  children?: Category[]
}

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = React.useState(true)
  const [products, setProducts] = React.useState<Product[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  
  // 从 URL 参数中获取初始值
  const [search, setSearch] = React.useState(searchParams.get('search') || '')
  const [categoryId, setCategoryId] = React.useState(searchParams.get('categoryId') || 'all')
  const [status, setStatus] = React.useState(searchParams.get('status') || 'all')

  // 获取所有分类
  const fetchCategories = React.useCallback(async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    }
  }, [])

  // 更新 URL 参数
  const updateUrlParams = React.useCallback((params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all') {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    router.push(`?${newParams.toString()}`)
  }, [searchParams, router])

  // 获取产品列表
  const fetchProducts = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (categoryId && categoryId !== 'all') params.append('categoryId', categoryId)
      if (status && status !== 'all') params.append('status', status)

      const response = await fetch(`/api/products?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      setProducts(data.data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }, [search, categoryId, status])

  // 初始加载
  React.useEffect(() => {
    Promise.all([fetchCategories(), fetchProducts()])
  }, [fetchCategories, fetchProducts])

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearch(value)
    updateUrlParams({ search: value, categoryId, status })
  }

  // 处理分类筛选
  const handleCategoryChange = (value: string) => {
    setCategoryId(value)
    updateUrlParams({ search, categoryId: value, status })
  }

  // 处理状态筛选
  const handleStatusChange = (value: string) => {
    setStatus(value)
    updateUrlParams({ search, categoryId, status: value })
  }

  const handleAddProduct = () => {
    router.push('/admin/products/new')
  }

  const handleEditProduct = (id: string) => {
    router.push(`/admin/products/${id}`)
  }

  // 递归渲染分类选项
  const renderCategoryOptions = (categories: Category[], level = 0): JSX.Element[] => {
    return categories.map(category => (
      <React.Fragment key={category.id}>
        <SelectItem value={category.id}>
          {'  '.repeat(level)}{category.name}
        </SelectItem>
        {category.children?.map(child =>
          renderCategoryOptions([child], level + 1)
        ).flat()}
      </React.Fragment>
    ))
  }

  // 获取分类名称
  const getCategoryPath = (categoryId: string): string => {
    const findCategoryPath = (categories: Category[], path: string[] = []): string[] => {
      for (const category of categories) {
        if (category.id === categoryId) {
          return [...path, category.name]
        }
        if (category.children) {
          const result = findCategoryPath(category.children, [...path, category.name])
          if (result.length > 0) {
            return result
          }
        }
      }
      return []
    }
    
    const path = findCategoryPath(categories)
    return path.join(' > ')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Products</h1>
        <Button onClick={handleAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Select value={categoryId} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {renderCategoryOptions(categories)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Coming Soon">Coming Soon</SelectItem>
            <SelectItem value="Discontinued">Discontinued</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No products found
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 bg-card rounded-lg border cursor-pointer hover:bg-accent/50"
              onClick={() => handleEditProduct(product.id)}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <Image
                    src={Array.isArray(product.images) ? product.images[0] : (typeof product.images === 'string' ? product.images : '/placeholder.png')}
                    alt={product.name}
                    fill
                    sizes="(max-width: 64px) 100vw, 64px"
                    className="object-cover rounded-md"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = '/placeholder.png';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    {getCategoryPath(product.categoryId).split(' > ').map((part, index, array) => (
                      <React.Fragment key={index}>
                        <span className={index === array.length - 1 ? "text-blue-600" : ""}>{part}</span>
                        {index < array.length - 1 && (
                          <span className="text-gray-400">/</span>
                        )}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-medium">{product.price}</div>
                  <div className={`text-sm ${
                    product.status === 'Active' ? 'text-green-500' :
                    product.status === 'Coming Soon' ? 'text-blue-500' :
                    'text-red-500'
                  }`}>
                    {product.status}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 