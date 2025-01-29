'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Download, FileText, FileCode, FileImage } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data - will be replaced with API calls
const mockDownloads = [
  {
    id: "1",
    name: "Product Manual",
    type: "Documentation",
    format: "PDF",
    version: "1.2.0",
    size: "2.5 MB",
    lastUpdated: "2024-03-15",
    category: "User Guide",
    downloads: 1234,
  },
  {
    id: "2",
    name: "API Documentation",
    type: "Documentation",
    format: "HTML",
    version: "2.0.0",
    size: "1.8 MB",
    lastUpdated: "2024-03-10",
    category: "Technical",
    downloads: 856,
  },
  {
    id: "3",
    name: "Sample Code",
    type: "Software",
    format: "ZIP",
    version: "1.0.0",
    size: "4.2 MB",
    lastUpdated: "2024-03-01",
    category: "Development",
    downloads: 567,
  },
]

const categories = ["All", "User Guide", "Technical", "Development", "Marketing", "Legal"]

export default function DownloadsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [downloads, setDownloads] = React.useState(mockDownloads)

  // Handle search and filtering
  React.useEffect(() => {
    let filtered = mockDownloads
    
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }
    
    setDownloads(filtered)
  }, [searchQuery, selectedCategory])

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return
    
    try {
      // TODO: Implement delete logic
      console.log('Deleting resource:', id)
      setDownloads(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Failed to delete resource:', error)
    }
  }

  // Get file icon based on format
  const getFileIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5" />
      case 'zip':
      case 'html':
      case 'json':
        return <FileCode className="h-5 w-5" />
      case 'jpg':
      case 'png':
      case 'gif':
        return <FileImage className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
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
        <h1 className="text-xl font-bold">Downloads</h1>
        <Button onClick={() => router.push('/admin/support/downloads/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search resources..."
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

      <div className="space-y-4">
        {downloads.map((resource) => (
          <Card key={resource.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="text-gray-400">
                {getFileIcon(resource.format)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold">{resource.name}</h2>
                  <span className="text-sm text-muted-foreground">v{resource.version}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span>{resource.category}</span>
                  <span>{resource.format}</span>
                  <span>{resource.size}</span>
                  <span>Updated {formatDate(resource.lastUpdated)}</span>
                  <span className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {resource.downloads.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{resource.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/admin/support/downloads/${resource.id}`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(resource.id)}
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