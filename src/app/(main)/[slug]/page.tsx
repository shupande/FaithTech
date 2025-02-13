import { notFound } from 'next/navigation'
import { prisma } from "@/lib/prisma"
import { Hero } from "@/components/hero"

export const revalidate = 3600 // 1小时缓存

async function getPageBySlug(slug: string) {
  try {
    const page = await prisma.page.findUnique({
      where: {
        slug,
        status: 'Published',
      },
    })
    return page
  } catch (error) {
    console.error('Failed to fetch page:', error)
    return null
  }
}

export default async function DynamicPage({
  params,
}: {
  params: { slug: string }
}) {
  const page = await getPageBySlug(params.slug)

  if (!page) {
    notFound()
  }

  // Parse JSON fields and validate hero data
  let hero = null
  let seo = null

  try {
    const heroData = page.hero ? (typeof page.hero === 'string' ? JSON.parse(page.hero) : page.hero) : null
    // 只有当 hero 数据完整时才显示
    if (heroData && 
        heroData.title && 
        heroData.description && 
        heroData.image && 
        heroData.image.light && 
        heroData.image.dark) {
      hero = heroData
    }
    
    seo = page.seo ? (typeof page.seo === 'string' ? JSON.parse(page.seo) : page.seo) : null
  } catch (error) {
    console.error('Failed to parse hero or seo data:', error)
  }

  return (
    <main className="flex-1">
      {hero && <Hero {...hero} />}
      <div className="container py-8 md:py-12">
        <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </main>
  )
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const page = await getPageBySlug(params.slug)

  if (!page) {
    return {}
  }

  const seo = page.seo ? JSON.parse(page.seo) : null

  return {
    title: seo?.title || page.title,
    description: seo?.description,
    keywords: seo?.keywords,
    openGraph: {
      title: seo?.title || page.title,
      description: seo?.description,
      images: seo?.ogImage ? [seo.ogImage] : [],
    },
  }
} 