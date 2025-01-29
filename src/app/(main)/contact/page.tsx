import * as React from "react"
import type { Metadata } from 'next'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Building2
} from "lucide-react"

export const metadata: Metadata = {
  title: 'Contact Us - BatteryEmulator',
  description: 'Get in touch with our team for sales inquiries, technical support, or general questions about our battery emulation solutions.',
}

export default function ContactPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Contact Us
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Get in touch with our team for sales inquiries, technical support, or general questions about our solutions.
            </p>
          </div>
        </div>
      </section>

      <section className="container px-4 py-16 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <Card className="p-6">
            <form className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Send us a Message</h2>
                <p className="text-gray-500">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-medium">
                    First name
                  </label>
                  <Input id="first-name" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-medium">
                    Last name
                  </label>
                  <Input id="last-name" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" placeholder="john.doe@example.com" type="email" />
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">
                  Company
                </label>
                <Input id="company" placeholder="Your company name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input id="subject" placeholder="How can we help you?" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Enter your message"
                  className="min-h-[150px]"
                />
              </div>
              <Button className="w-full" size="lg">
                Send Message
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="grid gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Corporate Headquarters</h3>
                    <p className="text-gray-500 mt-1">
                      123 Battery Street<br />
                      Tech City, TC 12345<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-500 mt-1">
                      Sales: +1 (555) 123-4567<br />
                      Support: +1 (555) 987-6543
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-500 mt-1">
                      Sales: sales@batteryemulator.com<br />
                      Support: support@batteryemulator.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Business Hours</h3>
                    <p className="text-gray-500 mt-1">
                      Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                      Technical Support: 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Global Offices</h2>
              <div className="grid gap-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Europe</h3>
                    <p className="text-gray-500">Munich, Germany</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Asia Pacific</h3>
                    <p className="text-gray-500">Shanghai, China</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 