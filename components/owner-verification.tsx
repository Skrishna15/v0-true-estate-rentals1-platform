"use client"

import { useState } from "react"
import { Shield, CheckCircle, XCircle, User, Building, Phone, Mail, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface OwnerVerificationProps {
  ownerName: string
  companyName?: string
}

export function OwnerVerification({ ownerName, companyName }: OwnerVerificationProps) {
  const [verificationData, setVerificationData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleVerification = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/owner-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerName,
          companyName,
        }),
      })

      const data = await response.json()
      setVerificationData(data)
      setVerified(data.verified)
    } catch (error) {
      console.error("Verification error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!verificationData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Owner Verification
          </CardTitle>
          <CardDescription>Verify owner identity and background using professional databases</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleVerification} disabled={loading} className="w-full">
            {loading ? "Verifying..." : "Run Verification Check"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const person = verificationData.person?.data
  const company = verificationData.company?.companies?.[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Verification Results
          <Badge className={verified ? "bg-green-500" : "bg-red-500"}>{verified ? "Verified" : "Unverified"}</Badge>
        </CardTitle>
        <CardDescription>Trust Score: {verificationData.trustScore}%</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Information */}
        {person && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Information
            </h4>
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={person.photo_url || "/placeholder.svg"} />
                <AvatarFallback>
                  {person.full_name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("") || "UN"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h5 className="font-medium">{person.full_name || ownerName}</h5>
                {person.job_title && <p className="text-sm text-gray-600">{person.job_title}</p>}
                {person.job_company_name && <p className="text-sm text-gray-600">at {person.job_company_name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className={person.emails?.length > 0 ? "text-green-600" : "text-gray-400"}>
                  {person.emails?.length > 0 ? "Email Verified" : "No Email"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className={person.phone_numbers?.length > 0 ? "text-green-600" : "text-gray-400"}>
                  {person.phone_numbers?.length > 0 ? "Phone Verified" : "No Phone"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-gray-400" />
                <span className={person.linkedin_url ? "text-green-600" : "text-gray-400"}>
                  {person.linkedin_url ? "LinkedIn Found" : "No LinkedIn"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-400" />
                <span className={person.job_company_name ? "text-green-600" : "text-gray-400"}>
                  {person.job_company_name ? "Employment Verified" : "No Employment"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Company Information */}
        {company && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Building className="w-4 h-4" />
              Company Information
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium">{company.name}</h5>
              {company.description && <p className="text-sm text-gray-600 mt-1">{company.description}</p>}
              <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                <div>
                  <span className="text-gray-500">Industry:</span>
                  <div>{company.industry || "N/A"}</div>
                </div>
                <div>
                  <span className="text-gray-500">Founded:</span>
                  <div>{company.founded_year || "N/A"}</div>
                </div>
                <div>
                  <span className="text-gray-500">Size:</span>
                  <div>{company.employee_count || "N/A"} employees</div>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <div>{company.location || "N/A"}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verification Checklist */}
        <div>
          <h4 className="font-semibold mb-3">Verification Checklist</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {person ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Identity Found in Database</span>
            </div>
            <div className="flex items-center gap-2">
              {person?.emails?.length > 0 ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Email Address Verified</span>
            </div>
            <div className="flex items-center gap-2">
              {person?.phone_numbers?.length > 0 ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Phone Number Verified</span>
            </div>
            <div className="flex items-center gap-2">
              {person?.linkedin_url ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Professional Profile Found</span>
            </div>
            <div className="flex items-center gap-2">
              {company ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Business Entity Verified</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
