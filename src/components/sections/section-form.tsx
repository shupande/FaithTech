'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MediaUpload } from "@/components/ui/media-upload"
import { CTAEditor } from "@/components/ui/cta-editor"
import { handleApiError } from "@/lib/api/error"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconPicker } from "@/components/ui/icon-picker"

interface Media {
  url: string
  type: 'image' | 'video'
  thumbnail?: string
  duration?: number
}

interface Feature {
  id: string
  title: string
  description: string
  icon?: string
}

interface MapPoint {
  id: string
  start: {
    lat: number
    lng: number
  }
  end: {
    lat: number
    lng: number
  }
}

interface Action {
  text: string
  href: string
  variant: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
}

interface Section {
  id?: string
  name: string
  title: string
  description: string
  badge?: {
    text: string
    action?: {
      text: string
      href: string
    }
  } | null
  actions?: any
  media?: Media[] | null
  features?: any[]
  mapPoints?: any[]
  status: string
  featureTitle?: string
  featureSubtitle?: string
  mapTitle?: string
  mapSubtitle?: string
}

interface SectionFormProps {
  section?: Section
  isEdit?: boolean
}

export function SectionForm({ section: initialSection, isEdit }: SectionFormProps) {
  const router = useRouter()
  const [section, setSection] = React.useState<Section>(() => {
    const section = initialSection || {
      name: '',
      title: '',
      description: '',
      badge: null,
      actions: [],
      media: [],
      features: [],
      mapPoints: [],
      status: 'Active'
    }

    // 确保 media 是数组
    if (section.media && typeof section.media === 'string') {
      try {
        section.media = JSON.parse(section.media)
      } catch (e) {
        console.error('Error parsing media:', e)
        section.media = []
      }
    }
    
    // 如果 media 不是数组，将其转换为数组
    if (section.media && !Array.isArray(section.media)) {
      section.media = [section.media]
    }

    // 解析 mapPoints
    if (section.mapPoints && typeof section.mapPoints === 'string') {
      try {
        section.mapPoints = JSON.parse(section.mapPoints)
        if (!Array.isArray(section.mapPoints)) {
          section.mapPoints = []
        }
        // 确保每个地图点都有正确的结构
        section.mapPoints = section.mapPoints.map((point: any) => ({
          id: point.id || crypto.randomUUID(),
          start: {
            lat: point.start?.lat || 0,
            lng: point.start?.lng || 0
          },
          end: {
            lat: point.end?.lat || 0,
            lng: point.end?.lng || 0
          }
        }))
      } catch (e) {
        console.error('Error parsing mapPoints:', e)
        section.mapPoints = []
      }
    } else if (!Array.isArray(section.mapPoints)) {
      section.mapPoints = []
    }

    return section
  })
  const [isSaving, setIsSaving] = React.useState(false)

  const handleAddFeature = () => {
    setSection({
      ...section,
      features: [
        ...(section.features || []),
        {
          id: crypto.randomUUID(),
          title: '',
          description: '',
          icon: ''
        }
      ]
    })
  }

  const handleFeatureChange = (id: string, field: keyof Feature, value: string) => {
    setSection({
      ...section,
      features: section.features?.map(feature =>
        feature.id === id ? { ...feature, [field]: value } : feature
      )
    })
  }

  const handleRemoveFeature = (id: string) => {
    setSection({
      ...section,
      features: section.features?.filter(feature => feature.id !== id)
    })
  }

  const handleAddMapPoint = () => {
    setSection({
      ...section,
      mapPoints: [
        ...(section.mapPoints || []),
        {
          id: crypto.randomUUID(),
          start: {
            lat: 0,
            lng: 0
          },
          end: {
            lat: 0,
            lng: 0
          }
        }
      ]
    })
  }

  const handleMapPointChange = (id: string, field: string, value: number) => {
    setSection(prev => ({
      ...prev,
      mapPoints: prev.mapPoints?.map(point =>
        point.id === id
          ? {
              ...point,
              start: {
                ...point.start,
                lat: field === 'start.lat' ? value : point.start?.lat || 0,
                lng: field === 'start.lng' ? value : point.start?.lng || 0,
              },
              end: {
                ...point.end,
                lat: field === 'end.lat' ? value : point.end?.lat || 0,
                lng: field === 'end.lng' ? value : point.end?.lng || 0,
              }
            }
          : point
      ) || []
    }))
  }

  const handleRemoveMapPoint = (id: string) => {
    setSection({
      ...section,
      mapPoints: section.mapPoints?.filter(point => point.id !== id)
    })
  }

  const handleMediaChange = (newMedia: Media) => {
    setSection(prev => ({
      ...prev,
      media: Array.isArray(prev.media) ? [...prev.media, newMedia] : [newMedia]
    }))
  }

  const handleRemoveMedia = (index: number) => {
    setSection(prev => ({
      ...prev,
      media: prev.media?.filter((_, i) => i !== index) || []
    }))
  }

  const handleReorderMedia = (result: any) => {
    if (!result.destination) return

    const media = Array.from(section.media || [])
    const [reorderedItem] = media.splice(result.source.index, 1)
    media.splice(result.destination.index, 0, reorderedItem)

    setSection(prev => ({
      ...prev,
      media
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setIsSaving(true)

      // 准备提交的数据
      const submitData = {
        ...section,
        badge: section.badge ? JSON.stringify(section.badge) : null,
        actions: typeof section.actions === 'string' ? section.actions : JSON.stringify(section.actions),
        media: section.media ? JSON.stringify(section.media) : null,
        features: section.features ? JSON.stringify(section.features) : null,
        mapPoints: Array.isArray(section.mapPoints) ? JSON.stringify(section.mapPoints) : null
      }

      console.log('Submitting data:', submitData)

      const response = await fetch(
        isEdit ? `/api/homepage/${section.id}` : '/api/homepage',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        }
      )

      const responseData = await response.json()
      console.log('Server response:', responseData)

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Failed to save section')
      }

      toast.success(isEdit ? 'Section updated successfully' : 'Section created successfully')
      router.push('/admin/homepage')
      router.refresh()
    } catch (error) {
      console.error(isEdit ? 'Failed to update section:' : 'Failed to create section:', error)
      handleApiError(error, isEdit ? 'Failed to update section' : 'Failed to create section')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
      <Card className="p-6">
        <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Section Name</Label>
            <Input
              id="name"
              value={section.name}
              onChange={(e) => setSection({ ...section, name: e.target.value })}
                  placeholder="hero-section"
              required
            />
                <p className="text-sm text-muted-foreground">
                  A unique identifier for this section
                </p>
          </div>

              <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={section.title}
              onChange={(e) => setSection({ ...section, title: e.target.value })}
                  placeholder="Welcome to Our Website"
              required
            />
                <p className="text-sm text-muted-foreground">
                  The main heading of the section
                </p>
          </div>

              <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={section.description}
              onChange={(e) => setSection({ ...section, description: e.target.value })}
                  placeholder="Enter a compelling description..."
              required
            />
                <p className="text-sm text-muted-foreground">
                  A brief description that appears below the title
                </p>
          </div>

              <div className="grid gap-2">
                <Label htmlFor="badge">Badge Text</Label>
            <Input
              id="badge"
                  value={section.badge?.text || ''}
                  onChange={(e) => setSection({ ...section, badge: { ...section.badge, text: e.target.value } })}
                  placeholder="New Feature"
                />
                <p className="text-sm text-muted-foreground">
                  Optional badge text to display above the title
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Call-to-Action Buttons</Label>
                <CTAEditor
                  value={Array.isArray(section.actions) ? section.actions : 
                         typeof section.actions === 'string' ? JSON.parse(section.actions) : []}
                  onChange={(buttons) => setSection({ ...section, actions: buttons })}
                />
                <p className="text-sm text-muted-foreground">
                  Add and arrange call-to-action buttons
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4 mt-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Hero Media</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('media-upload')?.click()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Media
                  </Button>
                </div>
                
                <DragDropContext onDragEnd={handleReorderMedia}>
                  <Droppable droppableId="media">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                      >
                        {(Array.isArray(section.media) ? section.media : []).map((item, index) => (
                          <Draggable
                            key={item.url}
                            draggableId={item.url}
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
                                  className="mt-3 cursor-move"
                                >
                                  <GripVertical className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="relative aspect-video w-40 rounded overflow-hidden">
                                  {item.type === 'video' ? (
                                    item.thumbnail ? (
                                      <Image
                                        src={item.thumbnail}
                                        alt=""
                                        fill
                                        className="object-cover"
                                      />
                                    ) : (
                                      <video
                                        src={item.url}
                                        className="w-full h-full object-cover"
                                      />
                                    )
                                  ) : (
                                    <Image
                                      src={item.url}
                                      alt=""
                                      fill
                                      className="object-cover"
                                    />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    {item.type === 'video' ? 'Video' : 'Image'}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate">
                                    {item.url.split('/').pop()}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveMedia(index)}
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

                <div className="hidden">
                  <MediaUpload
                    id="media-upload"
                    currentMedia={null}
                    onMediaChange={handleMediaChange}
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  Upload high-quality images or videos for the hero section
                  <br />
                  Recommended image size: 1920x1080px
                  <br />
                  Recommended video length: 30-60 seconds
                  <br />
                  Note: Videos under 5 seconds will auto-play and loop
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4 mt-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Feature Section Title</Label>
                <Input
                  value={section.featureTitle || ""}
                  onChange={(e) => setSection({ ...section, featureTitle: e.target.value })}
                  placeholder="Key Features"
                />
                <p className="text-sm text-muted-foreground">
                  The main heading for the features section
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Feature Section Subtitle</Label>
                <Textarea
                  value={section.featureSubtitle || ""}
                  onChange={(e) => setSection({ ...section, featureSubtitle: e.target.value })}
                  placeholder="Discover what makes our solutions stand out"
                />
                <p className="text-sm text-muted-foreground">
                  A brief description below the features heading
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label>Features</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddFeature}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
              
              <DragDropContext onDragEnd={() => {}}>
                <Droppable droppableId="features">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {section.features?.map((feature, index) => (
                        <Draggable
                          key={feature.id}
                          draggableId={feature.id}
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
                                className="mt-3 cursor-move"
                              >
                                <GripVertical className="h-5 w-5 text-gray-400" />
                              </div>
                              <div className="flex-1 space-y-4">
                                <div className="grid gap-2">
                                  <Label>Title</Label>
                                  <Input
                                    value={feature.title}
                                    onChange={(e) => handleFeatureChange(feature.id, 'title', e.target.value)}
                                    placeholder="Feature Title"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Description</Label>
                                  <Textarea
                                    value={feature.description}
                                    onChange={(e) => handleFeatureChange(feature.id, 'description', e.target.value)}
                                    placeholder="Feature Description"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Icon</Label>
                                  <IconPicker
                                    value={feature.icon || ''}
                                    onChange={(value) => handleFeatureChange(feature.id, 'icon', value)}
                                  />
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveFeature(feature.id)}
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
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4 mt-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Map Section Title</Label>
                <Input
                  value={section.mapTitle || ""}
                  onChange={(e) => setSection({ ...section, mapTitle: e.target.value })}
                  placeholder="Remote Connectivity"
                />
                <p className="text-sm text-muted-foreground">
                  The main heading for the map section
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Map Section Subtitle</Label>
                <Textarea
                  value={section.mapSubtitle || ""}
                  onChange={(e) => setSection({ ...section, mapSubtitle: e.target.value })}
                  placeholder="Break free from traditional boundaries. Work from anywhere, at the comfort of your own studio apartment. Perfect for Nomads and Travellers."
                />
                <p className="text-sm text-muted-foreground">
                  A brief description below the map heading
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label>Map Points</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddMapPoint}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>
              
              <div className="space-y-4">
                {section.mapPoints?.map((point) => (
                  <div key={point.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <Label>Start Point</Label>
                          <div className="grid gap-2">
                            <Label>Latitude</Label>
                            <Input
                              type="number"
                              value={point.start?.lat || 0}
                              onChange={(e) => handleMapPointChange(point.id, 'start.lat', parseFloat(e.target.value))}
                              placeholder="Latitude"
                              step="any"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Longitude</Label>
                            <Input
                              type="number"
                              value={point.start?.lng || 0}
                              onChange={(e) => handleMapPointChange(point.id, 'start.lng', parseFloat(e.target.value))}
                              placeholder="Longitude"
                              step="any"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <Label>End Point</Label>
                          <div className="grid gap-2">
                            <Label>Latitude</Label>
                            <Input
                              type="number"
                              value={point.end?.lat || 0}
                              onChange={(e) => handleMapPointChange(point.id, 'end.lat', parseFloat(e.target.value))}
                              placeholder="Latitude"
                              step="any"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Longitude</Label>
                            <Input
                              type="number"
                              value={point.end?.lng || 0}
                              onChange={(e) => handleMapPointChange(point.id, 'end.lng', parseFloat(e.target.value))}
                              placeholder="Longitude"
                              step="any"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMapPoint(point.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={section.status}
              onChange={(e) => setSection({ ...section, status: e.target.value })}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
                <p className="text-sm text-muted-foreground">
                  Control whether this section is visible on the website
                </p>
          </div>
        </div>
      </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/homepage')}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Section')}
        </Button>
      </div>
    </form>
  )
} 