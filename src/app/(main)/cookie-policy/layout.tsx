import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy - BatteryEmulator',
  description: 'Information about how BatteryEmulator uses cookies and similar technologies',
}

export default function CookiePolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 