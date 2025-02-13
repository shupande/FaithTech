import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - BatteryEmulator',
  description: 'Terms of Service and usage conditions for BatteryEmulator products and services',
}

export default function TermsOfServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 