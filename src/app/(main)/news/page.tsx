import * as React from "react"
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: 'News & Updates - BatteryEmulator',
  description: 'Stay up to date with the latest news, product updates, and industry insights from BatteryEmulator.',
}

export const revalidate = 3600 // 每小时重新验证一次

async function getNews() {
  const news = await prisma.news.findMany({
    where: {
      status: 'Published'
    },
    orderBy: {
      publishDate: 'desc'
    }
  })

  return news.map(item => ({
    ...item,
    coverImage: item.coverImage ? JSON.parse(item.coverImage) : null
  }))
}

export default async function NewsPage() {
  const news = await getNews()
  const featuredNews = news.slice(0, 3)
  const latestNews = news.slice(3)

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Latest News & Updates
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Stay up to date with the latest developments, product releases, and industry insights from BatteryEmulator.
            </p>
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="container px-4 py-16 md:px-6">
        <h2 className="text-2xl font-bold tracking-tighter mb-8">Featured Stories</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredNews.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              {item.coverImage && (
                <div className="relative aspect-video">
                  <Image
                    src={item.coverImage.url}
                    alt={item.coverImage.alt || item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  {new Date(item.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-500 mb-4">
                  {item.content.replace(/<[^>]+>/g, '').slice(0, 150)}...
                </p>
                <Link 
                  href={`/news/${item.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  Read More <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest News List */}
      <section className="container px-4 py-16 md:px-6 border-t">
        <h2 className="text-2xl font-bold tracking-tighter mb-8">Latest Updates</h2>
        <div className="grid gap-8">
          {latestNews.map((item) => (
            <article key={item.id} className="flex flex-col md:flex-row gap-6 items-start">
              <div className="md:w-48 flex-shrink-0">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(item.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="flex-1">
                <Badge className="mb-3">{item.category}</Badge>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 mb-4">
                  {item.content.replace(/<[^>]+>/g, '').slice(0, 150)}...
                </p>
                <Link 
                  href={`/news/${item.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  Read More <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
} 