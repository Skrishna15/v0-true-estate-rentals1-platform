"use client"

import { useState } from "react"
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Maximize2, Camera, Eye, VolumeX, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface VirtualTourProps {
  propertyId: string
  images: string[]
  has360Tour?: boolean
  hasVideoTour?: boolean
}

export function VirtualTour({ propertyId, images, has360Tour = true, hasVideoTour = true }: VirtualTourProps) {
  const [currentView, setCurrentView] = useState<"photos" | "360" | "video">("photos")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [zoom, setZoom] = useState(100)

  const tourImages =
    images.length > 0
      ? images
      : [
          "/placeholder.svg?height=600&width=800&text=Living Room",
          "/placeholder.svg?height=600&width=800&text=Kitchen",
          "/placeholder.svg?height=600&width=800&text=Bedroom",
          "/placeholder.svg?height=600&width=800&text=Bathroom",
          "/placeholder.svg?height=600&width=800&text=Balcony View",
        ]

  const rooms = [
    { name: "Living Room", image: tourImages[0], description: "Spacious living area with natural light" },
    { name: "Kitchen", image: tourImages[1], description: "Modern kitchen with stainless steel appliances" },
    { name: "Master Bedroom", image: tourImages[2], description: "Large bedroom with walk-in closet" },
    { name: "Bathroom", image: tourImages[3], description: "Updated bathroom with modern fixtures" },
    { name: "Balcony", image: tourImages[4], description: "Private balcony with city views" },
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % tourImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + tourImages.length) % tourImages.length)
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const resetView = () => {
    setZoom(100)
    setCurrentImageIndex(0)
  }

  const enterFullscreen = () => {
    // In a real implementation, this would trigger fullscreen mode
    console.log("Entering fullscreen mode")
  }

  return (
    <div className="space-y-6">
      {/* Tour Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Virtual Property Tour
          </CardTitle>
          <CardDescription>Explore this property from the comfort of your home</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={currentView === "photos" ? "default" : "outline"}
              onClick={() => setCurrentView("photos")}
              className="flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Photo Gallery
            </Button>
            {has360Tour && (
              <Button
                variant={currentView === "360" ? "default" : "outline"}
                onClick={() => setCurrentView("360")}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                360° Tour
                <Badge className="bg-green-500 text-white text-xs">NEW</Badge>
              </Button>
            )}
            {hasVideoTour && (
              <Button
                variant={currentView === "video" ? "default" : "outline"}
                onClick={() => setCurrentView("video")}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Video Tour
              </Button>
            )}
          </div>

          {/* Main Viewer */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            {/* Photo Gallery View */}
            {currentView === "photos" && (
              <div className="relative">
                <img
                  src={tourImages[currentImageIndex] || "/placeholder.svg"}
                  alt={`Property view ${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover transition-transform duration-300"
                  style={{ transform: `scale(${zoom / 100})` }}
                />

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  →
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {tourImages.length}
                </div>
              </div>
            )}

            {/* 360° Tour View */}
            {currentView === "360" && (
              <div className="relative h-96 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold mb-2">360° Virtual Tour</h3>
                  <p className="text-blue-200 mb-4">Loading immersive experience...</p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 max-w-md">
                    <p className="text-sm">
                      🖱️ Click and drag to look around
                      <br />🔍 Scroll to zoom in/out
                      <br />📱 Use touch gestures on mobile
                    </p>
                  </div>
                </div>

                {/* 360 Tour Placeholder */}
                <div className="absolute inset-0 opacity-30">
                  <img
                    src={tourImages[currentImageIndex] || "/placeholder.svg"}
                    alt="360 tour background"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Video Tour View */}
            {currentView === "video" && (
              <div className="relative h-96 bg-black flex items-center justify-center">
                <div className="relative w-full h-full">
                  <img
                    src="/placeholder.svg?height=400&width=800&text=Video Tour Preview"
                    alt="Video tour preview"
                    className="w-full h-full object-cover"
                  />

                  {/* Video Controls Overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <button
                      onClick={togglePlayback}
                      className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-gray-800" />
                      ) : (
                        <Play className="w-8 h-8 text-gray-800 ml-1" />
                      )}
                    </button>
                  </div>

                  {/* Video Progress Bar */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 rounded-lg p-3">
                      <div className="flex items-center gap-3 text-white">
                        <span className="text-sm">2:34</span>
                        <div className="flex-1 bg-white/30 rounded-full h-1">
                          <div className="bg-white rounded-full h-1 w-1/3"></div>
                        </div>
                        <span className="text-sm">7:42</span>
                        <button onClick={() => setIsMuted(!isMuted)}>
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tour Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setZoom(Math.max(50, zoom - 25))}
                className="bg-black/50 text-white hover:bg-black/70"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className="bg-black/50 text-white hover:bg-black/70"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={resetView}
                className="bg-black/50 text-white hover:bg-black/70"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={enterFullscreen}
                className="bg-black/50 text-white hover:bg-black/70"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Zoom Indicator */}
            {currentView === "photos" && zoom !== 100 && (
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">{zoom}%</div>
            )}
          </div>

          {/* Room Navigation */}
          <div className="mt-4">
            <h4 className="font-semibold mb-3">Explore Rooms</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {rooms.map((room, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === index
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img src={room.image || "/placeholder.svg"} alt={room.name} className="w-full h-16 object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-medium text-center px-1">{room.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Room Info */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium">{rooms[currentImageIndex]?.name}</h5>
            <p className="text-sm text-gray-600">{rooms[currentImageIndex]?.description}</p>
          </div>

          {/* Tour Features */}
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Camera className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-blue-900">High-Res Photos</h4>
              <p className="text-sm text-blue-700">Professional photography with zoom capability</p>
            </div>
            {has360Tour && (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <RotateCcw className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-green-900">360° Experience</h4>
                <p className="text-sm text-green-700">Immersive virtual walkthrough</p>
              </div>
            )}
            {hasVideoTour && (
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Play className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-purple-900">Video Tour</h4>
                <p className="text-sm text-purple-700">Guided walkthrough with narration</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
