"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Eye, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Legal = {
  id: string
  title: string
  slug: string
  type: string
  status: string
  version: string
  effectiveDate: string
  content: string
  createdAt: string
  updatedAt: string
}

type PaginatedResponse = {
  documents: Legal[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function LegalPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<PaginatedResponse | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<Legal | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchType, setSearchType] = useState<string>("all")
  const [searchStatus, setSearchStatus] = useState<string>("all")
  const [documentTypes, setDocumentTypes] = useState<string[]>([])

  // 加载文档类型
  useEffect(() => {
    async function loadTypes() {
      try {
        const response = await fetch('/api/legal/types')
        if (response.ok) {
          const data = await response.json()
          setDocumentTypes(data.map((t: any) => t.type))
        }
      } catch (error) {
        console.error("Error loading document types:", error)
      }
    }
    loadTypes()
  }, [])

  // 加载数据
  useEffect(() => {
    loadDocuments()
  }, [currentPage, searchType, searchStatus])

  async function loadDocuments() {
    try {
      setIsLoading(true)
      let url = `/api/legal?page=${currentPage}`
      if (searchType && searchType !== 'all') url += `&type=${searchType}`
      if (searchStatus && searchStatus !== 'all') url += `&status=${searchStatus}`

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch documents")
      
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error("Error loading documents:", error)
      toast.error("Failed to load documents")
    } finally {
      setIsLoading(false)
    }
  }

  // 删除文档
  async function handleDelete() {
    if (!documentToDelete) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/legal?id=${documentToDelete.id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) throw new Error("Failed to delete document")

      setIsDeleteDialogOpen(false)
      setDocumentToDelete(null)
      toast.success("Document deleted successfully")
      loadDocuments() // 重新加载文档列表
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error("Failed to delete document")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Legal Documents</h1>
        <Button asChild>
          <Link href="/admin/legal/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Document
          </Link>
        </Button>
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 mb-6">
        <div className="w-[200px]">
          <Select
            value={searchType}
            onValueChange={setSearchType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {documentTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[200px]">
          <Select
            value={searchStatus}
            onValueChange={setSearchStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : !data || data.documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No documents found
                </TableCell>
              </TableRow>
            ) : (
              data.documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {doc.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{doc.version}</TableCell>
                  <TableCell>
                    <Badge variant={doc.status === "Active" ? "default" : "secondary"}>
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(doc.effectiveDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(doc.updatedAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/admin/legal/${doc.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/admin/legal/${doc.id}/preview`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDocumentToDelete(doc)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* 分页 */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-2">
              Page {currentPage} of {data.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(data.pagination.totalPages, prev + 1))}
              disabled={currentPage === data.pagination.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 