'use client'

import * as React from 'react'
import Link from "next/link"
import { Battery, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBox } from "@/components/search"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FooterNav } from "@/components/footer-nav"

interface SocialMediaItem {
  id: number
  platform: string
  url: string
  icon: string
  displayOrder: number
  isActive: boolean
  qrCode?: string
  hasQrCode: boolean
}

interface WebsiteSettings {
  siteName: string
  siteDescription: string
  logo: string
  favicon: string
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [socialMedia, setSocialMedia] = React.useState<SocialMediaItem[]>([])
  const [selectedQrCode, setSelectedQrCode] = React.useState<SocialMediaItem | null>(null)
  const [settings, setSettings] = React.useState<WebsiteSettings>({
    siteName: 'BatteryEmulator',
    siteDescription: '',
    logo: '',
    favicon: '',
  })

  // Fetch website settings
  React.useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings/website')
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.error('Failed to fetch website settings:', error)
      }
    }
    fetchSettings()
  }, [])

  // Fetch social media items
  React.useEffect(() => {
    async function fetchSocialMedia() {
      try {
        const response = await fetch('/api/social-media')
        const data = await response.json()
        setSocialMedia(data.filter((item: SocialMediaItem) => item.isActive))
      } catch (error) {
        console.error('Failed to fetch social media:', error)
      }
    }
    fetchSocialMedia()
  }, [])

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    return Icons[iconName as keyof typeof Icons] || Icons.twitter // fallback to twitter if icon not found
  }

  // Helper function to handle social media click
  const handleSocialMediaClick = (item: SocialMediaItem) => {
    if (item.hasQrCode && item.qrCode) {
      setSelectedQrCode(item)
    } else {
      window.open(item.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center flex-1">
            <Link href="/" className="mr-8">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt={settings.siteName}
                  className="h-8 w-auto"
                />
              ) : (
                <Battery className="h-8 w-8" />
              )}
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center">
              <MainNav />
            </nav>
          </div>
          
          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <SearchBox />
            </div>
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="container py-4">
              <div className="mb-4 -mx-4">
                <div className="px-4">
                  <SearchBox />
                </div>
              </div>
              <nav className="flex flex-col space-y-3">
                <MainNav />
              </nav>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="container py-8 md:py-12">
          <FooterNav />
          
          {/* Social Media & Copyright */}
          <div className="mt-8 pt-8 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-4">
                {socialMedia.sort((a, b) => a.displayOrder - b.displayOrder).map((item) => {
                  const IconComponent = getIconComponent(item.icon)
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSocialMediaClick(item)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <IconComponent className="h-6 w-6" />
                    </button>
                  )
                })}
              </div>
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* QR Code Dialog */}
      <Dialog open={Boolean(selectedQrCode)} onOpenChange={() => setSelectedQrCode(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedQrCode && (
                <>
                  {React.createElement(getIconComponent(selectedQrCode.icon), { className: "h-5 w-5" })}
                  <span>Follow us on {selectedQrCode.platform}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedQrCode?.qrCode && (
            <div className="flex items-center justify-center p-6">
              <img
                src={selectedQrCode.qrCode}
                alt={`${selectedQrCode.platform} QR Code`}
                className="max-w-full h-auto"
                style={{ maxHeight: '300px' }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 