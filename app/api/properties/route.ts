import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Property } from "@/lib/models/Property"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")
    const city = searchParams.get("city")
    const state = searchParams.get("state")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const propertyType = searchParams.get("propertyType")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    console.log("Properties API called with params:", {
      address,
      city,
      state,
      minPrice,
      maxPrice,
      propertyType,
      limit,
      offset,
    })

    // Sample properties for fallback or when database is not available
    const sampleProperties = [
      {
        _id: "sample-1",
        address: {
          street: "123 Broadway",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
        },
        coordinates: {
          lat: 40.7505,
          lng: -73.9934,
        },
        details: {
          price: 3500000,
          rentPrice: 8500,
          size: 2200,
          bedrooms: 3,
          bathrooms: 2,
          propertyType: "condo",
          yearBuilt: 2018,
          parking: 1,
        },
        images: [
          "/placeholder.svg?height=400&width=600&query=luxury+condo+living+room",
          "/placeholder.svg?height=400&width=600&query=modern+kitchen+granite",
          "/placeholder.svg?height=400&width=600&query=bedroom+city+view",
        ],
        description: "Luxury condo in the heart of Manhattan with stunning city views and premium amenities.",
        amenities: ["Gym", "Doorman", "Rooftop Deck", "In-unit Laundry", "Central AC"],
        status: "active",
        transparencyScore: 95,
        verificationData: {
          ownerVerified: true,
          documentsVerified: true,
          addressVerified: true,
          priceVerified: true,
          lastVerified: new Date(),
        },
        ratings: {
          averageRating: 4.8,
          totalReviews: 24,
          breakdown: {
            landlord: 4.9,
            property: 4.7,
            neighborhood: 4.8,
            value: 4.6,
          },
        },
        owner: {
          name: "Sarah Johnson",
          company: "Manhattan Properties LLC",
          trustScore: 95,
          verified: true,
          totalProperties: 12,
          responseRate: 98,
          responseTime: "< 2 hours",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "sample-2",
        address: {
          street: "456 Park Avenue",
          city: "New York",
          state: "NY",
          zipCode: "10022",
          country: "USA",
        },
        coordinates: {
          lat: 40.7614,
          lng: -73.9776,
        },
        details: {
          price: 2800000,
          rentPrice: 6500,
          size: 1800,
          bedrooms: 2,
          bathrooms: 2,
          propertyType: "apartment",
          yearBuilt: 2015,
          parking: 1,
        },
        images: [
          "/placeholder.svg?height=400&width=600&query=modern+apartment+living+room",
          "/placeholder.svg?height=400&width=600&query=kitchen+stainless+steel",
          "/placeholder.svg?height=400&width=600&query=bedroom+park+view",
        ],
        description: "Modern apartment with park views and excellent location near Central Park.",
        amenities: ["Concierge", "Fitness Center", "Pet Friendly", "Balcony", "Storage"],
        status: "active",
        transparencyScore: 88,
        verificationData: {
          ownerVerified: true,
          documentsVerified: true,
          addressVerified: true,
          priceVerified: true,
          lastVerified: new Date(),
        },
        ratings: {
          averageRating: 4.5,
          totalReviews: 18,
          breakdown: {
            landlord: 4.6,
            property: 4.4,
            neighborhood: 4.7,
            value: 4.3,
          },
        },
        owner: {
          name: "Michael Chen",
          company: "Park Avenue Realty",
          trustScore: 88,
          verified: true,
          totalProperties: 8,
          responseRate: 95,
          responseTime: "< 4 hours",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "sample-3",
        address: {
          street: "789 Fifth Avenue",
          city: "New York",
          state: "NY",
          zipCode: "10065",
          country: "USA",
        },
        coordinates: {
          lat: 40.7736,
          lng: -73.9566,
        },
        details: {
          price: 1200000,
          rentPrice: 4200,
          size: 1200,
          bedrooms: 1,
          bathrooms: 1,
          propertyType: "studio",
          yearBuilt: 2020,
          parking: 0,
        },
        images: [
          "/placeholder.svg?height=400&width=600&query=studio+apartment+modern",
          "/placeholder.svg?height=400&width=600&query=compact+kitchen+efficient",
          "/placeholder.svg?height=400&width=600&query=murphy+bed+space+saving",
        ],
        description: "Efficient studio apartment in prime Upper East Side location with modern finishes.",
        amenities: ["Laundry Room", "Bike Storage", "Package Room", "High-Speed Internet"],
        status: "active",
        transparencyScore: 92,
        verificationData: {
          ownerVerified: true,
          documentsVerified: true,
          addressVerified: true,
          priceVerified: true,
          lastVerified: new Date(),
        },
        ratings: {
          averageRating: 4.2,
          totalReviews: 12,
          breakdown: {
            landlord: 4.3,
            property: 4.1,
            neighborhood: 4.5,
            value: 3.9,
          },
        },
        owner: {
          name: "Emily Rodriguez",
          company: "UES Properties",
          trustScore: 92,
          verified: true,
          totalProperties: 5,
          responseRate: 100,
          responseTime: "< 1 hour",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    try {
      // Try to connect to database
      const db = await getDatabase()
      const propertiesCollection = db.collection<Property>("properties")

      // Build query based on search parameters
      const query: any = {}

      if (address) {
        query.$or = [
          { "address.street": { $regex: address, $options: "i" } },
          { "address.city": { $regex: address, $options: "i" } },
          { "address.state": { $regex: address, $options: "i" } },
          { "address.zipCode": { $regex: address, $options: "i" } },
        ]
      }

      if (city) {
        query["address.city"] = { $regex: city, $options: "i" }
      }

      if (state) {
        query["address.state"] = { $regex: state, $options: "i" }
      }

      if (minPrice || maxPrice) {
        query["details.price"] = {}
        if (minPrice) query["details.price"].$gte = Number.parseInt(minPrice)
        if (maxPrice) query["details.price"].$lte = Number.parseInt(maxPrice)
      }

      if (propertyType) {
        query["details.propertyType"] = propertyType
      }

      // Execute query
      const properties = await propertiesCollection
        .find(query)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .toArray()

      const total = await propertiesCollection.countDocuments(query)

      console.log(`Found ${properties.length} properties in database`)

      return NextResponse.json({
        properties: properties.length > 0 ? properties : sampleProperties,
        total: properties.length > 0 ? total : sampleProperties.length,
        success: true,
        source: properties.length > 0 ? "database" : "sample",
      })
    } catch (dbError) {
      console.error("Database error, using sample data:", dbError)

      // Filter sample properties based on search parameters
      let filteredProperties = sampleProperties

      if (address) {
        const searchTerm = address.toLowerCase()
        filteredProperties = sampleProperties.filter(
          (property) =>
            property.address.street.toLowerCase().includes(searchTerm) ||
            property.address.city.toLowerCase().includes(searchTerm) ||
            property.address.state.toLowerCase().includes(searchTerm),
        )
      }

      if (city) {
        filteredProperties = filteredProperties.filter((property) =>
          property.address.city.toLowerCase().includes(city.toLowerCase()),
        )
      }

      if (state) {
        filteredProperties = filteredProperties.filter((property) =>
          property.address.state.toLowerCase().includes(state.toLowerCase()),
        )
      }

      if (minPrice) {
        filteredProperties = filteredProperties.filter(
          (property) => property.details.price >= Number.parseInt(minPrice),
        )
      }

      if (maxPrice) {
        filteredProperties = filteredProperties.filter(
          (property) => property.details.price <= Number.parseInt(maxPrice),
        )
      }

      if (propertyType) {
        filteredProperties = filteredProperties.filter((property) => property.details.propertyType === propertyType)
      }

      return NextResponse.json({
        properties: filteredProperties.slice(offset, offset + limit),
        total: filteredProperties.length,
        success: true,
        source: "sample",
        message: "Using sample data due to database connection issue",
      })
    }
  } catch (error) {
    console.error("Properties API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch properties",
        message: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 },
    )
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
      status: "active",
      transparencyScore: 0,
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
      views: 0,
      bookmarks: 0,
      flagged: false,
    }

    const result = await propertiesCollection.insertOne(newProperty)

    return NextResponse.json({
      success: true,
      propertyId: result.insertedId,
      message: "Property created successfully",
    })
  } catch (error) {
    console.error("Property creation error:", error)
    return NextResponse.json(
      {
        error: "Failed to create property",
        message: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 },
    )
  }
}
