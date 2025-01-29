'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  Package,
  Lightbulb,
  Wrench,
  Newspaper,
  FileQuestion,
  Download,
  ScrollText,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package
  },
  {
    title: "Solutions",
    href: "/admin/solutions",
    icon: Lightbulb
  },
  {
    title: "Services",
    href: "/admin/services",
    icon: Wrench
  },
  {
    title: "News",
    href: "/admin/news",
    icon: Newspaper
  },
  {
    title: "Pages",
    href: "/admin/pages",
    icon: FileText
  },
  {
    title: "Navigation",
    href: "/admin/navigation",
    icon: Menu
  },
  {
    title: "Support",
    href: "/admin/support",
    icon: FileQuestion,
    children: [
      {
        title: "FAQ",
        href: "/admin/support/faq",
      },
      {
        title: "Downloads",
        href: "/admin/support/downloads",
      }
    ]
  },
  {
    title: "Legal",
    href: "/admin/legal",
    icon: ScrollText,
    children: [
      {
        title: "Privacy Policy",
        href: "/admin/legal/privacy-policy",
      },
      {
        title: "Terms of Service",
        href: "/admin/legal/terms-of-service",
      },
      {
        title: "Cookie Policy",
        href: "/admin/legal/cookie-policy",
      }
    ]
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])
  const pathname = usePathname()

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-white border-r",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isExpanded = expandedItems.includes(item.href)
            const isActive = pathname === item.href || 
              (item.children && item.children.some(child => pathname === child.href))

            return (
              <div key={item.href}>
                <Link
                  href={item.children ? "#" : item.href}
                  onClick={item.children ? () => toggleExpanded(item.href) : undefined}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100",
                    isActive && "bg-gray-100 text-blue-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    {item.title}
                  </div>
                  {item.children && (
                    <Menu 
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "rotate-90"
                      )} 
                    />
                  )}
                </Link>
                {item.children && isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100",
                          pathname === child.href && "bg-gray-100 text-blue-600"
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "transition-all",
        isSidebarOpen ? "lg:ml-64" : ""
      )}>
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-white border-b">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 