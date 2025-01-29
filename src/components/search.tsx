"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchBox() {
  const router = useRouter()
  const [query, setQuery] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    // 始终导航到搜索页面，执行全局搜索
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full md:w-[240px] -mx-4 md:mx-0 px-4 md:px-0">
      <Search className="absolute left-6 md:left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      <Input
        type="search"
        placeholder="Search..."
        value={query}
        onChange={handleChange}
        className="w-full pl-10 bg-gray-50 border-gray-200 focus:bg-white"
      />
    </form>
  )
} 