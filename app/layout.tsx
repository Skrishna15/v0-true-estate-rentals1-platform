import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TrueEstate - Real Estate Transparency & Owner Verification",
  description:
    "Stop rental scams with verified property ownership data, trust scores, and wealth mapping. Make informed real estate decisions with transparent landlord verification.",
  keywords: "real estate transparency, rental scams, property owner verification, landlord trust score, wealth mapping",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
