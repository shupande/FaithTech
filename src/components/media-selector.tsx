import * as React from "react"
import { Search, Filter, Grid, List, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { MediaPreview } from "@/components/media-preview"
import { MediaAPI } from "@/lib/api/services"
import type { MediaAsset, MediaSearchParams } from "@/types/media"
import { toast } from "react-hot-toast"

interface MediaSelectorProps {
  trigger?: React.ReactNode
  onSelect: (asset: MediaAsset) => void
  selectedId?: string
  type?: string
  category?: string
  multiple?: boolean
}

export function MediaSelector({
  trigger,
  onSelect,
  selectedId,
  type,
  category,
  multiple = false,
}: MediaSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [view, setView] = React.useState<'grid' | 'list'>('grid')
  const [assets, setAssets] = React.useState<MediaAsset[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchParams, setSearchParams] = React.useState<MediaSearchParams>({
    page: 1,
    limit: 20,
    status: 'Active',
    type,
    category,
  })

  // 加载资源
  const loadAssets = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await MediaAPI.listAssets(searchParams)
      setAssets(response.data.data)
    } catch (error) {
      console.error('Failed to load assets:', error)
      toast.error('Failed to load media assets')
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  React.useEffect(() => {
    if (open) {
      loadAssets()
    }
  }, [open, loadAssets])

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

  // 处理选择
  const handleSelect = (asset: MediaAsset) => {
    onSelect(asset)
    if (!multiple) {
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Select Media</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>

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
            <Select
              value={searchParams.type || 'all'}
              onValueChange={handleTypeFilter}
            >
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
          </div>
        </Card>

        <div className={view === 'grid' ? 'grid gap-4 md:grid-cols-3' : 'space-y-4'}>
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
                selected={selectedId === asset.id}
                onSelect={() => handleSelect(asset)}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface AssetCardProps {
  asset: MediaAsset
  view: 'grid' | 'list'
  selected?: boolean
  onSelect: () => void
}

function AssetCard({ asset, view, selected, onSelect }: AssetCardProps) {
  const isImage = asset.type === 'image'
  const thumbnail = isImage ? asset.path : '/placeholder.png'

  if (view === 'grid') {
    return (
      <Card
        className={`overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer ${
          selected ? 'ring-2 ring-primary' : ''
        }`}
      >
        <div className="aspect-video relative">
          <img
            src={thumbnail}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <MediaPreview
              asset={asset}
              trigger={
                <Button variant="secondary" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              }
            />
            <Button variant="secondary" size="sm" onClick={onSelect}>
              Select
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium truncate" title={asset.name}>{asset.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{asset.description}</p>
          <div className="mt-2 text-sm text-muted-foreground">
            {(asset.size / 1024).toFixed(1)} KB
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className={`p-4 hover:shadow-lg transition-shadow duration-200 ${
        selected ? 'ring-2 ring-primary' : ''
      }`}
    >
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
        <div className="flex items-center gap-2">
          <MediaPreview
            asset={asset}
            trigger={
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            }
          />
          <Button variant="ghost" size="sm" onClick={onSelect}>
            Select
          </Button>
        </div>
      </div>
    </Card>
  )
} 