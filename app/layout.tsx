import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TrueEstate - Clarity before Capital | Real Estate Intelligence",
  description:
    "Clarity before Capital. Know your landlord, verify property ownership, and make informed real estate decisions with AI-powered transparency and trust scoring.",
  keywords:
    "clarity before capital, real estate transparency, property owner verification, landlord trust score, rental scams, wealth mapping",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
