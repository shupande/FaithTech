import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Battery, 
  Zap, 
  Settings, 
  BarChart3, 
  Shield, 
  Download,
  ChevronRight
} from "lucide-react"

export const metadata: Metadata = {
  title: 'Products - BatteryEmulator',
  description: 'Explore our range of advanced battery emulation solutions for testing and development',
  openGraph: {
    title: 'Products - BatteryEmulator',
    description: 'Explore our range of advanced battery emulation solutions',
  },
}

const products = [
  {
    id: 'be-1000',
    name: 'BatteryEmulator 1000',
    description: 'Entry-level battery emulator, perfect for small device testing',
    longDescription: 'The BatteryEmulator 1000 is our entry-level solution designed for small-scale testing environments. Ideal for individual developers, small labs, and educational institutions.',
    features: [
      '0-24V Output Voltage Range',
      'Up to 10A Output Current',
      'Basic Battery Characteristics Emulation',
      'Built-in Over-voltage and Over-current Protection',
      'USB Interface for Control and Monitoring',
      'Compact Desktop Design',
    ],
    highlights: [
      {
        icon: Zap,
        title: 'Fast Response',
        description: 'microsecond-level voltage and current adjustments'
      },
      {
        icon: Shield,
        title: 'Safe Operation',
        description: 'comprehensive protection features'
      },
      {
        icon: Settings,
        title: 'Easy Setup',
        description: 'plug-and-play USB connectivity'
      }
    ],
    image: '/images/be-1000.jpg',
    price: '$2,999',
    badge: 'Popular Choice',
  },
  {
    id: 'be-2000',
    name: 'BatteryEmulator 2000',
    description: 'Professional battery emulator for medium-scale device development',
    longDescription: 'The BatteryEmulator 2000 is our professional-grade solution perfect for R&D labs and medium-scale testing facilities. Features advanced emulation capabilities and comprehensive data analysis.',
    features: [
      '0-48V Output Voltage Range',
      'Up to 20A Output Current',
      'Advanced Battery Characteristics Emulation',
      'Real-time Data Logging and Analysis',
      'Ethernet and USB Connectivity',
      'Rack-mountable Design',
    ],
    highlights: [
      {
        icon: BarChart3,
        title: 'Advanced Analytics',
        description: 'real-time performance monitoring'
      },
      {
        icon: Battery,
        title: 'Wide Range',
        description: '0-48V voltage output'
      },
      {
        icon: Settings,
        title: 'Flexible Control',
        description: 'multiple interface options'
      }
    ],
    image: '/images/be-2000.jpg',
    price: '$4,999',
    badge: 'Best Seller',
  },
  {
    id: 'be-3000',
    name: 'BatteryEmulator 3000',
    description: 'Enterprise-grade battery emulator for large-scale testing',
    longDescription: 'The BatteryEmulator 3000 is our flagship enterprise solution designed for large-scale testing environments. Features AI-driven emulation and cloud connectivity for remote operation.',
    features: [
      '0-100V Output Voltage Range',
      'Up to 50A Output Current',
      'AI-driven Battery Characteristics Emulation',
      'Cloud Analytics and Remote Control',
      'Multi-unit Synchronization',
      'Industrial 19" Rack Design',
    ],
    highlights: [
      {
        icon: Zap,
        title: 'High Power',
        description: 'up to 5kW output capability'
      },
      {
        icon: BarChart3,
        title: 'Cloud Analytics',
        description: 'advanced data processing'
      },
      {
        icon: Settings,
        title: 'AI-Powered',
        description: 'intelligent battery modeling'
      }
    ],
    image: '/images/be-3000.jpg',
    price: '$7,999',
    badge: 'Enterprise',
  },
]

export default function ProductsPage() {
  return (
    <main className="flex-1">
      {/* Top Feature Section */}
      <section className="relative overflow-hidden bg-gray-50">
        <div className="container px-4 py-16 md:px-6 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Advanced Battery Emulation Technology
              </h1>
              <p className="text-gray-500 md:text-xl">
                Our battery emulators provide industry-leading precision and reliability for your testing needs. With advanced features like real-time monitoring and AI-driven control systems.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">High Performance</h3>
                    <p className="text-sm text-gray-500">Microsecond response time</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Safety First</h3>
                    <p className="text-sm text-gray-500">Built-in protection</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-video lg:aspect-square">
              <Image
                src="/images/hero-product.jpg"
                alt="BatteryEmulator Advanced Technology"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container px-4 py-16 md:px-6">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter">Our Products</h2>
            <p className="text-xl text-gray-500">
              Explore our range of battery emulators, providing complete solutions for your testing and development needs
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <div className="relative aspect-video mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle>{product.name}</CardTitle>
                    {product.badge && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="mb-4 text-gray-500">{product.description}</p>
                  <ul className="space-y-2">
                    {product.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-1 h-1 rounded-full bg-blue-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex items-center justify-start pt-4">
                  <Button asChild>
                    <Link href={`/products/${product.id}`}>
                      Learn More <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Feature Section */}
      <section className="bg-gray-50">
        <div className="container px-4 py-16 md:px-6 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="relative aspect-video lg:aspect-square">
              <Image
                src="/images/software-interface.jpg"
                alt="BatteryEmulator Software Interface"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter">
                Intuitive Control Software
              </h2>
              <p className="text-gray-500 md:text-xl">
                Our advanced control software provides real-time monitoring, data logging, and comprehensive analysis tools. Easy to use interface with powerful capabilities.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Real-time Analytics</h3>
                    <p className="text-sm text-gray-500">Live data visualization</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Settings className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Easy Configuration</h3>
                    <p className="text-sm text-gray-500">Intuitive controls</p>
                  </div>
                </div>
              </div>
              <Button asChild>
                <Link href="/software">
                  Learn More About Our Software
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">
                Technical Resources
              </h2>
              <p className="text-gray-500 md:text-lg">
                Access detailed documentation, software downloads, and support materials for your BatteryEmulator products.
              </p>
              <Button variant="outline" asChild>
                <Link href="/resources">
                  <Download className="mr-2 h-4 w-4" />
                  Download Center
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">
                Need Help Choosing?
              </h2>
              <p className="text-gray-500 md:text-lg">
                Contact our team of experts to find the perfect battery emulation solution for your specific requirements.
              </p>
              <Button asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 