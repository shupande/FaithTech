'use client'

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Code, Image as ImageIcon, Save, Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

// Mock data - will be replaced with API calls
const mockSettings = {
  siteName: "FaithTech",
  siteDescription: "Technology Solutions for Faith-Based Organizations",
  logo: "/images/logo.png",
  favicon: "/images/favicon.ico",
  smtp: {
    host: "",
    port: "",
    username: "",
    password: "",
  }
}

interface WebsiteSettings {
  siteName: string
  siteDescription: string
  logo: string
  favicon: string
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSavingSmtp, setIsSavingSmtp] = React.useState(false)
  const [isTestingSmtp, setIsTestingSmtp] = React.useState(false)
  const [selectedLogo, setSelectedLogo] = React.useState<string | undefined>(mockSettings.logo)
  const [selectedFavicon, setSelectedFavicon] = React.useState<string | undefined>(mockSettings.favicon)
  const [smtpSettings, setSmtpSettings] = React.useState(mockSettings.smtp)
  const [testEmail, setTestEmail] = React.useState("")
  const logoInputRef = React.useRef<HTMLInputElement>(null)
  const faviconInputRef = React.useRef<HTMLInputElement>(null)
  const [settings, setSettings] = React.useState<WebsiteSettings>({
    siteName: '',
    siteDescription: '',
    logo: '',
    favicon: '',
  })

  // 加载 SMTP 设置
  React.useEffect(() => {
    loadSmtpSettings()
  }, [])

  // Fetch current settings
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
        toast.error('Failed to load settings')
      }
    }
    fetchSettings()
  }, [])

  async function loadSmtpSettings() {
    try {
      const response = await fetch('/api/settings/smtp')
      if (response.ok) {
        const data = await response.json()
        if (data.data) {
          setSmtpSettings(JSON.parse(data.data))
        }
      }
    } catch (error) {
      console.error("Error loading SMTP settings:", error)
    }
  }

  // 保存 SMTP 设置
  async function handleSaveSmtp() {
    try {
      setIsSavingSmtp(true)
      const response = await fetch('/api/settings/smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpSettings)
      })

      if (!response.ok) throw new Error("Failed to save SMTP settings")
      
      toast.success("SMTP settings saved successfully")
    } catch (error) {
      console.error("Error saving SMTP settings:", error)
      toast.error("Failed to save SMTP settings")
    } finally {
      setIsSavingSmtp(false)
    }
  }

  // 测试 SMTP 连接
  async function handleTestSmtp() {
    if (!testEmail) {
      toast.error("Please enter a test email address")
      return
    }

    try {
      setIsTestingSmtp(true)
      const response = await fetch('/api/settings/smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          ...smtpSettings,
          testEmail
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.details || "Test failed")

      toast.success("SMTP test successful")
    } catch (error) {
      console.error("SMTP test failed:", error)
      toast.error(error instanceof Error ? error.message : "SMTP test failed")
    } finally {
      setIsTestingSmtp(false)
    }
  }

  // Handle logo selection
  const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle favicon selection
  const handleFaviconSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedFavicon(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle save basic info
  const handleSaveBasicInfo = async () => {
    try {
      setIsLoading(true)
      // TODO: Implement save logic
      console.log('Saving basic info')
    } catch (error) {
      console.error('Failed to save basic info:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle file upload
  const handleFileUpload = async (file: File, type: 'logo' | 'favicon') => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')
      
      const data = await response.json()
      setSettings(prev => ({ ...prev, [type]: data.url }))
      return data.url
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload file')
      return null
    }
  }

  // Handle save settings
  const handleSave = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/settings/website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error('Failed to save settings')
      
      toast.success('Settings saved successfully')
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6">
        {/* Email Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <CardTitle>Email Settings</CardTitle>
            </div>
            <CardDescription>
              Configure SMTP settings for sending email notifications. These settings are required for the email notification system to work.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input
                id="smtp-host"
                placeholder="smtp.example.com"
                value={smtpSettings.host}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, host: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input
                id="smtp-port"
                placeholder="587"
                type="number"
                value={smtpSettings.port}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, port: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">
                Common ports: 25 (SMTP), 465 (SMTPS), 587 (Submission)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-user">SMTP Username</Label>
              <Input
                id="smtp-user"
                placeholder="Enter SMTP username"
                value={smtpSettings.username}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-pass">SMTP Password</Label>
              <Input
                id="smtp-pass"
                type="password"
                placeholder="Enter SMTP password"
                value={smtpSettings.password}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-email">Test Email</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="Enter email address for testing"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Enter an email address to receive a test message
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveSmtp}
                  disabled={isSavingSmtp || isTestingSmtp}
                >
                  {isSavingSmtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Email Settings
                </Button>
                <Button
                  variant="outline"
                  onClick={handleTestSmtp}
                  disabled={isSavingSmtp || isTestingSmtp}
                >
                  {isTestingSmtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Test Connection
                </Button>
              </div>
              <Button
                variant="outline"
                asChild
              >
                <Link href="/admin/contact/notifications">
                  Manage Notifications
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Website Information */}
        <Card>
          <CardHeader>
            <CardTitle>Website Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input
                id="site-name"
                placeholder="Enter site name"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-description">Site Description</Label>
              <Input
                id="site-description"
                placeholder="Enter site description"
                value={settings.siteDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label>Logo</Label>
                <p className="text-sm text-muted-foreground">
                  Upload your website logo. Recommended size: 200x50 pixels.
                </p>
              </div>

              <div className="flex items-start gap-6">
                {settings.logo ? (
                  <div className="relative w-[200px] h-[50px]">
                    <img
                      src={settings.logo}
                      alt="Website Logo"
                      className="object-contain w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-[200px] h-[50px] bg-muted rounded-lg">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    {settings.logo ? "Change Logo" : "Upload Logo"}
                  </Button>
                  {settings.logo && (
                    <Button
                      variant="ghost"
                      onClick={() => setSettings(prev => ({ ...prev, logo: '' }))}
                    >
                      Remove
                    </Button>
                  )}
                  <input
                    type="file"
                    ref={logoInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        await handleFileUpload(file, 'logo')
                      }
                    }}
                  />
                  <p className="text-sm text-muted-foreground">
                    Accepted formats: PNG, JPG, GIF. Max file size: 2MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Favicon</Label>
                <p className="text-sm text-muted-foreground">
                  Upload your website favicon. Recommended size: 32x32 or 16x16 pixels.
                </p>
              </div>

              <div className="flex items-start gap-6">
                {settings.favicon ? (
                  <div className="relative w-[32px] h-[32px]">
                    <img
                      src={settings.favicon}
                      alt="Website Favicon"
                      className="object-contain w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-[32px] h-[32px] bg-muted rounded-lg">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => faviconInputRef.current?.click()}
                  >
                    {settings.favicon ? "Change Favicon" : "Upload Favicon"}
                  </Button>
                  {settings.favicon && (
                    <Button
                      variant="ghost"
                      onClick={() => setSettings(prev => ({ ...prev, favicon: '' }))}
                    >
                      Remove
                    </Button>
                  )}
                  <input
                    type="file"
                    ref={faviconInputRef}
                    className="hidden"
                    accept="image/x-icon,image/png"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        await handleFileUpload(file, 'favicon')
                      }
                    }}
                  />
                  <p className="text-sm text-muted-foreground">
                    Accepted formats: ICO, PNG. Max file size: 1MB.
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <div className="text-sm text-gray-500">
                  Put the site in maintenance mode
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Code Injection */}
        <Card>
          <CardHeader>
            <CardTitle>Code Injection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  <Label>Third-party Integrations</Label>
                </div>
                <div className="text-sm text-gray-500">
                  Manage analytics, chat widgets, and other third-party code
                </div>
              </div>
              <Button asChild>
                <Link href="/admin/settings/code-injection">
                  Configure
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 