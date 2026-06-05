import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/Nav'

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kiln — Pottery Studio Tracker',
  description: 'Track your ceramic pieces through every stage of creation',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <head>
        <script src="https://reverse-bubble.up.railway.app/overlay/v1/rb-overlay.js" defer data-rb-project="a38998f6-d6ea-4c14-a681-ab45298fe9bd" data-rb-token="rbo_NHsL-3HaURJuCFotG1Lbgu9vc9Fxy5Qj" />
      </head>
      <body className="bg-stone-50 min-h-screen">
        <Nav />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
