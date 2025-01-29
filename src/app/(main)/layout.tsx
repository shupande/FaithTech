'use client'

import * as React from 'react'
import Link from "next/link"
import { Battery, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBox } from "@/components/search"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center flex-1">
            <Link href="/" className="mr-8 flex items-center space-x-2">
              <Battery className="h-6 w-6" />
              <span className="font-bold">BatteryEmulator</span>
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="font-medium">Home</Link>
              <Link href="/products" className="font-medium">Products</Link>
              <Link href="/solutions" className="font-medium">Solutions</Link>
              <Link href="/services" className="font-medium">Services</Link>
              <Link href="/news" className="font-medium">News</Link>
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
                <Link 
                  href="/" 
                  className="px-2 py-1 font-medium hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/products" 
                  className="px-2 py-1 font-medium hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link 
                  href="/solutions" 
                  className="px-2 py-1 font-medium hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Solutions
                </Link>
                <Link 
                  href="/services" 
                  className="px-2 py-1 font-medium hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <Link 
                  href="/news" 
                  className="px-2 py-1 font-medium hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  News
                </Link>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Products</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/products/be-1000" className="text-gray-500 hover:text-gray-900">
                    BE-1000 Series
                  </Link>
                </li>
                <li>
                  <Link href="/products/be-2000" className="text-gray-500 hover:text-gray-900">
                    BE-2000 Series
                  </Link>
                </li>
                <li>
                  <Link href="/products/be-3000" className="text-gray-500 hover:text-gray-900">
                    BE-3000 Series
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Solutions</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/solutions" className="text-gray-500 hover:text-gray-900">
                    Overview
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-500 hover:text-gray-900">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="text-gray-500 hover:text-gray-900">
                    News
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-gray-500 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-500 hover:text-gray-900">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/downloads" className="text-gray-500 hover:text-gray-900">
                    Downloads
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className="text-gray-500 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-gray-500 hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="text-gray-500 hover:text-gray-900">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
} 