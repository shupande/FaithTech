"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

type Legal = {
  id: string
  title: string
  slug: string
  type: string
  status: string
  content: string
  version: string
  effectiveDate: string
  createdAt: string
  updatedAt: string
}

export default function LegalPreviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [document, setDocument] = React.useState<Legal | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadDocument() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/legal?id=${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch document")
        
        const data = await response.json()
        setDocument(data)
      } catch (error) {
        console.error("Error loading document:", error)
        toast.error("Failed to load document")
      } finally {
        setIsLoading(false)
      }
    }

    loadDocument()
  }, [params.id])

  const handleBack = () => {
    router.push(`/admin/legal/${params.id}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl font-bold mb-4">Document Not Found</h1>
        <Button onClick={handleBack}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Edit
          </Button>
          <h1 className="text-xl font-bold">Preview</h1>
        </div>
      </div>

      <Card className="p-6">
        <div className="prose prose-sm max-w-none">
          <div className="mb-8">
            <h1>{document.title}</h1>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Version {document.version}</p>
              <p>Effective Date: {format(new Date(document.effectiveDate), 'MMMM d, yyyy')}</p>
              <p>Last Updated: {format(new Date(document.updatedAt), 'MMMM d, yyyy')}</p>
            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: document.content }} />
        </div>
      </Card>
    </div>
  )
} 