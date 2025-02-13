import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - BatteryEmulator',
  description: 'Get in touch with our team for sales inquiries, technical support, or general questions about our battery emulation solutions.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 