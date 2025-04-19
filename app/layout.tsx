import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Carcassonne counter',
  description: 'Simple carcassonne points calculator'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
