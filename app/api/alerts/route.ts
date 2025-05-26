import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { PropertyAlert } from "@/lib/models/Bookmark"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  try {
    const db = await getDatabase()
    const alertsCollection = db.collection<PropertyAlert>("propertyAlerts")

    const alerts = await alertsCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      alerts,
      success: true,
    })
  } catch (error) {
    console.error("Alerts fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, name, criteria, frequency } = await request.json()

    const db = await getDatabase()
    const alertsCollection = db.collection<PropertyAlert>("propertyAlerts")

    const alert: Omit<PropertyAlert, "_id"> = {
      userId: new ObjectId(userId),
      name,
      criteria,
      frequency: frequency || "daily",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await alertsCollection.insertOne(alert)

    return NextResponse.json({
      success: true,
      alertId: result.insertedId,
    })
  } catch (error) {
    console.error("Alert creation error:", error)
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
  }
}
