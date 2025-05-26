import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""
  const limit = Math.min(Number.parseInt(searchParams.get("limit") || "5"), 10) // Limit results

  try {
    // Quick mock response for demo (remove DB dependency for speed)
    const mockOwners = [
      {
        _id: "owner_1",
        name: "Sarah Johnson",
        company: "Johnson Properties LLC",
        email: "sarah@johnsonproperties.com",
        businessType: "LLC",
        portfolio: {
          totalProperties: 8,
          totalValue: 12500000,
          locations: ["San Francisco", "Oakland"],
          propertyTypes: ["Single Family", "Multi-Family"],
        },
        trustMetrics: {
          trustScore: 95,
          responseRate: 98,
          averageResponseTime: 2.5,
          totalReviews: 47,
          averageRating: 4.8,
        },
        verificationStatus: {
          identityVerified: true,
          backgroundCheck: true,
          businessVerified: true,
          documentsVerified: true,
          lastVerified: new Date(),
        },
        properties: [
          {
            address: "123 Oak Street, San Francisco, CA",
            value: 1850000,
            type: "Multi-Family",
            coordinates: [-122.4194, 37.7749],
          },
        ],
      },
      {
        _id: "owner_2",
        name: "Michael Chen",
        company: "Pacific Real Estate Group",
        email: "michael@pacificrealestate.com",
        businessType: "Corporation",
        portfolio: {
          totalProperties: 15,
          totalValue: 28300000,
          locations: ["Los Angeles", "Santa Monica"],
          propertyTypes: ["Luxury Condo", "Apartment"],
        },
        trustMetrics: {
          trustScore: 92,
          responseRate: 95,
          averageResponseTime: 3.2,
          totalReviews: 73,
          averageRating: 4.6,
        },
        verificationStatus: {
          identityVerified: true,
          backgroundCheck: true,
          businessVerified: true,
          documentsVerified: true,
          lastVerified: new Date(),
        },
        properties: [
          {
            address: "789 Sunset Blvd, Los Angeles, CA",
            value: 2100000,
            type: "Luxury Condo",
            coordinates: [-118.2437, 34.0522],
          },
        ],
      },
    ]

    // Filter based on query
    const filteredOwners = mockOwners.filter(
      (owner) =>
        owner.name.toLowerCase().includes(query.toLowerCase()) ||
        owner.company.toLowerCase().includes(query.toLowerCase()) ||
        owner.email.toLowerCase().includes(query.toLowerCase()),
    )

    return NextResponse.json({
      owners: filteredOwners.slice(0, limit),
      success: true,
      total: filteredOwners.length,
      query,
    })
  } catch (error) {
    console.error("Owner search error:", error)
    return NextResponse.json(
      {
        owners: [],
        success: false,
        error: "Search failed",
      },
      { status: 500 },
    )
  }
}
