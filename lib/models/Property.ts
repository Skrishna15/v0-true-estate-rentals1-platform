import type { ObjectId } from "mongodb"

export interface Property {
  _id?: ObjectId
  ownerId: ObjectId
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  coordinates: {
    lat: number
    lng: number
  }
  details: {
    price: number
    rentPrice?: number
    size: number // sq ft
    bedrooms: number
    bathrooms: number
    propertyType: "house" | "apartment" | "condo" | "townhouse" | "commercial" | "land"
    yearBuilt?: number
    lotSize?: number
    parking?: number
  }
  images: string[]
  description: string
  amenities: string[]
  status: "active" | "pending" | "sold" | "rented" | "off-market"

  // Transparency & Trust
  transparencyScore: number // 0-100 computed score
  verificationData: {
    ownerVerified: boolean
    documentsVerified: boolean
    addressVerified: boolean
    priceVerified: boolean
    lastVerified: Date
  }

  // Reviews & Ratings
  ratings: {
    averageRating: number
    totalReviews: number
    breakdown: {
      landlord: number
      property: number
      neighborhood: number
      value: number
    }
  }

  // Transaction History
  transactionHistory: {
    date: Date
    type: "sale" | "rental" | "listing"
    price: number
    buyer?: string
    seller?: string
    agent?: string
  }[]

  // Third-party Data
  externalData: {
    zillow?: {
      zestimate: number
      rentEstimate: number
      lastUpdated: Date
    }
    rentcast?: {
      rentEstimate: number
      confidence: number
      lastUpdated: Date
    }
    walkScore?: number
    schoolRating?: number
  }

  // Metadata
  views: number
  bookmarks: number
  flagged: boolean
  flagReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface PropertyReview {
  _id?: ObjectId
  propertyId: ObjectId
  userId: ObjectId
  ownerId: ObjectId
  rating: {
    overall: number
    landlord: number
    property: number
    neighborhood: number
    value: number
  }
  comment: string
  verified: boolean
  helpful: number
  reported: boolean
  createdAt: Date
}

export interface PropertyBookmark {
  _id?: ObjectId
  userId: ObjectId
  propertyId: ObjectId
  notes?: string
  tags: string[]
  createdAt: Date
}
