'use client'

import Link from 'next/link'
import { Card } from "@/components/ui/card"
import { ProductsAPI, DownloadsAPI } from "@/lib/api/services"
import type { Product, Download } from "@/lib/api/types"
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Box, Download as DownloadIcon, Lightbulb } from 'lucide-react'

interface SearchResult {
  type: 'product' | 'download' | 'solution' | 'feature' | 'model' | 'document'
  id: string
  title: string
  description: string
  url: string
  context?: string
  image?: string | null
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

// 搜索所有内容
const searchProducts = async (searchQuery: string) => {
  const results: SearchResult[] = []
  searchQuery = searchQuery.toLowerCase()

  try {
    console.log('Searching with query:', searchQuery)
    
    // 获取产品列表
    console.log('Fetching products...')
    const productsResponse = await ProductsAPI.list({
      search: searchQuery,
      status: 'Active'
    })
    console.log('Products response:', productsResponse)
    
    if (productsResponse?.data?.data && Array.isArray(productsResponse.data.data)) {
      productsResponse.data.data.forEach((product: Product) => {
        results.push({
          type: 'product',
          id: product.id,
          title: product.name,
          description: product.description.replace(/<\/?[^>]+(>|$)/g, ""),
          url: `/products/${product.slug}`,
          image: product.images[0] || '/images/product-placeholder.jpg',
        })
      })
    }

    // 获取下载列表
    console.log('Fetching downloads...')
    const downloadsResponse = await DownloadsAPI.list({
      status: 'Active'
    })
    console.log('Downloads response:', downloadsResponse)
    
    // 检查下载数据的结构并进行客户端过滤
    const downloads = Array.isArray(downloadsResponse.data) 
      ? downloadsResponse.data 
      : downloadsResponse.data?.data
    
    if (downloads && Array.isArray(downloads)) {
      downloads.forEach((download: Download) => {
        // 在客户端进行搜索匹配
        const matchesSearch = 
          download.title.toLowerCase().includes(searchQuery) ||
          download.description.toLowerCase().includes(searchQuery) ||
          download.category.toLowerCase().includes(searchQuery) ||
          (download.version && download.version.toLowerCase().includes(searchQuery))

        if (matchesSearch) {
          console.log('Processing matching download:', download)
          results.push({
            type: 'download',
            id: download.id,
            title: download.title,
            description: download.description.replace(/<\/?[^>]+(>|$)/g, ""),
            url: download.fileUrl,
            context: `${download.category}${download.version ? ` • Version ${download.version}` : ''}${download.file ? ` • ${(download.file.size / 1024).toFixed(1)} KB` : ''}`
          })
        }
      })
    }
  } catch (error) {
    console.error('Search failed:', error)
    throw error
  }

  console.log('Final search results:', results)
  return results
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  // 执行搜索
  React.useEffect(() => {
    if (!query) {
      setSearchResults([])
      return
    }

    const search = async () => {
      setIsLoading(true)
      try {
        const results = await searchProducts(query)
        setSearchResults(results)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    search()
  }, [query])

  // 按类型对结果进行分组
  const groupedResults = React.useMemo(() => {
    const groups = {
      products: searchResults.filter(r => r.type === 'product'),
      downloads: searchResults.filter(r => r.type === 'download'),
      solutions: searchResults.filter(r => r.type === 'solution'),
    }
    return groups
  }, [searchResults])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-10">
        <div className="container">
          <h1 className="text-3xl font-bold tracking-tighter mb-4">
            Search Results
          </h1>
          <p className="text-lg text-muted-foreground">
            {searchResults.length} results found for "{query}"
          </p>
        </div>
      </div>

      {/* Results Section */}
      <div className="container py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Searching...</span>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-10">
            {/* Products Section */}
            {groupedResults.products.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Box className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Products</h2>
                  <span className="text-sm text-muted-foreground">
                    ({groupedResults.products.length})
                  </span>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {groupedResults.products.map((result, index) => (
                    <ProductCard key={index} result={result} />
                  ))}
                </div>
              </section>
            )}

            {/* Downloads Section */}
            {groupedResults.downloads.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <DownloadIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Downloads</h2>
                  <span className="text-sm text-muted-foreground">
                    ({groupedResults.downloads.length})
                  </span>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {groupedResults.downloads.map((result, index) => (
                    <DownloadCard key={index} result={result} />
                  ))}
                </div>
              </section>
            )}

            {/* Solutions Section */}
            {groupedResults.solutions.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Solutions</h2>
                  <span className="text-sm text-muted-foreground">
                    ({groupedResults.solutions.length})
                  </span>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {groupedResults.solutions.map((result, index) => (
                    <SolutionCard key={index} result={result} />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground">
              We couldn't find any matches for "{query}".<br />
              Try different keywords or check your spelling.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ProductCard({ result }: { result: SearchResult }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-video bg-muted/50 relative">
        {result.image ? (
          <img
            src={result.image}
            alt={result.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Box className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}
      </div>
      <div className="p-4">
        <Link 
          href={result.url}
          className="text-lg font-semibold hover:text-primary transition-colors line-clamp-1"
        >
          {result.title}
        </Link>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {result.description}
        </p>
      </div>
    </Card>
  )
}

function DownloadCard({ result }: { result: SearchResult }) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <DownloadIcon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <Link 
            href={result.url}
            className="font-semibold hover:text-primary transition-colors line-clamp-1"
          >
            {result.title}
          </Link>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {result.description}
          </p>
        </div>
      </div>
    </Card>
  )
}

function SolutionCard({ result }: { result: SearchResult }) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Lightbulb className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <Link 
            href={result.url}
            className="font-semibold hover:text-primary transition-colors line-clamp-1"
          >
            {result.title}
          </Link>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {result.description}
          </p>
          {result.context && (
            <p className="text-xs text-muted-foreground mt-2">
              {result.context}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
} 