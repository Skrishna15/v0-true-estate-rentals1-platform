import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")

  try {
    if (!address) {
      return NextResponse.json(
        {
          error: "Address parameter is required",
          success: false,
        },
        { status: 400 },
      )
    }

    // Check if API key exists
    if (!process.env.RAPIDAPI_KEY) {
      console.log("RAPIDAPI_KEY not found, returning mock data")
      return NextResponse.json({
        properties: [
          {
            address: address,
            price: Math.floor(Math.random() * 500000) + 200000,
            bedrooms: Math.floor(Math.random() * 4) + 1,
            bathrooms: Math.floor(Math.random() * 3) + 1,
            sqft: Math.floor(Math.random() * 2000) + 800,
            propertyType: "Single Family Home",
            city: address.split(",")[1]?.trim() || "Unknown City",
            state: address.split(",")[2]?.trim() || "CA",
            yearBuilt: 2000 + Math.floor(Math.random() * 24),
            longitude: -122.4194 + (Math.random() - 0.5) * 0.1,
            latitude: 37.7749 + (Math.random() - 0.5) * 0.1,
          },
        ],
        success: true,
        source: "mock",
      })
    }

    // Try Zillow API
    const response = await fetch(
      `https://zillow-com1.p.rapidapi.com/propertyExtendedSearch?location=${encodeURIComponent(address)}`,
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "zillow-com1.p.rapidapi.com",
        },
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 second timeout
      },
    )

    if (!response.ok) {
      throw new Error(`Zillow API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // If no properties found, return mock data
    if (!data.props || data.props.length === 0) {
      return NextResponse.json({
        properties: [
          {
            address: address,
            price: Math.floor(Math.random() * 500000) + 200000,
            bedrooms: Math.floor(Math.random() * 4) + 1,
            bathrooms: Math.floor(Math.random() * 3) + 1,
            sqft: Math.floor(Math.random() * 2000) + 800,
            propertyType: "Single Family Home",
            city: address.split(",")[1]?.trim() || "Unknown City",
            state: address.split(",")[2]?.trim() || "CA",
            yearBuilt: 2000 + Math.floor(Math.random() * 24),
            longitude: -122.4194 + (Math.random() - 0.5) * 0.1,
            latitude: 37.7749 + (Math.random() - 0.5) * 0.1,
          },
        ],
        success: true,
        source: "mock_no_results",
      })
    }

    return NextResponse.json({
      properties: data.props || [],
      success: true,
      source: "zillow",
    })
  } catch (error) {
    console.error("Zillow API Error:", error)

    // Return mock data on error
    return NextResponse.json({
      properties: [
        {
          address: address || "Sample Address",
          price: Math.floor(Math.random() * 500000) + 200000,
          bedrooms: Math.floor(Math.random() * 4) + 1,
          bathrooms: Math.floor(Math.random() * 3) + 1,
          sqft: Math.floor(Math.random() * 2000) + 800,
          propertyType: "Single Family Home",
          city: address?.split(",")[1]?.trim() || "Unknown City",
          state: address?.split(",")[2]?.trim() || "CA",
          yearBuilt: 2000 + Math.floor(Math.random() * 24),
          longitude: -122.4194 + (Math.random() - 0.5) * 0.1,
          latitude: 37.7749 + (Math.random() - 0.5) * 0.1,
        },
      ],
      success: true,
      source: "fallback",
      error: error.message,
    })
  }
}
