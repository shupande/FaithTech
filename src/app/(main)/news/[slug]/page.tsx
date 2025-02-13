import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from 'next'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Share2, ChevronRight, Tag } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const revalidate = 3600 // 每小时重新验证一次

interface NewsItem {
  id: string
  title: string
  slug: string
  content: string
  category: string
  status: string
  publishDate: Date
  coverImage: any
  attachments: any
  tags: string | null
  excerpt: string | null
  createdAt: Date
  updatedAt: Date
}

// 获取相关文章
async function getRelatedNews(currentSlug: string, category: string) {
  return await prisma.news.findMany({
    where: {
      slug: { not: currentSlug },
      category: category,
      status: 'Published'
    },
    select: {
      id: true,
      title: true,
      slug: true,
      publishDate: true,
      coverImage: true,
      excerpt: true,
      tags: true,
    },
    take: 3,
    orderBy: {
      publishDate: 'desc'
    }
  })
}

// 获取热门标签
async function getPopularTags() {
  const news = await prisma.news.findMany({
    where: { status: 'Published' },
    select: {
      id: true,
      tags: true
    }
  })
  
  const tagCounts = news.reduce((acc: Record<string, number>, item) => {
    const tags = item.tags ? JSON.parse(item.tags) : []
    tags.forEach((tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {})

  return Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag]) => tag)
}

// 生成动态元数据
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const newsItem = await getNewsItem(params.slug)
  
  if (!newsItem) {
    return {
      title: 'News Not Found - BatteryEmulator',
      description: 'The requested news article could not be found.',
    }
  }

  const tags = newsItem.tags ? JSON.parse(newsItem.tags) : []
  
  return {
    title: `${newsItem.title} - BatteryEmulator News`,
    description: newsItem.excerpt || newsItem.content.replace(/<[^>]+>/g, '').slice(0, 200),
    keywords: tags.join(', '),
    openGraph: {
      title: newsItem.title,
      description: newsItem.excerpt || newsItem.content.replace(/<[^>]+>/g, '').slice(0, 200),
      images: newsItem.coverImage ? [{ url: newsItem.coverImage.url }] : [],
      type: 'article',
      publishedTime: newsItem.publishDate.toISOString(),
      modifiedTime: newsItem.updatedAt.toISOString(),
      tags,
    }
  }
}

// 生成静态参数
export async function generateStaticParams() {
  const news = await prisma.news.findMany({
    where: { status: 'Published' },
    select: { slug: true }
  })

  return news.map((item) => ({
    slug: item.slug,
  }))
}

async function getNewsItem(slug: string): Promise<NewsItem | null> {
  try {
    const newsItem = await prisma.news.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        category: true,
        status: true,
        publishDate: true,
        coverImage: true,
        attachments: true,
        tags: true,
        excerpt: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!newsItem) {
      return null
    }

    return {
      ...newsItem,
      coverImage: newsItem.coverImage ? JSON.parse(newsItem.coverImage) : null,
      attachments: newsItem.attachments ? JSON.parse(newsItem.attachments) : null,
      tags: newsItem.tags,
      excerpt: newsItem.excerpt
    }
  } catch (error) {
    console.error('Error fetching news item:', error)
    return null
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const newsItem = await getNewsItem(params.slug)

  if (!newsItem) {
    notFound()
  }

  // 获取相关文章和热门标签
  const [relatedNews, popularTags] = await Promise.all([
    getRelatedNews(params.slug, newsItem.category),
    getPopularTags()
  ])

  // 解析标签
  const tags = newsItem.tags ? JSON.parse(newsItem.tags) : []

  // 构建结构化数据
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: newsItem.title,
    description: newsItem.excerpt || newsItem.content.replace(/<[^>]+>/g, '').slice(0, 200),
    image: newsItem.coverImage ? [newsItem.coverImage.url] : [],
    datePublished: newsItem.publishDate.toISOString(),
    dateModified: newsItem.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'BatteryEmulator Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'BatteryEmulator',
      logo: {
        '@type': 'ImageObject',
        url: 'https://batteryemulator.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://batteryemulator.com/news/${newsItem.slug}`
    },
    keywords: tags.join(', ')
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="flex-1">
        <article className="relative" itemScope itemType="https://schema.org/NewsArticle">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="container py-8 md:py-16">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <li>
                <Link href="/" className="hover:text-gray-900">Home</Link>
              </li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li>
                <Link href="/news" className="hover:text-gray-900">News</Link>
              </li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li>
                <Link 
                  href={`/news/category/${newsItem.category.toLowerCase()}`}
                  className="hover:text-gray-900"
                >
                  {newsItem.category}
                </Link>
              </li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li className="text-gray-900" aria-current="page">{newsItem.title}</li>
            </ol>
          </nav>

          {/* Article Header */}
          <div className="container px-4 pb-8 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Link 
                  href={`/news/category/${newsItem.category.toLowerCase()}`}
                  className="no-underline"
                >
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {newsItem.category}
                  </Badge>
                </Link>
                <time 
                  dateTime={newsItem.publishDate.toISOString()}
                  className="flex items-center gap-2 text-sm text-gray-500"
                  itemProp="datePublished"
                >
                  <Calendar className="w-4 h-4" />
                  {new Date(newsItem.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <h1 
                className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900"
                itemProp="headline"
              >
                {newsItem.title}
              </h1>
              {newsItem.excerpt && (
                <p className="text-xl text-gray-600 mb-8" itemProp="description">
                  {newsItem.excerpt}
                </p>
              )}
            </div>
          </div>

          {/* Hero Image */}
          {newsItem.coverImage && (
            <figure className="relative w-full mb-12">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 to-gray-900/10" />
              <div className="container px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                  <div className="relative aspect-[21/9] rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src={newsItem.coverImage.url}
                      alt={newsItem.coverImage.alt || newsItem.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      itemProp="image"
                    />
                  </div>
                  {newsItem.coverImage.caption && (
                    <figcaption className="text-sm text-gray-500 mt-2 text-center">
                      {newsItem.coverImage.caption}
                    </figcaption>
                  )}
                </div>
              </div>
            </figure>
          )}

          {/* Article Content */}
          <div className="container px-4 pb-12 md:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between border-y border-gray-200 py-4 mb-8">
                <div className="text-sm">
                  <span className="text-gray-500">By </span>
                  <span className="font-medium text-gray-900" itemProp="author">BatteryEmulator Team</span>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  <Tag className="w-4 h-4 text-gray-500" />
                  {tags.map((tag: string) => (
                    <Link 
                      key={tag}
                      href={`/news/tag/${tag.toLowerCase()}`}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Article Content */}
              <div 
                className="prose prose-lg prose-blue max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-p:text-gray-600 prose-p:leading-relaxed
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: newsItem.content }}
                itemProp="articleBody"
              />

              {/* Attachments */}
              {newsItem.attachments && newsItem.attachments.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Attachments</h2>
                  <ul className="space-y-4 divide-y divide-gray-100">
                    {newsItem.attachments.map((file: any) => (
                      <li key={file.url} className="pt-4 first:pt-0">
                        <Link 
                          href={file.url}
                          className="group flex items-center gap-4 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {Math.round(file.size / 1024)}KB
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Articles */}
              {relatedNews.length > 0 && (
                <section className="mt-12 pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Related Articles</h2>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {relatedNews.map((article: any) => (
                      <Link 
                        key={article.slug}
                        href={`/news/${article.slug}`}
                        className="group block"
                      >
                        <article className="relative">
                          {article.coverImage && (
                            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
                              <Image
                                src={JSON.parse(article.coverImage).url}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                          )}
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h3>
                          <time 
                            dateTime={article.publishDate.toISOString()}
                            className="text-sm text-gray-500"
                          >
                            {new Date(article.publishDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </time>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Popular Tags */}
              {popularTags.length > 0 && (
                <section className="mt-12 pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Popular Topics</h2>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag: string) => (
                      <Link
                        key={tag}
                        href={`/news/tag/${tag.toLowerCase()}`}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </article>
      </main>
    </>
  )
} 