'use client'

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Plus, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { Product } from "@/lib/api/types"

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = React.useState(true)
  const [products, setProducts] = React.useState<Product[]>([])
  
  // 从 URL 参数中获取初始值
  const [search, setSearch] = React.useState(searchParams.get('search') || '')
  const [category, setCategory] = React.useState(searchParams.get('category') || 'all')
  const [status, setStatus] = React.useState(searchParams.get('status') || 'all')

  // 获取所有有效的分类
  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)))
    return uniqueCategories.filter(cat => cat && cat.trim() !== '')
  }, [products])

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
      if (category && category !== 'all') params.append('category', category)
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
  }, [search, category, status])

  // 初始加载和筛选条件变化时重新获取数据
  React.useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearch(value)
    updateUrlParams({ search: value, category, status })
  }

  // 处理分类筛选
  const handleCategoryChange = (value: string) => {
    setCategory(value)
    updateUrlParams({ search, category: value, status })
  }

  // 处理状态筛选
  const handleStatusChange = (value: string) => {
    setStatus(value)
    updateUrlParams({ search, category, status: value })
  }

  const handleAddProduct = () => {
    router.push('/admin/products/new')
  }

  const handleEditProduct = (id: string) => {
    router.push(`/admin/products/${id}`)
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
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
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
                <img
                  src={product.images[0]?.url || '/placeholder.png'}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
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