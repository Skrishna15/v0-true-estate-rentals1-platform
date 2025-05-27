"use client"
import { useParams } from "next/navigation"
import { OwnerWealthAnalysis } from "@/components/owner-wealth-analysis"
import { Header } from "@/components/header"

export default function OwnerPage() {
  const params = useParams()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <OwnerWealthAnalysis ownerId={params.id as string} />
      </div>
    </div>
  )
}
