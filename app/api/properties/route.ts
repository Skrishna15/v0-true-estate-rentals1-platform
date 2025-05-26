import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Property } from "@/lib/models/Property"

// Calculate transparency score
function calculateTransparencyScore(property: Property): number {
  let score = 0

  // Owner verification (40 points)
  if (property.verificationData.ownerVerified) score += 40

  // Document verification (20 points)
  if (property.verificationData.documentsVerified) score += 20

  // Address verification (15 points)
  if (property.verificationData.addressVerified) score += 15

  // Price verification (10 points)
  if (property.verificationData.priceVerified) score += 10

  // Reviews (15 points based on rating and count)
  if (property.ratings.totalReviews > 0) {
    const reviewScore = (property.ratings.averageRating / 5) * 15
    score += reviewScore
  }

  return Math.round(score)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const city = searchParams.get("city") || ""
    const state = searchParams.get("state") || ""
    const minPrice = Number.parseInt(searchParams.get("minPrice") || "0")
    const maxPrice = Number.parseInt(searchParams.get("maxPrice") || "999999999")
    const propertyType = searchParams.get("propertyType") || ""
    const minRating = Number.parseFloat(searchParams.get("minRating") || "0")
    const verified = searchParams.get("verified") === "true"

    const db = await getDatabase()

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [
        { "address.street": { $regex: search, $options: "i" } },
        { "address.city": { $regex: search, $options: "i" } },
        { "address.zipCode": { $regex: search, $options: "i" } },
      ]
    }

    if (city) query["address.city"] = { $regex: city, $options: "i" }
    if (state) query["address.state"] = { $regex: state, $options: "i" }
    if (propertyType) query["details.propertyType"] = propertyType
    if (verified) query["verificationData.ownerVerified"] = true

    query["details.price"] = { $gte: minPrice, $lte: maxPrice }
    if (minRating > 0) query["ratings.averageRating"] = { $gte: minRating }

    // Get properties with owner data
    const properties = await db
      .collection("properties")
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: "users",
            localField: "ownerId",
            foreignField: "_id",
            as: "owner",
          },
        },
        { $unwind: "$owner" },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $sort: { createdAt: -1 } },
      ])
      .toArray()

    // Calculate transparency scores
    const propertiesWithScores = properties.map((property) => ({
      ...property,
      transparencyScore: calculateTransparencyScore(property),
    }))

    const total = await db.collection("properties").countDocuments(query)

    return NextResponse.json({
      properties: propertiesWithScores,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      success: true,
    })
  } catch (error) {
    console.error("Properties fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["owner", "agent", "admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const propertyData = await request.json()
    const db = await getDatabase()

    const newProperty: Omit<Property, "_id"> = {
      ...propertyData,
      ownerId: new ObjectId(session.user.id),
      transparencyScore: 0, // Will be calculated
      verificationData: {
        ownerVerified: false,
        documentsVerified: false,
        addressVerified: false,
        priceVerified: false,
        lastVerified: new Date(),
      },
      ratings: {
        averageRating: 0,
        totalReviews: 0,
        breakdown: {
          landlord: 0,
          property: 0,
          neighborhood: 0,
          value: 0,
        },
      },
      transactionHistory: [],
      externalData: {},
      views: 0,
      bookmarks: 0,
      flagged: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Calculate initial transparency score
    newProperty.transparencyScore = calculateTransparencyScore(newProperty as Property)

    const result = await db.collection("properties").insertOne(newProperty)

    return NextResponse.json({
      success: true,
      propertyId: result.insertedId,
    })
  } catch (error) {
    console.error("Property creation error:", error)
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}
