import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { products } from '@/data/products'
import type { Products } from '@/types/product'

export const metadata: Metadata = {
  title: 'Search Results - BatteryEmulator',
  description: 'Search results from BatteryEmulator website',
}

interface SearchResult {
  title: string
  description: string
  url: string
  type: 'product' | 'model' | 'document' | 'feature'
  context?: string
}

function normalizeModelNumber(text: string): string {
  // 移除所有空格和特殊字符，转换为小写
  return text.toLowerCase().replace(/[\s-_]/g, '')
}

function modelNumberMatches(modelName: string, searchQuery: string): boolean {
  const normalizedModel = normalizeModelNumber(modelName)
  const normalizedQuery = normalizeModelNumber(searchQuery)
  
  // 如果是完全匹配
  if (normalizedModel === normalizedQuery) return true
  
  // 如果查询是型号的一部分
  if (normalizedModel.includes(normalizedQuery)) return true
  
  // 如果型号是查询的一部分
  if (normalizedQuery.includes(normalizedModel)) return true
  
  // 分割型号和查询字符串进行部分匹配
  const modelParts = normalizedModel.split(/(?=[a-z]|\d+)/i)
  const queryParts = normalizedQuery.split(/(?=[a-z]|\d+)/i)
  
  // 检查是否有部分匹配
  return modelParts.some(part => 
    queryParts.some(queryPart => 
      part.length > 1 && queryPart.length > 1 && 
      (part.includes(queryPart) || queryPart.includes(part))
    )
  )
}

function searchProducts(query: string): SearchResult[] {
  const results: SearchResult[] = []
  const searchQuery = query.toLowerCase()

  // 搜索所有产品
  Object.entries(products as Products).forEach(([id, product]) => {
    // 搜索产品名称和描述
    if (
      product.name.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery) ||
      product.fullDescription.toLowerCase().includes(searchQuery) ||
      modelNumberMatches(product.name, searchQuery)
    ) {
      results.push({
        title: product.name,
        description: product.description,
        url: `/products/${id}`,
        type: 'product'
      })
    }

    // 搜索产品特性
    product.features.forEach((feature) => {
      if (
        feature.title.toLowerCase().includes(searchQuery) ||
        feature.description.toLowerCase().includes(searchQuery)
      ) {
        results.push({
          title: feature.title,
          description: feature.description,
          url: `/products/${id}?tab=features`,
          type: 'feature',
          context: `Feature of ${product.name}`
        })
      }
    })

    // 搜索产品型号
    if (product.models) {
      product.models.forEach((model) => {
        if (
          modelNumberMatches(model.name, searchQuery) ||
          model.description.toLowerCase().includes(searchQuery) ||
          model.features.some((f) => f.toLowerCase().includes(searchQuery))
        ) {
          results.push({
            title: model.name,
            description: model.description,
            url: `/products/${id}?tab=models&model=${encodeURIComponent(model.name)}`,
            type: 'model',
            context: `Model of ${product.name}`
          })
        }
      })
    }

    // 搜索文档
    product.documents.forEach((doc) => {
      if (
        doc.title.toLowerCase().includes(searchQuery) ||
        doc.description.toLowerCase().includes(searchQuery)
      ) {
        results.push({
          title: doc.title,
          description: doc.description,
          url: `/products/${id}?tab=documents`,
          type: 'document',
          context: `Document of ${product.name}`
        })
      }
    })

    // 搜索规格参数
    product.specifications.forEach((spec) => {
      if (
        spec.name.toLowerCase().includes(searchQuery) ||
        spec.value.toLowerCase().includes(searchQuery)
      ) {
        results.push({
          title: `${spec.name}: ${spec.value}`,
          description: `Specification of ${product.name}`,
          url: `/products/${id}?tab=specifications`,
          type: 'feature',
          context: `Specification of ${product.name}`
        })
      }
    })
  })

  return results
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  const query = searchParams.q || ''
  const results = searchProducts(query)

  return (
    <div className="container py-8 md:py-16">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tighter mb-4">
            Search Results
          </h1>
          <p className="text-lg text-gray-500">
            {results.length} results found for "{query}"
          </p>
        </div>

        <div className="grid gap-4">
          {results.map((result, index) => (
            <Link key={index} href={result.url}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">{result.title}</h2>
                      {result.context && (
                        <p className="text-sm text-blue-600 mb-2">{result.context}</p>
                      )}
                      <p className="text-gray-500">{result.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100">
                        {result.type}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {results.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No results found for your search.</p>
              <p className="text-gray-500 mt-2">
                Try using different keywords or check your spelling.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 