'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  status: string
}

const categories = ["All", "General", "Technical", "Applications", "Services", "Support"]

export default function FAQPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [faqs, setFaqs] = React.useState<FAQ[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // 加载 FAQ 数据
  React.useEffect(() => {
    const fetchFAQs = async () => {
      try {
        let url = '/api/faq?'
        const params = new URLSearchParams()
        
        if (searchQuery) {
          params.append('search', searchQuery)
        }
        if (selectedCategory !== 'All') {
          params.append('category', selectedCategory)
        }

        const response = await fetch(url + params.toString())
        if (!response.ok) {
          throw new Error('Failed to fetch FAQs')
        }
        const result = await response.json()
        if (result.success) {
          setFaqs(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch FAQs:', error)
        toast.error('Failed to load FAQs')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFAQs()
  }, [searchQuery, selectedCategory])

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return
    
    try {
      const response = await fetch(`/api/faq/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete FAQ')
      }

      const result = await response.json()
      if (result.success) {
        toast.success('FAQ deleted successfully')
        setFaqs(prev => prev.filter(item => item.id !== id))
      } else {
        throw new Error(result.message || 'Failed to delete FAQ')
      }
    } catch (error) {
      console.error('Failed to delete FAQ:', error)
      toast.error('Failed to delete FAQ')
    }
  }

  // Get status style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700'
      case 'Draft':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">FAQ Management</h1>
        <Button onClick={() => router.push('/admin/support/faq/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="space-y-4">
        {isLoading ? (
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          </Card>
        ) : faqs.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-gray-500">
              No FAQs found
            </div>
          </Card>
        ) : (
          faqs.map((faq) => (
            <Card key={faq.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="text-gray-400 cursor-move">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">#{faq.order}</span>
                    <h2 className="text-lg font-semibold">{faq.question}</h2>
                    <span className={`text-sm px-2 py-0.5 rounded-full ${getStatusStyle(faq.status)}`}>
                      {faq.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span>{faq.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/support/faq/${faq.id}`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(faq.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 