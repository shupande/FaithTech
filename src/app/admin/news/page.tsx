'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 模拟数据 - 之后会替换为API调用
const mockNews = [
  {
    id: "1",
    title: "New Product Launch",
    category: "Product",
    publishDate: "2024-03-15",
    status: "Published",
    author: "John Doe",
    views: 1234,
    excerpt: "Announcing our latest product innovation that will revolutionize the industry",
  },
  {
    id: "2",
    title: "Company Expansion",
    category: "Company",
    publishDate: "2024-03-10",
    status: "Draft",
    author: "Jane Smith",
    views: 0,
    excerpt: "We're excited to announce our expansion into new markets",
  },
  {
    id: "3",
    title: "Industry Award",
    category: "Achievement",
    publishDate: "2024-03-01",
    status: "Published",
    author: "Mike Johnson",
    views: 856,
    excerpt: "Our team has been recognized with a prestigious industry award",
  },
]

const categories = ["All", "Product", "Company", "Achievement", "Technology", "Event"]

export default function NewsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [news, setNews] = React.useState(mockNews)

  // 处理搜索和筛选
  React.useEffect(() => {
    let filtered = mockNews
    
    // 应用搜索
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // 应用分类筛选
    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }
    
    setNews(filtered)
  }, [searchQuery, selectedCategory])

  // 处理删除
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    
    try {
      // TODO: 实现删除逻辑
      console.log('Deleting article:', id)
      setNews(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Failed to delete article:', error)
    }
  }

  // 获取状态标签的样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-700'
      case 'Draft':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">News</h1>
        <Button onClick={() => router.push('/admin/news/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Article
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid gap-4">
        {news.map((article) => (
          <Card key={article.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{article.title}</h2>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${getStatusStyle(article.status)}`}>
                    {article.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{article.category}</span>
                  <span>By {article.author}</span>
                  <span>{formatDate(article.publishDate)}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {article.views.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm">{article.excerpt}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/admin/news/${article.id}`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(article.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 