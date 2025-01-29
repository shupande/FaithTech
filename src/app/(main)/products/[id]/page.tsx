import { Metadata } from 'next'
import { ProductContent } from './product-content'

// 产品数据
const products = {
  'be-1000': {
    name: 'BatteryEmulator 1000',
    description: 'Entry-level battery emulator for basic testing needs',
    fullDescription: 'The BatteryEmulator 1000 is our entry-level solution designed for basic battery emulation and testing. Perfect for small-scale development and educational purposes.',
    features: [
      {
        icon: 'battery',
        title: 'Battery Emulation',
        description: 'Accurate emulation of various battery types and characteristics'
      },
      {
        icon: 'zap',
        title: 'Power Control',
        description: 'Precise voltage and current control with high resolution'
      },
      {
        icon: 'shield',
        title: 'Protection',
        description: 'Comprehensive protection features for safe operation'
      },
      {
        icon: 'chart',
        title: 'Data Analysis',
        description: 'Real-time monitoring and data logging capabilities'
      }
    ],
    specifications: [
      { name: 'Voltage Range', value: '0-24V' },
      { name: 'Current Range', value: '0-5A' },
      { name: 'Power Rating', value: '120W' },
      { name: 'Interface', value: 'USB' },
      { name: 'Display', value: '4.3" LCD' },
      { name: 'Dimensions', value: '220x150x80mm' },
      { name: 'Weight', value: '2.5kg' },
      { name: 'Input Power', value: '110-240V AC' }
    ],
    documents: [
      {
        icon: 'file',
        title: 'User Manual',
        description: 'Complete guide for operation and maintenance',
        fileSize: '2.5 MB',
        downloadUrl: '#'
      },
      {
        icon: 'book',
        title: 'Quick Start Guide',
        description: 'Get started with basic operations',
        fileSize: '1.2 MB',
        downloadUrl: '#'
      },
      {
        icon: 'code',
        title: 'API Documentation',
        description: 'Integration guide for developers',
        fileSize: '3.1 MB',
        downloadUrl: '#'
      }
    ],
    images: [
      {
        url: '/products/be1000-1.jpg',
        alt: 'BatteryEmulator 1000 Front View'
      },
      {
        url: '/products/be1000-2.jpg',
        alt: 'BatteryEmulator 1000 Interface'
      },
      {
        url: '/products/be1000-3.jpg',
        alt: 'BatteryEmulator 1000 Connections'
      }
    ],
    price: '$2,999'
  },
  'be-2000': {
    name: 'BatteryEmulator 2000',
    description: 'Professional battery emulator for advanced testing requirements',
    fullDescription: 'The BatteryEmulator 2000 is our professional-grade solution offering advanced features and higher power capabilities. Ideal for professional labs and manufacturing testing.',
    features: [
      {
        icon: 'battery',
        title: 'Advanced Emulation',
        description: 'High-precision battery modeling with dynamic characteristics'
      },
      {
        icon: 'zap',
        title: 'Enhanced Power',
        description: 'Higher voltage and current ranges for demanding applications'
      },
      {
        icon: 'shield',
        title: 'Comprehensive Protection',
        description: 'Multi-level protection system with fault analysis'
      },
      {
        icon: 'chart',
        title: 'Advanced Analytics',
        description: 'Detailed data analysis with export capabilities'
      }
    ],
    specifications: [
      { name: 'Voltage Range', value: '0-48V' },
      { name: 'Current Range', value: '0-10A' },
      { name: 'Power Rating', value: '480W' },
      { name: 'Interface', value: 'USB, RS485' },
      { name: 'Display', value: '7" Touch LCD' },
      { name: 'Dimensions', value: '300x200x120mm' },
      { name: 'Weight', value: '4.2kg' },
      { name: 'Input Power', value: '110-240V AC' }
    ],
    documents: [
      {
        icon: 'file',
        title: 'User Manual',
        description: 'Complete guide for operation and maintenance',
        fileSize: '3.5 MB',
        downloadUrl: '#'
      },
      {
        icon: 'book',
        title: 'Quick Start Guide',
        description: 'Get started with basic operations',
        fileSize: '1.5 MB',
        downloadUrl: '#'
      },
      {
        icon: 'code',
        title: 'API Documentation',
        description: 'Integration guide for developers',
        fileSize: '4.2 MB',
        downloadUrl: '#'
      }
    ],
    images: [
      {
        url: '/products/be2000-1.jpg',
        alt: 'BatteryEmulator 2000 Front View'
      },
      {
        url: '/products/be2000-2.jpg',
        alt: 'BatteryEmulator 2000 Interface'
      },
      {
        url: '/products/be2000-3.jpg',
        alt: 'BatteryEmulator 2000 Connections'
      }
    ],
    price: '$4,999'
  },
  'be-3000': {
    name: 'BatteryEmulator 3000',
    description: 'High-end battery emulator for industrial and research applications',
    fullDescription: 'The BatteryEmulator 3000 is our flagship model designed for demanding industrial and research applications. Features the highest power capacity and most advanced capabilities.',
    features: [
      {
        icon: 'battery',
        title: 'Premium Emulation',
        description: 'Ultra-precise battery modeling with advanced algorithms'
      },
      {
        icon: 'zap',
        title: 'Maximum Power',
        description: 'Highest voltage and current capabilities in the series'
      },
      {
        icon: 'shield',
        title: 'Ultimate Protection',
        description: 'Advanced protection system with predictive warnings'
      },
      {
        icon: 'chart',
        title: 'Professional Analytics',
        description: 'Comprehensive data analysis and reporting system'
      }
    ],
    specifications: [
      { name: 'Voltage Range', value: '0-100V' },
      { name: 'Current Range', value: '0-20A' },
      { name: 'Power Rating', value: '2000W' },
      { name: 'Interface', value: 'USB, RS485, Ethernet' },
      { name: 'Display', value: '10.1" Touch LCD' },
      { name: 'Dimensions', value: '400x300x150mm' },
      { name: 'Weight', value: '8.5kg' },
      { name: 'Input Power', value: '110-240V AC' }
    ],
    documents: [
      {
        icon: 'file',
        title: 'User Manual',
        description: 'Complete guide for operation and maintenance',
        fileSize: '4.8 MB',
        downloadUrl: '#'
      },
      {
        icon: 'book',
        title: 'Quick Start Guide',
        description: 'Get started with basic operations',
        fileSize: '2.1 MB',
        downloadUrl: '#'
      },
      {
        icon: 'code',
        title: 'API Documentation',
        description: 'Integration guide for developers',
        fileSize: '5.5 MB',
        downloadUrl: '#'
      }
    ],
    images: [
      {
        url: '/products/be3000-1.jpg',
        alt: 'BatteryEmulator 3000 Front View'
      },
      {
        url: '/products/be3000-2.jpg',
        alt: 'BatteryEmulator 3000 Interface'
      },
      {
        url: '/products/be3000-3.jpg',
        alt: 'BatteryEmulator 3000 Connections'
      }
    ],
    price: '$7,999'
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = products[params.id as keyof typeof products]
  
  return {
    title: `${product.name} - BatteryEmulator`,
    description: product.description,
  }
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products[params.id as keyof typeof products]
  if (!product) {
    return null
  }

  // Get related products (excluding current product)
  const relatedProducts = Object.values(products).filter(p => p !== product)

  return <ProductContent product={product} relatedProducts={relatedProducts} productId={params.id} />
} 