'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronLeft, ChevronRight, Download, Battery, Zap, Shield, BarChart3, FileText, Book, FileCode } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ProductImages } from "@/components/product-images"
import { Input } from "@/components/ui/input"
import type { LucideIcon } from 'lucide-react'

// 图标映射
const ICON_MAP = {
  battery: Battery,
  zap: Zap,
  shield: Shield,
  chart: BarChart3,
  file: FileText,
  book: Book,
  code: FileCode
}

interface ProductFeature {
  icon: string
  title: string
  description: string
}

interface ProductSpecification {
  name: string
  value: string
}

interface ProductDocument {
  icon: string
  title: string
  description: string
  fileSize: string
  downloadUrl: string
}

interface ProductModel {
  name: string
  voltage: string
  current: string
  interface: string
  features: string
}

interface Product {
  name: string
  description: string
  fullDescription: string
  features: ProductFeature[]
  specifications: ProductSpecification[]
  documents: ProductDocument[]
  models: {
    name: string
    description: string
    features: string[]
  }[]
  images: {
    url: string
    alt: string
  }[]
  price: string
}

interface ProductContentProps {
  product: Product
  relatedProducts: Product[]
  productId: string
}

// 生成演示型号的函数
function generateDemoModels(baseModel: string): ProductModel[] {
  const models: ProductModel[] = []
  const series = baseModel.toUpperCase() // 例如 "BE-1000"
  
  // 根据不同系列设置不同的规格
  const specs = {
    'BE-1000': {
      voltages: ['0-24V', '0-36V'],
      currents: ['5A', '10A', '15A'],
      interfaces: ['USB', 'USB + RS485']
    },
    'BE-2000': {
      voltages: ['0-48V', '0-60V'],
      currents: ['10A', '20A', '30A'],
      interfaces: ['USB', 'USB + RS485', 'USB + RS485 + Ethernet']
    },
    'BE-3000': {
      voltages: ['0-100V', '0-120V'],
      currents: ['20A', '40A', '50A'],
      interfaces: ['USB', 'USB + RS485', 'USB + RS485 + Ethernet', 'All Interfaces']
    }
  }[series] || {
    voltages: ['0-24V'],
    currents: ['5A'],
    interfaces: ['USB']
  }

  // 基本型号
  const baseModels = [
    { suffix: 'S', level: 'Standard' },
    { suffix: 'P', level: 'Professional' },
    { suffix: 'E', level: 'Enterprise' }
  ]

  // 为每个基本型号生成所有电流规格的变体
  baseModels.forEach(({ suffix, level }) => {
    specs.currents.forEach(current => {
      specs.voltages.forEach(voltage => {
        specs.interfaces.forEach(interface_type => {
          models.push({
            name: `${series}-${suffix}`,
            voltage,
            current,
            interface: interface_type,
            features: `${level} Features, ${level} Support`
          })
        })
      })
    })
  })

  // 扩展型号
  const extendedModels = [
    { suffix: 'H', desc: 'High Power' },
    { suffix: 'L', desc: 'Low Power' },
    { suffix: 'M', desc: 'Multi-Range' },
    { suffix: 'Pro', desc: 'Professional' },
    { suffix: 'Plus', desc: 'Enhanced' }
  ]

  // 为每个扩展型号生成变体
  extendedModels.forEach(({ suffix, desc }) => {
    specs.currents.forEach(current => {
      models.push({
        name: `${series}-${suffix}`,
        voltage: specs.voltages[Math.floor(Math.random() * specs.voltages.length)],
        current,
        interface: specs.interfaces[Math.floor(Math.random() * specs.interfaces.length)],
        features: `${desc} Features, Extended Support`
      })
    })
  })

  // 特殊型号
  const specialModels = [
    {
      name: `${series}-Custom`,
      voltage: specs.voltages[specs.voltages.length - 1],
      current: specs.currents[specs.currents.length - 1],
      interface: specs.interfaces[specs.interfaces.length - 1],
      features: 'Custom Features, Premium Support'
    },
    {
      name: `${series}-Lab`,
      voltage: specs.voltages[0],
      current: specs.currents[0],
      interface: specs.interfaces[0],
      features: 'Laboratory Features, Basic Support'
    }
  ]
  models.push(...specialModels)

  return models.sort((a, b) => a.name.localeCompare(b.name))
}

export function ProductContent({ product, relatedProducts, productId }: ProductContentProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('features')

  // 生成演示型号列表
  const demoModels = generateDemoModels(productId)
  const filteredModels = demoModels.filter(model => {
    const search = searchQuery.toLowerCase()
    return (
      model.name.toLowerCase().includes(search) ||
      model.voltage.toLowerCase().includes(search) ||
      model.current.toLowerCase().includes(search) ||
      model.interface.toLowerCase().includes(search) ||
      model.features.toLowerCase().includes(search)
    )
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="container py-8 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-5 overflow-x-auto">
        <Link href="/" className="hover:text-gray-900 whitespace-nowrap">Home</Link>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <Link href="/products" className="hover:text-gray-900 whitespace-nowrap">Products</Link>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <span className="text-gray-900 whitespace-nowrap">{product.name}</span>
      </nav>

      <div className="space-y-8">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline" size="icon" asChild className="flex-shrink-0">
            <Link href="/products">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">{product.name}</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <ProductImages images={product.images} />
          <div className="space-y-6 pl-0 lg:pl-4">
            <p className="text-lg md:text-xl text-gray-500 max-w-[500px]">{product.fullDescription}</p>
            <div>
              <Button size="lg">Contact Sales</Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0 space-x-6">
              <TabsTrigger 
                value="features" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 pb-2 whitespace-nowrap"
              >
                Features
              </TabsTrigger>
              <TabsTrigger 
                value="specifications" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 pb-2 whitespace-nowrap"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="models" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 pb-2 whitespace-nowrap"
              >
                Models
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 pb-2 whitespace-nowrap"
              >
                Documents
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="features" className="mt-6">
            {/* Key Features Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
              {product.features.map((feature: ProductFeature, index: number) => {
                const Icon = ICON_MAP[feature.icon as keyof typeof ICON_MAP]
                return (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="mb-2 font-semibold">{feature.title}</h3>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Product Details */}
            <div className="space-y-12 md:space-y-16">
              {/* Overview Section */}
              <section className="grid gap-8 lg:grid-cols-2 items-center">
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-bold">Advanced Battery Emulation</h2>
                  <p className="text-gray-500">
                    Experience precise battery behavior emulation with our advanced technology. 
                    Perfect for testing and validating battery-powered devices across their entire operating range.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Real-time voltage and current control</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Dynamic impedance simulation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Temperature-dependent behavior modeling</span>
                    </li>
                  </ul>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={product.images[0].url}
                    alt="Advanced Battery Emulation"
                    fill
                    className="object-cover"
                  />
                </div>
              </section>

              {/* Interface Section */}
              <section className="grid gap-8 lg:grid-cols-2 items-center">
                <div className="order-2 lg:order-1 relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={product.images[1].url}
                    alt="User Interface"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4 order-1 lg:order-2">
                  <h2 className="text-2xl font-bold">Intuitive User Interface</h2>
                  <p className="text-gray-500">
                    Control your device with our user-friendly touch interface. 
                    Access all functions and monitor real-time data with just a few taps.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>4.3" Color touch display (BE-1000)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Real-time waveform display</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Customizable dashboard layout</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Protection Features */}
              <section className="grid gap-8 lg:grid-cols-2 items-center">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Comprehensive Protection</h2>
                  <p className="text-gray-500">
                    Built-in safety features protect both the emulator and your device under test.
                    Multiple protection mechanisms ensure safe operation in all conditions.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Over-voltage protection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Over-current protection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Temperature monitoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Short-circuit protection</span>
                    </li>
                  </ul>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={product.images[2].url}
                    alt="Protection Features"
                    fill
                    className="object-cover"
                  />
                </div>
              </section>

              {/* Applications */}
              <section className="text-center space-y-8">
                <div className="max-w-2xl mx-auto space-y-4">
                  <h2 className="text-2xl font-bold">Applications</h2>
                  <p className="text-gray-500">
                    Our battery emulators are used across various industries for testing and validation
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Consumer Electronics</h3>
                      <p className="text-sm text-gray-500">
                        Mobile devices, laptops, and portable electronics testing
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Automotive</h3>
                      <p className="text-sm text-gray-500">
                        Electric vehicle components and charging systems
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Industrial</h3>
                      <p className="text-sm text-gray-500">
                        Power tools and industrial equipment validation
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {product.specifications.map((spec: ProductSpecification, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b py-3"
                >
                  <span className="font-medium">{spec.name}</span>
                  <span className="text-gray-500">{spec.value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="models" className="mt-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  type="search"
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="max-w-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="text-blue-600">All Models</Button>
                <Button variant="outline" size="sm">Standard</Button>
                <Button variant="outline" size="sm">Professional</Button>
                <Button variant="outline" size="sm">Enterprise</Button>
              </div>
            </div>
            {/* 型号列表 */}
            <div className="border rounded-lg divide-y">
              <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 font-medium">
                <div className="col-span-3">Model</div>
                <div className="col-span-3">Voltage Range</div>
                <div className="col-span-2">Current</div>
                <div className="col-span-2">Interface</div>
                <div className="col-span-2">Features</div>
              </div>
              {filteredModels.map((model, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50">
                  <div className="col-span-3 font-medium">{model.name}</div>
                  <div className="col-span-3">{model.voltage}</div>
                  <div className="col-span-2">{model.current}</div>
                  <div className="col-span-2">{model.interface}</div>
                  <div className="col-span-2">
                    <Badge variant="secondary">{model.features}</Badge>
                  </div>
                </div>
              ))}
              {filteredModels.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No models found matching your search.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <div className="space-y-4">
              {product.documents.map((doc, index) => {
                const Icon = ICON_MAP[doc.icon as keyof typeof ICON_MAP]
                return (
                  <div key={index} className="flex flex-wrap items-center justify-between gap-4 py-4 border-b">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-blue-50 flex-shrink-0">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <p className="text-sm text-gray-500">{doc.fileSize}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" asChild>
                      <Link href={doc.downloadUrl}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <section className="mt-12 md:mt-16 space-y-8">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Related Products</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((relatedProduct, index) => {
              const productId = relatedProduct.name.match(/\d+/)?.[0]
              return (
                <Link key={index} href={`/products/be-${productId?.toLowerCase()}`}>
                  <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={relatedProduct.images[0].url}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{relatedProduct.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{relatedProduct.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
} 