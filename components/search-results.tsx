"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Property } from "@/types/property" // Assuming Property type is declared in "@/types/property"

interface SearchResultsProps {
  properties: Property[]
}

const SearchResults: React.FC<SearchResultsProps> = ({ properties }) => {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {properties.map((property) => (
        <div key={property.id} className="border rounded-lg shadow-md">
          <img
            src={property.image || "/placeholder.svg"}
            alt={property.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{property.title}</h3>
            <p className="text-gray-600">{property.location}</p>
            <div className="flex items-center mt-2">
              <Avatar className="w-6 h-6 mr-2">
                <AvatarImage src={property.agent.image || "/placeholder.svg"} />
                <AvatarFallback>{property.agent.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{property.agent.name}</span>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-xl font-bold">${property.price}</span>
              <Button variant="outline" size="sm" onClick={() => router.push(`/property/${property.id}`)}>
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export { SearchResults }
