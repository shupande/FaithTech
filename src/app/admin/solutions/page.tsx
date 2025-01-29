'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

// 模拟数据 - 之后会替换为API调用
const mockSolutions = [
  {
    id: "1",
    title: "Enterprise Solution",
    category: "Enterprise",
    status: "Active",
    summary: "Comprehensive enterprise solution for large organizations",
  },
  {
    id: "2",
    title: "Cloud Integration",
    category: "Cloud",
    status: "Featured",
    summary: "Seamless cloud integration services for modern businesses",
  },
  {
    id: "3",
    title: "Data Analytics",
    category: "Analytics",
    status: "Draft",
    summary: "Advanced data analytics and visualization platform",
  },
]

export default function SolutionsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [solutions, setSolutions] = React.useState(mockSolutions)

  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    // 简单的客户端搜索
    const filtered = mockSolutions.filter(solution => 
      solution.title.toLowerCase().includes(query.toLowerCase()) ||
      solution.category.toLowerCase().includes(query.toLowerCase()) ||
      solution.summary.toLowerCase().includes(query.toLowerCase())
    )
    setSolutions(filtered)
  }

  // 处理删除
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this solution?')) return
    
    try {
      // TODO: 实现删除逻辑
      console.log('Deleting solution:', id)
      setSolutions(prev => prev.filter(s => s.id !== id))
    } catch (error) {
      console.error('Failed to delete solution:', error)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Solutions</h1>
        <Button onClick={() => router.push('/admin/solutions/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Solution
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search solutions..."
            value={searchQuery}
            onChange={handleSearch}
            className="max-w-sm"
          />
        </div>
      </Card>

      <div className="grid gap-4">
        {solutions.map((solution) => (
          <Card key={solution.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{solution.title}</h2>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${
                    solution.status === 'Featured' ? 'bg-blue-100 text-blue-700' :
                    solution.status === 'Active' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {solution.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{solution.category}</p>
                <p className="text-sm">{solution.summary}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/admin/solutions/${solution.id}`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(solution.id)}
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