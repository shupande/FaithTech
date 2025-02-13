"use client"

import { useEffect, useState } from "react"
import { Loader2, ChevronRight } from "lucide-react"
import Link from 'next/link'

type Legal = {
  title: string
  content: string
  version: string
  effectiveDate: string
}

export default function TermsOfServicePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [document, setDocument] = useState<Legal | null>(null)

  useEffect(() => {
    async function loadDocument() {
      try {
        const response = await fetch("/api/legal?type=terms&slug=terms-of-service")
        if (!response.ok) throw new Error("Failed to fetch document")
        
        const data = await response.json()
        if (data && !data.error) {
          setDocument(data)
        }
      } catch (error) {
        console.error("Error loading terms of service:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDocument()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!document) {
    return (
      <div className="container mx-auto py-20">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p>Terms of service document is not available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">Terms of Service</span>
      </nav>

      <div className="prose prose-blue max-w-none">
        <h1>{document.title}</h1>
        <div className="text-sm text-gray-500 mt-2 mb-8">
          <p>Version {document.version}</p>
          <p>Effective Date: {new Date(document.effectiveDate).toLocaleDateString()}</p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: document.content }} />
      </div>
    </div>
  )
} 