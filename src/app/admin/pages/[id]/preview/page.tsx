'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Eye, FileText, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Mock data - will be replaced with API calls
const mockPage = {
  id: "1",
  title: "Home",
  path: "/",
  type: "Landing Page",
  status: "Published",
  content: "<h1>Welcome to our site</h1><p>This is the homepage content.</p>",
  isHomePage: true,
  lastUpdated: "2024-03-15T10:30:00Z",
  author: "John Doe",
  views: 1234,
  seo: {
    title: "Homepage - Our Site",
    description: "Welcome to our site. Find everything you need here.",
    keywords: "home, welcome, site",
    ogImage: "/images/og-home.jpg",
  },
  settings: {
    showInNavigation: true,
    allowComments: false,
    password: "",
  },
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function PagePreviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  // Handle back
  const handleBack = () => {
    router.push(`/admin/pages/${params.id}`)
  }

  // Handle edit
  const handleEdit = () => {
    router.push(`/admin/pages/${params.id}`)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold">{mockPage.title}</h1>
          </div>
          <Button onClick={handleEdit}>
            Edit Page
          </Button>
        </div>
      </div>

      <div className="container grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="p-6">
            <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: mockPage.content }} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Page Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                <span className="text-muted-foreground">Type:</span>
                <span>{mockPage.type}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{formatDate(mockPage.lastUpdated)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span className="text-muted-foreground">Author:</span>
                <span>{mockPage.author}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4" />
                <span className="text-muted-foreground">Views:</span>
                <span>{mockPage.views.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">SEO Preview</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-blue-600 hover:underline text-xl">
                  {mockPage.seo.title || mockPage.title}
                </h3>
                <div className="text-green-700 text-sm">
                  https://example.com{mockPage.path}
                </div>
                <p className="text-sm text-gray-600">
                  {mockPage.seo.description || "No description provided"}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Meta Tags</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>title: {mockPage.seo.title || mockPage.title}</div>
                  <div>description: {mockPage.seo.description}</div>
                  <div>keywords: {mockPage.seo.keywords}</div>
                  <div>og:image: {mockPage.seo.ogImage}</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Page Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Show in Navigation</span>
                <span className="text-sm">{mockPage.settings.showInNavigation ? "Yes" : "No"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Allow Comments</span>
                <span className="text-sm">{mockPage.settings.allowComments ? "Yes" : "No"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Password Protection</span>
                <span className="text-sm">{mockPage.settings.password ? "Yes" : "No"}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 