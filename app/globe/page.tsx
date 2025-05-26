"use client"

import { GlobeMap } from "@/components/globe-map"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, TrendingUp, Shield, Eye } from "lucide-react"

export default function GlobePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">3D Property Globe</h1>
              <p className="text-gray-600">Interactive 3D visualization of global real estate data</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              <Eye className="w-3 h-3 mr-1" />
              Real-time Data
            </Badge>
            <Badge variant="secondary">
              <Shield className="w-3 h-3 mr-1" />
              Verified Properties
            </Badge>
            <Badge variant="secondary">
              <TrendingUp className="w-3 h-3 mr-1" />
              Market Intelligence
            </Badge>
          </div>
        </div>

        {/* Globe Map */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                <div className="h-[600px] lg:h-[700px]">
                  <GlobeMap className="w-full h-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Global Overview</CardTitle>
                <CardDescription>Real-time property statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Properties</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Verified</span>
                  <span className="font-semibold text-green-600">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Under Review</span>
                  <span className="font-semibold text-yellow-600">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">High Risk</span>
                  <span className="font-semibold text-red-600">1</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Value</span>
                    <span className="font-semibold text-green-600">$12.4M</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Controls Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Map Controls</CardTitle>
                <CardDescription>How to navigate the 3D globe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Rotate:</strong> Click and drag to rotate the globe
                </div>
                <div>
                  <strong>Zoom:</strong> Use mouse wheel or zoom controls
                </div>
                <div>
                  <strong>Properties:</strong> Click markers to view details
                </div>
                <div>
                  <strong>Styles:</strong> Toggle between light/dark themes
                </div>
                <div>
                  <strong>Atmosphere:</strong> Enable/disable fog effects
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>3D Globe Projection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Atmospheric Effects</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Interactive Property Markers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Real-time Data Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Trust Score Visualization</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
