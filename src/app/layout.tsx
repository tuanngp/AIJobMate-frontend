import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Layout from '@/components/common/Layout/Layout'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'AI JobMate - Your AI Career Assistant',
  description: 'AI-powered career assistance platform for personalized career advice, interview practice, and job matching.',
  keywords: 'career advice, job search, interview practice, AI career assistant',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
