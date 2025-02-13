"use client"

import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Building2,
  Loader2
} from "lucide-react"

// 表单验证schema
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  company: z.string().min(1, "Company is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
})

// 更新 ContactSettings 类型定义以匹配设计
type ContactSettings = {
  headquarters?: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  contact?: {
    salesPhone: string
    supportPhone: string
    salesEmail: string
    supportEmail: string
  }
  businessHours?: {
    weekday: string
    support: string
  }
}

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<ContactSettings>({})
  const [offices, setOffices] = useState<any[]>([])

  // 初始化表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
    },
  })

  // 加载设置和办公室信息
  React.useEffect(() => {
    const loadData = async () => {
      try {
        // 加载设置
        const settingsRes = await fetch("/api/contact/settings")
        const settingsData = await settingsRes.json()
        const parsedSettings: ContactSettings = {}
        
        settingsData.forEach((setting: any) => {
          parsedSettings[setting.type as keyof ContactSettings] = JSON.parse(setting.data)
        })
        
        setSettings(parsedSettings)

        // 加载办公室信息
        const officesRes = await fetch("/api/contact/offices")
        const officesData = await officesRes.json()
        setOffices(officesData)
      } catch (error) {
        console.error("Error loading data:", error)
        toast.error("Failed to load contact information")
      }
    }

    loadData()
  }, [])

  // 提交表单
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const response = await fetch("/api/contact/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      form.reset()
      toast.success("Message sent successfully!")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to send message")
    } finally {
      setIsLoading(false)
    }
  }

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
          {/* Contact Form Card */}
          <Card className="p-6">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Send us a Message</h2>
              <p className="text-gray-500">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="john.doe@example.com" 
                            {...field} 
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel" 
                            placeholder="+1 (555) 000-0000" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Your company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="How can we help you?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your message"
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </Form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold">Contact Information</h2>
              <div className="grid gap-8 mt-6">
                {settings.headquarters && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Corporate Headquarters</h3>
                      <div className="mt-1 text-gray-500 space-y-1">
                        <p>{settings.headquarters.address}</p>
                        <p>{settings.headquarters.city}, {settings.headquarters.state} {settings.headquarters.zipCode}</p>
                        <p>{settings.headquarters.country}</p>
                      </div>
                    </div>
                  </div>
                )}

                {settings.contact && (
                  <>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <div className="mt-1 text-gray-500 space-y-1">
                          <p>Sales: {settings.contact.salesPhone}</p>
                          <p>Support: {settings.contact.supportPhone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <div className="mt-1 text-gray-500 space-y-1">
                          <p>Sales: {settings.contact.salesEmail}</p>
                          <p>Support: {settings.contact.supportEmail}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {settings.businessHours && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Business Hours</h3>
                      <div className="mt-1 text-gray-500 space-y-1">
                        <p>{settings.businessHours.weekday}</p>
                        <p>{settings.businessHours.support}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {offices.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Global Offices</h2>
                <div className="grid gap-6">
                  {offices.map((office) => (
                    <div key={office.id} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{office.name}</h3>
                        <div className="mt-1 text-gray-500 space-y-1">
                          <p>{office.location}</p>
                          <p>{office.address}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
} 