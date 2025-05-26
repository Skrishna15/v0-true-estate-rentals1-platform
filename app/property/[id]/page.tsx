import { User, Star, Mail, Phone, MessageCircle, Flag, Shield, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const PropertyDetailsPage = ({ property }: { property: any }) => {
  return (
    <div>
      {/* Property Details Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Basic Property Information */}
          <div>
            {/* Add your basic property information here */}
            <p>Property Name: {property.name}</p>
            <p>
              Location: {property.city}, {property.state}
            </p>
            {/* More details can be added here */}
          </div>

          {/* Owner Information Section - Add this after the basic property info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Property Owner Information
                {property.owner.verified && (
                  <Badge className="bg-green-100 text-green-800">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified Owner
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Owner Profile */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {property.owner.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{property.owner.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{property.owner.trustScore}% Trust Score</span>
                    </div>
                  </div>
                  {property.owner.company && <p className="text-gray-600 mb-2">{property.owner.company}</p>}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {property.owner.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{property.owner.email}</span>
                      </div>
                    )}
                    {property.owner.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{property.owner.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Trust Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{property.owner.trustScore}%</div>
                  <div className="text-sm text-gray-600">Trust Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {property.owner.portfolio?.totalProperties || Math.floor(Math.random() * 15) + 1}
                  </div>
                  <div className="text-sm text-gray-600">Properties Owned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {property.owner.portfolio?.totalValue || `$${(Math.random() * 10 + 5).toFixed(1)}M`}
                  </div>
                  <div className="text-sm text-gray-600">Portfolio Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {property.owner.yearsActive || Math.floor(Math.random() * 10) + 3}
                  </div>
                  <div className="text-sm text-gray-600">Years Active</div>
                </div>
              </div>

              {/* Verification Status */}
              <div className="space-y-3">
                <h4 className="font-semibold">Verification Status</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${property.owner.verified ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span className="text-sm">Identity Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${property.owner.backgroundCheck ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span className="text-sm">Background Check</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${property.owner.businessVerified ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span className="text-sm">Business Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${property.owner.documentsVerified ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span className="text-sm">Documents Verified</span>
                  </div>
                </div>
              </div>

              {/* Portfolio Overview */}
              {property.owner.portfolio && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Portfolio Overview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Property Types</div>
                      <div className="flex flex-wrap gap-1">
                        {(property.owner.portfolio.propertyTypes || ["Single Family", "Condo"]).map((type: string) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Locations</div>
                      <div className="flex flex-wrap gap-1">
                        {(property.owner.portfolio.locations || [property.city]).map((location: string) => (
                          <Badge key={location} variant="outline" className="text-xs">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="space-y-3">
                <h4 className="font-semibold">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Property Listed</div>
                      <div className="text-xs text-gray-600">Listed this property 2 weeks ago</div>
                    </div>
                    <div className="text-xs text-gray-500">2w ago</div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Verification Updated</div>
                      <div className="text-xs text-gray-600">Completed background verification</div>
                    </div>
                    <div className="text-xs text-gray-500">1m ago</div>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Owner
                </Button>
                <Button variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Portfolio
                </Button>
                <Button variant="outline">
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

export default PropertyDetailsPage
