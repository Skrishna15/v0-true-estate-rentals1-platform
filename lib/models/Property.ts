import type { ObjectId } from "mongodb"

export interface Property {
  _id?: ObjectId
  address: string
  city: string
  state: string
  zipCode: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  propertyType: string
  listingDate: Date
  coordinates: {
    lat: number
    lng: number
  }
  owner: {
    name: string
    email?: string
    phone?: string
    company?: string
    trustScore: number
    verified: boolean
    backgroundCheck?: boolean
    businessVerified?: boolean
    documentsVerified?: boolean
    yearsActive?: number
    responseRate?: number
    averageResponseTime?: number // in hours
    portfolio?: {
      totalProperties: number
      totalValue: string
      propertyTypes: string[]
      locations: string[]
      averageRent?: number
    }
    reviews?: {
      totalReviews: number
      averageRating: number
      recentReviews: Array<{
        rating: number
        comment: string
        date: Date
        propertyAddress: string
      }>
    }
    businessInfo?: {
      licenseNumber?: string
      businessType?: string
      establishedYear?: number
      website?: string
    }
    lastActive?: Date
  }
  images: string[]
  amenities: string[]
  description: string
  status: "active" | "pending" | "sold" | "rented"
  verificationData?: {
    attomData?: any
    zillowData?: any
    lastVerified: Date
  }
  neighborhoodData?: {
    schools: any[]
    hospitals: any[]
    transit: any[]
    demographics?: any
    lastUpdated: Date
  }
  createdAt: Date
  updatedAt: Date
}

export interface PropertyComment {
  _id?: ObjectId
  propertyId: ObjectId
  userId: ObjectId
  userName: string
  userAvatar?: string
  comment: string
  rating: number
  createdAt: Date
  verified: boolean
}

export interface PropertyQuestion {
  _id?: ObjectId
  propertyId: ObjectId
  userId: ObjectId
  userName: string
  question: string
  answer?: string
  answeredBy?: ObjectId
  answeredAt?: Date
  createdAt: Date
}
