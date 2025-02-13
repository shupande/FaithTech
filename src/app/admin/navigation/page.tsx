'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  PlusCircle,
  Trash2,
  Edit2,
  Save,
  X,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { NavigationItemType } from "@/lib/api/types"

export default function NavigationManager() {
  const [items, setItems] = useState<NavigationItemType[]>([])
  const [activeSection, setActiveSection] = useState<'header' | 'footer'>('header')
  const [editingItem, setEditingItem] = useState<NavigationItemType | null>(null)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [newItem, setNewItem] = useState({
    label: '',
    url: '',
    parentId: null as string | null,
  })
  const [addingChildTo, setAddingChildTo] = useState<string | null>(null)
  const [newChildItem, setNewChildItem] = useState({
    label: '',
    url: '',
  })

  useEffect(() => {
    fetchItems()
  }, [activeSection])

  const fetchItems = async () => {
    try {
      const response = await fetch(`/api/navigation?type=${activeSection}`)
      const data = await response.json()
      if (data.success) {
        setItems(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch navigation items:', error)
      toast.error('Failed to load navigation items')
    }
  }

  const handleAdd = async () => {
    if (!newItem.label || !newItem.url) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: newItem.label,
          url: newItem.url,
          type: activeSection,
          order: items.length,
          parentId: newItem.parentId || undefined,
          active: true,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setNewItem({ label: '', url: '', parentId: null })
        await fetchItems()
        toast.success('Navigation item added successfully')
      } else {
        // Handle validation errors
        if (data.errors) {
          const errorMessages = data.errors.map((err: any) => err.message).join(', ')
          toast.error(`Validation failed: ${errorMessages}`)
        } else {
          toast.error(data.message || 'Failed to add navigation item')
        }
      }
    } catch (error) {
      console.error('Failed to add navigation item:', error)
      toast.error('Failed to add navigation item')
    }
  }

  const handleUpdate = async (item: NavigationItemType) => {
    try {
      // 只发送已更改的字段
      const updateData: Partial<NavigationItemType> = {}
      
      if (editingItem) {
        // 如果是编辑模式，使用编辑中的值
        updateData.label = editingItem.label
        updateData.url = editingItem.url
      } else {
        // 如果是其他操作（如切换开关），使用传入的值
        if (item.active !== undefined) updateData.active = item.active
        if (item.order !== undefined) updateData.order = item.order
        if (item.parentId !== undefined) updateData.parentId = item.parentId
      }
      
      // 始终保持类型一致
      updateData.type = item.type

      console.log('Sending update:', updateData) // 添加日志

      const response = await fetch(`/api/navigation/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()
      if (data.success) {
        setEditingItem(null)
        await fetchItems()
        toast.success('Navigation item updated successfully')
      } else {
        if (data.errors) {
          const errorMessages = data.errors.map((err: any) => err.message).join(', ')
          toast.error(`Validation failed: ${errorMessages}`)
        } else {
          toast.error(data.message || 'Failed to update navigation item')
        }
      }
    } catch (error) {
      console.error('Failed to update navigation item:', error)
      toast.error('Failed to update navigation item')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/navigation/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        await fetchItems()
        toast.success('Navigation item deleted successfully')
      }
    } catch (error) {
      console.error('Failed to delete navigation item:', error)
      toast.error('Failed to delete navigation item')
    }
  }

  const handleReorder = async (items: NavigationItemType[]) => {
    try {
      const response = await fetch('/api/navigation/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item, index) => ({
            id: item.id,
            order: index,
            parentId: item.parentId,
          })),
        }),
      })

      if (response.ok) {
        await fetchItems()
        toast.success('Navigation order updated successfully')
      }
    } catch (error) {
      console.error('Failed to reorder navigation items:', error)
      toast.error('Failed to update navigation order')
    }
  }

  const moveItem = async (item: NavigationItemType, direction: 'up' | 'down') => {
    // 获取同级别的项目
    const siblingItems = items.filter(i => i.parentId === item.parentId)
    const currentIndex = siblingItems.findIndex(i => i.id === item.id)
    
    if (currentIndex === -1) return
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= siblingItems.length) return
    
    // 交换当前项目和目标位置项目的顺序
    const updatedItems = [...siblingItems]
    const temp = updatedItems[currentIndex].order
    updatedItems[currentIndex].order = updatedItems[newIndex].order
    updatedItems[newIndex].order = temp
    
    // 准备要更新的项目
    const itemsToUpdate = [
      { id: updatedItems[currentIndex].id, order: updatedItems[currentIndex].order, parentId: updatedItems[currentIndex].parentId },
      { id: updatedItems[newIndex].id, order: updatedItems[newIndex].order, parentId: updatedItems[newIndex].parentId }
    ]
    
    try {
      const response = await fetch('/api/navigation/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToUpdate }),
      })

      if (response.ok) {
        await fetchItems()
        toast.success('Navigation order updated successfully')
      } else {
        toast.error('Failed to update navigation order')
      }
    } catch (error) {
      console.error('Failed to reorder navigation items:', error)
      toast.error('Failed to update navigation order')
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleAddChild = async (parentId: string) => {
    if (!newChildItem.label || !newChildItem.url) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: newChildItem.label,
          url: newChildItem.url,
          type: activeSection,
          parentId: parentId,
          order: items.find(item => item.id === parentId)?.children?.length || 0,
          active: true,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setNewChildItem({ label: '', url: '' })
        setAddingChildTo(null)
        await fetchItems()
        toast.success('Child menu item added successfully')
      } else {
        if (data.errors) {
          const errorMessages = data.errors.map((err: any) => err.message).join(', ')
          toast.error(`Validation failed: ${errorMessages}`)
        } else {
          toast.error(data.message || 'Failed to add child menu item')
        }
      }
    } catch (error) {
      console.error('Failed to add child menu item:', error)
      toast.error('Failed to add child menu item')
    }
  }

  const renderNavigationItem = (item: NavigationItemType, depth = 0): JSX.Element => {
    const isExpanded = expandedItems.includes(item.id)
    const hasChildren = item.children && item.children.length > 0
    const isAddingChild = addingChildTo === item.id

    return (
      <>
        <TableRow key={item.id}>
          <TableCell>
            <div className="flex items-center space-x-2" style={{ paddingLeft: `${depth * 2}rem` }}>
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0"
                  onClick={() => toggleExpand(item.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              {editingItem?.id === item.id ? (
                <Input
                  value={editingItem.label}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      label: e.target.value,
                    })
                  }
                  className="w-48"
                />
              ) : (
                <span>{item.label}</span>
              )}
            </div>
          </TableCell>
          <TableCell>
            {editingItem?.id === item.id ? (
              <Input
                value={editingItem.url}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    url: e.target.value,
                  })
                }
                className="w-48"
              />
            ) : (
              item.url
            )}
          </TableCell>
          <TableCell>
            <Switch
              checked={item.active}
              onCheckedChange={(checked) =>
                handleUpdate({ ...item, active: checked })
              }
            />
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveItem(item, 'up')}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveItem(item, 'down')}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              {editingItem?.id === item.id ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdate(editingItem)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingItem(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingItem(item)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAddingChildTo(isAddingChild ? null : item.id)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {isAddingChild && (
          <TableRow>
            <TableCell colSpan={4}>
              <div className="flex items-center space-x-4 pl-8">
                <Input
                  placeholder="Child Label"
                  value={newChildItem.label}
                  onChange={(e) =>
                    setNewChildItem({ ...newChildItem, label: e.target.value })
                  }
                />
                <Input
                  placeholder="Child URL"
                  value={newChildItem.url}
                  onChange={(e) =>
                    setNewChildItem({ ...newChildItem, url: e.target.value })
                  }
                />
                <Button onClick={() => handleAddChild(item.id)}>
                  Add Child
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAddingChildTo(null)
                    setNewChildItem({ label: '', url: '' })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
        {isExpanded &&
          item.children?.map((child) => renderNavigationItem(child, depth + 1))}
      </>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="space-x-2">
          <Button
            variant={activeSection === 'header' ? 'default' : 'outline'}
            onClick={() => setActiveSection('header')}
          >
            Header Navigation
          </Button>
          <Button
            variant={activeSection === 'footer' ? 'default' : 'outline'}
            onClick={() => setActiveSection('footer')}
          >
            Footer Navigation
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Label"
              value={newItem.label}
              onChange={(e) =>
                setNewItem({ ...newItem, label: e.target.value })
              }
            />
            <Input
              placeholder="URL"
              value={newItem.url}
              onChange={(e) =>
                setNewItem({ ...newItem, url: e.target.value })
              }
            />
          </div>
          <Button onClick={handleAdd} className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Navigation Item
          </Button>
        </div>
      </Card>

      <Card className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => renderNavigationItem(item))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
} 