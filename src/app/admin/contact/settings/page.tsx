"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Building2, Phone, Mail, Clock, MapPin, Trash2, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// 定义表单验证schema
const formSchema = z.object({
  headquarters: z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "ZIP Code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  contact: z.object({
    salesPhone: z.string().min(1, "Sales phone is required"),
    supportPhone: z.string().min(1, "Support phone is required"),
    salesEmail: z.string().email("Invalid sales email"),
    supportEmail: z.string().email("Invalid support email"),
  }),
  businessHours: z.object({
    weekday: z.string().min(1, "Weekday hours are required"),
    support: z.string().min(1, "Support hours are required"),
  }),
})

const officeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  address: z.string().min(1, "Address is required"),
})

type Office = {
  id: string
  name: string
  location: string
  address: string
  status: boolean
}

export default function ContactSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [offices, setOffices] = useState<Office[]>([])
  const [isAddOfficeOpen, setIsAddOfficeOpen] = useState(false)
  const [newOffice, setNewOffice] = useState({
    name: "",
    location: "",
    address: "",
  })
  const [isAddingOffice, setIsAddingOffice] = useState(false)

  // 初始化表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      headquarters: {
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      contact: {
        salesPhone: "",
        supportPhone: "",
        salesEmail: "",
        supportEmail: "",
      },
      businessHours: {
        weekday: "",
        support: "",
      },
    },
  })

  // 加载设置和办公室数据
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setIsLoading(true)

      // 加载设置
      const settingsRes = await fetch("/api/contact/settings")
      const settingsData = await settingsRes.json()

      const settings: any = {}
      settingsData.forEach((setting: any) => {
        settings[setting.type] = JSON.parse(setting.data)
      })

      form.reset({
        headquarters: settings.headquarters || form.getValues("headquarters"),
        contact: settings.contact || form.getValues("contact"),
        businessHours: settings.businessHours || form.getValues("businessHours"),
      })

      // 加载办公室
      const officesRes = await fetch("/api/contact/offices")
      const officesData = await officesRes.json()
      setOffices(officesData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Failed to load settings")
    } finally {
      setIsLoading(false)
    }
  }

  // 表单提交处理
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSaving(true)

      // 保存总部信息
      await fetch("/api/contact/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "headquarters",
          data: JSON.stringify(values.headquarters),
        }),
      })

      // 保存联系信息
      await fetch("/api/contact/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          data: JSON.stringify(values.contact),
        }),
      })

      // 保存营业时间
      await fetch("/api/contact/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "businessHours",
          data: JSON.stringify(values.businessHours),
        }),
      })

      toast.success("Settings saved successfully")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  // 添加办公室
  async function handleAddOffice() {
    try {
      const validated = officeSchema.parse(newOffice)
      setIsAddingOffice(true)

      const response = await fetch("/api/contact/offices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      })

      if (!response.ok) throw new Error("Failed to add office")

      setIsAddOfficeOpen(false)
      setNewOffice({ name: "", location: "", address: "" })
      loadData()
      toast.success("Office added successfully")
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message)
      } else {
        console.error("Error adding office:", error)
        toast.error("Failed to add office")
      }
    } finally {
      setIsAddingOffice(false)
    }
  }

  // 更新办公室状态
  async function handleToggleOfficeStatus(id: string, status: boolean) {
    try {
      const response = await fetch("/api/contact/offices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: !status }),
      })

      if (!response.ok) throw new Error("Failed to update office")

      loadData()
      toast.success("Office status updated")
    } catch (error) {
      console.error("Error updating office:", error)
      toast.error("Failed to update office status")
    }
  }

  // 删除办公室
  async function handleDeleteOffice(id: string) {
    if (!confirm("Are you sure you want to delete this office?")) return

    try {
      const response = await fetch(`/api/contact/offices?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete office")

      loadData()
      toast.success("Office deleted successfully")
    } catch (error) {
      console.error("Error deleting office:", error)
      toast.error("Failed to delete office")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contact Page Settings</h1>
        <Button 
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          {/* Headquarters Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Headquarters</h2>
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="headquarters.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="headquarters.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="headquarters.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="headquarters.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="headquarters.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Contact Information</h2>
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contact.salesPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sales Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact.supportPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contact.salesEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sales Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact.supportEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Card>

          {/* Business Hours */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Business Hours</h2>
            </div>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="businessHours.weekday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekday Hours</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessHours.support"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Hours</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>
        </form>
      </Form>

      {/* Global Offices */}
      <Card className="p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Global Offices</h2>
          </div>
          <Button onClick={() => setIsAddOfficeOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Office
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offices.map((office) => (
              <TableRow key={office.id}>
                <TableCell>{office.name}</TableCell>
                <TableCell>{office.location}</TableCell>
                <TableCell>{office.address}</TableCell>
                <TableCell>
                  <Switch
                    checked={office.status}
                    onCheckedChange={() => handleToggleOfficeStatus(office.id, office.status)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500"
                    onClick={() => handleDeleteOffice(office.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add Office Dialog */}
      <Dialog open={isAddOfficeOpen} onOpenChange={setIsAddOfficeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Office</DialogTitle>
            <DialogDescription>
              Add a new global office location
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Office Name</label>
              <Input
                value={newOffice.name}
                onChange={(e) => setNewOffice({ ...newOffice, name: e.target.value })}
                placeholder="e.g., Europe Office"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                value={newOffice.location}
                onChange={(e) => setNewOffice({ ...newOffice, location: e.target.value })}
                placeholder="e.g., Munich, Germany"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={newOffice.address}
                onChange={(e) => setNewOffice({ ...newOffice, address: e.target.value })}
                placeholder="Full address"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddOfficeOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddOffice}
              disabled={isAddingOffice}
            >
              {isAddingOffice ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Office"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 