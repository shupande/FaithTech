'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { NavigationItemType } from "@/lib/api/types"

export function MainNav() {
  const pathname = usePathname()
  const [items, setItems] = useState<NavigationItemType[]>([])

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const response = await fetch('/api/navigation?type=header')
        const data = await response.json()
        if (data.success) {
          setItems(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch navigation:', error)
      }
    }

    fetchNavigation()
  }, [])

  const renderNavItem = (item: NavigationItemType) => {
    if (item.children && item.children.length > 0) {
      return (
        <div key={item.id} className="relative group">
          <Link
            href={item.url}
            className={cn(
              "flex items-center text-base font-medium text-foreground transition-colors hover:text-primary md:px-4 md:py-2",
              pathname === item.url && "text-primary"
            )}
          >
            {item.label}
            <svg
              className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Link>
          <div className="absolute left-0 invisible opacity-0 translate-y-1 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0">
            <div className="px-2 py-2 mt-2 bg-background rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
              {item.children.map((child) => (
                <Link
                  key={child.id}
                  href={child.url}
                  className={cn(
                    "block px-4 py-2 text-base text-foreground transition-colors hover:text-primary hover:bg-muted rounded-sm",
                    pathname === child.url && "text-primary"
                  )}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <Link
        key={item.id}
        href={item.url}
        className={cn(
          "text-base font-medium text-foreground transition-colors hover:text-primary md:px-4 md:py-2",
          pathname === item.url && "text-primary"
        )}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <nav className="flex md:items-center md:space-x-4 flex-col md:flex-row space-y-3 md:space-y-0">
      {items.filter(item => item.active).map(renderNavItem)}
    </nav>
  )
} 