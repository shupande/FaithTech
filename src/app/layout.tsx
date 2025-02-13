import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { prisma } from "@/lib/prisma"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

async function getSettings() {
  const [websiteSettings, seoSettings] = await Promise.all([
    prisma.settings.findUnique({
      where: { type: 'website' }
    }),
    prisma.globalSEO.findFirst()
  ])

  if (!websiteSettings || !seoSettings) {
    throw new Error('Required settings not found in database')
  }

  const website = JSON.parse(websiteSettings.data)
  const seo = seoSettings

  return { website, seo }
}

export async function generateMetadata(): Promise<Metadata> {
  const { website, seo } = await getSettings()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000'

  return {
    metadataBase: new URL(baseUrl),
    title: `${website.siteName} - ${website.siteDescription}`,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: website.siteName,
      description: seo.description,
      siteName: website.siteName,
      locale: 'en_US',
      type: 'website',
      ...(seo.ogImage && {
        images: [{
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: website.siteName,
        }]
      })
    }
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { website, seo } = await getSettings()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`${website.siteName} - ${website.siteDescription}`}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        {website.favicon && <link rel="icon" href={website.favicon} />}
        <meta property="og:title" content={website.siteName} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:site_name" content={website.siteName} />
        {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
} 