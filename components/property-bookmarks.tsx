"use client"

import { useState, useEffect } from "react"
import { Heart, Tag, FileText, Trash2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Bookmark {
  _id: string
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
  createdAt: string
}

interface PropertyBookmarksProps {
  userId: string
  onPropertySelect?: (property: any) => void
}

export function PropertyBookmarks({ userId, onPropertySelect }: PropertyBookmarksProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)
  const [editingNotes, setEditingNotes] = useState("")
  const [editingTags, setEditingTags] = useState("")

  useEffect(() => {
    fetchBookmarks()
  }, [userId])

  const fetchBookmarks = async () => {
    try {
      const response = await fetch(`/api/bookmarks?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setBookmarks(data.bookmarks)
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeBookmark = async (bookmarkId: string) => {
    try {
      const response = await fetch(`/api/bookmarks?id=${bookmarkId}&userId=${userId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setBookmarks(bookmarks.filter((b) => b._id !== bookmarkId))
      }
    } catch (error) {
      console.error("Failed to remove bookmark:", error)
    }
  }

  const updateBookmark = async (bookmarkId: string, notes: string, tags: string[]) => {
    try {
      const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, tags }),
      })
      if (response.ok) {
        fetchBookmarks()
      }
    } catch (error) {
      console.error("Failed to update bookmark:", error)
    }
  }

  // Add this useEffect after the existing ones
  useEffect(() => {
    const handleBookmarkAdded = () => {
      fetchBookmarks() // Refresh the bookmark list
    }

    window.addEventListener("bookmarkAdded", handleBookmarkAdded)

    return () => {
      window.removeEventListener("bookmarkAdded", handleBookmarkAdded)
    }
  }, [])

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
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Saved Properties ({bookmarks.length})
        </CardTitle>
        <CardDescription>Your bookmarked properties and notes</CardDescription>
      </CardHeader>
      <CardContent>
        {bookmarks.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No saved properties yet</p>
            <p className="text-sm text-gray-400">Click the heart icon on any property to save it</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onPropertySelect?.(bookmark.propertyData)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{bookmark.propertyData.owner}</h4>
                    <p className="text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {bookmark.propertyData.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${
                        bookmark.propertyData.trustScore >= 90
                          ? "bg-green-500"
                          : bookmark.propertyData.trustScore >= 80
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      } text-white`}
                    >
                      {bookmark.propertyData.trustScore}% Trust
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeBookmark(bookmark._id)
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-sm text-gray-500">Property Value</span>
                    <div className="font-semibold text-green-600">{bookmark.propertyData.value}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Saved</span>
                    <div className="text-sm">{new Date(bookmark.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {bookmark.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {bookmark.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {bookmark.notes && (
                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Notes</span>
                    </div>
                    <p className="text-sm text-gray-600">{bookmark.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedBookmark(bookmark)
                          setEditingNotes(bookmark.notes)
                          setEditingTags(bookmark.tags.join(", "))
                        }}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Edit Notes
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Property Notes</DialogTitle>
                        <DialogDescription>{bookmark.propertyData.address}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea
                            id="notes"
                            value={editingNotes}
                            onChange={(e) => setEditingNotes(e.target.value)}
                            placeholder="Add your notes about this property..."
                            rows={4}
                          />
                        </div>
                        <div>
                          <Label htmlFor="tags">Tags (comma-separated)</Label>
                          <Input
                            id="tags"
                            value={editingTags}
                            onChange={(e) => setEditingTags(e.target.value)}
                            placeholder="investment, rental, potential, etc."
                          />
                        </div>
                        <Button
                          onClick={() => {
                            if (selectedBookmark) {
                              updateBookmark(
                                selectedBookmark._id,
                                editingNotes,
                                editingTags
                                  .split(",")
                                  .map((tag) => tag.trim())
                                  .filter(Boolean),
                              )
                            }
                          }}
                          className="w-full"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Trigger map focus on this property
                      window.dispatchEvent(
                        new CustomEvent("focusProperty", {
                          detail: {
                            ...bookmark.propertyData,
                            coordinates: bookmark.propertyData.coordinates,
                          },
                        }),
                      )
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    Show on Map
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
