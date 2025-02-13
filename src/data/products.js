const products = {
  'be-1000': {
    name: 'BatteryEmulator 1000',
    description: 'Entry-level battery emulator for small device testing',
    fullDescription: 'The BatteryEmulator 1000 is our entry-level solution designed for testing small battery-powered devices. Perfect for R&D labs and small-scale production testing.',
    features: [
      {
        icon: 'battery',
        title: 'Basic Battery Emulation',
        description: 'Accurate emulation of basic battery characteristics'
      },
      {
        icon: 'zap',
        title: 'Fast Response Time',
        description: 'Quick voltage and current adjustments'
      },
      {
        icon: 'shield',
        title: 'Protection Features',
        description: 'Built-in overcurrent and overvoltage protection'
      },
      {
        icon: 'chart',
        title: 'Data Logging',
        description: 'Basic data logging and analysis capabilities'
      }
    ],
    specifications: [
      { name: 'Voltage Range', value: '0-24V' },
      { name: 'Max Current', value: '5A' },
      { name: 'Interface', value: 'USB, RS485' },
      { name: 'Accuracy', value: '±0.1%' }
    ],
    documents: [
      {
        icon: 'file',
        title: 'User Manual',
        description: 'Complete guide for BE-1000',
        fileSize: '2.5 MB',
        downloadUrl: '/docs/be-1000-manual.pdf'
      },
      {
        icon: 'book',
        title: 'Quick Start Guide',
        description: 'Get started with BE-1000',
        fileSize: '1.2 MB',
        downloadUrl: '/docs/be-1000-quickstart.pdf'
      },
      {
        icon: 'code',
        title: 'API Documentation',
        description: 'API reference for BE-1000',
        fileSize: '800 KB',
        downloadUrl: '/docs/be-1000-api.pdf'
      }
    ],
    models: [
      {
        name: 'BE-1000-S',
        description: 'Standard model with basic features',
        features: ['USB Interface', 'Basic Data Logging']
      },
      {
        name: 'BE-1000-P',
        description: 'Professional model with enhanced features',
        features: ['USB & RS485 Interface', 'Advanced Data Logging', 'Extended Warranty']
      }
    ],
    images: [
      {
        url: '/images/be-1000-main.jpg',
        alt: 'BatteryEmulator 1000 Front View'
      },
      {
        url: '/images/be-1000-side.jpg',
        alt: 'BatteryEmulator 1000 Side View'
      }
    ],
    price: 'Contact Sales'
  },
  'be-2000': {
    name: 'BatteryEmulator 2000',
    description: 'Professional battery emulator for medium-scale applications',
    fullDescription: 'The BatteryEmulator 2000 is our professional-grade solution for medium-scale battery emulation needs. Ideal for production testing and advanced R&D applications.',
    features: [
      {
        icon: 'battery',
        title: 'Advanced Battery Emulation',
        description: 'High-precision emulation of complex battery behaviors'
      },
      {
        icon: 'zap',
        title: 'High Power Output',
        description: 'Enhanced power capabilities for demanding applications'
      },
      {
        icon: 'shield',
        title: 'Comprehensive Protection',
        description: 'Multi-layer protection system with fault detection'
      },
      {
        icon: 'chart',
        title: 'Advanced Analytics',
        description: 'Real-time data analysis and reporting'
      }
    ],
    specifications: [
      { name: 'Voltage Range', value: '0-48V' },
      { name: 'Max Current', value: '20A' },
      { name: 'Interface', value: 'USB, RS485, Ethernet' },
      { name: 'Accuracy', value: '±0.05%' }
    ],
    documents: [
      {
        icon: 'file',
        title: 'User Manual',
        description: 'Complete guide for BE-2000',
        fileSize: '3.5 MB',
        downloadUrl: '/docs/be-2000-manual.pdf'
      },
      {
        icon: 'book',
        title: 'Quick Start Guide',
        description: 'Get started with BE-2000',
        fileSize: '1.5 MB',
        downloadUrl: '/docs/be-2000-quickstart.pdf'
      },
      {
        icon: 'code',
        title: 'API Documentation',
        description: 'API reference for BE-2000',
        fileSize: '1.2 MB',
        downloadUrl: '/docs/be-2000-api.pdf'
      }
    ],
    models: [
      {
        name: 'BE-2000-P',
        description: 'Professional model for standard applications',
        features: ['All Basic Interfaces', 'Advanced Analytics', 'Remote Control']
      },
      {
        name: 'BE-2000-E',
        description: 'Enterprise model with full feature set',
        features: ['All Interfaces', 'Premium Analytics', 'Priority Support', 'Extended Warranty']
      }
    ],
    images: [
      {
        url: '/images/be-2000-main.jpg',
        alt: 'BatteryEmulator 2000 Front View'
      },
      {
        url: '/images/be-2000-side.jpg',
        alt: 'BatteryEmulator 2000 Side View'
      }
    ],
    price: 'Contact Sales'
  },
  'be-3000': {
    name: 'BatteryEmulator 3000',
    description: 'Enterprise-grade battery emulator for large-scale testing',
    fullDescription: 'The BatteryEmulator 3000 is our flagship enterprise solution, designed for large-scale testing environments and high-precision applications.',
    features: [
      {
        icon: 'battery',
        title: 'Premium Battery Emulation',
        description: 'Ultra-precise emulation with advanced modeling'
      },
      {
        icon: 'zap',
        title: 'Maximum Performance',
        description: 'Industry-leading power and precision'
      },
      {
        icon: 'shield',
        title: 'Enterprise Security',
        description: 'Advanced security features and redundancy'
      },
      {
        icon: 'chart',
        title: 'Enterprise Analytics',
        description: 'Comprehensive data analysis and integration'
      }
    ],
    specifications: [
      { name: 'Voltage Range', value: '0-100V' },
      { name: 'Max Current', value: '50A' },
      { name: 'Interface', value: 'USB, RS485, Ethernet, CAN' },
      { name: 'Accuracy', value: '±0.01%' }
    ],
    documents: [
      {
        icon: 'file',
        title: 'User Manual',
        description: 'Complete guide for BE-3000',
        fileSize: '4.5 MB',
        downloadUrl: '/docs/be-3000-manual.pdf'
      },
      {
        icon: 'book',
        title: 'Quick Start Guide',
        description: 'Get started with BE-3000',
        fileSize: '2.0 MB',
        downloadUrl: '/docs/be-3000-quickstart.pdf'
      },
      {
        icon: 'code',
        title: 'API Documentation',
        description: 'API reference for BE-3000',
        fileSize: '1.5 MB',
        downloadUrl: '/docs/be-3000-api.pdf'
      }
    ],
    models: [
      {
        name: 'BE-3000-E',
        description: 'Enterprise model for demanding applications',
        features: ['All Interfaces', 'Enterprise Analytics', '24/7 Support']
      },
      {
        name: 'BE-3000-EX',
        description: 'Extended enterprise model with custom features',
        features: ['Custom Interfaces', 'Custom Analytics', 'Dedicated Support Team', 'Custom Warranty']
      }
    ],
    images: [
      {
        url: '/images/be-3000-main.jpg',
        alt: 'BatteryEmulator 3000 Front View'
      },
      {
        url: '/images/be-3000-side.jpg',
        alt: 'BatteryEmulator 3000 Side View'
      }
    ],
    price: 'Contact Sales'
  }
}

export default products 