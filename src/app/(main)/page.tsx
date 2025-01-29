import * as React from "react"
import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Battery, Zap, Settings, BarChart3, Shield, Cpu } from "lucide-react"
import { HomeHero } from "@/components/blocks/home-hero"
import { WorldMapDemo } from "@/components/blocks/world-map-demo"
import { FAQSection } from "@/components/blocks/faq-section"

export const metadata: Metadata = {
  title: 'BatteryEmulator - Advanced Battery Emulation Solutions',
  description: 'Simulate real-world battery behavior with precision. Perfect for testing, development, and validation of battery-powered systems.',
  openGraph: {
    title: 'BatteryEmulator - Advanced Battery Emulation Solutions',
    description: 'Simulate real-world battery behavior with precision.',
    type: 'website',
  },
}

export default function Home() {
  return (
    <main>
      <HomeHero />

      {/* Features Grid */}
      <section id="features" className="container px-4 py-16 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Key Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Zap className="w-10 h-10 text-blue-600" />
              <CardTitle>High Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Industry-leading response times and precision for accurate battery simulation.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Settings className="w-10 h-10 text-blue-600" />
              <CardTitle>Configurable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Easily customize parameters to match your specific testing requirements.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <BarChart3 className="w-10 h-10 text-blue-600" />
              <CardTitle>Real-time Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Monitor and analyze battery behavior with advanced data visualization tools.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="w-10 h-10 text-blue-600" />
              <CardTitle>Safety Features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Built-in protection mechanisms ensure safe operation during testing.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Cpu className="w-10 h-10 text-blue-600" />
              <CardTitle>Advanced Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Sophisticated control algorithms for precise battery behavior emulation.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Battery className="w-10 h-10 text-blue-600" />
              <CardTitle>Multiple Models</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Support for various battery types and chemistries in a single device.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* World Map Section */}
      <WorldMapDemo />

      {/* FAQ Section */}
      <FAQSection />
    </main>
  )
} 