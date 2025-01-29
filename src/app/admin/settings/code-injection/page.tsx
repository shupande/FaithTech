'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, Loader2, Code, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

const codeSchema = z.object({
  headerCode: z.string(),
  footerCode: z.string(),
})

type CodeFormValues = z.infer<typeof codeSchema>

// Mock data - will be replaced with API calls
const mockSettings = {
  headerCode: `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXX');</script>
<!-- End Google Tag Manager -->`,
  footerCode: `<!-- Crisp Chat -->
<script type="text/javascript">
window.$crisp=[];window.CRISP_WEBSITE_ID="XXXXX";
(function(){d=document;s=d.createElement("script");
s.src="https://client.crisp.chat/l.js";
s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
</script>`,
}

export default function CodeInjectionPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)

  const form = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: mockSettings,
  })

  // Watch form changes
  React.useEffect(() => {
    const subscription = form.watch(() => setIsDirty(true))
    return () => subscription.unsubscribe()
  }, [form.watch])

  // Handle save
  const handleSubmit = async (data: CodeFormValues) => {
    try {
      setIsLoading(true)
      // TODO: Implement save logic
      console.log('Saving code settings:', data)
      
      setIsDirty(false)
    } catch (error) {
      console.error('Failed to save code settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Code Injection</h1>
        <Button 
          onClick={form.handleSubmit(handleSubmit)} 
          disabled={isLoading || !isDirty}
        >
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Add custom code to your site's header and footer. This is useful for adding analytics, tracking codes, chat widgets, or other third-party integrations.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Header Code</h2>
          </div>
          <div className="space-y-4">
            <Alert variant="destructive" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              <AlertDescription className="text-sm">
                Code added here will be injected into the <code className="px-1 py-0.5 bg-yellow-100 rounded">&lt;head&gt;</code> section of every page. Be careful as invalid code can break your site's functionality.
              </AlertDescription>
            </Alert>
            <FormField
              label="Header Code"
              error={form.formState.errors.headerCode?.message}
            >
              <Textarea
                {...form.register("headerCode")}
                placeholder="<!-- Add your header code here -->"
                className="font-mono text-sm"
                rows={10}
              />
            </FormField>
            <div className="text-sm text-muted-foreground">
              Common uses: Analytics tracking codes, meta tags, custom styles
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Footer Code</h2>
          </div>
          <div className="space-y-4">
            <Alert variant="destructive" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              <AlertDescription className="text-sm">
                Code added here will be injected before the closing <code className="px-1 py-0.5 bg-yellow-100 rounded">&lt;/body&gt;</code> tag of every page. Be careful as invalid code can break your site's functionality.
              </AlertDescription>
            </Alert>
            <FormField
              label="Footer Code"
              error={form.formState.errors.footerCode?.message}
            >
              <Textarea
                {...form.register("footerCode")}
                placeholder="<!-- Add your footer code here -->"
                className="font-mono text-sm"
                rows={10}
              />
            </FormField>
            <div className="text-sm text-muted-foreground">
              Common uses: Chat widgets, conversion tracking, custom scripts
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 