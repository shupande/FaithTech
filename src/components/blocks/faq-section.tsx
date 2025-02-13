"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
  order: number
  status: string
}

export function FAQSection() {
  const [faqs, setFaqs] = React.useState<FAQ[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch('/api/faq?status=Active')
        if (!response.ok) {
          throw new Error('Failed to fetch FAQs')
        }
        const result = await response.json()
        if (result.success) {
          setFaqs(result.data)
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFAQs()
  }, [])

  if (isLoading) {
    return (
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-500">
            Loading...
          </p>
        </div>
      </section>
    )
  }

  if (faqs.length === 0) {
    return (
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-500">
            No FAQs available at the moment.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-gray-500">
          Find answers to common questions about our Battery Emulators and services.
        </p>
      </div>
      <div className="mx-auto mt-8 max-w-4xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
} 