'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil } from "lucide-react"
import { toast } from "sonner"
import { type ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { handleApiError } from "@/lib/api/error"

interface NewsItem {
  id: string
  title: string
  slug: string
  category: string
  status: "Draft" | "Published"
  publishDate: string
  createdAt: string
  updatedAt: string
}

export default function NewsListPage() {
  const router = useRouter()
  const [news, setNews] = React.useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // 加载新闻列表
  React.useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/news')
        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }
        const result = await response.json()
        if (!result || !result.data) {
          throw new Error('No news data received')
        }
        setNews(result.data)
      } catch (error) {
        console.error('Failed to fetch news:', error)
        handleApiError(error, 'Failed to load news')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  // 表格列定义
  const columns: ColumnDef<NewsItem>[] = [
    {
      header: "Title",
      accessorKey: "title",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.original.title}</span>
        </div>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className={row.original.status === 'Published' ? 'text-green-600' : 'text-yellow-600'}>
            {row.original.status}
          </span>
        </div>
      ),
    },
    {
      header: "Publish Date",
      accessorKey: "publishDate",
      cell: ({ row }) => (
        <span>{new Date(row.original.publishDate).toLocaleDateString()}</span>
      ),
    },
    {
      header: "Last Updated",
      accessorKey: "updatedAt",
      cell: ({ row }) => (
        <span>{new Date(row.original.updatedAt).toLocaleDateString()}</span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/admin/news/${row.original.id}`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">News</h1>
        <Button onClick={() => router.push('/admin/news/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add News
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={news}
        isLoading={isLoading}
        noDataText="No news found"
      />
    </div>
  )
} 