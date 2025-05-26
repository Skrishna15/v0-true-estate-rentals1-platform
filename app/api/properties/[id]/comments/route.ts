import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongodb"
import type { PropertyComment } from "@/lib/models/Property"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const commentsCollection = db.collection<PropertyComment>("property_comments")

    const comments = await commentsCollection
      .find({ propertyId: new ObjectId(params.id) })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      comments,
      success: true,
    })
  } catch (error) {
    console.error("Comments fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId, userName, userAvatar, comment, rating } = await request.json()
    const db = await getDatabase()
    const commentsCollection = db.collection<PropertyComment>("property_comments")

    const newComment: Omit<PropertyComment, "_id"> = {
      propertyId: new ObjectId(params.id),
      userId: new ObjectId(userId),
      userName,
      userAvatar,
      comment,
      rating,
      createdAt: new Date(),
      verified: false, // Will be verified later
    }

    const result = await commentsCollection.insertOne(newComment)

    return NextResponse.json({
      success: true,
      commentId: result.insertedId,
    })
  } catch (error) {
    console.error("Comment creation error:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
