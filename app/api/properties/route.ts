import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Property } from "@/lib/models/Property"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")
  const city = searchParams.get("city")
  const state = searchParams.get("state")
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const page = Number.parseInt(searchParams.get("page") || "1")

  try {
    const db = await getDatabase()
    const propertiesCollection = db.collection<Property>("properties")

    // Build search query
    const query: any = {}
    if (address) {
      query.address = { $regex: address, $options: "i" }
    }
    if (city) {
      query.city = { $regex: city, $options: "i" }
    }
    if (state) {
      query.state = { $regex: state, $options: "i" }
    }

    // Get properties from database
    const properties = await propertiesCollection
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .toArray()

    // If no properties found in DB, fetch from external APIs
    if (properties.length === 0 && address) {
      // ATTOM Data API for property details
      const attomResponse = await fetch(
        `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/detail?address1=${encodeURIComponent(address)}&locality=${encodeURIComponent(city || "")}&division=${encodeURIComponent(state || "")}`,
        {
          headers: {
            Accept: "application/json",
            apikey: process.env.ATTOM_API_KEY!,
          },
        },
      )

      const attomData = await attomResponse.json()

      // RentCast API for rental estimates
      const rentcastResponse = await fetch(
        `https://api.rentcast.io/v1/avm/rent/long-term?address=${encodeURIComponent(address)}&city=${encodeURIComponent(city || "")}&state=${encodeURIComponent(state || "")}`,
        {
          headers: {
            "X-Api-Key": process.env.RENTCAST_API!,
          },
        },
      )

      const rentcastData = await rentcastResponse.json()

      // Save to database for future use
      if (attomData.property && attomData.property.length > 0) {
        const propertyData = attomData.property[0]
        const newProperty: Omit<Property, "_id"> = {
          address: propertyData.address?.oneLine || address,
          city: propertyData.address?.locality || city || "",
          state: propertyData.address?.countrySubd || state || "",
          zipCode: propertyData.address?.postal1 || "",
          price: rentcastData.rent || propertyData.assessment?.market?.mktTtlValue || 0,
          bedrooms: propertyData.building?.rooms?.beds || 0,
          bathrooms: propertyData.building?.rooms?.bathsTotal || 0,
          sqft: propertyData.building?.size?.livingSize || 0,
          propertyType: propertyData.summary?.propType || "Unknown",
          listingDate: new Date(),
          coordinates: {
            lat: propertyData.location?.latitude || 0,
            lng: propertyData.location?.longitude || 0,
          },
          owner: {
            name: "Property Owner", // Will be updated with verification
            trustScore: 50, // Default score
            verified: false,
          },
          images: [],
          amenities: [],
          description: "",
          status: "active",
          verificationData: {
            attomData: propertyData,
            zillowData: null,
            lastVerified: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        await propertiesCollection.insertOne(newProperty)
      }

      return NextResponse.json({
        properties: properties,
        external: {
          attom: attomData,
          rentcast: rentcastData,
        },
        success: true,
      })
    }

    return NextResponse.json({
      properties: properties,
      total: await propertiesCollection.countDocuments(query),
      page,
      limit,
      success: true,
    })
  } catch (error) {
    console.error("Property API Error:", error)
    return NextResponse.json({ error: "Failed to fetch property data" }, { status: 500 })
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
