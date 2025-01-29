import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service - BatteryEmulator',
  description: 'Terms of Service and usage conditions for BatteryEmulator products and services',
}

export default function TermsOfServicePage() {
  return (
    <div className="container py-8 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">Terms of Service</span>
      </nav>

      <div className="prose prose-blue max-w-none">
        <h1>Terms of Service</h1>
        
        <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Agreement to Terms</h2>
        <p>
          By accessing or using BatteryEmulator's website, products, or services, you agree to be bound 
          by these Terms of Service. If you disagree with any part of these terms, you may not access 
          our services.
        </p>

        <h2>2. Products and Services</h2>
        <h3>2.1 Product Use</h3>
        <p>
          Our battery emulation products are designed for professional use in research, development, 
          and testing environments. Users must follow all safety guidelines and operating instructions 
          provided with the products.
        </p>

        <h3>2.2 Service Availability</h3>
        <p>
          We strive to maintain high availability of our services but do not guarantee uninterrupted 
          access. We reserve the right to modify, suspend, or discontinue any part of our services 
          with or without notice.
        </p>

        <h2>3. User Responsibilities</h2>
        <p>You agree to:</p>
        <ul>
          <li>Provide accurate information when registering or making purchases</li>
          <li>Maintain the security of your account credentials</li>
          <li>Use our products and services in compliance with applicable laws</li>
          <li>Not reverse engineer or modify our products without authorization</li>
          <li>Not use our services for any illegal or unauthorized purpose</li>
        </ul>

        <h2>4. Intellectual Property</h2>
        <p>
          All content, features, and functionality of our website and products, including but not 
          limited to text, graphics, logos, and software, are the exclusive property of BatteryEmulator 
          and are protected by international copyright, trademark, and other intellectual property laws.
        </p>

        <h2>5. Warranty and Liability</h2>
        <h3>5.1 Product Warranty</h3>
        <p>
          Our products come with a limited warranty as specified in the product documentation. This 
          warranty is exclusive and in lieu of all other warranties, whether express or implied.
        </p>

        <h3>5.2 Limitation of Liability</h3>
        <p>
          To the maximum extent permitted by law, BatteryEmulator shall not be liable for any indirect, 
          incidental, special, consequential, or punitive damages arising from the use of our products 
          or services.
        </p>

        <h2>6. Termination</h2>
        <p>
          We may terminate or suspend your access to our services immediately, without prior notice or 
          liability, for any reason, including breach of these Terms.
        </p>

        <h2>7. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. We will notify users of any material 
          changes via email or through our website.
        </p>

        <h2>8. Contact Information</h2>
        <p>
          For questions about these Terms of Service, please contact us at:
          <br />
          Email: legal@batteryemulator.com
          <br />
          Address: [Company Address]
        </p>
      </div>
    </div>
  )
} 