'use client'

import * as React from "react"
import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[600px] py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[800px] flex-col items-center gap-4 text-center">
        <div className="rounded-lg bg-muted p-4">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold">Category Not Found</h1>
        <p className="max-w-[600px] text-lg text-muted-foreground">
          Sorry, we couldn't find the product category you're looking for. The category might have been removed,
          renamed, or doesn't exist.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 