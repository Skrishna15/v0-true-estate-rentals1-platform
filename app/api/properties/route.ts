import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Property } from "@/lib/models/Property"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")
  const city = searchParams.get("city")
  const state = searchParams.get("state")
  const limit = Math.min(Number.parseInt(searchParams.get("limit") || "10"), 20) // Limit max results
  const page = Number.parseInt(searchParams.get("page") || "1")

  try {
    // Quick response for empty queries
    if (!address && !city && !state) {
      return NextResponse.json({
        properties: [],
        success: true,
        message: "No search parameters provided",
      })
    }

    // Try database first with timeout
    let dbProperties = []
    const dbTimeout = 2000 // 2 second timeout for DB

    try {
      const dbPromise = getPropertiesFromDB(address, city, state, limit, page)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database timeout")), dbTimeout),
      )

      dbProperties = (await Promise.race([dbPromise, timeoutPromise])) as any[]
    } catch (dbError) {
      console.log("Database query failed or timed out, using fallback")
    }

    // If we have DB results, return them quickly
    if (dbProperties.length > 0) {
      return NextResponse.json({
        properties: dbProperties,
        total: dbProperties.length,
        page,
        limit,
        success: true,
        source: "database",
      })
    }

    // Fast fallback with mock data
    const mockProperty = createFastMockProperty(address, city, state)

    return NextResponse.json({
      properties: [mockProperty],
      success: true,
      source: "mock",
      message: "Using sample data for demo",
    })
  } catch (error) {
    console.error("Property API Error:", error)

    // Always return something quickly
    const fallbackProperty = createFastMockProperty(address, city, state)

    return NextResponse.json({
      properties: [fallbackProperty],
      success: true,
      source: "fallback",
      error: "Using sample data",
    })
  }
}

// Add helper functions
async function getPropertiesFromDB(
  address: string | null,
  city: string | null,
  state: string | null,
  limit: number,
  page: number,
) {
  const db = await getDatabase()
  const propertiesCollection = db.collection("properties")

  const query: any = {}
  if (address) query.address = { $regex: address, $options: "i" }
  if (city) query.city = { $regex: city, $options: "i" }
  if (state) query.state = { $regex: state, $options: "i" }

  return await propertiesCollection
    .find(query)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
    .toArray()
}

function createFastMockProperty(address: string | null, city: string | null, state: string | null) {
  return {
    _id: `mock-${Date.now()}`,
    address: address || "123 Sample Street",
    city: city || "San Francisco",
    state: state || "CA",
    zipCode: "94102",
    price: Math.floor(Math.random() * 500000) + 300000,
    bedrooms: Math.floor(Math.random() * 4) + 1,
    bathrooms: Math.floor(Math.random() * 3) + 1,
    sqft: Math.floor(Math.random() * 1500) + 800,
    propertyType: "Single Family Home",
    coordinates: {
      lat: 37.7749 + (Math.random() - 0.5) * 0.1,
      lng: -122.4194 + (Math.random() - 0.5) * 0.1,
    },
    owner: {
      name: "Sample Owner",
      company: "Sample Properties LLC",
      trustScore: Math.floor(Math.random() * 30) + 70,
      verified: Math.random() > 0.5,
    },
    marketData: {
      appreciation: Math.random() * 15,
      rentEstimate: Math.floor(Math.random() * 2000) + 2000,
      walkScore: Math.floor(Math.random() * 40) + 60,
      crimeRate: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
    },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export async function POST(request: NextRequest) {
  try {
    const propertyData = await request.json()
    const db = await getDatabase()
    const propertiesCollection = db.collection<Property>("properties")

    const newProperty: Omit<Property, "_id"> = {
      ...propertyData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await propertiesCollection.insertOne(newProperty)

    return NextResponse.json({
      success: true,
      propertyId: result.insertedId,
    })
  } catch (error) {
    console.error("Property creation error:", error)
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}
