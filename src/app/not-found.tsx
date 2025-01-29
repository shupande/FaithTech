'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  const router = useRouter()
  const [countdown, setCountdown] = React.useState(3)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000)

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [router])

  return (
    <main className="flex-1">
      <div className="container flex flex-col items-center justify-center min-h-[600px] px-4 py-16 md:px-6">
        <h1 className="text-9xl font-bold tracking-tighter text-gray-900">404</h1>
        <p className="mt-4 text-xl text-gray-500">Page not found</p>
        <p className="mt-2 text-gray-500">
          Redirecting to homepage in {countdown} seconds...
        </p>
        <Button 
          className="mt-8" 
          onClick={() => router.push('/')}
        >
          <Home className="mr-2 h-4 w-4" />
          Go to Homepage
        </Button>
      </div>
    </main>
  )
} 