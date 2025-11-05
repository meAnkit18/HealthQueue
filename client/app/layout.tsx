import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HealthQueue - Hospital Queue Management",
  description: "Modern queue management system for hospitals",
  generator: "v0.app",
}

import { cookies } from 'next/headers';
import Header from "@/components/Header";
import { Chatbot } from "@/components/Chatbot"; // Import Chatbot component

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get('isLoggedIn')?.value === 'true';

  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Header isLoggedIn={isLoggedIn} />
        {children}
        <Analytics />
        <Chatbot /> {/* Add Chatbot component here */}
      </body>
    </html>
  )
}
