'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Eye, FileText, Globe, Home } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const statuses = ["All", "Published", "Draft"]
const types = ["All", "Landing Page", "Content Page"]

export default function PagesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedStatus, setSelectedStatus] = React.useState("All")
  const [selectedType, setSelectedType] = React.useState("All")
  const [pages, setPages] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Load pages
  const loadPages = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (selectedStatus !== 'All') params.set('status', selectedStatus)
      
      const response = await fetch(`/api/pages?${params.toString()}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to load pages')
      }

      if (data.success) {
        let filteredPages = data.data
        
        // Client-side type filtering since it's not supported by the API
        if (selectedType !== 'All') {
          filteredPages = filteredPages.filter((page: any) => page.type === selectedType)
        }
        
        setPages(filteredPages)
      }
    } catch (error) {
      console.error('Failed to load pages:', error)
      toast.error('Failed to load pages')
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedStatus, selectedType])

  React.useEffect(() => {
    loadPages()
  }, [loadPages])

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return
    
    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete page')
      }

      toast.success('Page deleted successfully')
      loadPages()
    } catch (error) {
      console.error('Failed to delete page:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete page')
    }
  }

  // Handle set as homepage
  const handleSetHomePage = async (id: string) => {
    if (!confirm('Are you sure you want to set this page as the homepage?')) return
    
    try {
      const response = await fetch(`/api/pages/${id}/set-home`, {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to set homepage')
      }

      toast.success('Homepage set successfully')
      loadPages()
    } catch (error) {
      console.error('Failed to set homepage:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to set homepage')
    }
  }

  // Get status style
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

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Pages</h1>
        <Button onClick={() => router.push('/admin/pages/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Input
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Pages List */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </Card>
        ) : pages.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-gray-500">
              No pages found
            </div>
          </Card>
        ) : (
          pages.map((page) => (
            <Card key={page.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">{page.title}</h2>
                    {page.isHomePage && (
                      <Badge variant="secondary">
                        <Home className="h-3 w-3 mr-1" />
                        Homepage
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      {page.slug}
                    </div>
                    <div>
                      <Badge variant="outline" className={getStatusStyle(page.status)}>
                        {page.status}
                      </Badge>
                    </div>
                    <div>
                      Last updated: {formatDate(page.updatedAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/pages/${page.id}/preview`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/pages/${page.id}`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {!page.isHomePage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetHomePage(page.id)}
                    >
                      <Home className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(page.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 