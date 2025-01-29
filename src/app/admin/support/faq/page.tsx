'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data - will be replaced with API calls
const mockFaqs = [
  {
    id: "1",
    question: "How do I get started?",
    answer: "Follow our quick start guide to begin using our platform...",
    category: "Getting Started",
    order: 1,
    status: "Published",
  },
  {
    id: "2",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers...",
    category: "Billing",
    order: 2,
    status: "Published",
  },
  {
    id: "3",
    question: "How can I contact support?",
    answer: "You can reach our support team through email, phone, or live chat...",
    category: "Support",
    order: 3,
    status: "Draft",
  },
]

const categories = ["All", "Getting Started", "Features", "Billing", "Support", "Security", "Integration"]

export default function FAQPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [faqs, setFaqs] = React.useState(mockFaqs)

  // Handle search and filtering
  React.useEffect(() => {
    let filtered = mockFaqs
    
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }
    
    setFaqs(filtered)
  }, [searchQuery, selectedCategory])

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return
    
    try {
      // TODO: Implement delete logic
      console.log('Deleting FAQ:', id)
      setFaqs(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Failed to delete FAQ:', error)
    }
  }

  // Get status style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Published':
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
        {faqs.map((faq) => (
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
        ))}
      </div>
    </div>
  )
} 