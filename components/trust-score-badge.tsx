"use client"

import { useState } from "react"
import { Shield, CheckCircle, Info, Star, FileText, Phone, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TrustScoreBadgeProps {
  ownerName: string
  trustScore: number
  verificationData: {
    identityVerified: boolean
    ownershipVerified: boolean
    backgroundCheck: boolean
    businessVerified: boolean
    phoneVerified: boolean
    emailVerified: boolean
  }
  reviewData: {
    totalReviews: number
    averageRating: number
    responseRate: number
    responseTime: string
  }
  onViewDocs?: () => void
}

export function TrustScoreBadge({
  ownerName,
  trustScore,
  verificationData,
  reviewData,
  onViewDocs,
}: TrustScoreBadgeProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getTrustLevel = (score: number) => {
    if (score >= 90) return { level: "VERIFIED SAFE", color: "bg-green-500", textColor: "text-green-800" }
    if (score >= 80) return { level: "TRUSTED", color: "bg-blue-500", textColor: "text-blue-800" }
    if (score >= 70) return { level: "CAUTION", color: "bg-yellow-500", textColor: "text-yellow-800" }
    return { level: "HIGH RISK", color: "bg-red-500", textColor: "text-red-800" }
  }

  const trustLevel = getTrustLevel(trustScore)

  const verificationChecks = [
    { key: "identityVerified", label: "Identity Verified", icon: CheckCircle },
    { key: "ownershipVerified", label: "Property Ownership", icon: FileText },
    { key: "backgroundCheck", label: "Background Check", icon: Shield },
    { key: "businessVerified", label: "Business Entity", icon: CheckCircle },
    { key: "phoneVerified", label: "Phone Number", icon: Phone },
    { key: "emailVerified", label: "Email Address", icon: Mail },
  ]

  const verifiedCount = Object.values(verificationData).filter(Boolean).length
  const totalChecks = Object.keys(verificationData).length

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Main Trust Badge */}
        <Card
          className={`border-2 ${trustScore >= 90 ? "border-green-200 bg-green-50" : trustScore >= 80 ? "border-blue-200 bg-blue-50" : trustScore >= 70 ? "border-yellow-200 bg-yellow-50" : "border-red-200 bg-red-50"}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full ${trustLevel.color} flex items-center justify-center`}>
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                    <span className="text-xs font-bold">{trustScore}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{ownerName}</h3>
                  <Badge className={`${trustLevel.color} text-white text-sm px-3 py-1`}>{trustLevel.level}</Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    {verifiedCount}/{totalChecks} verifications completed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">{trustScore}%</div>
                <div className="text-sm text-gray-600">Trust Score</div>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowDetails(!showDetails)}>
                  <Info className="w-4 h-4 mr-2" />
                  {showDetails ? "Hide" : "View"} Details
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{reviewData.averageRating}</span>
                </div>
                <div className="text-xs text-gray-600">{reviewData.totalReviews} reviews</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">{reviewData.responseRate}%</div>
                <div className="text-xs text-gray-600">Response Rate</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{reviewData.responseTime}</div>
                <div className="text-xs text-gray-600">Avg Response</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Breakdown */}
        {showDetails && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Trust Score Breakdown
              </CardTitle>
              <CardDescription>Detailed verification and review metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Verification Checklist */}
              <div>
                <h4 className="font-semibold mb-3">Verification Status</h4>
                <div className="space-y-3">
                  {verificationChecks.map((check) => {
                    const isVerified = verificationData[check.key as keyof typeof verificationData]
                    const IconComponent = check.icon
                    return (
                      <div key={check.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className={`w-5 h-5 ${isVerified ? "text-green-500" : "text-gray-400"}`} />
                          <span className="text-sm">{check.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isVerified ? (
                            <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500 text-xs">
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Trust Score Components */}
              <div>
                <h4 className="font-semibold mb-3">Score Components</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Identity Verification</span>
                    <div className="flex items-center gap-2">
                      <Progress value={verificationData.identityVerified ? 100 : 0} className="w-20" />
                      <span className="text-sm font-medium">{verificationData.identityVerified ? "25" : "0"}/25</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Property Ownership</span>
                    <div className="flex items-center gap-2">
                      <Progress value={verificationData.ownershipVerified ? 100 : 0} className="w-20" />
                      <span className="text-sm font-medium">{verificationData.ownershipVerified ? "25" : "0"}/25</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Background & Business</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={
                          (verificationData.backgroundCheck && verificationData.businessVerified ? 100 : 0) ||
                          (verificationData.backgroundCheck || verificationData.businessVerified ? 50 : 0)
                        }
                        className="w-20"
                      />
                      <span className="text-sm font-medium">
                        {(verificationData.backgroundCheck ? 10 : 0) + (verificationData.businessVerified ? 15 : 0)}
                        /25
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reviews & Response</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(reviewData.averageRating / 5) * 100} className="w-20" />
                      <span className="text-sm font-medium">{Math.round((reviewData.averageRating / 5) * 25)}/25</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={onViewDocs} className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  View Ownership Documents
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">
                      <Info className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Trust scores are calculated using verified data from multiple sources</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}
