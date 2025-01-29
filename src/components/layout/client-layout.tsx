'use client'

import * as React from 'react'
import Script from 'next/script'

// Mock data - will be replaced with API calls
const siteSettings = {
  headerCode: '',  // Will be populated from API/database
  footerCode: '',  // Will be populated from API/database
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Header Scripts */}
      {siteSettings.headerCode && (
        <Script
          id="header-scripts"
          dangerouslySetInnerHTML={{ __html: siteSettings.headerCode }}
          strategy="afterInteractive"
        />
      )}

      {children}

      {/* Footer Scripts */}
      {siteSettings.footerCode && (
        <Script
          id="footer-scripts"
          dangerouslySetInnerHTML={{ __html: siteSettings.footerCode }}
          strategy="afterInteractive"
        />
      )}
    </>
  )
} 