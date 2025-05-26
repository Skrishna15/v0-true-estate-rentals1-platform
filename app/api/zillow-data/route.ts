import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")

  try {
    // Using RapidAPI for Zillow data
    const response = await fetch(
      `https://zillow-com1.p.rapidapi.com/propertyExtendedSearch?location=${encodeURIComponent(address || "")}`,
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
          "X-RapidAPI-Host": "zillow-com1.p.rapidapi.com",
        },
      },
    )

    const data = await response.json()

    return NextResponse.json({
      properties: data.props || [],
      success: true,
    })
  } catch (error) {
    console.error("Zillow API Error:", error)
    return NextResponse.json({ error: "Failed to fetch Zillow data" }, { status: 500 })
  }
}
