import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TrueEstate - Know Your Landlord. Protect Your Investment.",
  description:
    "The first real estate intelligence platform that provides complete transparency into property ownership, landlord credibility, and market dynamics. Make informed decisions with verified data before you invest your capital.",
  keywords:
    "real estate transparency, rental scams, property owner verification, landlord trust score, wealth mapping, property intelligence",
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
