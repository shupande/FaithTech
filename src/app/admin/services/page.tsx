'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

// 模拟数据 - 之后会替换为API调用
const mockServices = [
  {
    id: "1",
    name: "Technical Consulting",
    type: "Professional",
    team: "Engineering",
    availability: "Available",
    description: "Expert technical consulting services for enterprise clients",
  },
  {
    id: "2",
    name: "Implementation Support",
    type: "Support",
    team: "Support",
    availability: "Limited",
    description: "24/7 implementation support for our solutions",
  },
  {
    id: "3",
    name: "Custom Development",
    type: "Development",
    team: "Development",
    availability: "By Request",
    description: "Custom software development services",
  },
]

export default function ServicesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [services, setServices] = React.useState(mockServices)

  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    // 简单的客户端搜索
    const filtered = mockServices.filter(service => 
      service.name.toLowerCase().includes(query.toLowerCase()) ||
      service.type.toLowerCase().includes(query.toLowerCase()) ||
      service.team.toLowerCase().includes(query.toLowerCase()) ||
      service.description.toLowerCase().includes(query.toLowerCase())
    )
    setServices(filtered)
  }

  // 处理删除
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      // TODO: 实现删除逻辑
      console.log('Deleting service:', id)
      setServices(prev => prev.filter(s => s.id !== id))
    } catch (error) {
      console.error('Failed to delete service:', error)
    }
  }

  // 获取类型标签的样式
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Professional':
        return 'bg-purple-100 text-purple-700'
      case 'Support':
        return 'bg-blue-100 text-blue-700'
      case 'Development':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // 获取可用性标签的样式
  const getAvailabilityStyle = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'bg-green-100 text-green-700'
      case 'Limited':
        return 'bg-yellow-100 text-yellow-700'
      case 'By Request':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Services</h1>
        <Button onClick={() => router.push('/admin/services/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={handleSearch}
            className="max-w-sm"
          />
        </div>
      </Card>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{service.name}</h2>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${getTypeStyle(service.type)}`}>
                    {service.type}
                  </span>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${getAvailabilityStyle(service.availability)}`}>
                    {service.availability}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Team: {service.team}</p>
                <p className="text-sm">{service.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/admin/services/${service.id}`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
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