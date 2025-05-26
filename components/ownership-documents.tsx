"use client"

import { useState } from "react"
import {
  FileText,
  Download,
  Eye,
  Shield,
  Building,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Lock,
  Verified,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface OwnershipDocument {
  id: string
  type: "deed" | "llc" | "background" | "insurance" | "tax" | "mortgage"
  title: string
  description: string
  verificationStatus: "verified" | "pending" | "expired"
  lastUpdated: string
  fileSize: string
  pages: number
  thumbnailUrl: string
  confidenceScore: number
}

interface OwnershipDocumentsProps {
  ownerName: string
  propertyAddress: string
  documents: OwnershipDocument[]
}

const mockDocuments: OwnershipDocument[] = [
  {
    id: "1",
    type: "deed",
    title: "Property Deed",
    description: "Official property ownership deed from San Francisco County Recorder",
    verificationStatus: "verified",
    lastUpdated: "2023-06-15",
    fileSize: "2.4 MB",
    pages: 8,
    thumbnailUrl: "/placeholder.svg?height=200&width=150&query=property+deed+document",
    confidenceScore: 98,
  },
  {
    id: "2",
    type: "llc",
    title: "LLC Registration",
    description: "Johnson Properties LLC - California Secretary of State filing",
    verificationStatus: "verified",
    lastUpdated: "2023-01-10",
    fileSize: "1.2 MB",
    pages: 4,
    thumbnailUrl: "/placeholder.svg?height=200&width=150&query=LLC+registration+document",
    confidenceScore: 95,
  },
  {
    id: "3",
    type: "background",
    title: "Background Check Report",
    description: "Comprehensive background verification by TrustedScreen Inc.",
    verificationStatus: "verified",
    lastUpdated: "2024-01-05",
    fileSize: "3.1 MB",
    pages: 12,
    thumbnailUrl: "/placeholder.svg?height=200&width=150&query=background+check+report",
    confidenceScore: 92,
  },
  {
    id: "4",
    type: "insurance",
    title: "Property Insurance",
    description: "Current property insurance policy - State Farm",
    verificationStatus: "verified",
    lastUpdated: "2024-01-01",
    fileSize: "0.8 MB",
    pages: 6,
    thumbnailUrl: "/placeholder.svg?height=200&width=150&query=insurance+policy+document",
    confidenceScore: 89,
  },
  {
    id: "5",
    type: "tax",
    title: "Property Tax Records",
    description: "2023 Property tax assessment and payment records",
    verificationStatus: "verified",
    lastUpdated: "2023-12-31",
    fileSize: "1.5 MB",
    pages: 3,
    thumbnailUrl: "/placeholder.svg?height=200&width=150&query=tax+assessment+document",
    confidenceScore: 94,
  },
]

export function OwnershipDocuments({ ownerName, propertyAddress, documents = mockDocuments }: OwnershipDocumentsProps) {
  const [selectedDocument, setSelectedDocument] = useState<OwnershipDocument | null>(null)
  const [showViewer, setShowViewer] = useState(false)

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "deed":
        return FileText
      case "llc":
        return Building
      case "background":
        return Shield
      case "insurance":
        return Shield
      case "tax":
        return FileText
      case "mortgage":
        return Building
      default:
        return FileText
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewDocument = (document: OwnershipDocument) => {
    setSelectedDocument(document)
    setShowViewer(true)
  }

  const verifiedCount = documents.filter((doc) => doc.verificationStatus === "verified").length
  const averageConfidence = Math.round(documents.reduce((sum, doc) => sum + doc.confidenceScore, 0) / documents.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Verified className="w-6 h-6 text-blue-600" />
            Ownership Validation Documents
          </CardTitle>
          <CardDescription>
            Legal proof of ownership for {propertyAddress} - Owner: {ownerName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{verifiedCount}</div>
              <div className="text-sm text-blue-700">Verified Documents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{averageConfidence}%</div>
              <div className="text-sm text-green-700">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{documents.length}</div>
              <div className="text-sm text-purple-700">Total Documents</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((document) => {
          const IconComponent = getDocumentIcon(document.type)
          return (
            <Card key={document.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Document Thumbnail */}
                  <div className="relative">
                    <img
                      src={document.thumbnailUrl || "/placeholder.svg"}
                      alt={document.title}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={getStatusColor(document.verificationStatus)}>
                        {document.verificationStatus === "verified" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {document.verificationStatus === "pending" && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {document.verificationStatus.charAt(0).toUpperCase() + document.verificationStatus.slice(1)}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                      {document.pages} pages
                    </div>
                  </div>

                  {/* Document Info */}
                  <div>
                    <div className="flex items-start gap-2 mb-2">
                      <IconComponent className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{document.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{document.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <span className="font-medium text-green-600">{document.confidenceScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span>{document.fileSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Updated:</span>
                        <span>{new Date(document.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => handleViewDocument(document)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Document Viewer Dialog */}
      <Dialog open={showViewer} onOpenChange={setShowViewer}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              {selectedDocument?.title}
            </DialogTitle>
            <DialogDescription>Secure document viewer - {selectedDocument?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Document Preview */}
            <div className="bg-gray-100 rounded-lg p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
              <FileText className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Document Preview</h3>
              <p className="text-gray-600 mb-4">
                This is a secure document viewer. In production, this would display the actual document content.
              </p>
              <div className="bg-white rounded border p-4 max-w-md">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Document Type:</span>
                    <span>{selectedDocument?.type.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Pages:</span>
                    <span>{selectedDocument?.pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">File Size:</span>
                    <span>{selectedDocument?.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Verification:</span>
                    <Badge className={getStatusColor(selectedDocument?.verificationStatus || "")}>
                      {selectedDocument?.verificationStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Verified by TrueEstate Security Team</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  Request Update
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
