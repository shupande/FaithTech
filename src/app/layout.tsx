import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientLayout } from "@/components/layout/client-layout"
import { ApiProvider } from "@/lib/api/context"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "FaithTech",
  description: "Faith-based technology solutions",
}

// Mock data - will be replaced with API calls
const siteSettings = {
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} flex min-h-full flex-col`}>
        <ApiProvider>
          <ClientLayout>{children}</ClientLayout>
          <Toaster />
        </ApiProvider>
      </body>
    </html>
  )
} 