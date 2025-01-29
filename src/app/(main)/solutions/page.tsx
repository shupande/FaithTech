import * as React from "react"
import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Factory, 
  Car, 
  School, 
  Beaker, 
  Smartphone, 
  Power
} from "lucide-react"

export const metadata: Metadata = {
  title: 'Solutions - BatteryEmulator',
  description: 'Industry-specific battery emulation solutions for various sectors including automotive, manufacturing, research, and education.',
}

export default function SolutionsPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Industry Solutions
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Discover how our battery emulation technology can transform your industry with precise, reliable, and customizable solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="container px-4 py-16 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Car className="w-10 h-10 text-blue-600" />
              <CardTitle>Automotive</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Comprehensive testing solutions for EV batteries, charging systems, and power management units. Support for various voltage ranges and battery types.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Factory className="w-10 h-10 text-blue-600" />
              <CardTitle>Manufacturing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Production line testing and quality control solutions. High throughput capabilities with automated testing sequences.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Beaker className="w-10 h-10 text-blue-600" />
              <CardTitle>Research & Development</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Advanced battery simulation for research institutions. Precise control and detailed data analysis capabilities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <School className="w-10 h-10 text-blue-600" />
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Educational solutions for universities and training centers. Safe and controlled environment for battery technology learning.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Smartphone className="w-10 h-10 text-blue-600" />
              <CardTitle>Consumer Electronics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Testing solutions for mobile devices, laptops, and consumer electronics. Support for multiple battery chemistries.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Power className="w-10 h-10 text-blue-600" />
              <CardTitle>Energy Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Solutions for grid storage systems and renewable energy applications. High power capabilities with bidirectional operation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Need a Custom Solution?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl">
              Contact our team to discuss your specific requirements and how we can help you achieve your testing goals.
            </p>
            <a
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  )
} 