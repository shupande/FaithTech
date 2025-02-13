'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface WebsiteSettings {
  siteName: string
  siteDescription: string
}

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [settings, setSettings] = React.useState<WebsiteSettings>({
    siteName: '',
    siteDescription: ''
  })

  React.useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings/website')
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Login failed')
      }

      toast.success('Login successful')
      router.push('/admin')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-50">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center text-gray-900">{settings.siteName}</h1>
        <p className="text-gray-600 text-center mt-2">{settings.siteDescription}</p>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-center text-gray-900">Login</h2>
          <p className="text-sm text-gray-500 text-center">
            Enter your credentials to access the admin panel
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Email"
            error={form.formState.errors.email?.message}
          >
            <Input
              type="email"
              placeholder="admin@example.com"
              {...form.register('email')}
              disabled={isLoading}
              className="w-full"
            />
          </FormField>

          <FormField
            label="Password"
            error={form.formState.errors.password?.message}
          >
            <Input
              type="password"
              placeholder="••••••••"
              {...form.register('password')}
              disabled={isLoading}
              className="w-full"
            />
          </FormField>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p>
      </div>
    </div>
  )
} 