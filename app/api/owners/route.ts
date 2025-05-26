import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Owner } from "@/lib/models/Owner"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sortBy = searchParams.get("sortBy") || "totalValue"
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  try {
    const db = await getDatabase()
    const ownersCollection = db.collection<Owner>("owners")

    const sortOptions: any = {}
    if (sortBy === "totalValue") {
      sortOptions["portfolio.totalValue"] = -1
    } else if (sortBy === "trustScore") {
      sortOptions["trustMetrics.trustScore"] = -1
    } else if (sortBy === "properties") {
      sortOptions["portfolio.totalProperties"] = -1
    }

    const owners = await ownersCollection.find({}).sort(sortOptions).limit(limit).toArray()

    return NextResponse.json({
      owners,
      success: true,
    })
  } catch (error) {
    console.error("Owners fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch owners" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const ownerData = await request.json()
    const db = await getDatabase()
    const ownersCollection = db.collection<Owner>("owners")

    const newOwner: Omit<Owner, "_id"> = {
      userId: new ObjectId(ownerData.userId),
      name: ownerData.name,
      email: ownerData.email,
      phone: ownerData.phone,
      company: ownerData.company,
      businessType: ownerData.businessType || "individual",
      portfolio: {
        totalProperties: 0,
        totalValue: 0,
        locations: [],
        propertyTypes: [],
      },
      trustMetrics: {
        trustScore: 50,
        responseRate: 0,
        averageResponseTime: 0,
        totalReviews: 0,
        averageRating: 0,
      },
      verificationStatus: {
        identityVerified: false,
        backgroundCheck: false,
        businessVerified: false,
        documentsVerified: false,
        lastVerified: new Date(),
      },
      properties: [],
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await ownersCollection.insertOne(newOwner)

    return NextResponse.json({
      success: true,
      ownerId: result.insertedId,
    })
  } catch (error) {
    console.error("Owner creation error:", error)
    return NextResponse.json({ error: "Failed to create owner" }, { status: 500 })
  }
}
