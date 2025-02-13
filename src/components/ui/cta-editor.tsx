'use client'

import * as React from "react"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { cn } from "@/lib/utils"

interface CTAButton {
  text: string
  href: string
  variant: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
}

interface CTAEditorProps {
  value: CTAButton[] | string | null
  onChange: (buttons: CTAButton[]) => void
}

const buttonVariants = [
  { value: 'default', label: 'Primary', preview: 'bg-primary text-primary-foreground hover:bg-primary/90' },
  { value: 'secondary', label: 'Secondary', preview: 'bg-secondary text-secondary-foreground hover:bg-secondary/80' },
  { value: 'outline', label: 'Outline', preview: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' },
  { value: 'ghost', label: 'Ghost', preview: 'hover:bg-accent hover:text-accent-foreground' },
  { value: 'link', label: 'Link', preview: 'text-primary underline-offset-4 hover:underline' }
]

export function CTAEditor({ value, onChange }: CTAEditorProps) {
  // Ensure value is always an array of CTAButton objects
  const buttons = React.useMemo(() => {
    if (!value) return []
    if (Array.isArray(value)) return value
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.error('Error parsing CTA buttons:', e)
      return []
    }
  }, [value])

  const handleAdd = () => {
    onChange([
      ...buttons,
      { text: '', href: '', variant: 'default' }
    ])
  }

  const handleRemove = (index: number) => {
    onChange(buttons.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: keyof CTAButton, newValue: string) => {
    const newButtons = [...buttons]
    newButtons[index] = {
      ...newButtons[index],
      [field]: newValue
    }
    onChange(newButtons)
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(buttons)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    onChange(items)
  }

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="cta-buttons">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {buttons.map((button, index) => (
                <Draggable
                  key={index}
                  draggableId={`button-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="mt-8 cursor-move"
                      >
                        <GripVertical className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="grid gap-2">
                          <Label>Button Text</Label>
                          <Input
                            value={button.text}
                            onChange={(e) => handleChange(index, 'text', e.target.value)}
                            placeholder="Get Started"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Link</Label>
                          <Input
                            value={button.href}
                            onChange={(e) => handleChange(index, 'href', e.target.value)}
                            placeholder="/get-started"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Button Style</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                            {buttonVariants.map((variant) => (
                              <button
                                key={variant.value}
                                type="button"
                                onClick={() => handleChange(index, 'variant', variant.value)}
                                className={cn(
                                  'flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                                  variant.preview,
                                  button.variant === variant.value && 'ring-2 ring-ring ring-offset-2'
                                )}
                              >
                                {variant.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <Button
        type="button"
        variant="outline"
        onClick={handleAdd}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Button
      </Button>
    </div>
  )
} 