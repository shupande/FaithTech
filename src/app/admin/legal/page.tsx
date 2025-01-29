'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Eye, FileText, Clock, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data - will be replaced with API calls
const mockDocuments = [
  {
    id: "1",
    title: "Privacy Policy",
    path: "/privacy-policy",
    type: "Policy",
    lastUpdated: "2024-03-15",
    status: "Published",
    views: 1234,
    effectiveDate: "2024-03-20",
    version: "2.1",
  },
  {
    id: "2",
    title: "Terms of Service",
    path: "/terms-of-service",
    type: "Terms",
    lastUpdated: "2024-03-10",
    status: "Published",
    views: 856,
    effectiveDate: "2024-03-15",
    version: "3.0",
  },
  {
    id: "3",
    title: "Cookie Policy",
    path: "/cookie-policy",
    type: "Policy",
    lastUpdated: "2024-03-01",
    status: "Draft",
    views: 0,
    effectiveDate: null,
    version: "1.0",
  },
]

const statuses = ["All", "Published", "Draft", "Archived"]

export default function LegalPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedStatus, setSelectedStatus] = React.useState("All")
  const [documents, setDocuments] = React.useState(mockDocuments)

  // Handle search and filtering
  React.useEffect(() => {
    let filtered = mockDocuments
    
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.path.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply status filter
    if (selectedStatus !== "All") {
      filtered = filtered.filter(item => item.status === selectedStatus)
    }
    
    setDocuments(filtered)
  }, [searchQuery, selectedStatus])

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return
    
    try {
      // TODO: Implement delete logic
      console.log('Deleting document:', id)
      setDocuments(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Failed to delete document:', error)
    }
  }

  // Get status style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-700'
      case 'Draft':
        return 'bg-gray-100 text-gray-700'
      case 'Archived':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Legal Documents</h1>
        <Button onClick={() => router.push('/admin/legal/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
        {documents.map((doc) => (
          <Card key={doc.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="text-gray-400">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold">{doc.title}</h2>
                  <span className="text-sm text-muted-foreground">v{doc.version}</span>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${getStatusStyle(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {doc.path}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Updated {formatDate(doc.lastUpdated)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {doc.views.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Effective Date: {formatDate(doc.effectiveDate)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/admin/legal/${doc.id}/preview`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/admin/legal/${doc.id}`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(doc.id)}
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