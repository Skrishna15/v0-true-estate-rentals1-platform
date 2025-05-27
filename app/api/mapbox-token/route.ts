import { NextResponse } from "next/server"

export async function GET() {
  try {
    const token = process.env.MAPBOX_ACCESS_TOKEN

    if (!token) {
      console.error("MAPBOX_ACCESS_TOKEN not found in environment variables")
      return NextResponse.json({ error: "Mapbox token not configured", token: null }, { status: 500 })
    }

    return NextResponse.json({ token, success: true })
  } catch (error) {
    console.error("Error fetching Mapbox token:", error)
    return NextResponse.json({ error: "Failed to fetch token", token: null }, { status: 500 })
  }
}
