"use client"

import { ArrowLeft, Building } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { OwnerPortfolio } from "@/components/owner-portfolio"

// Sample owner data - in real app this would come from API
const ownerData = {
  name: "Sarah Johnson",
  company: "Johnson Properties LLC",
  avatar: "/placeholder-user.jpg",
  trustScore: 95,
  totalProperties: 12,
  totalValue: "$8.2M",
  joinDate: "2019",
  responseRate: "98%",
  responseTime: "< 2 hours",
  portfolio: {
    properties: [
      {
        id: "prop-1",
        address: "123 Oak Street, San Francisco, CA",
        value: "$850K",
        type: "Condo",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1200,
        rent: "$4,500",
        status: "occupied" as const,
        images: ["/placeholder.svg?height=200&width=300"],
        yearBuilt: 2015,
        lastRenovated: 2022,
        tenantRating: 4.8,
        occupancyHistory: "98% (last 2 years)",
      },
      {
        id: "prop-2",
        address: "456 Pine Avenue, San Francisco, CA",
        value: "$1.2M",
        type: "Single Family",
        bedrooms: 3,
        bathrooms: 2.5,
        sqft: 1800,
        rent: "$6,200",
        status: "available" as const,
        images: ["/placeholder.svg?height=200&width=300"],
        yearBuilt: 2018,
        tenantRating: 4.9,
        occupancyHistory: "95% (last 3 years)",
      },
      {
        id: "prop-3",
        address: "789 Market Street, San Francisco, CA",
        value: "$950K",
        type: "Townhouse",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1400,
        rent: "$5,100",
        status: "maintenance" as const,
        images: ["/placeholder.svg?height=200&width=300"],
        yearBuilt: 2016,
        lastRenovated: 2023,
        tenantRating: 4.7,
        occupancyHistory: "92% (last 2 years)",
      },
      {
        id: "prop-4",
        address: "321 Valencia Street, San Francisco, CA",
        value: "$780K",
        type: "Studio",
        bedrooms: 0,
        bathrooms: 1,
        sqft: 650,
        rent: "$3,200",
        status: "occupied" as const,
        images: ["/placeholder.svg?height=200&width=300"],
        yearBuilt: 2020,
        tenantRating: 4.6,
        occupancyHistory: "100% (last 1 year)",
      },
      {
        id: "prop-5",
        address: "654 Mission Bay, San Francisco, CA",
        value: "$1.1M",
        type: "Luxury Condo",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1350,
        rent: "$5,800",
        status: "available" as const,
        images: ["/placeholder.svg?height=200&width=300"],
        yearBuilt: 2019,
        lastRenovated: 2023,
        tenantRating: 4.9,
        occupancyHistory: "97% (last 2 years)",
      },
      {
        id: "prop-6",
        address: "987 Telegraph Ave, Oakland, CA",
        value: "$420K",
        type: "Apartment",
        bedrooms: 1,
        bathrooms: 1,
        sqft: 800,
        rent: "$2,800",
        status: "occupied" as const,
        images: ["/placeholder.svg?height=200&width=300"],
        yearBuilt: 2010,
        lastRenovated: 2021,
        tenantRating: 4.5,
        occupancyHistory: "93% (last 3 years)",
      },
    ],
    analytics: {
      totalRevenue: "$2.1M",
      occupancyRate: "96%",
      avgTenantStay: "2.3 years",
      maintenanceScore: 94,
      responseScore: 98,
      satisfactionScore: 92,
    },
    markets: [
      {
        city: "San Francisco",
        properties: 8,
        totalValue: "$6.8M",
        avgRent: "$5,200",
        occupancyRate: "96%",
      },
      {
        city: "Oakland",
        properties: 3,
        totalValue: "$1.2M",
        avgRent: "$3,800",
        occupancyRate: "94%",
      },
      {
        city: "Berkeley",
        properties: 1,
        totalValue: "$200K",
        avgRent: "$2,900",
        occupancyRate: "100%",
      },
    ],
  },
}

export default function OwnerPortfolioPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Wealth Map
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">TrueEstate</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <OwnerPortfolio ownerId={params.id} ownerData={ownerData} />
      </div>
    </div>
  )
}
