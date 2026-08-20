import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Manchester Select | Sport with purpose',
  description: 'Manchester Select brings sport, community and charitable impact together across Manchester.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
