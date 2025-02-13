'use client'

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Product } from "@/lib/api/types"

interface Category {
  id: string
  name: string
  children?: Category[]
  _count?: {
    products: number
  }
  slug?: string
}

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = React.useState<Product[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedCategory, setSelectedCategory] = React.useState(searchParams.get('category') || 'all')

  // 获取所有分类
  React.useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // 获取产品列表
  React.useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (selectedCategory !== 'all') {
          params.set('category', selectedCategory)
        }
        const response = await fetch(`/api/products?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data.data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [selectedCategory, searchParams])

  // 处理分类变更
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('category')
    } else {
      params.set('category', value)
    }
    router.push(`?${params.toString()}`)
  }

  // 递归渲染分类选项
  const renderCategoryOptions = (categories: Category[], level = 0): JSX.Element[] => {
    return categories.map(category => (
      <React.Fragment key={category.id}>
        <SelectItem
          value={category.id}
          className="flex items-center pl-6"
          style={{
            paddingLeft: level === 0 ? '24px' : `${(level + 2) * 16}px`
          }}
        >
          {category.name}
          {category._count && (
            <span className="ml-2 text-sm text-muted-foreground">
              ({category._count.products})
            </span>
          )}
        </SelectItem>
        {category.children?.map(child =>
          renderCategoryOptions([child], level + 1)
        ).flat()}
      </React.Fragment>
    ))
  }

  // 获取分类路径
  const getCategoryPath = (categoryId: string): { id: string; name: string; slug: string }[] => {
    const findCategoryPath = (categories: Category[], path: { id: string; name: string; slug: string }[] = []): { id: string; name: string; slug: string }[] => {
      for (const category of categories) {
        if (category.id === categoryId) {
          return [...path, { id: category.id, name: category.name, slug: category.slug || category.id }]
        }
        if (category.children) {
          const result = findCategoryPath(category.children, [...path, { id: category.id, name: category.name, slug: category.slug || category.id }])
          if (result.length > 0) {
            return result
          }
        }
      }
      return []
    }
    
    return findCategoryPath(categories)
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-16">
      {/* 面包屑导航 */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href="/products"
          className="hover:text-foreground"
          onClick={() => setSelectedCategory('all')}
        >
          Products
        </Link>
        {selectedCategory !== 'all' && (
          <>
            {getCategoryPath(selectedCategory).map((category, index) => (
              <React.Fragment key={category.id}>
                <ChevronRight className="h-4 w-4" />
                <Link
                  href={`/products/categories/${category.slug}`}
                  className="hover:text-foreground"
                >
                  {category.name}
                </Link>
              </React.Fragment>
            ))}
          </>
        )}
      </nav>

      {/* 分类筛选 */}
      <div className="flex items-center gap-4 mb-8">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {renderCategoryOptions(categories)}
          </SelectContent>
        </Select>
      </div>

      {/* 产品网格 */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={Array.isArray(product.images) && product.images.length > 0
                      ? product.images[0]
                      : '/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-2 mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {getCategoryPath(product.categoryId).map((category, index) => (
                      <React.Fragment key={category.id}>
                        {index > 0 && ' / '}
                        <Link
                          href={`/products/categories/${category.slug}`}
                          className="hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          {category.name}
                        </Link>
                      </React.Fragment>
                    ))}
                  </p>
                  <div className="mt-4">
                    <Button variant="secondary" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 