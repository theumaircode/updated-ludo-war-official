import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cinzel, Rajdhani } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-cinzel',
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
})

export const metadata: Metadata = {
  title: 'LUDO WAR® — Cosmic Singularity & Universe Ruling Ring',
  description:
    'LUDO WAR® by THE UMAIR CODE®. Command your 3D sculpted relics across the cosmic altar and conquer the Black Hole Singularity to claim the Ancient Greek Universe Ruling Ring.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LUDO WAR®',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'application-name': 'LUDO WAR®',
  },
  icons: {
    icon: '/images/game-icon.jpg',
    shortcut: '/images/game-icon.jpg',
    apple: '/images/game-icon.jpg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${rajdhani.variable} dark`}>
      <body className="bg-black text-[#e8dcc4] font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden select-none">
        {children}
        {process.env.NODE_ENV === 'production' &&
          process.env.CAPACITOR_BUILD !== 'true' && <Analytics />}
      </body>
    </html>
  )
}
