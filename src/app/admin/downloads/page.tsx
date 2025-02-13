'use client'

import * as React from 'react'
import Link from 'next/link'
import { Plus, Pencil, FileDown, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DownloadsAPI } from "@/lib/api/services"
import type { Download } from "@/lib/api/types"

export default function DownloadsManagement() {
  const [downloads, setDownloads] = React.useState<Download[]>([])
  const [loading, setLoading] = React.useState(true)

  // 加载下载列表
  const loadDownloads = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await DownloadsAPI.list()
      // 检查响应数据结构
      const downloadData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || []
      setDownloads(downloadData)
    } catch (error) {
      console.error('Failed to fetch downloads:', error)
      toast.error('Failed to load downloads')
      setDownloads([]) // 确保在错误时设置为空数组
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadDownloads()
  }, [loadDownloads])

  // 处理删除
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this download? This action cannot be undone.')) {
      return
    }

    try {
      await DownloadsAPI.delete(id)
      toast.success('Download deleted successfully')
      // 重新加载列表
      loadDownloads()
    } catch (error) {
      console.error('Failed to delete download:', error)
      toast.error('Failed to delete download')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading downloads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Downloads Management</h1>
        <Button asChild>
          <Link href="/admin/downloads/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Download
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {downloads.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              No downloads found
            </div>
          </Card>
        ) : (
          downloads.map((download) => (
            <Card key={download.id} className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-semibold">{download.title}</h2>
                    <span className={`text-sm px-2 py-0.5 rounded-full ${
                      download.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {download.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span>{download.category}</span>
                    {download.version && (
                      <span>v{download.version}</span>
                    )}
                    <span>{download.downloads} downloads</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {download.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <Link href={`/admin/downloads/${download.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(download.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {download.file?.url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link href={download.file.url} target="_blank">
                        <FileDown className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 