'use client'

import * as React from "react"
import { notFound } from "next/navigation"
import { Loader2 } from "lucide-react"
import type { Product } from "@/lib/api/types"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface ProductsResponse {
  success: boolean
  data: Product[]
  pagination?: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const response = await fetch(`/api/products?categoryId=${category}`)
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    const result: ProductsResponse = await response.json()
    return result.data || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

const getCategoryPath = (categoryId: string, categories: Category[]): { id: string; name: string; slug: string }[] => {
  const findCategoryPath = (categories: Category[], path: { id: string; name: string; slug: string }[] = []): { id: string; name: string; slug: string }[] => {
    for (const category of categories) {
      if (category.id === categoryId) {
        return [...path, { id: category.id, name: category.name, slug: category.slug }];
      }
      if (category.children) {
        const result = findCategoryPath(category.children, [...path, { id: category.id, name: category.name, slug: category.slug }]);
        if (result.length > 0) {
          return result;
        }
      }
    }
    return [];
  };
  return findCategoryPath(categories);
};

export default function CategoryPage({
  params,
}: {
  params: { category: string }
}) {
  const [products, setProducts] = React.useState<Product[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Fetch categories
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

  // Fetch products by category
  React.useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true)
        const products = await getProductsByCategory(params.category)
        setProducts(products)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [params.category])

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // If no products found for this category, show 404
  if (!products || products.length === 0) {
    notFound()
  }

  return (
    <div className="container py-8 md:py-16">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {params.category.replace(/-/g, ' ')}
      </h1>
      
      {/* 面包屑导航 */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href="/products"
          className="hover:text-foreground"
        >
          Products
        </Link>
        {getCategoryPath(params.category, categories).map((category: { id: string; name: string; slug: string }, index: number) => (
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
      </nav>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600 mt-2">{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 