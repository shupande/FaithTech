import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cookie Policy - BatteryEmulator',
  description: 'Information about how BatteryEmulator uses cookies and similar technologies',
}

export default function CookiePolicyPage() {
  return (
    <div className="container py-8 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">Cookie Policy</span>
      </nav>

      <div className="prose prose-blue max-w-none">
        <h1>Cookie Policy</h1>
        
        <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. What Are Cookies</h2>
        <p>
          Cookies are small text files that are placed on your computer or mobile device when you visit 
          our website. They are widely used to make websites work more efficiently and provide useful 
          information to website owners.
        </p>

        <h2>2. How We Use Cookies</h2>
        <p>We use cookies for several purposes, including:</p>
        <ul>
          <li>Essential cookies: Required for the website to function properly</li>
          <li>Analytics cookies: To understand how visitors use our website</li>
          <li>Preference cookies: To remember your settings and preferences</li>
          <li>Marketing cookies: To deliver more relevant advertisements</li>
        </ul>

        <h2>3. Types of Cookies We Use</h2>
        <h3>3.1 Essential Cookies</h3>
        <p>
          These cookies are necessary for the website to function and cannot be switched off. They are 
          usually only set in response to actions you take, such as logging in or filling out forms.
        </p>

        <h3>3.2 Analytics Cookies</h3>
        <p>
          We use analytics cookies to understand how visitors interact with our website. This helps us 
          improve our website's functionality and content.
        </p>

        <h3>3.3 Preference Cookies</h3>
        <p>
          These cookies enable the website to remember choices you make (such as language or region) 
          and provide enhanced features.
        </p>

        <h3>3.4 Marketing Cookies</h3>
        <p>
          Marketing cookies are used to track visitors across websites. The intention is to display ads 
          that are relevant and engaging for individual users.
        </p>

        <h2>4. Managing Cookies</h2>
        <p>
          Most web browsers allow you to control cookies through their settings. You can:
        </p>
        <ul>
          <li>View cookies stored on your computer</li>
          <li>Delete all or specific cookies</li>
          <li>Block all or specific types of cookies</li>
          <li>Configure cookie settings for specific websites</li>
        </ul>

        <h2>5. Third-Party Cookies</h2>
        <p>
          We may use third-party services that also set cookies on our website. These services include:
        </p>
        <ul>
          <li>Google Analytics (for website analytics)</li>
          <li>Social media plugins (for sharing content)</li>
          <li>Payment processors (for processing transactions)</li>
        </ul>

        <h2>6. Impact of Disabling Cookies</h2>
        <p>
          If you disable or decline cookies, some features of our website may not function properly. 
          Essential cookies cannot be disabled as they are required for basic website functionality.
        </p>

        <h2>7. Updates to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. Any changes will be posted on this page 
          with an updated revision date.
        </p>

        <h2>8. Contact Information</h2>
        <p>
          If you have any questions about our Cookie Policy, please contact us at:
          <br />
          Email: privacy@batteryemulator.com
          <br />
          Address: [Company Address]
        </p>
      </div>
    </div>
  )
} 