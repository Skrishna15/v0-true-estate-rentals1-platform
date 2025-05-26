import type { ObjectId } from "mongodb"

export interface Bookmark {
  _id?: ObjectId
  userId: ObjectId
  propertyId: string
  propertyData: {
    address: string
    owner: string
    value: string
    trustScore: number
    coordinates: [number, number]
  }
  notes: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface SavedMapView {
  _id?: ObjectId
  userId: ObjectId
  name: string
  description: string
  mapState: {
    center: [number, number]
    zoom: number
    style: string
    filters: any
  }
  isPublic: boolean
  sharedWith: ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  _id?: ObjectId
  userId: ObjectId
  type: "alert" | "price_change" | "new_listing" | "team_activity" | "system"
  title: string
  message: string
  data: any
  read: boolean
  createdAt: Date
}

export interface PropertyAlert {
  _id?: ObjectId
  userId: ObjectId
  name: string
  criteria: {
    location?: string
    priceMin?: number
    priceMax?: number
    propertyType?: string
    trustScoreMin?: number
  }
  frequency: "instant" | "daily" | "weekly"
  active: boolean
  createdAt: Date
  updatedAt: Date
}
