'use client'

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Download, FileType, Star, Search } from "lucide-react"
import { prisma } from "@/lib/prisma"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

interface DownloadItem {
  id: string
  title: string
  description: string
  category: string
  version?: string | null
  fileUrl: string
  fileSize?: string | null
  fileType?: string | null
  thumbnail?: string | null
  featured: boolean
  downloads: number
  status: string
}

export default function DownloadsPage() {
  const [downloads, setDownloads] = React.useState<DownloadItem[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchDownloads() {
      try {
        const response = await fetch('/api/downloads')
        const data = await response.json()
        setDownloads(data)
      } catch (error) {
        console.error('Failed to fetch downloads:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDownloads()
  }, [])

  // Filter downloads based on search query
  const filteredDownloads = React.useMemo(() => {
    if (!searchQuery.trim()) return downloads

    const query = searchQuery.toLowerCase()
    return downloads.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    )
  }, [downloads, searchQuery])

  const categories = React.useMemo(() => 
    Array.from(new Set(downloads.map(d => d.category))),
    [downloads]
  )

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading downloads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-muted/50 to-muted py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Download Center</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access our comprehensive collection of software, tools, and documentation to enhance your experience
            </p>
          </div>
          
          {/* Search Box */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                type="search"
                placeholder="Search downloads..."
                className="w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="flex justify-center mb-8">
            <TabsTrigger value="all">All Downloads</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDownloads.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No downloads found</p>
                </div>
              ) : (
                filteredDownloads.map((item) => (
                  <DownloadCard key={item.id} item={item} />
                ))
              )}
            </div>
          </TabsContent>

          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredDownloads
                  .filter(item => item.category === category)
                  .map((item) => (
                    <DownloadCard key={item.id} item={item} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

function DownloadCard({ item }: { item: DownloadItem }) {
  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          {item.featured && (
            <Badge variant="secondary" className="mb-2">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {item.version && (
            <Badge variant="outline">v{item.version}</Badge>
          )}
        </div>
        <div className="flex items-start gap-4">
          {item.thumbnail ? (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <FileType className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div>
            <CardTitle>{item.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {item.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {item.fileSize && (
            <span>{item.fileSize}</span>
          )}
          {item.fileType && (
            <Badge variant="secondary">{item.fileType}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={item.fileUrl}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
} 