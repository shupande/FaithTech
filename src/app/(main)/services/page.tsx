import * as React from "react"
import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Wrench, 
  GraduationCap, 
  FileCode, 
  HeartHandshake, 
  BarChart3, 
  Clock
} from "lucide-react"

export const metadata: Metadata = {
  title: 'Services - BatteryEmulator',
  description: 'Comprehensive support services for battery emulation solutions including installation, training, consulting, and maintenance.',
}

export default function ServicesPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Professional Services
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Expert support and services to ensure you get the most out of your battery emulation solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container px-4 py-16 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Wrench className="w-10 h-10 text-blue-600" />
              <CardTitle>Installation & Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Professional installation and configuration services to ensure your battery emulation system is properly set up and optimized for your specific requirements.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <GraduationCap className="w-10 h-10 text-blue-600" />
              <CardTitle>Training Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Comprehensive training sessions for your team, covering system operation, maintenance, and best practices for battery emulation testing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileCode className="w-10 h-10 text-blue-600" />
              <CardTitle>Custom Development</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Tailored software development services to integrate our battery emulators with your existing systems and create custom testing sequences.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <HeartHandshake className="w-10 h-10 text-blue-600" />
              <CardTitle>Technical Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Dedicated technical support team available to assist with troubleshooting, maintenance, and system optimization whenever you need help.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="w-10 h-10 text-blue-600" />
              <CardTitle>Consulting Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Expert consultation for test system design, workflow optimization, and integration strategies to maximize your testing efficiency.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="w-10 h-10 text-blue-600" />
              <CardTitle>Maintenance Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Regular maintenance and calibration services to ensure your battery emulation systems maintain peak performance and accuracy.
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
              Need Specialized Support?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl">
              Contact our service team to discuss your specific requirements and how we can help you achieve optimal testing results.
            </p>
            <a
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </main>
  )
} 