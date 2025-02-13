'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"

interface SocialMediaItem {
  id: number
  platform: string
  url: string
  icon: string
  displayOrder: number
  isActive: boolean
  qrCode?: string
  hasQrCode: boolean
}

// Available social media icons with QR code support
const SOCIAL_ICONS = {
  twitter: { name: 'Twitter', icon: 'twitter', supportsQr: false },
  facebook: { name: 'Facebook', icon: 'facebook', supportsQr: false },
  linkedin: { name: 'LinkedIn', icon: 'linkedin', supportsQr: false },
  youtube: { name: 'YouTube', icon: 'youtube', supportsQr: false },
  instagram: { name: 'Instagram', icon: 'instagram', supportsQr: false },
  tiktok: { name: 'TikTok', icon: 'tiktok', supportsQr: false },
  wechat: { name: 'WeChat', icon: 'wechat', supportsQr: true },
  whatsapp: { name: 'WhatsApp', icon: 'whatsapp', supportsQr: false },
  qq: { name: 'QQ', icon: 'qq', supportsQr: true },
  skype: { name: 'Skype', icon: 'skype', supportsQr: false },
  github: { name: 'GitHub', icon: 'github', supportsQr: false },
  email: { name: 'Email', icon: 'email', supportsQr: false },
  phone: { name: 'Phone', icon: 'phone', supportsQr: false },
} as const

export default function SocialMediaPage() {
  const router = useRouter()
  const [items, setItems] = React.useState<SocialMediaItem[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<SocialMediaItem | null>(null)
  const [selectedIcon, setSelectedIcon] = React.useState<string>(editingItem?.icon || 'twitter')
  const [isActive, setIsActive] = React.useState(editingItem?.isActive ?? true)
  const [selectedQrCode, setSelectedQrCode] = React.useState<File | null>(null)

  // Fetch social media items
  const fetchItems = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/social-media')
      const data = await response.json()
      setItems(data)
    } catch (error) {
      toast.error('Failed to load social media items')
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchItems()
  }, [])

  // Handle save
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Handle QR code upload if needed
    let qrCodeUrl = editingItem?.qrCode
    if (selectedQrCode) {
      try {
        const qrCodeFormData = new FormData()
        qrCodeFormData.append('file', selectedQrCode)
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: qrCodeFormData
        })
        if (!uploadResponse.ok) throw new Error('Failed to upload QR code')
        const { url } = await uploadResponse.json()
        qrCodeUrl = url
      } catch (error) {
        toast.error('Failed to upload QR code')
        return
      }
    }

    const data = {
      platform: formData.get('platform'),
      url: formData.get('url'),
      icon: selectedIcon,
      displayOrder: parseInt(formData.get('displayOrder') as string),
      isActive: isActive,
      qrCode: qrCodeUrl,
      hasQrCode: Boolean(qrCodeUrl)
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/social-media' + (editingItem ? `/${editingItem.id}` : ''), {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Failed to save')
      
      toast.success(editingItem ? 'Updated successfully' : 'Created successfully')
      setIsDialogOpen(false)
      fetchItems()
    } catch (error) {
      toast.error('Failed to save changes')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/social-media/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete')
      
      toast.success('Deleted successfully')
      fetchItems()
    } catch (error) {
      toast.error('Failed to delete item')
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form when dialog opens
  React.useEffect(() => {
    if (isDialogOpen) {
      setSelectedIcon(editingItem?.icon || 'twitter')
      setIsActive(editingItem?.isActive ?? true)
      setSelectedQrCode(null)
    }
  }, [isDialogOpen, editingItem])

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Social Media Management</h1>
        <Button onClick={() => {
          setEditingItem(null)
          setIsDialogOpen(true)
        }}>
          Add New
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Platform</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Display Order</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.platform}</TableCell>
              <TableCell>{item.url}</TableCell>
              <TableCell>{item.displayOrder}</TableCell>
              <TableCell>{item.isActive ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingItem(item)
                      setIsDialogOpen(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit' : 'Add'} Social Media</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Edit the social media details below.' : 'Add a new social media platform.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="platform">Platform</Label>
                <Input
                  id="platform"
                  name="platform"
                  defaultValue={editingItem?.platform}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  name="url"
                  defaultValue={editingItem?.url}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Icon</Label>
                <Select
                  value={selectedIcon}
                  onValueChange={setSelectedIcon}
                >
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        {selectedIcon && Icons[selectedIcon as keyof typeof Icons] && (
                          <div className="w-5 h-5">
                            {React.createElement(Icons[selectedIcon as keyof typeof Icons], { className: "w-full h-full" })}
                          </div>
                        )}
                        {SOCIAL_ICONS[selectedIcon as keyof typeof SOCIAL_ICONS]?.name || selectedIcon}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SOCIAL_ICONS).map(([value, { name, icon }]) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5">
                            {React.createElement(Icons[icon as keyof typeof Icons], { className: "w-full h-full" })}
                          </div>
                          {name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {SOCIAL_ICONS[selectedIcon as keyof typeof SOCIAL_ICONS]?.supportsQr && (
                <div className="grid gap-2">
                  <Label>QR Code</Label>
                  <div className="flex flex-col gap-4">
                    {editingItem?.qrCode && (
                      <div className="relative w-32 h-32">
                        <img
                          src={editingItem.qrCode}
                          alt="QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) setSelectedQrCode(file)
                      }}
                    />
                  </div>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  defaultValue={editingItem?.displayOrder || 0}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 