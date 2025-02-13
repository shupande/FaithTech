"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Download, Trash2 } from "lucide-react"
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

type ContactForm = {
  id: string
  firstName: string
  lastName: string
  email: string
  company: string
  subject: string
  message: string
  status: string
  notes: string | null
  attachments: string | null
  createdAt: string
  responses: Array<{
    id: string
    message: string
    respondedBy: string
    createdAt: string
  }>
}

// 修改 DateRange 类型
type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

export default function ContactManagementPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [forms, setForms] = useState<ContactForm[]>([])
  const [selectedForm, setSelectedForm] = useState<ContactForm | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [newNote, setNewNote] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [formToDelete, setFormToDelete] = useState<ContactForm | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // 加载联系表单数据
  useEffect(() => {
    loadForms()
  }, [selectedStatus, searchQuery, dateRange])

  async function loadForms() {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      
      if (selectedStatus !== "all") {
        params.append("status", selectedStatus)
      }
      
      if (searchQuery) {
        params.append("search", searchQuery)
      }
      
      if (dateRange.from) {
        params.append("fromDate", dateRange.from.toISOString())
      }
      
      if (dateRange.to) {
        params.append("toDate", dateRange.to.toISOString())
      }

      const response = await fetch(`/api/contact/form?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch forms")
      
      const data = await response.json()
      setForms(data)
    } catch (error) {
      console.error("Error loading forms:", error)
      toast.error("Failed to load contact forms")
    } finally {
      setIsLoading(false)
    }
  }

  // 更新表单状态
  async function handleUpdateStatus() {
    if (!selectedForm || !newStatus) return

    try {
      setIsUpdating(true)
      const response = await fetch("/api/contact/form", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedForm.id,
          status: newStatus,
          notes: newNote || undefined,
        }),
      })

      if (!response.ok) throw new Error("Failed to update form")

      toast.success("Form status updated successfully")
      setIsUpdateOpen(false)
      loadForms()
    } catch (error) {
      console.error("Error updating form:", error)
      toast.error("Failed to update form status")
    } finally {
      setIsUpdating(false)
    }
  }

  // 导出数据
  async function handleExport() {
    try {
      setIsExporting(true)
      const params = new URLSearchParams()
      
      if (selectedStatus !== "all") {
        params.append("status", selectedStatus)
      }
      
      if (searchQuery) {
        params.append("search", searchQuery)
      }
      
      if (dateRange.from) {
        params.append("fromDate", dateRange.from.toISOString())
      }
      
      if (dateRange.to) {
        params.append("toDate", dateRange.to.toISOString())
      }

      params.append("export", "true")

      const response = await fetch(`/api/contact/form?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to export data")
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `contact-forms-${format(new Date(), "yyyy-MM-dd")}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Data exported successfully")
    } catch (error) {
      console.error("Error exporting data:", error)
      toast.error("Failed to export data")
    } finally {
      setIsExporting(false)
    }
  }

  // 删除联系表单
  async function handleDelete() {
    if (!formToDelete) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/contact/form?id=${formToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete form")

      toast.success("Form deleted successfully")
      setIsDeleteDialogOpen(false)
      setFormToDelete(null)
      loadForms()
    } catch (error) {
      console.error("Error deleting form:", error)
      toast.error("Failed to delete form")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contact Form Management</h1>
        <Button 
          variant="outline" 
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </>
          )}
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by name, email, or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 min-w-[300px]">
            <DateRangePicker
              value={dateRange}
              onChange={(value) => value && setDateRange(value)}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
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
            ) : forms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No contact forms found
                </TableCell>
              </TableRow>
            ) : (
              forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>
                    {format(new Date(form.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    {form.firstName} {form.lastName}
                  </TableCell>
                  <TableCell>{form.email}</TableCell>
                  <TableCell>{form.company}</TableCell>
                  <TableCell>{form.subject}</TableCell>
                  <TableCell>
                    <Badge variant={
                      form.status === "pending" ? "default" :
                      form.status === "in_progress" ? "secondary" :
                      "outline"
                    }>
                      {form.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedForm(form)
                          setIsViewOpen(true)
                        }}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedForm(form)
                          setNewStatus(form.status)
                          setNewNote(form.notes || "")
                          setIsUpdateOpen(true)
                        }}
                      >
                        Update
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          setFormToDelete(form)
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
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Contact Form Details</DialogTitle>
            <DialogDescription>
              View the complete details of the contact form submission
            </DialogDescription>
          </DialogHeader>

          {selectedForm && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Name</h4>
                  <p>{selectedForm.firstName} {selectedForm.lastName}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Email</h4>
                  <p>{selectedForm.email}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Company</h4>
                  <p>{selectedForm.company}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Subject</h4>
                  <p>{selectedForm.subject}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-1">Message</h4>
                <p className="whitespace-pre-wrap">{selectedForm.message}</p>
              </div>

              {selectedForm.notes && (
                <div>
                  <h4 className="font-medium mb-1">Internal Notes</h4>
                  <p className="whitespace-pre-wrap">{selectedForm.notes}</p>
                </div>
              )}

              {selectedForm.attachments && (
                <div>
                  <h4 className="font-medium mb-1">Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(selectedForm.attachments).map((attachment: string, index: number) => (
                      <a
                        key={index}
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Attachment {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selectedForm.responses.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Responses</h4>
                  <div className="space-y-4">
                    {selectedForm.responses.map((response) => (
                      <div key={response.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">{response.respondedBy}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(response.createdAt), "MMM dd, yyyy HH:mm")}
                          </p>
                        </div>
                        <p className="whitespace-pre-wrap">{response.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Sheet */}
      <Sheet open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Update Status</SheetTitle>
            <SheetDescription>
              Update the status and add notes to this contact form
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Internal Notes</label>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add internal notes here..."
                className="min-h-[100px]"
              />
            </div>

            <Button 
              className="w-full" 
              onClick={handleUpdateStatus}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the contact form
              and all associated responses.
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