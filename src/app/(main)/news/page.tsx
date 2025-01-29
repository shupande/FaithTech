import * as React from "react"
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: 'News & Updates - BatteryEmulator',
  description: 'Stay up to date with the latest news, product updates, and industry insights from BatteryEmulator.',
}

const news = [
  {
    id: 1,
    title: 'Introducing BatteryEmulator 3000: Next-Generation Battery Testing',
    description: 'Our latest flagship model brings unprecedented precision and AI-driven capabilities to battery emulation.',
    image: '/images/news/be-3000-launch.jpg',
    date: '2024-03-15',
    category: 'Product Launch',
    featured: true,
  },
  {
    id: 2,
    title: 'BatteryEmulator Opens New R&D Center in Munich',
    description: 'Expanding our European presence with a state-of-the-art research and development facility.',
    image: '/images/news/munich-rd.jpg',
    date: '2024-03-01',
    category: 'Company News',
    featured: true,
  },
  {
    id: 3,
    title: 'Partnership Announcement: Leading EV Manufacturer',
    description: 'Strategic collaboration to advance electric vehicle battery testing capabilities.',
    image: '/images/news/ev-partnership.jpg',
    date: '2024-02-20',
    category: 'Partnership',
    featured: true,
  },
  {
    id: 4,
    title: 'Software Update: Enhanced Data Analytics Features',
    description: 'Latest software release includes advanced reporting and real-time monitoring capabilities.',
    date: '2024-02-15',
    category: 'Software Update',
  },
  {
    id: 5,
    title: 'BatteryEmulator at Battery Tech Expo 2024',
    description: 'Join us at the largest battery technology exhibition in North America.',
    date: '2024-02-10',
    category: 'Events',
  },
  {
    id: 6,
    title: 'New Training Program for Battery Test Engineers',
    description: 'Comprehensive certification program launched for professional battery test engineers.',
    date: '2024-02-01',
    category: 'Training',
  },
  {
    id: 7,
    title: 'Q4 2023 Performance Results',
    description: 'Record growth in global market share and customer satisfaction ratings.',
    date: '2024-01-25',
    category: 'Company News',
  },
  {
    id: 8,
    title: 'Technical White Paper: Advanced Battery Modeling',
    description: 'New research paper on next-generation battery simulation techniques.',
    date: '2024-01-15',
    category: 'Research',
  },
]

export default function NewsPage() {
  const featuredNews = news.filter(item => item.featured)
  const latestNews = news.filter(item => !item.featured)

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
              <div className="relative aspect-video">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                    {item.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  {new Date(item.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-500 mb-4">{item.description}</p>
                <Link 
                  href={`/news/${item.id}`}
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
                  {new Date(item.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="flex-1">
                <Badge className="mb-3">{item.category}</Badge>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 mb-4">{item.description}</p>
                <Link 
                  href={`/news/${item.id}`}
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