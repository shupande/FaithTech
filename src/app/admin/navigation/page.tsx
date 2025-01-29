'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, GripVertical, Pencil, Trash2, ChevronDown } from "lucide-react"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

// Mock data - will be replaced with API calls
const mockNavigation = [
  {
    id: "1",
    title: "Home",
    path: "/",
    isVisible: true,
    type: "page",
    order: 1,
  },
  {
    id: "2",
    title: "Products",
    path: "/products",
    isVisible: true,
    type: "section",
    order: 2,
    children: [
      {
        id: "2-1",
        title: "Product A",
        path: "/products/product-a",
        isVisible: true,
      },
      {
        id: "2-2",
        title: "Product B",
        path: "/products/product-b",
        isVisible: true,
      }
    ]
  },
  {
    id: "3",
    title: "Solutions",
    path: "/solutions",
    isVisible: true,
    type: "section",
    order: 3,
  },
  {
    id: "4",
    title: "Services",
    path: "/services",
    isVisible: true,
    type: "section",
    order: 4,
  },
  {
    id: "5",
    title: "News",
    path: "/news",
    isVisible: true,
    type: "section",
    order: 5,
  }
]

export default function NavigationPage() {
  const router = useRouter()
  const [items, setItems] = React.useState(mockNavigation)
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])

  // Handle drag end
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const newItems = Array.from(items)
    const [reorderedItem] = newItems.splice(result.source.index, 1)
    newItems.splice(result.destination.index, 0, reorderedItem)

    // Update order
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1
    }))

    setItems(updatedItems)
  }

  // Toggle item visibility
  const toggleVisibility = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isVisible: !item.isVisible }
      }
      if (item.children) {
        return {
          ...item,
          children: item.children.map(child => 
            child.id === id ? { ...child, isVisible: !child.isVisible } : child
          )
        }
      }
      return item
    }))
  }

  // Toggle expanded state
  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Navigation Menu</h1>
        <Button onClick={() => router.push('/admin/navigation/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      <Card className="p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="navigation">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <div className="flex items-center gap-4 p-3 bg-white rounded-lg border">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.title}</span>
                              <Badge variant="secondary" className="text-xs">
                                {item.type}
                              </Badge>
                              {item.children && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleExpanded(item.id)}
                                >
                                  <ChevronDown className={`h-4 w-4 transition-transform ${
                                    expandedItems.includes(item.id) ? 'rotate-180' : ''
                                  }`} />
                                </Button>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {item.path}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={item.isVisible}
                              onCheckedChange={() => toggleVisibility(item.id)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/navigation/${item.id}`)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {/* TODO: Implement delete */}}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {item.children && expandedItems.includes(item.id) && (
                          <div className="ml-8 mt-2 space-y-2">
                            {item.children.map((child) => (
                              <div
                                key={child.id}
                                className="flex items-center gap-4 p-3 bg-white rounded-lg border"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{child.title}</span>
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {child.path}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={child.isVisible}
                                    onCheckedChange={() => toggleVisibility(child.id)}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push(`/admin/navigation/${child.id}`)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {/* TODO: Implement delete */}}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Card>
    </div>
  )
} 