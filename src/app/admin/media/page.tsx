'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter, Grid, List, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { MediaAPI } from "@/lib/api/services"
import type { MediaAsset, MediaSearchParams } from "@/types/media"

export default function MediaLibraryPage() {
  const router = useRouter()
  const [view, setView] = React.useState<'grid' | 'list'>('grid')
  const [assets, setAssets] = React.useState<MediaAsset[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchParams, setSearchParams] = React.useState<MediaSearchParams>({
    page: 1,
    limit: 20,
    status: 'Active',
  })

  // 加载资源
  const loadAssets = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await MediaAPI.listAssets(searchParams)
      setAssets(response.data.data)
    } catch (error) {
      console.error('Failed to load assets:', error)
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  React.useEffect(() => {
    loadAssets()
  }, [loadAssets])

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      search: value,
      page: 1,
    }))
  }

  // 处理类型筛选
  const handleTypeFilter = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      type: value === 'all' ? undefined : value,
      page: 1,
    }))
  }

  // 处理分类筛选
  const handleCategoryFilter = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      category: value === 'all' ? undefined : value,
      page: 1,
    }))
  }

  // 处理状态筛选
  const handleStatusFilter = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      status: value as 'Active' | 'Archived' | 'Deleted',
      page: 1,
    }))
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Media Library</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
          >
            {view === 'grid' ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid className="h-4 w-4" />
            )}
          </Button>
          <Button onClick={() => router.push('/admin/media/upload')}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button onClick={() => router.push('/admin/media/categories')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                className="pl-9"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          <Select onValueChange={handleTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="archive">Archives</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={handleCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {/* TODO: Add dynamic categories */}
            </SelectContent>
          </Select>
          <Select
            value={searchParams.status}
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
              <SelectItem value="Deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className={view === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'}>
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading assets...</p>
            </div>
          </div>
        ) : assets.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No assets found</p>
          </div>
        ) : (
          assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              view={view}
              onEdit={() => router.push(`/admin/media/${asset.id}`)}
            />
          ))
        )}
      </div>
    </div>
  )
}

interface AssetCardProps {
  asset: MediaAsset
  view: 'grid' | 'list'
  onEdit: () => void
}

function AssetCard({ asset, view, onEdit }: AssetCardProps) {
  const isImage = asset.type === 'image'
  const thumbnail = isImage ? asset.path : '/placeholder.png'

  if (view === 'grid') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="aspect-video relative">
          <img
            src={thumbnail}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium truncate" title={asset.name}>{asset.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{asset.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {(asset.size / 1024).toFixed(1)} KB
            </div>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              Edit
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 relative flex-shrink-0">
          <img
            src={thumbnail}
            alt={asset.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate" title={asset.name}>{asset.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{asset.description}</p>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            <span>{asset.type}</span>
            <span>{(asset.size / 1024).toFixed(1)} KB</span>
            <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
    </Card>
  )
} 