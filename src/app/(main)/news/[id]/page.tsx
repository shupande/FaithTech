import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft, Share2 } from "lucide-react"

// 这里模拟新闻详情数据
const newsDetails = {
  1: {
    title: 'Introducing BatteryEmulator 3000: Next-Generation Battery Testing',
    description: 'Our latest flagship model brings unprecedented precision and AI-driven capabilities to battery emulation.',
    content: `
      <p>We are excited to announce the launch of our latest flagship product, the BatteryEmulator 3000. This next-generation battery testing solution represents a significant leap forward in battery emulation technology, offering unprecedented precision and AI-driven capabilities.</p>

      <h2>Key Innovations</h2>
      <ul>
        <li>Advanced AI-driven battery modeling for more accurate emulation</li>
        <li>Extended voltage range (0-100V) and current capability (up to 50A)</li>
        <li>Real-time cloud analytics and remote operation</li>
        <li>Multi-unit synchronization for large-scale testing</li>
      </ul>

      <h2>Enhanced Testing Capabilities</h2>
      <p>The BatteryEmulator 3000 introduces several groundbreaking features that set new standards in battery testing:</p>
      <ul>
        <li>Microsecond-level response times for precise emulation</li>
        <li>Advanced thermal modeling and simulation</li>
        <li>Integrated safety features and protection mechanisms</li>
        <li>Comprehensive data logging and analysis tools</li>
      </ul>

      <h2>Industry Applications</h2>
      <p>This new model is specifically designed to meet the demanding requirements of:</p>
      <ul>
        <li>Electric vehicle development and testing</li>
        <li>Renewable energy storage systems</li>
        <li>Consumer electronics manufacturing</li>
        <li>Research and development laboratories</li>
      </ul>
    `,
    image: '/images/news/be-3000-launch.jpg',
    date: '2024-03-15',
    category: 'Product Launch',
    author: 'Technical Team',
  },
  2: {
    title: 'BatteryEmulator Opens New R&D Center in Munich',
    description: 'Expanding our European presence with a state-of-the-art research and development facility.',
    content: `
      <p>We are proud to announce the opening of our new Research & Development Center in Munich, Germany. This strategic expansion marks a significant milestone in our commitment to advancing battery emulation technology and serving our European customers.</p>

      <h2>State-of-the-Art Facility</h2>
      <p>The new R&D center features:</p>
      <ul>
        <li>Advanced testing laboratories</li>
        <li>Dedicated research spaces</li>
        <li>Collaborative work environments</li>
        <li>Customer training facilities</li>
      </ul>

      <h2>Research Focus Areas</h2>
      <p>Our Munich team will focus on:</p>
      <ul>
        <li>Next-generation battery emulation technologies</li>
        <li>Advanced power electronics development</li>
        <li>Software and firmware innovations</li>
        <li>Industry-specific solutions</li>
      </ul>

      <h2>European Market Support</h2>
      <p>This new facility will enhance our ability to:</p>
      <ul>
        <li>Provide local technical support</li>
        <li>Collaborate with European partners</li>
        <li>Accelerate product development</li>
        <li>Deliver customized solutions</li>
      </ul>
    `,
    image: '/images/news/munich-rd.jpg',
    date: '2024-03-01',
    category: 'Company News',
    author: 'Corporate Communications',
  },
  3: {
    title: 'Partnership Announcement: Leading EV Manufacturer',
    description: 'Strategic collaboration to advance electric vehicle battery testing capabilities.',
    content: `
      <p>We are excited to announce our strategic partnership with a leading electric vehicle manufacturer to advance battery testing capabilities in the automotive industry.</p>

      <h2>Partnership Objectives</h2>
      <ul>
        <li>Development of specialized testing solutions</li>
        <li>Integration of advanced battery modeling</li>
        <li>Creation of industry-specific testing protocols</li>
        <li>Joint research initiatives</li>
      </ul>

      <h2>Technology Integration</h2>
      <p>Key aspects of the collaboration include:</p>
      <ul>
        <li>Custom battery emulation profiles</li>
        <li>Advanced testing automation</li>
        <li>Real-time data analytics</li>
        <li>Specialized reporting tools</li>
      </ul>

      <h2>Industry Impact</h2>
      <p>This partnership will contribute to:</p>
      <ul>
        <li>Accelerated EV development cycles</li>
        <li>Enhanced battery testing standards</li>
        <li>Improved safety protocols</li>
        <li>Reduced development costs</li>
      </ul>
    `,
    image: '/images/news/ev-partnership.jpg',
    date: '2024-02-20',
    category: 'Partnership',
    author: 'Business Development Team',
  }
}

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const newsItem = newsDetails[params.id as keyof typeof newsDetails]

  if (!newsItem) {
    notFound()
  }

  return (
    <main className="flex-1">
      <article>
        {/* Hero Section */}
        <div className="relative w-full aspect-[2/1] bg-gray-100">
          <Image
            src={newsItem.image}
            alt={newsItem.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="container px-4 py-12 md:px-6">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <Button variant="ghost" asChild>
                <Link href="/news" className="text-gray-500 hover:text-gray-900">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to News
                </Link>
              </Button>
            </div>

            {/* Article Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-blue-600 text-white">
                  {newsItem.category}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(newsItem.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter mb-4">
                {newsItem.title}
              </h1>
              <p className="text-xl text-gray-500 mb-4">
                {newsItem.description}
              </p>
              <div className="flex items-center justify-between border-y py-4">
                <div className="text-sm text-gray-500">
                  By {newsItem.author}
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: newsItem.content }}
            />
          </div>
        </div>
      </article>
    </main>
  )
} 