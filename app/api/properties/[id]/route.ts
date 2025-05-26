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
