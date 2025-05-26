import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { PropertyReview } from "@/lib/models/Property"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()

    const reviews = await db
      .collection("property_reviews")
      .aggregate([
        { $match: { propertyId: new ObjectId(params.id) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            rating: 1,
            comment: 1,
            verified: 1,
            helpful: 1,
            createdAt: 1,
            "user.name": 1,
            "user.avatar": 1,
            "user.verified": 1,
          },
        },
      ])
      .toArray()

    return NextResponse.json({
      reviews,
      success: true,
    })
  } catch (error) {
    console.error("Reviews fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { rating, comment } = await request.json()

    if (!rating || !comment) {
      return NextResponse.json({ error: "Rating and comment are required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Get property to find owner
    const property = await db.collection("properties").findOne({
      _id: new ObjectId(params.id),
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Check if user already reviewed this property
    const existingReview = await db.collection("property_reviews").findOne({
      propertyId: new ObjectId(params.id),
      userId: new ObjectId(session.user.id),
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this property" }, { status: 400 })
    }

    const newReview: Omit<PropertyReview, "_id"> = {
      propertyId: new ObjectId(params.id),
      userId: new ObjectId(session.user.id),
      ownerId: property.ownerId,
      rating,
      comment,
      verified: session.user.verified || false,
      helpful: 0,
      reported: false,
      createdAt: new Date(),
    }

    await db.collection("property_reviews").insertOne(newReview)

    // Update property ratings
    const allReviews = await db
      .collection("property_reviews")
      .find({ propertyId: new ObjectId(params.id) })
      .toArray()

    const totalReviews = allReviews.length
    const averageRating = allReviews.reduce((sum, review) => sum + review.rating.overall, 0) / totalReviews

    const breakdown = {
      landlord: allReviews.reduce((sum, review) => sum + review.rating.landlord, 0) / totalReviews,
      property: allReviews.reduce((sum, review) => sum + review.rating.property, 0) / totalReviews,
      neighborhood: allReviews.reduce((sum, review) => sum + review.rating.neighborhood, 0) / totalReviews,
      value: allReviews.reduce((sum, review) => sum + review.rating.value, 0) / totalReviews,
    }

    await db.collection("properties").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          "ratings.averageRating": averageRating,
          "ratings.totalReviews": totalReviews,
          "ratings.breakdown": breakdown,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      success: true,
      message: "Review added successfully",
    })
  } catch (error) {
    console.error("Review creation error:", error)
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 })
  }
}
