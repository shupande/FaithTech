'use client'

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Code, Image as ImageIcon, Save, Loader2 } from "lucide-react"
import Link from "next/link"

// Mock data - will be replaced with API calls
const mockSettings = {
  siteName: "FaithTech",
  siteDescription: "Technology Solutions for Faith-Based Organizations",
  logo: "/images/logo.png"
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedLogo, setSelectedLogo] = React.useState<string | undefined>(mockSettings.logo)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6">
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
                defaultValue={mockSettings.siteName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-description">Site Description</Label>
              <Input
                id="site-description"
                placeholder="Enter site description"
                defaultValue={mockSettings.siteDescription}
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
                {selectedLogo ? (
                  <div className="relative w-[200px] h-[50px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedLogo}
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
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {selectedLogo ? "Change Logo" : "Upload Logo"}
                  </Button>
                  {selectedLogo && (
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedLogo(undefined)}
                    >
                      Remove
                    </Button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoSelect}
                  />
                  <p className="text-sm text-muted-foreground">
                    Accepted formats: PNG, JPG, GIF. Max file size: 2MB.
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleSaveBasicInfo} disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

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

        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input
                id="smtp-host"
                placeholder="smtp.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input
                id="smtp-port"
                placeholder="587"
                type="number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-user">SMTP Username</Label>
              <Input
                id="smtp-user"
                placeholder="Enter SMTP username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-pass">SMTP Password</Label>
              <Input
                id="smtp-pass"
                type="password"
                placeholder="Enter SMTP password"
              />
            </div>
            <Button>
              Save Email Settings
            </Button>
          </CardContent>
        </Card>

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