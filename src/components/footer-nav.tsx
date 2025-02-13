'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NavigationItemType } from '@/lib/api/types'

export function FooterNav() {
  const [sections, setSections] = useState<NavigationItemType[]>([])

  useEffect(() => {
    async function fetchFooterSections() {
      try {
        const response = await fetch('/api/navigation?type=footer')
        const data = await response.json()
        if (data.success) {
          setSections(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch footer sections:', error)
      }
    }
    fetchFooterSections()
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {sections.map((section) => (
        <div key={section.id}>
          <h3 className="font-semibold mb-3">{section.label}</h3>
          <ul className="space-y-2">
            {section.children?.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url}
                  className="text-gray-500 hover:text-gray-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
} 