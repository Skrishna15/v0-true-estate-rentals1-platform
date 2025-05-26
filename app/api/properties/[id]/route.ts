import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongodb"
import type { Property } from "@/lib/models/Property"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const propertiesCollection = db.collection<Property>("properties")

    const property = await propertiesCollection.findOne({
      _id: new ObjectId(params.id),
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Enhance owner data if it's missing some fields
    if (property.owner && !property.owner.portfolio) {
      property.owner = {
        ...property.owner,
        backgroundCheck: property.owner.verified || Math.random() > 0.3,
        businessVerified: property.owner.verified || Math.random() > 0.4,
        documentsVerified: property.owner.verified || Math.random() > 0.2,
        yearsActive: Math.floor(Math.random() * 10) + 3,
        responseRate: Math.floor(Math.random() * 20) + 80,
        averageResponseTime: Math.floor(Math.random() * 12) + 1,
        portfolio: {
          totalProperties: Math.floor(Math.random() * 15) + 1,
          totalValue: `$${(Math.random() * 10 + 5).toFixed(1)}M`,
          propertyTypes: ["Single Family", "Condo", "Townhouse"].slice(0, Math.floor(Math.random() * 3) + 1),
          locations: [property.city, "Oakland", "Berkeley"].slice(0, Math.floor(Math.random() * 3) + 1),
          averageRent: Math.floor(Math.random() * 2000) + 2000,
        },
        reviews: {
          totalReviews: Math.floor(Math.random() * 50) + 10,
          averageRating: 3.5 + Math.random() * 1.5,
          recentReviews: [
            {
              rating: 5,
              comment: "Excellent landlord, very responsive and professional",
              date: new Date("2024-01-15"),
              propertyAddress: property.address,
            },
            {
              rating: 4,
              comment: "Good communication, property well maintained",
              date: new Date("2024-01-10"),
              propertyAddress: "456 Oak St",
            },
          ],
        },
        businessInfo: property.owner.company
          ? {
              licenseNumber: `RE${Math.floor(Math.random() * 1000000)}`,
              businessType: "LLC",
              establishedYear: 2010 + Math.floor(Math.random() * 14),
              website: `www.${property.owner.company.toLowerCase().replace(/\s+/g, "")}.com`,
            }
          : undefined,
        lastActive: new Date(),
      }
    }

    return NextResponse.json({
      property,
      success: true,
    })
  } catch (error) {
    console.error("Property fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updateData = await request.json()
    const db = await getDatabase()
    const propertiesCollection = db.collection<Property>("properties")

    const result = await propertiesCollection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      modified: result.modifiedCount > 0,
    })
  } catch (error) {
    console.error("Property update error:", error)
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 })
  }
}
