'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Eye, FileText, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Mock data - will be replaced with API calls
const mockDocument = {
  id: "1",
  title: "Privacy Policy",
  path: "/privacy-policy",
  type: "Policy",
  status: "Published",
  content: `
    <h1>Privacy Policy</h1>
    <p>Last updated: March 15, 2024</p>
    <h2>1. Introduction</h2>
    <p>This privacy policy describes how we collect, use, and protect your personal information...</p>
    <h2>2. Information We Collect</h2>
    <p>We collect information that you provide directly to us, including...</p>
    <h2>3. How We Use Your Information</h2>
    <p>We use the information we collect for various purposes, including...</p>
  `,
  effectiveDate: "2024-03-20",
  version: "2.1",
  metadata: {
    author: "John Doe",
    reviewedBy: "Legal Team",
    approvedBy: "Jane Smith",
    lastReviewDate: "2024-03-15",
  },
}

export default function LegalPreviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Handle back
  const handleBack = () => {
    router.push(`/admin/legal/${params.id}`)
  }

  // Handle edit
  const handleEdit = () => {
    router.push(`/admin/legal/${params.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Editor
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                Preview Mode
              </div>
            </div>
            <Button onClick={handleEdit}>
              Edit Document
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">{mockDocument.title}</h1>
                  <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Effective {formatDate(mockDocument.effectiveDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Version {mockDocument.version}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="prose prose-gray max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: mockDocument.content }} />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Document Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Author:</span>
                        <span className="font-medium text-foreground">{mockDocument.metadata.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Reviewed By:</span>
                        <span className="font-medium text-foreground">{mockDocument.metadata.reviewedBy}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Approved By:</span>
                        <span className="font-medium text-foreground">{mockDocument.metadata.approvedBy}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Last Review:</span>
                        <span className="font-medium text-foreground">
                          {formatDate(mockDocument.metadata.lastReviewDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 