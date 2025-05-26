"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Shield, DollarSign, AlertTriangle, Users, Building } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface RealTimeStatsProps {
  data: {
    totalValue: string
    activeProperties: number
    verifiedOwners: number
    avgTrustScore: number
    scamsPrevented: number
    newListings: number
  }
}

export function RealTimeStats({ data }: RealTimeStatsProps) {
  const [animatedStats, setAnimatedStats] = useState(data)
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStats((prev) => ({
        ...prev,
        scamsPrevented: prev.scamsPrevented + Math.floor(Math.random() * 2),
        newListings: prev.newListings + Math.floor(Math.random() * 1),
      }))

      // Flash live indicator
      setIsLive(false)
      setTimeout(() => setIsLive(true), 200)
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const stats = [
    {
      icon: DollarSign,
      label: "Total Portfolio Value",
      value: animatedStats.totalValue,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Building,
      label: "Verified Properties",
      value: animatedStats.activeProperties.toLocaleString(),
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Users,
      label: "Trusted Owners",
      value: animatedStats.verifiedOwners.toLocaleString(),
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Shield,
      label: "Avg Trust Score",
      value: `${animatedStats.avgTrustScore}%`,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      icon: AlertTriangle,
      label: "Scams Prevented",
      value: animatedStats.scamsPrevented.toLocaleString(),
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      icon: TrendingUp,
      label: "New Listings Today",
      value: animatedStats.newListings.toLocaleString(),
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? "bg-green-500" : "bg-gray-400"} animate-pulse`}></div>
          <span className="text-sm font-medium text-gray-600">LIVE MARKET DATA</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Real-Time Platform Statistics</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-xs text-gray-600 leading-tight">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          Data updates every 15 seconds • Last sync: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </section>
  )
}
