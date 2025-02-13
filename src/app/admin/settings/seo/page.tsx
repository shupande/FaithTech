'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SingleImageUpload } from '@/components/ui/single-image-upload'

const seoFormSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  keywords: z.string(),
  ogImage: z.string(),
  robotsTxt: z.string(),
  googleVerification: z.string(),
  bingVerification: z.string(),
  customMetaTags: z.string().default('[]')
})

type SeoFormValues = z.infer<typeof seoFormSchema>

export default function SeoSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [generatingRobots, setGeneratingRobots] = useState(false)
  const [generatingSitemap, setGeneratingSitemap] = useState(false)

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoFormSchema),
    defaultValues: {
      description: '',
      keywords: '',
      ogImage: '',
      robotsTxt: '',
      googleVerification: '',
      bingVerification: '',
      customMetaTags: '[]'
    }
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings/seo')
        const data = await response.json()
        if (response.ok) {
          form.reset(data)
        }
      } catch (error) {
        console.error('Error fetching SEO settings:', error)
        toast.error('Failed to load SEO settings')
      }
    }

    fetchSettings()
  }, [form])

  async function onSubmit(data: SeoFormValues) {
    try {
      setLoading(true)
      const response = await fetch('/api/settings/seo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update SEO settings')
      }

      toast.success('SEO settings updated successfully')
    } catch (error) {
      console.error('Error updating SEO settings:', error)
      toast.error('Failed to update SEO settings')
    } finally {
      setLoading(false)
    }
  }

  async function generateRobotsTxt() {
    try {
      setGeneratingRobots(true)
      const response = await fetch('/api/settings/generate-robots', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to generate robots.txt')
      }

      toast.success('robots.txt generated successfully')
      // 刷新表单数据以获取新的robots.txt内容
      const seoResponse = await fetch('/api/settings/seo')
      const data = await seoResponse.json()
      if (seoResponse.ok) {
        form.reset(data)
      }
    } catch (error) {
      console.error('Error generating robots.txt:', error)
      toast.error('Failed to generate robots.txt')
    } finally {
      setGeneratingRobots(false)
    }
  }

  async function generateSitemap() {
    try {
      setGeneratingSitemap(true)
      const response = await fetch('/api/settings/generate-sitemap', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to generate sitemap.xml')
      }

      toast.success('sitemap.xml generated successfully')
    } catch (error) {
      console.error('Error generating sitemap.xml:', error)
      toast.error('Failed to generate sitemap.xml')
    } finally {
      setGeneratingSitemap(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
          <CardDescription>
            Configure your website&apos;s global SEO settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your website"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A short description that appears in search results (recommended: 150-160 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Keywords</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="keyword1, keyword2, keyword3"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated keywords (less important for modern SEO)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ogImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Open Graph Image</FormLabel>
                    <FormControl>
                      <SingleImageUpload
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Image that appears when sharing on social media (recommended: 1200x630px)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="robotsTxt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Robots.txt Content</FormLabel>
                    <div className="space-y-2">
                      <FormControl>
                        <Textarea
                          placeholder="Enter robots.txt content"
                          className="min-h-[200px] font-mono"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={generateRobotsTxt}
                          disabled={generatingRobots}
                        >
                          {generatingRobots ? 'Generating...' : 'Generate robots.txt'}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={generateSitemap}
                          disabled={generatingSitemap}
                        >
                          {generatingSitemap ? 'Generating...' : 'Generate sitemap.xml'}
                        </Button>
                      </div>
                    </div>
                    <FormDescription>
                      Configure your robots.txt file content. You can also automatically generate it.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="googleVerification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Site Verification</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Google verification code"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Google Search Console verification code
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bingVerification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bing Site Verification</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Bing verification code"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Bing Webmaster Tools verification code
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 