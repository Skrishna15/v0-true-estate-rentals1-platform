import type { ObjectId } from "mongodb"

export interface Owner {
  _id?: ObjectId
  userId: ObjectId
  name: string
  email: string
  phone?: string
  company?: string
  businessType: "individual" | "llc" | "corporation" | "partnership"
  portfolio: {
    totalProperties: number
    totalValue: number
    locations: string[]
    propertyTypes: string[]
  }
  trustMetrics: {
    trustScore: number
    responseRate: number
    averageResponseTime: number // in hours
    totalReviews: number
    averageRating: number
  }
  verificationStatus: {
    identityVerified: boolean
    backgroundCheck: boolean
    businessVerified: boolean
    documentsVerified: boolean
    lastVerified: Date
  }
  properties: ObjectId[]
  reviews: {
    userId: ObjectId
    rating: number
    comment: string
    propertyId: ObjectId
    createdAt: Date
  }[]
  createdAt: Date
  updatedAt: Date
}
