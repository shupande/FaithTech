'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import {
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { adminNav } from "@/config/admin-nav"
import { toast } from "sonner"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // 如果是登录页面,不显示admin layout
  const pathname = usePathname()
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])
  const router = useRouter()

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      toast.success('Logged out successfully')
      router.push('/admin/login')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-white border-r overflow-y-auto max-h-screen",
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
          {/* Navigation Items */}
          {adminNav.map((item) => {
            const isActive = pathname === item.href || 
              (item.submenu && item.submenu.some(subItem => pathname === subItem.href))

            const MenuContent = (
              <div className="flex items-center gap-3 flex-1">
                {item.icon && <item.icon className="h-5 w-5" />}
                {item.title}
              </div>
            )

            return (
              <div key={item.href} className="mt-2">
                {item.submenu ? (
                  <div
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer",
                      isActive && "bg-gray-100 text-blue-600"
                    )}
                    onClick={() => toggleExpanded(item.title)}
                  >
                    {MenuContent}
                    <div className={cn(
                      "transform transition-transform",
                      expandedItems.includes(item.title) ? "rotate-90" : ""
                    )}>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100",
                      isActive && "bg-gray-100 text-blue-600"
                    )}
                  >
                    {MenuContent}
                  </Link>
                )}

                {item.submenu && expandedItems.includes(item.title) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100",
                          pathname === subItem.href && "bg-gray-100 text-blue-600"
                        )}
                      >
                        {subItem.title}
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
              <Button variant="ghost" size="icon" onClick={handleLogout}>
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