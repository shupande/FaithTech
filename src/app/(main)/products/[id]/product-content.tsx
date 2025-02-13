'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronLeft, ChevronRight, Download, Battery, Zap, Shield, BarChart3, FileText, Book, FileCode } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ProductImages } from "@/components/product-images"
import { Input } from "@/components/ui/input"
import type { LucideIcon } from 'lucide-react'

// 图标映射
const ICON_MAP = {
  battery: Battery,
  zap: Zap,
  shield: Shield,
  chart: BarChart3,
  file: FileText,
  book: Book,
  code: FileCode
}

interface ProductFeature {
  icon: string
  title: string
  description: string
}

interface ProductSpecification {
  name: string
  value: string
}

interface ProductDocument {
  icon: string
  title: string
  description: string
  fileSize: string
  downloadUrl: string
}

interface ProductModel {
  name: string
  voltage: string
  current: string
  interface: string
  features: string
}

interface ProductImage {
  url: string
  alt: string
}

interface CategoryPath {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  fullDescription?: string
  features: string
  specifications: string
  models: string
  documents: ProductDocument[]
  images: ProductImage[]
  categoryPath: CategoryPath[]
}

interface ProductContentProps {
  product: Product
  relatedProducts: Product[]
  productId: string
}

export function ProductContent({ product, relatedProducts, productId }: ProductContentProps) {
  const [activeTab, setActiveTab] = React.useState('features')

  return (
    <div className="container py-8 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-5 overflow-x-auto">
        <Link href="/" className="hover:text-gray-900 whitespace-nowrap">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <Link href="/products" className="hover:text-gray-900 whitespace-nowrap">
          Products
        </Link>
        {product.categoryPath.map((category, index) => (
          <React.Fragment key={category.id}>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <Link 
              href={`/products/categories/${category.slug}`}
              className="hover:text-gray-900 whitespace-nowrap"
            >
              {category.name}
            </Link>
          </React.Fragment>
        ))}
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <span className="text-gray-900 whitespace-nowrap">{product.name}</span>
      </nav>

      <div className="space-y-8">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline" size="icon" asChild className="flex-shrink-0">
            <Link href="/products">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">{product.name}</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <ProductImages images={product.images} />
          <div className="space-y-6 pl-0 lg:pl-4">
            <div 
              className="text-lg md:text-xl text-gray-500 max-w-[500px]"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
            <div>
              <Button size="lg">Contact Sales</Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0 space-x-6">
              <TabsTrigger 
                value="features" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 pb-2 whitespace-nowrap"
              >
                Features
              </TabsTrigger>
              <TabsTrigger 
                value="specifications" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 pb-2 whitespace-nowrap"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="models" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 pb-2 whitespace-nowrap"
              >
                Models
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 pb-2 whitespace-nowrap"
              >
                Documents
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="features" className="mt-6">
            <div className="prose max-w-none">
              {/* 显示 fullDescription 作为主要特性内容 */}
              <div dangerouslySetInnerHTML={{ __html: product.features }} />
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: product.specifications }} />
            </div>
          </TabsContent>

          <TabsContent value="models" className="mt-6">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: product.models }} />
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <div className="space-y-4">
              {product.documents.map((doc, index) => (
                  <div key={index} className="flex flex-wrap items-center justify-between gap-4 py-4 border-b">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-blue-50 flex-shrink-0">
                      {ICON_MAP[doc.icon as keyof typeof ICON_MAP] && (
                        React.createElement(ICON_MAP[doc.icon as keyof typeof ICON_MAP], {
                          className: "h-5 w-5 text-blue-600"
                        })
                      )}
                      </div>
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <p className="text-sm text-gray-500">{doc.fileSize}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" asChild>
                      <Link href={doc.downloadUrl}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Link>
                    </Button>
                  </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Related Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((relatedProduct, index) => (
              <Link key={index} href={`/products/${relatedProduct.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video">
                      <Image
                      src={relatedProduct.images[0]?.url || '/images/product-placeholder.jpg'}
                      alt={relatedProduct.images[0]?.alt || relatedProduct.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                    <div 
                      className="text-sm text-gray-500 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: relatedProduct.description }}
                    />
                    </CardContent>
                  </Card>
                </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 