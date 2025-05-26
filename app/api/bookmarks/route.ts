import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { PropertyBookmark } from "@/lib/models/Property"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const db = await getDatabase()

    const bookmarks = await db
      .collection("property_bookmarks")
      .aggregate([
        { $match: { userId: new ObjectId(session.user.id) } },
        {
          $lookup: {
            from: "properties",
            localField: "propertyId",
            foreignField: "_id",
            as: "property",
          },
        },
        { $unwind: "$property" },
        {
          $lookup: {
            from: "users",
            localField: "property.ownerId",
            foreignField: "_id",
            as: "property.owner",
          },
        },
        { $unwind: "$property.owner" },
        { $sort: { createdAt: -1 } },
      ])
      .toArray()

    return NextResponse.json({
      bookmarks,
      success: true,
    })
  } catch (error) {
    console.error("Bookmarks fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { propertyId, notes, tags } = await request.json()

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if already bookmarked
    const existingBookmark = await db.collection("property_bookmarks").findOne({
      userId: new ObjectId(session.user.id),
      propertyId: new ObjectId(propertyId),
    })

    if (existingBookmark) {
      return NextResponse.json({ error: "Property already bookmarked" }, { status: 400 })
    }

    const newBookmark: Omit<PropertyBookmark, "_id"> = {
      userId: new ObjectId(session.user.id),
      propertyId: new ObjectId(propertyId),
      notes: notes || "",
      tags: tags || [],
      createdAt: new Date(),
    }

    await db.collection("property_bookmarks").insertOne(newBookmark)

    // Update property bookmark count
    await db.collection("properties").updateOne({ _id: new ObjectId(propertyId) }, { $inc: { bookmarks: 1 } })

    return NextResponse.json({
      success: true,
      message: "Property bookmarked successfully",
    })
  } catch (error) {
    console.error("Bookmark creation error:", error)
    return NextResponse.json({ error: "Failed to bookmark property" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get("propertyId")

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
    }

    const db = await getDatabase()

    const result = await db.collection("property_bookmarks").deleteOne({
      userId: new ObjectId(session.user.id),
      propertyId: new ObjectId(propertyId),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 })
    }

    // Update property bookmark count
    await db.collection("properties").updateOne({ _id: new ObjectId(propertyId) }, { $inc: { bookmarks: -1 } })

    return NextResponse.json({
      success: true,
      message: "Bookmark removed successfully",
    })
  } catch (error) {
    console.error("Bookmark deletion error:", error)
    return NextResponse.json({ error: "Failed to remove bookmark" }, { status: 500 })
  }
}
