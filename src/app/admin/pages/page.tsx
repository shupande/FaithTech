'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Eye, FileText, Globe, Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Mock data - will be replaced with API calls
const mockPages = [
  {
    id: "1",
    title: "Home",
    path: "/",
    type: "Landing Page",
    lastUpdated: "2024-03-15",
    status: "Published",
    isHomePage: true,
    views: 5678,
  },
  {
    id: "2",
    title: "About Us",
    path: "/about",
    type: "Content Page",
    lastUpdated: "2024-03-10",
    status: "Published",
    isHomePage: false,
    views: 234,
  },
  {
    id: "3",
    title: "New Landing Page",
    path: "/welcome",
    type: "Landing Page",
    lastUpdated: "2024-03-01",
    status: "Draft",
    isHomePage: false,
    views: 0,
  },
]

const statuses = ["All", "Published", "Draft"]
const types = ["All", "Landing Page", "Content Page"]

export default function PagesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedStatus, setSelectedStatus] = React.useState("All")
  const [selectedType, setSelectedType] = React.useState("All")
  const [pages, setPages] = React.useState(mockPages)

  // Handle search and filtering
  React.useEffect(() => {
    let filtered = mockPages
    
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply status filter
    if (selectedStatus !== "All") {
      filtered = filtered.filter(item => item.status === selectedStatus)
    }

    // Apply type filter
    if (selectedType !== "All") {
      filtered = filtered.filter(item => item.type === selectedType)
    }
    
    setPages(filtered)
  }, [searchQuery, selectedStatus, selectedType])

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return
    
    try {
      // TODO: Implement delete logic
      console.log('Deleting page:', id)
      setPages(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Failed to delete page:', error)
    }
  }

  // Handle set as homepage
  const handleSetHomePage = async (id: string) => {
    if (!confirm('Are you sure you want to set this page as the homepage?')) return
    
    try {
      // TODO: Implement set homepage logic
      console.log('Setting homepage:', id)
      setPages(prev => prev.map(page => ({
        ...page,
        isHomePage: page.id === id
      })))
    } catch (error) {
      console.error('Failed to set homepage:', error)
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
        <h1 className="text-xl font-bold">Pages</h1>
        <Button onClick={() => router.push('/admin/pages/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={selectedType}
            onValueChange={setSelectedType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {types.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="space-y-4">
        {pages.map((page) => (
          <Card key={page.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="text-gray-400">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold">{page.title}</h2>
                  {page.isHomePage && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      <Home className="h-3 w-3 mr-1" />
                      Homepage
                    </Badge>
                  )}
                  <span className={`text-sm px-2 py-0.5 rounded-full ${getStatusStyle(page.status)}`}>
                    {page.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {page.path}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {page.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {page.views.toLocaleString()} views
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last updated: {formatDate(page.lastUpdated)}
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
        ))}
      </div>
    </div>
  )
} 