import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JG Impact - Mental Health & Rehabilitation Facility',
  description: 'Professional mental health care, rehabilitation support, and counseling in Juja, Kenya.',
  keywords: ['mental health', 'rehabilitation', 'counseling', 'therapy', 'Juja', 'Kenya'],
  icons: {
    icon: '/images/JG-logo.jpg',
    shortcut: '/images/JG-logo.jpg',
    apple: '/images/JG-logo.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
