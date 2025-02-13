import * as React from "react"
import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Zap, Settings, BarChart3, Shield, Cpu, Battery,
  Users, Bell, Calendar, Camera, Check, ChevronRight,
  Clock, Cloud, Code, Cog, Copy, CreditCard, Download,
  Edit, Eye, File, FileText, Filter, Flag, Folder,
  Globe, Heart, HomeIcon, Image, Info, Key, Link, List,
  Lock, Mail, Map, Menu, MessageCircle,
  Monitor, Moon, MoreHorizontal, MoreVertical, Package,
  Phone, Plus, Power, Printer, Radio, RefreshCw,
  Save, Search, Send, Server, Share, ShoppingCart,
  Slash, Smartphone, Star, Sun, Table, Tag, Terminal,
  Trash, Trash2, TrendingUp, User,
  Video, Volume2, Wifi, X, type LucideIcon
} from "lucide-react"
import { WorldMapDemo } from "@/components/blocks/world-map-demo"
import { FAQSection } from "@/components/blocks/faq-section"
import { prisma } from '@/lib/prisma'
import { HeroSection } from '@/components/hero-section'
import { SectionContent } from '@prisma/client'

interface Feature {
  id: string
  title: string
  description: string
  icon: string
  seoDescription?: string
  link?: {
    href: string
    text: string
  }
  media?: {
    url: string
    type: 'image' | 'video'
    alt?: string
    width?: number
    height?: number
    caption?: string
    thumbnail?: string
  }
}

interface MapPoint {
  id: string
  start: {
    lat: number
    lng: number
  }
  end: {
    lat: number
    lng: number
  }
}

interface HomeContent {
  title: string
  description: string
  seoDescription?: string
  badge?: {
    text: string
    action?: {
      text: string
      href: string
    }
  }
  actions?: {
    text: string
    href: string
    variant: 'default' | 'outline'
    ariaLabel?: string
  }[]
  media?: {
    url: string
    type: 'image' | 'video'
    alt?: string
    width?: number
    height?: number
    thumbnail?: string
    caption?: string
    loading?: 'lazy' | 'eager'
    duration?: number // 视频时长（秒）
  }
  features: Feature[]
  featureTitle?: string
  featureSubtitle?: string
  featureSeoDescription?: string
  mapTitle?: string
  mapSubtitle?: string
  mapSeoDescription?: string
  mapPoints?: MapPoint[]
  seoKeywords?: string[]
  focusKeyphrase?: string
}

interface StructuredData {
  '@context': 'https://schema.org'
  '@type': string
  [key: string]: any
}

interface SEOAnalysis {
  score: number
  suggestions: {
    type: 'error' | 'warning' | 'success' | 'info'
    message: string
    field: string
  }[]
}

interface InternalLink {
  href: string
  text: string
  type: 'primary' | 'secondary' | 'related'
  context: string
}

function analyzeSEO(content: HomeContent, website: any): SEOAnalysis {
  const suggestions: SEOAnalysis['suggestions'] = []
  let score = 100

  // 检查标题长度和关键词密度
  if (!content.title) {
    suggestions.push({
      type: 'error',
      message: 'Title is missing',
      field: 'title'
    })
    score -= 10
  } else {
    // 标题长度检查
    if (content.title.length < 30) {
      suggestions.push({
        type: 'warning',
        message: 'Title is too short (recommended: 30-60 characters)',
        field: 'title'
      })
      score -= 5
    } else if (content.title.length > 60) {
      suggestions.push({
        type: 'warning',
        message: 'Title is too long (recommended: 30-60 characters)',
        field: 'title'
      })
      score -= 5
    }
    
    // 检查标题是否以品牌名称结尾
    if (website?.name && !content.title.endsWith(website.name)) {
      suggestions.push({
        type: 'warning',
        message: `Title should end with brand name (${website.name})`,
        field: 'title'
      })
      score -= 3
    }
  }

  // 检查描述长度和关键词使用
  if (!content.description) {
    suggestions.push({
      type: 'error',
      message: 'Description is missing',
      field: 'description'
    })
    score -= 10
  } else {
    // 描述长度检查
    if (content.description.length < 120) {
      suggestions.push({
        type: 'warning',
        message: 'Description is too short (recommended: 120-160 characters)',
        field: 'description'
      })
      score -= 5
    } else if (content.description.length > 160) {
      suggestions.push({
        type: 'warning',
        message: 'Description is too long (recommended: 120-160 characters)',
        field: 'description'
      })
      score -= 5
    }

    // 检查描述是否包含行动号召
    const ctaWords = ['discover', 'learn', 'get', 'find', 'explore', 'start']
    if (!ctaWords.some(word => content.description.toLowerCase().includes(word))) {
      suggestions.push({
        type: 'warning',
        message: 'Description should include a call-to-action',
        field: 'description'
      })
      score -= 3
    }
  }

  // 检查关键词策略
  if (!content.focusKeyphrase) {
    suggestions.push({
      type: 'warning',
      message: 'Focus keyphrase is missing',
      field: 'focusKeyphrase'
    })
    score -= 5
  } else {
    const keyphrase = content.focusKeyphrase.toLowerCase()
    const text = [
      content.title,
      content.description,
      ...content.features.map(f => f.description),
      content.featureSubtitle,
      content.mapSubtitle,
    ].join(' ').toLowerCase()

    // 计算关键词密度
    const keywordCount = (text.match(new RegExp(keyphrase, 'g')) || []).length
    const wordCount = text.split(/\s+/).length
    const density = (keywordCount / wordCount) * 100

    if (density < 0.5) {
      suggestions.push({
        type: 'warning',
        message: 'Keyword density is too low (recommended: 0.5% - 2.5%)',
        field: 'content'
      })
      score -= 5
    } else if (density > 2.5) {
      suggestions.push({
        type: 'warning',
        message: 'Keyword density is too high (recommended: 0.5% - 2.5%)',
        field: 'content'
      })
      score -= 5
    }

    // 检查关键词在第一段中的位置
    const firstParagraph = content.description.split('.')[0].toLowerCase()
    if (!firstParagraph.includes(keyphrase)) {
      suggestions.push({
        type: 'warning',
        message: 'Focus keyphrase should appear in the first paragraph',
        field: 'description'
      })
      score -= 3
    }
  }

  // 检查媒体内容和可访问性
  if (!content.media) {
    suggestions.push({
      type: 'warning',
      message: 'No media content found',
      field: 'media'
    })
    score -= 5
  } else {
    // 图片检查
    if (content.media.type === 'image') {
      if (!content.media.alt) {
        suggestions.push({
          type: 'error',
          message: 'Image alt text is missing',
          field: 'media.alt'
        })
        score -= 10
      } else if (content.media.alt.length < 10) {
        suggestions.push({
          type: 'warning',
          message: 'Image alt text is too short (recommended: 10-100 characters)',
          field: 'media.alt'
        })
        score -= 3
      }
      
      if (!content.media.caption) {
        suggestions.push({
          type: 'warning',
          message: 'Image caption is missing',
          field: 'media.caption'
        })
        score -= 5
      }

      // 检查图片尺寸
      if (!content.media.width || !content.media.height) {
        suggestions.push({
          type: 'warning',
          message: 'Image dimensions should be specified',
          field: 'media'
        })
        score -= 3
      }
    }
    
    // 视频检查
    if (content.media.type === 'video' && !content.media.thumbnail) {
      suggestions.push({
        type: 'warning',
        message: 'Video thumbnail is missing',
        field: 'media.thumbnail'
      })
      score -= 5
    }
  }

  // 检查内部链接
  const internalLinks = content.features
    .filter(f => f.link)
    .map(f => f.link!.href)

  if (internalLinks.length < content.features.length / 2) {
    suggestions.push({
      type: 'warning',
      message: 'Add more internal links to features',
      field: 'features'
    })
    score -= 5
  }

  // 检查行动号召按钮
  if (!content.actions || content.actions.length === 0) {
    suggestions.push({
      type: 'warning',
      message: 'No call-to-action buttons found',
      field: 'actions'
    })
    score -= 5
  } else {
    content.actions.forEach((action, index) => {
      if (!action.ariaLabel) {
        suggestions.push({
          type: 'warning',
          message: `Action button #${index + 1} missing aria-label`,
          field: `actions[${index}].ariaLabel`
        })
        score -= 2
      }
    })
  }

  // 检查特性描述的SEO优化
  content.features.forEach((feature, index) => {
    if (!feature.seoDescription) {
      suggestions.push({
        type: 'warning',
        message: `Feature #${index + 1} (${feature.title}) is missing SEO description`,
        field: `features[${index}].seoDescription`
      })
      score -= 2
    } else {
      // 检查特性描述中的关键词使用
      if (content.focusKeyphrase && 
          !feature.seoDescription.toLowerCase().includes(content.focusKeyphrase.toLowerCase())) {
        suggestions.push({
          type: 'info',
          message: `Consider including focus keyphrase in feature #${index + 1} description`,
          field: `features[${index}].seoDescription`
        })
        score -= 1
      }
    }
  })

  return {
    score: Math.max(0, score),
    suggestions: suggestions.sort((a, b) => {
      if (a.type === 'error' && b.type !== 'error') return -1
      if (b.type === 'error' && a.type !== 'error') return 1
      if (a.type === 'warning' && b.type === 'info') return -1
      if (b.type === 'warning' && a.type === 'info') return 1
      return 0
    })
  }
}

function generateStructuredData(
  website: any,
  homeContent: HomeContent | null
): StructuredData[] {
  const baseUrl = website?.url || process.env.NEXT_PUBLIC_BASE_URL || ''
  const schemas: StructuredData[] = []
  
  // 组织信息
  const organizationSchema: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: website?.name || 'FaithTech',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: website?.logo || '',
      width: 1200,
      height: 630,
      caption: website?.name
    },
    sameAs: [
      website?.social?.facebook,
      website?.social?.twitter,
      website?.social?.linkedin,
      website?.social?.youtube,
      website?.social?.instagram,
      website?.social?.github,
    ].filter(Boolean),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: website?.phone,
        email: website?.email,
        contactType: 'customer service',
        areaServed: website?.serviceArea || 'Worldwide',
        availableLanguage: website?.languages || ['en'],
      },
      {
        '@type': 'ContactPoint',
        telephone: website?.supportPhone,
        email: website?.supportEmail,
        contactType: 'technical support',
        areaServed: website?.serviceArea || 'Worldwide',
        availableLanguage: website?.languages || ['en'],
      }
    ],
    address: website?.address ? {
      '@type': 'PostalAddress',
      ...website.address
    } : undefined,
    foundingDate: website?.foundingDate,
    founders: website?.founders?.map((founder: any) => ({
      '@type': 'Person',
      name: founder.name,
      jobTitle: founder.title,
    })),
    numberOfEmployees: website?.employeeCount,
    slogan: website?.slogan,
    description: website?.description,
  }
  schemas.push(organizationSchema)

  // 网站信息
  const websiteSchema: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: website?.name || 'FaithTech',
    description: website?.description,
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: `${baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
      {
        '@type': 'ReadAction',
        target: [
          `${baseUrl}/about`,
          `${baseUrl}/contact`,
          `${baseUrl}/products`,
        ],
      }
    ],
    inLanguage: website?.languages || ['en'],
    copyrightYear: new Date().getFullYear(),
    creditText: website?.copyright,
    keywords: website?.keywords,
  }
  schemas.push(websiteSchema)

  // 网页信息
  if (homeContent) {
    const webpageSchema: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${baseUrl}/#webpage`,
      url: baseUrl,
      name: homeContent.title,
      description: homeContent.description,
      isPartOf: {
        '@id': `${baseUrl}/#website`,
      },
      about: {
        '@id': `${baseUrl}/#organization`,
      },
      primaryImageOfPage: homeContent.media?.url ? {
        '@type': 'ImageObject',
        url: homeContent.media.url,
        width: homeContent.media.width || 1200,
        height: homeContent.media.height || 630,
        caption: homeContent.media.caption,
      } : undefined,
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      breadcrumb: {
        '@id': `${baseUrl}/#breadcrumb`,
      },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', 'h2', '.description'],
      },
    }
    schemas.push(webpageSchema)
  }

  // 特性列表
  if (homeContent?.features.length) {
    const itemListSchema: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${baseUrl}/#features`,
      name: homeContent.featureTitle || 'Key Features',
      description: homeContent.featureSubtitle,
      itemListElement: homeContent.features.map((feature, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Thing',
          name: feature.title,
          description: feature.seoDescription || feature.description,
          url: feature.link?.href ? `${baseUrl}${feature.link.href}` : undefined,
          image: feature.media?.url ? {
            '@type': 'ImageObject',
            url: feature.media.url,
            caption: feature.media.caption || feature.title,
          } : undefined,
        },
      })),
      numberOfItems: homeContent.features.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
    }
    schemas.push(itemListSchema)
  }

  // FAQ页面
  if (website?.faq?.length) {
    const faqSchema: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${baseUrl}/#faq`,
      name: 'Frequently Asked Questions',
      description: 'Common questions about our products and services',
      mainEntity: website.faq.map((item: any) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
          author: {
            '@type': 'Organization',
            name: website?.name,
          },
          dateCreated: item.createdAt || new Date().toISOString(),
          upvoteCount: item.upvotes || 0,
        },
      })),
    }
    schemas.push(faqSchema)
  }

  // 面包屑导航
  const breadcrumbSchema: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${baseUrl}/#breadcrumb`,
    name: 'Breadcrumb',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
    ],
  }
  schemas.push(breadcrumbSchema)

  // 如果有视频内容
  if (homeContent?.media?.type === 'video') {
    const videoSchema: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      '@id': `${baseUrl}/#video`,
      name: homeContent.title,
      description: homeContent.description,
      thumbnailUrl: homeContent.media.thumbnail,
      uploadDate: new Date().toISOString(),
      contentUrl: homeContent.media.url,
      embedUrl: homeContent.media.url,
      duration: homeContent.media.duration,
      width: homeContent.media.width,
      height: homeContent.media.height,
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
    }
    schemas.push(videoSchema)
  }

  return schemas
}

async function generateMetadata(): Promise<Metadata> {
  try {
    const [websiteSettings, homeContent] = await Promise.all([
      prisma.settings.findUnique({
        where: {
          type: 'website'
        }
      }),
      getHomeContent()
    ])

    // 解析website settings
    const website = websiteSettings ? JSON.parse(websiteSettings.data) : null

    // 如果没有设置和首页内容，使用默认值
    if (!website && !homeContent) {
      return {
        title: 'FaithTech',
        description: 'Empowering faith communities with modern technology solutions.',
        openGraph: {
          title: 'FaithTech',
          description: 'Empowering faith communities with modern technology solutions.',
          type: 'website',
        },
      }
    }

    // 构建完整的标题
    const title = homeContent?.title 
      ? `${homeContent.title} | ${website?.name || 'FaithTech'}`
      : website?.name || 'FaithTech'

    // 处理图片和alt文本
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    let ogImages: { url: string; alt: string; width?: number; height?: number }[] | undefined

    // 处理首页媒体图片
    if (homeContent?.media?.url && homeContent.media.url.trim()) {
      try {
        // 确保URL是有效的
        const mediaUrl = homeContent.media.url.startsWith('http') 
          ? homeContent.media.url 
          : new URL(homeContent.media.url, baseUrl).toString()

        ogImages = [{
          url: mediaUrl,
          alt: homeContent?.media?.alt || homeContent?.title || website?.name || 'FaithTech',
          ...(homeContent?.media?.width && { width: homeContent.media.width }),
          ...(homeContent?.media?.height && { height: homeContent.media.height }),
        }]
      } catch (error) {
        console.error('Invalid media URL:', error)
      }
    }
    // 如果没有有效的媒体图片，尝试使用网站logo
    else if (website?.logo && website.logo.trim()) {
      try {
        const logoUrl = website.logo.startsWith('http') 
          ? website.logo 
          : new URL(website.logo, baseUrl).toString()

        ogImages = [{
          url: logoUrl,
          alt: website.name,
          width: 1200,
          height: 630
        }]
      } catch (error) {
        console.error('Invalid logo URL:', error)
      }
    }

    // 构建metadata
    return {
      title,
      description: homeContent?.seoDescription || homeContent?.description || website?.description,
      keywords: homeContent?.seoKeywords?.join(', ') || website?.keywords,
      openGraph: {
        title,
        description: homeContent?.seoDescription || homeContent?.description || website?.description,
        type: 'website',
        ...(ogImages && { images: ogImages })
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    // 返回默认metadata
    return {
      title: 'FaithTech',
      description: 'Empowering faith communities with modern technology solutions.',
      openGraph: {
        title: 'FaithTech',
        description: 'Empowering faith communities with modern technology solutions.',
        type: 'website',
      },
    }
  }
}

// 替换原有的静态metadata导出
export { generateMetadata as generateMetadata }

async function getHomeContent(): Promise<HomeContent | null> {
  try {
    const [content, websiteSettings] = await Promise.all([
      prisma.sectionContent.findFirst({
        where: {
          name: 'home',
          status: 'Active'
        }
      }),
      prisma.settings.findUnique({
        where: {
          type: 'website'
        }
      })
    ])

    if (!content) {
      return null
    }

    const website = websiteSettings ? JSON.parse(websiteSettings.data) : null
    const homeContent = await parseHomeContent(content)
    
    // 进行SEO分析
    const seoAnalysis = analyzeSEO(homeContent, website)
    
    // 将分析结果记录到日志或数据库中
    console.log('SEO Analysis:', seoAnalysis)

    return homeContent
  } catch (error) {
    console.error('Failed to fetch home content:', error)
    return null
  }
}

function generateAltText(
  context: {
    title: string
    description: string
    type: string
    section?: string
    index?: number
    focusKeyphrase?: string
    imageContext?: {
      width?: number
      height?: number
      fileType?: string
      location?: string
    }
  }
): string {
  const { title, description, type, section, index, focusKeyphrase, imageContext } = context
  
  // 移除HTML标签和多余的空格
  const cleanText = (text: string) => {
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // 提取关键短语（最多4个词）
  const getKeyPhrase = (text: string) => {
    const words = cleanText(text).split(' ')
    return words.slice(0, 4).join(' ')
  }

  // 根据不同类型生成不同的alt文本
  switch (type) {
    case 'hero': {
      const keyPhrase = focusKeyphrase || getKeyPhrase(title)
      const shortDesc = cleanText(description).slice(0, 100)
      return `${keyPhrase} - ${shortDesc}${description.length > 100 ? '...' : ''}`
    }
    
    case 'feature': {
      const position = index !== undefined ? ` #${index + 1}` : ''
      const sectionPrefix = section ? `${section} - ` : ''
      const shortDesc = cleanText(description).slice(0, 50)
      return `${sectionPrefix}${title}${position} feature illustration - ${shortDesc}${description.length > 50 ? '...' : ''}`
    }
    
    case 'map': {
      const locations = description.match(/\b(?:in|at|from|to)\s+([^,.]+)/g)
      const locationText = locations 
        ? locations.map(loc => loc.replace(/^(?:in|at|from|to)\s+/, '')).join(', ')
        : description
      return `Interactive world map showing ${cleanText(locationText)}`
    }
    
    case 'gallery': {
      const dimensionInfo = imageContext?.width && imageContext?.height
        ? ` (${imageContext.width}x${imageContext.height})`
        : ''
      const locationInfo = imageContext?.location
        ? ` - Location: ${imageContext.location}`
        : ''
      return `${title} image${index ? ` #${index + 1}` : ''}${dimensionInfo}${locationInfo} - ${cleanText(description)}`
    }

    case 'logo':
      return `${title} company logo`

    case 'icon':
      return `${title} icon symbol`

    case 'product': {
      const shortDesc = cleanText(description).slice(0, 80)
      return `${title} product image - ${shortDesc}${description.length > 80 ? '...' : ''}`
    }

    case 'background':
      return `Decorative background image for ${title} section`

    case 'testimonial': {
      const position = index !== undefined ? ` #${index + 1}` : ''
      return `Customer testimonial${position} - ${cleanText(description)}`
    }

    case 'team': {
      const role = description.split(',')[0]
      return `${title} - ${role}`
    }

    default:
      return cleanText(title)
  }
}

function generateInternalLinks(
  content: HomeContent,
  website: any
): InternalLink[] {
  const links: InternalLink[] = []

  // 从特性生成产品链接
  content.features.forEach(feature => {
    if (feature.link) {
      links.push({
        ...feature.link,
        type: 'primary',
        context: 'feature'
      })
    }
  })

  // 从网站导航生成相关链接
  if (website?.navigation) {
    const nav = JSON.parse(website.navigation)
    nav.forEach((item: any) => {
      if (item.type === 'main' && !links.some(link => link.href === item.url)) {
        links.push({
          href: item.url,
          text: item.label,
          type: 'secondary',
          context: 'navigation'
        })
      }
    })
  }

  // 生成相关内容链接
  if (content.focusKeyphrase) {
    const keyphrase = content.focusKeyphrase.toLowerCase()
    
    // 相关产品链接
    website?.products?.forEach((product: any) => {
      if (
        product.keywords?.includes(keyphrase) ||
        product.title.toLowerCase().includes(keyphrase) ||
        product.description.toLowerCase().includes(keyphrase)
      ) {
        links.push({
          href: `/products/${product.slug}`,
          text: `Related Product: ${product.title}`,
          type: 'related',
          context: 'product'
        })
      }
    })

    // 相关文章链接
    website?.articles?.forEach((article: any) => {
      if (
        article.keywords?.includes(keyphrase) ||
        article.title.toLowerCase().includes(keyphrase)
      ) {
        links.push({
          href: `/blog/${article.slug}`,
          text: `Related Article: ${article.title}`,
          type: 'related',
          context: 'article'
        })
      }
    })

    // 相关案例研究
    website?.caseStudies?.forEach((study: any) => {
      if (
        study.industry?.toLowerCase().includes(keyphrase) ||
        study.title.toLowerCase().includes(keyphrase)
      ) {
        links.push({
          href: `/case-studies/${study.slug}`,
          text: `Case Study: ${study.title}`,
          type: 'related',
          context: 'case-study'
        })
      }
    })
  }

  // 生成支持和文档链接
  content.features.forEach(feature => {
    // 查找相关文档
    website?.documentation?.forEach((doc: any) => {
      if (
        doc.topics?.includes(feature.title.toLowerCase()) ||
        doc.title.toLowerCase().includes(feature.title.toLowerCase())
      ) {
        links.push({
          href: `/docs/${doc.slug}`,
          text: `Documentation: ${doc.title}`,
          type: 'secondary',
          context: 'documentation'
        })
      }
    })

    // 查找相关教程
    website?.tutorials?.forEach((tutorial: any) => {
      if (
        tutorial.topics?.includes(feature.title.toLowerCase()) ||
        tutorial.title.toLowerCase().includes(feature.title.toLowerCase())
      ) {
        links.push({
          href: `/tutorials/${tutorial.slug}`,
          text: `Tutorial: ${tutorial.title}`,
          type: 'secondary',
          context: 'tutorial'
        })
      }
    })
  })

  // 生成社区和支持链接
  if (website?.community) {
    const community = website.community
    
    // 论坛链接
    if (community.forum) {
      links.push({
        href: community.forum,
        text: 'Join our Community Forum',
        type: 'secondary',
        context: 'community'
      })
    }

    // Discord/Slack链接
    if (community.chat) {
      links.push({
        href: community.chat,
        text: 'Join our Community Chat',
        type: 'secondary',
        context: 'community'
      })
    }

    // GitHub链接
    if (community.github) {
      links.push({
        href: community.github,
        text: 'View on GitHub',
        type: 'secondary',
        context: 'community'
      })
    }
  }

  // 添加转化链接
  const conversionLinks = [
    {
      href: '/get-started',
      text: 'Get Started',
      type: 'primary' as const,
      context: 'conversion'
    },
    {
      href: '/demo',
      text: 'Request Demo',
      type: 'primary' as const,
      context: 'conversion'
    },
    {
      href: '/contact',
      text: 'Contact Sales',
      type: 'primary' as const,
      context: 'conversion'
    }
  ]

  // 根据页面内容选择最相关的转化链接
  const relevantConversionLinks = conversionLinks.slice(0, 2)
  links.push(...relevantConversionLinks)

  // 去重并限制链接数量
  const uniqueLinks = links.filter((link, index, self) =>
    index === self.findIndex((l) => l.href === link.href)
  )

  // 按类型排序
  return uniqueLinks
    .sort((a, b) => {
      const typeOrder = { primary: 0, secondary: 1, related: 2 }
      return typeOrder[a.type] - typeOrder[b.type]
    })
    .slice(0, 10) // 限制最多10个链接
}

async function parseHomeContent(content: any): Promise<HomeContent> {
  // Parse the JSON fields safely
  let parsedActions = []
  try {
    parsedActions = content.actions ? JSON.parse(content.actions.toString()) : []
    if (!Array.isArray(parsedActions)) {
      parsedActions = []
    }
  } catch (e) {
    console.error('Error parsing actions:', e)
  }

  let parsedBadge = null
  try {
    parsedBadge = content.badge ? JSON.parse(content.badge) : null
  } catch (e) {
    console.error('Error parsing badge:', e)
  }

  let parsedMedia = null
  try {
    parsedMedia = content.media ? JSON.parse(content.media.toString()) : null
    // 如果是图片且没有alt文本，自动生成
    if (parsedMedia && parsedMedia.type === 'image' && !parsedMedia.alt) {
      parsedMedia.alt = generateAltText({
        title: content.title,
        description: content.description,
        type: 'hero'
      })
    }
  } catch (e) {
    console.error('Error parsing media:', e)
  }

  let parsedFeatures = []
  try {
    parsedFeatures = content.features ? JSON.parse(content.features.toString()) : []
    if (Array.isArray(parsedFeatures)) {
      parsedFeatures = parsedFeatures.map((feature, index) => {
        // 处理图片alt文本
        if (feature.media && feature.media.type === 'image' && !feature.media.alt) {
          feature.media.alt = generateAltText({
            title: feature.title,
            description: feature.description,
            type: 'feature',
            section: 'features',
            index
          })
        }
        
        // 如果特性没有链接，尝试生成一个
        if (!feature.link) {
          const slug = feature.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
          
          feature.link = {
            href: `/features/${slug}`,
            text: 'Learn more'
          }
        }
        
        return feature
      })
    } else {
      parsedFeatures = []
    }
  } catch (e) {
    console.error('Error parsing features:', e)
  }

  let parsedMapPoints = []
  try {
    if (content.mapPoints) {
      parsedMapPoints = JSON.parse(content.mapPoints.toString())
      if (!Array.isArray(parsedMapPoints)) {
        parsedMapPoints = []
      }
    }
  } catch (e) {
    console.error('Error parsing map points:', e)
  }

  const homeContent: HomeContent = {
    title: content.title || 'Welcome to FaithTech',
    description: content.description || 'Empowering faith communities with modern technology solutions.',
    seoDescription: content.seoDescription,
    badge: parsedBadge,
    actions: parsedActions,
    media: parsedMedia,
    features: parsedFeatures,
    featureTitle: content.featureTitle || 'Key Features',
    featureSubtitle: content.featureSubtitle || 'Discover what makes our solutions stand out',
    featureSeoDescription: content.featureSeoDescription,
    mapTitle: content.mapTitle || 'Remote Connectivity',
    mapSubtitle: content.mapSubtitle || 'Break free from traditional boundaries.',
    mapSeoDescription: content.mapSeoDescription,
    mapPoints: parsedMapPoints,
    seoKeywords: content.seoKeywords ? JSON.parse(content.seoKeywords) : [],
    focusKeyphrase: content.focusKeyphrase,
  }

  // 生成内部链接建议
  try {
    const websiteSettings = await prisma.settings.findUnique({
      where: { type: 'website' }
    })
    const website = websiteSettings ? JSON.parse(websiteSettings.data) : null
    const internalLinks = generateInternalLinks(homeContent, website)
    
    // 记录链接建议
    console.log('Suggested internal links:', internalLinks)
  } catch (error) {
    console.error('Error generating internal links:', error)
  }

  return homeContent
}

export default async function Home() {
  const content = await getHomeContent()

  const getIconComponent = (iconName: string) => {
    const icons = {
      Zap, Settings, BarChart3, Shield, Cpu, Battery,
      Users, Bell, Calendar, Camera, Check, ChevronRight,
      Clock, Cloud, Code, Cog, Copy, CreditCard, Download,
      Edit, Eye, File, FileText, Filter, Flag, Folder,
      Globe, Heart, HomeIcon, Image, Info, Key, Link, List,
      Lock, Mail, Map, Menu, MessageCircle,
      Monitor, Moon, MoreHorizontal, MoreVertical, Package,
      Phone, Plus, Power, Printer, Radio, RefreshCw,
      Save, Search, Send, Server, Share, ShoppingCart,
      Slash, Smartphone, Star, Sun, Table, Tag, Terminal,
      Trash, Trash2, TrendingUp, User,
      Video, Volume2, Wifi, X
    }
    // 转换为小写进行比较
    const lowercaseIconName = iconName.toLowerCase()
    const iconEntry = Object.entries(icons).find(([key]) => key.toLowerCase() === lowercaseIconName)
    return iconEntry ? iconEntry[1] : Zap
  }

  if (!content) return null

  return (
    <main>
      {/* Hero Section with SEO optimizations */}
      <HeroSection
        title={content.title}
        description={content.seoDescription || content.description}
        badge={content.badge}
        actions={content.actions}
        media={content.media}
      />

      {/* Features Grid with SEO optimizations */}
      <section 
        id="features" 
        className="container px-4 py-16 md:px-6"
        aria-label={content.featureSeoDescription || content.featureTitle}
      >
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-4">
          {content.featureTitle}
        </h2>
        {content.featureSubtitle && (
          <p className="text-xl text-muted-foreground text-center mb-12">
            {content.featureSubtitle}
          </p>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.features.map((feature: Feature) => {
            const IconComponent = getIconComponent(feature.icon)
            return (
              <Card key={feature.id}>
                <CardHeader>
                  <IconComponent 
                    className="w-10 h-10 text-blue-600" 
                    aria-hidden="true"
                  />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    {feature.seoDescription || feature.description}
                  </p>
                  {feature.link && (
                    <a 
                      href={feature.link.href}
                      className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
                      aria-label={`Learn more about ${feature.title}`}
                    >
                      {feature.link.text}
                    </a>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* World Map Section with SEO optimizations */}
      <section aria-label={content.mapSeoDescription || content.mapTitle}>
        <WorldMapDemo 
          title={content.mapTitle || "Remote Connectivity"}
          subtitle={content.mapSeoDescription || content.mapSubtitle}
          dots={content.mapPoints || []}
        />
      </section>

      {/* FAQ Section */}
      <FAQSection />
    </main>
  )
} 