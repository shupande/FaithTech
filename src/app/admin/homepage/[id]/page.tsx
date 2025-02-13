import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { SectionForm } from "@/components/sections/section-form"

interface HomePageSectionEditProps {
  params: {
    id: string
  }
}

async function getSection(id: string) {
  try {
    const section = await prisma.sectionContent.findUnique({
      where: {
        id
      }
    })

    if (!section) return null

    // 解析JSON字段
    return {
      ...section,
      badge: section.badge ? JSON.parse(section.badge) : null,
      actions: section.actions ? JSON.parse(section.actions) : [],
      media: section.media ? JSON.parse(section.media) : null,
      features: section.features ? JSON.parse(section.features) : [],
      mapPoints: section.mapPoints ? JSON.parse(section.mapPoints) : [],
      thumbnail: section.thumbnail // 包含缩略图URL
    }
  } catch (error) {
    console.error('Failed to fetch section:', error)
    return null
  }
}

export default async function HomePageSectionEdit({ params }: HomePageSectionEditProps) {
  const section = await getSection(params.id)

  if (!section) {
    notFound()
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Edit Homepage Section</h1>
      </div>

      <SectionForm section={section} isEdit />
    </div>
  )
} 