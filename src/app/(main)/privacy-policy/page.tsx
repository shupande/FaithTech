import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - BatteryEmulator',
  description: 'Privacy Policy and data protection information for BatteryEmulator users',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-8 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">Privacy Policy</span>
      </nav>

      <div className="prose prose-blue max-w-none">
        <h1>Privacy Policy</h1>
        
        <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Introduction</h2>
        <p>
          BatteryEmulator ("we," "our," or "us") is committed to protecting your privacy. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
          when you visit our website or use our services.
        </p>

        <h2>2. Information We Collect</h2>
        <h3>2.1 Personal Information</h3>
        <p>We may collect personal information that you voluntarily provide to us when you:</p>
        <ul>
          <li>Register for an account</li>
          <li>Purchase our products or services</li>
          <li>Sign up for our newsletter</li>
          <li>Contact our support team</li>
          <li>Participate in surveys or promotions</li>
        </ul>

        <h3>2.2 Usage Information</h3>
        <p>We automatically collect certain information about your device when you visit our website, including:</p>
        <ul>
          <li>IP address</li>
          <li>Browser type</li>
          <li>Operating system</li>
          <li>Pages visited</li>
          <li>Time and date of visits</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use the collected information for various purposes, including:</p>
        <ul>
          <li>Providing and maintaining our services</li>
          <li>Processing your transactions</li>
          <li>Sending you technical notices and updates</li>
          <li>Responding to your inquiries</li>
          <li>Improving our website and services</li>
          <li>Complying with legal obligations</li>
        </ul>

        <h2>4. Information Sharing</h2>
        <p>We may share your information with:</p>
        <ul>
          <li>Service providers who assist in our operations</li>
          <li>Professional advisors</li>
          <li>Law enforcement when required by law</li>
          <li>Business partners with your consent</li>
        </ul>

        <h2>5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information. 
          However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Object to processing of your information</li>
          <li>Withdraw consent</li>
        </ul>

        <h2>7. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at:
          <br />
          Email: privacy@batteryemulator.com
          <br />
          Address: [Company Address]
        </p>
      </div>
    </div>
  )
} 