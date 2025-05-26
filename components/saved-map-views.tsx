"use client"

import { useState, useEffect } from "react"
import { Save, MapPin, Trash2, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface SavedMapView {
  _id: string
  name: string
  description: string
  mapState: {
    center: [number, number]
    zoom: number
    style: string
    filters: any
  }
  isPublic: boolean
  createdAt: string
}

interface SavedMapViewsProps {
  userId: string
  currentMapState?: any
  onLoadView?: (mapState: any) => void
}

export function SavedMapViews({ userId, currentMapState, onLoadView }: SavedMapViewsProps) {
  const [savedViews, setSavedViews] = useState<SavedMapView[]>([])
  const [loading, setLoading] = useState(true)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [newViewName, setNewViewName] = useState("")
  const [newViewDescription, setNewViewDescription] = useState("")

  useEffect(() => {
    fetchSavedViews()
  }, [userId])

  const fetchSavedViews = async () => {
    try {
      const response = await fetch(`/api/saved-views?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSavedViews(data.views)
        }
      }
    } catch (error) {
      console.error("Failed to fetch saved views:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveCurrentView = async () => {
    if (!newViewName.trim()) return

    try {
      const response = await fetch("/api/saved-views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: newViewName,
          description: newViewDescription,
          mapState: currentMapState || {
            center: [-100, 40],
            zoom: 2,
            style: "light",
            filters: {},
          },
          isPublic: false,
        }),
      })

      if (response.ok) {
        fetchSavedViews()
        setShowSaveDialog(false)
        setNewViewName("")
        setNewViewDescription("")
      }
    } catch (error) {
      console.error("Failed to save view:", error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Saved Views ({savedViews.length})
            </CardTitle>
            <CardDescription>Your saved map configurations</CardDescription>
          </div>
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Save className="w-4 h-4 mr-1" />
                Save Current
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Current Map View</DialogTitle>
                <DialogDescription>
                  Save your current map position, style, and filters for quick access later.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="viewName">View Name</Label>
                  <Input
                    id="viewName"
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                    placeholder="e.g., San Francisco Properties"
                  />
                </div>
                <div>
                  <Label htmlFor="viewDescription">Description (optional)</Label>
                  <Textarea
                    id="viewDescription"
                    value={newViewDescription}
                    onChange={(e) => setNewViewDescription(e.target.value)}
                    placeholder="Brief description of this view..."
                    rows={3}
                  />
                </div>
                <Button onClick={saveCurrentView} className="w-full" disabled={!newViewName.trim()}>
                  Save View
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {savedViews.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No saved views yet</p>
            <p className="text-sm text-gray-400">Save your current map view to quickly return to it later</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedViews.map((view) => (
              <div
                key={view._id}
                className="border rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => onLoadView?.(view.mapState)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium">{view.name}</h4>
                    {view.description && <p className="text-sm text-gray-600 mt-1">{view.description}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {view.isPublic && (
                      <Badge variant="outline" className="text-xs">
                        <Globe className="w-3 h-3 mr-1" />
                        Public
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>Style: {view.mapState.style}</div>
                  <div>Zoom: {view.mapState.zoom.toFixed(1)}</div>
                </div>

                <div className="text-xs text-gray-400 mt-2">Saved: {new Date(view.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
