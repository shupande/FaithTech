import { redirect } from 'next/navigation'
import { prisma } from "@/lib/prisma"

async function getHomeSection() {
  try {
    const section = await prisma.sectionContent.findFirst({
      where: {
        name: 'home'
      }
    })
    return section
  } catch (error) {
    console.error('Failed to fetch home section:', error)
    return null
  }
}

export default async function HomePageManagement() {
  const section = await getHomeSection()

  // 如果找到了主页内容，重定向到编辑页面
  if (section) {
    redirect(`/admin/homepage/${section.id}`)
  }

  // 如果没有找到主页内容，重定向到创建页面
  redirect('/admin/homepage/new')
} 