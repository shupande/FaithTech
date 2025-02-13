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
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { toast } from "sonner"
import { PlusCircle, Mail, Loader2, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type NotificationConfig = {
  id: string
  name: string
  type: string
  description: string
  emails: string
  enabled: boolean
  createdAt: string
}

type SmtpStatus = {
  configured: boolean
  message: string
}

export default function EmailNotificationsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [configs, setConfigs] = useState<NotificationConfig[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedConfig, setSelectedConfig] = useState<NotificationConfig | null>(null)
  const [newConfig, setNewConfig] = useState({
    name: "",
    type: "",
    description: "",
    emails: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [smtpStatus, setSmtpStatus] = useState<SmtpStatus>()

  // 加载通知配置和SMTP状态
  useEffect(() => {
    loadConfigs()
    checkSmtpStatus()
  }, [])

  async function checkSmtpStatus() {
    try {
      const response = await fetch('/api/settings/smtp/check')
      const data = await response.json()
      setSmtpStatus(data)
    } catch (error) {
      console.error("Error checking SMTP status:", error)
      setSmtpStatus({
        configured: false,
        message: "Failed to check SMTP status"
      })
    }
  }

  async function loadConfigs() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/contact/notifications")
      if (!response.ok) throw new Error("Failed to fetch configurations")
      
      const data = await response.json()
      setConfigs(data)
    } catch (error) {
      console.error("Error loading configurations:", error)
      toast.error("Failed to load notification configurations")
    } finally {
      setIsLoading(false)
    }
  }

  // 添加新配置
  async function handleAddConfig() {
    try {
      setIsSubmitting(true)
      const emailList = newConfig.emails.split(",").map(email => email.trim())

      const response = await fetch("/api/contact/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newConfig,
          emails: JSON.stringify(emailList),
        }),
      })

      if (!response.ok) throw new Error("Failed to add configuration")

      setIsAddOpen(false)
      setNewConfig({ name: "", type: "", description: "", emails: "" })
      loadConfigs()
      toast.success("Configuration added successfully")
    } catch (error) {
      console.error("Error adding configuration:", error)
      toast.error("Failed to add configuration")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 更新配置
  async function handleUpdateConfig() {
    if (!selectedConfig) return

    try {
      setIsSubmitting(true)
      const emailList = selectedConfig.emails

      const response = await fetch("/api/contact/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedConfig.id,
          name: selectedConfig.name,
          type: selectedConfig.type,
          description: selectedConfig.description,
          emails: JSON.stringify(emailList),
        }),
      })

      if (!response.ok) throw new Error("Failed to update configuration")

      setIsEditOpen(false)
      loadConfigs()
      toast.success("Configuration updated successfully")
    } catch (error) {
      console.error("Error updating configuration:", error)
      toast.error("Failed to update configuration")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 切换启用状态
  async function handleToggleStatus(id: string, enabled: boolean) {
    try {
      const response = await fetch("/api/contact/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          enabled: !enabled,
        }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      loadConfigs()
      toast.success("Status updated successfully")
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update status")
    }
  }

  // 测试通知
  async function handleTestNotification(id: string) {
    if (!smtpStatus?.configured) {
      toast.error("SMTP is not configured. Please configure SMTP settings first.")
      return
    }

    try {
      setIsTesting(true)
      const response = await fetch(`/api/contact/notifications/test?id=${id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to send test notification")
      }

      toast.success("Test notification sent successfully")
    } catch (error) {
      console.error("Error sending test notification:", error)
      toast.error(error instanceof Error ? error.message : "Failed to send test notification")
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Email Notifications</h1>
        <Button onClick={() => setIsAddOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Configuration
        </Button>
      </div>

      {/* SMTP Status Alert */}
      {!smtpStatus?.configured && (
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>SMTP Not Configured</AlertTitle>
          <AlertDescription>
            Email notifications will not be sent until SMTP is configured.{" "}
            <Link href="/admin/settings" className="underline">
              Configure SMTP Settings
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Configurations Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Status</TableHead>
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
            ) : configs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No notification configurations found
                </TableCell>
              </TableRow>
            ) : (
              configs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell className="font-medium">{config.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {config.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{config.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {JSON.parse(config.emails).map((email: string, index: number) => (
                        <span key={index} className="text-sm">
                          {email}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={config.enabled}
                      onCheckedChange={() => handleToggleStatus(config.id, config.enabled)}
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(config.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedConfig({
                            ...config,
                            emails: JSON.parse(config.emails)
                          })
                          setIsEditOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTestNotification(config.id)}
                        disabled={isTesting || !config.enabled}
                      >
                        {isTesting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                        Test
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Add Configuration Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Configuration</DialogTitle>
            <DialogDescription>
              Create a new email notification configuration
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newConfig.name}
                onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
                placeholder="e.g., New Contact Form Notification"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Type</label>
              <Input
                value={newConfig.type}
                onChange={(e) => setNewConfig({ ...newConfig, type: e.target.value })}
                placeholder="e.g., new_contact"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newConfig.description}
                onChange={(e) => setNewConfig({ ...newConfig, description: e.target.value })}
                placeholder="Describe when this notification will be sent"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Recipients (comma separated)</label>
              <Input
                value={newConfig.emails}
                onChange={(e) => setNewConfig({ ...newConfig, emails: e.target.value })}
                placeholder="e.g., admin@example.com, sales@example.com"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddConfig}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Configuration"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Configuration Sheet */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Configuration</SheetTitle>
            <SheetDescription>
              Update the notification configuration
            </SheetDescription>
          </SheetHeader>

          {selectedConfig && (
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={selectedConfig.name}
                  onChange={(e) => setSelectedConfig({
                    ...selectedConfig,
                    name: e.target.value,
                  })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Input
                  value={selectedConfig.type}
                  onChange={(e) => setSelectedConfig({
                    ...selectedConfig,
                    type: e.target.value,
                  })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={selectedConfig.description}
                  onChange={(e) => setSelectedConfig({
                    ...selectedConfig,
                    description: e.target.value,
                  })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipients (comma separated)</label>
                <Input
                  value={Array.isArray(selectedConfig.emails) ? selectedConfig.emails.join(", ") : selectedConfig.emails}
                  onChange={(e) => setSelectedConfig({
                    ...selectedConfig,
                    emails: JSON.stringify(e.target.value.split(",").map(email => email.trim())),
                  })}
                />
              </div>

              <Button
                className="w-full mt-6"
                onClick={handleUpdateConfig}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Configuration"
                )}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
} 