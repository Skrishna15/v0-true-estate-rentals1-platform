"use client"

import { useState } from "react"
import {
  Building,
  PieChart,
  BarChart3,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface WealthBreakdown {
  category: string
  value: number
  percentage: number
  confidence: number
  trend: "up" | "down" | "stable"
}

interface PropertyHolding {
  id: string
  address: string
  city: string
  state: string
  value: number
  acquisitionDate: string
  acquisitionPrice: number
  propertyType: string
  equity: number
}

interface OwnerProfile {
  id: string
  name: string
  type: "individual" | "entity"
  netWorth: number
  confidence: number
  lastUpdated: string
  trustScore: number
  verificationStatus: "verified" | "pending" | "unverified"
  backgroundCheck: boolean
  wealthBreakdown: WealthBreakdown[]
  properties: PropertyHolding[]
  businessInterests: {
    name: string
    industry: string
    role: string
    estimatedValue: number
  }[]
  riskFactors: {
    type: "low" | "medium" | "high"
    description: string
  }[]
  dataSources: string[]
  comparisonMetrics: {
    percentile: number
    averageForRegion: number
    averageForIndustry?: number
  }
}

const mockOwnerProfile: OwnerProfile = {
  id: "1",
  name: "Sarah Johnson",
  type: "individual",
  netWorth: 15000000,
  confidence: 85,
  lastUpdated: "2024-01-15",
  trustScore: 92,
  verificationStatus: "verified",
  backgroundCheck: true,
  wealthBreakdown: [
    {
      category: "Real Estate",
      value: 8500000,
      percentage: 56.7,
      confidence: 92,
      trend: "up",
    },
    {
      category: "Investment Portfolio",
      value: 4200000,
      percentage: 28.0,
      confidence: 78,
      trend: "up",
    },
    {
      category: "Business Interests",
      value: 1800000,
      percentage: 12.0,
      confidence: 65,
      trend: "stable",
    },
    {
      category: "Cash & Equivalents",
      value: 500000,
      percentage: 3.3,
      confidence: 95,
      trend: "stable",
    },
  ],
  properties: [
    {
      id: "1",
      address: "123 Market Street",
      city: "San Francisco",
      state: "CA",
      value: 2500000,
      acquisitionDate: "2023-06-15",
      acquisitionPrice: 2300000,
      propertyType: "Condo",
      equity: 2500000,
    },
    {
      id: "2",
      address: "456 Oak Avenue",
      city: "Palo Alto",
      state: "CA",
      value: 3200000,
      acquisitionDate: "2021-03-20",
      acquisitionPrice: 2800000,
      propertyType: "House",
      equity: 2400000,
    },
    {
      id: "3",
      address: "789 Pine Street",
      city: "Berkeley",
      state: "CA",
      value: 1800000,
      acquisitionDate: "2020-11-10",
      acquisitionPrice: 1600000,
      propertyType: "Duplex",
      equity: 1800000,
    },
  ],
  businessInterests: [
    {
      name: "TechStart Ventures",
      industry: "Technology",
      role: "Co-Founder",
      estimatedValue: 1200000,
    },
    {
      name: "Bay Area Consulting LLC",
      industry: "Consulting",
      role: "Managing Partner",
      estimatedValue: 600000,
    },
  ],
  riskFactors: [
    {
      type: "low",
      description: "Diversified portfolio across multiple asset classes",
    },
    {
      type: "medium",
      description: "Heavy concentration in Bay Area real estate market",
    },
    {
      type: "low",
      description: "Strong credit history and financial track record",
    },
  ],
  dataSources: [
    "Public Records",
    "Property Assessments",
    "Business Filings",
    "Credit Reports",
    "Investment Disclosures",
  ],
  comparisonMetrics: {
    percentile: 95,
    averageForRegion: 2800000,
    averageForIndustry: 4200000,
  },
}

interface OwnerWealthAnalysisProps {
  ownerId: string
}

export function OwnerWealthAnalysis({ ownerId }: OwnerWealthAnalysisProps) {
  const [owner] = useState<OwnerProfile>(mockOwnerProfile)
  const [selectedComparison, setSelectedComparison] = useState<"region" | "industry">("region")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="w-4 h-4 text-green-500" />
      case "down":
        return <ArrowDownRight className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600"
    if (confidence >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const totalPropertyValue = owner.properties.reduce((sum, prop) => sum + prop.value, 0)
  const totalEquity = owner.properties.reduce((sum, prop) => sum + prop.equity, 0)
  const totalAppreciation = owner.properties.reduce((sum, prop) => sum + (prop.value - prop.acquisitionPrice), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl">{owner.name}</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <Badge className={owner.type === "individual" ? "bg-blue-500" : "bg-purple-500"}>
                  {owner.type === "individual" ? "Individual" : "Entity"}
                </Badge>
                <Badge
                  className={
                    owner.verificationStatus === "verified"
                      ? "bg-green-500"
                      : owner.verificationStatus === "pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }
                >
                  {owner.verificationStatus.charAt(0).toUpperCase() + owner.verificationStatus.slice(1)}
                </Badge>
                {owner.backgroundCheck && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Background Verified
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{formatCurrency(owner.netWorth)}</div>
              <div className="text-sm text-gray-600">Estimated Net Worth</div>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="font-medium">{owner.trustScore}% Trust Score</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-lg font-semibold">{owner.confidence}%</div>
              <div className="text-sm text-gray-600">Data Confidence</div>
              <Progress value={owner.confidence} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{owner.comparisonMetrics.percentile}th</div>
              <div className="text-sm text-gray-600">Wealth Percentile</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{formatDate(owner.lastUpdated)}</div>
              <div className="text-sm text-gray-600">Last Updated</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wealth Analysis Tabs */}
      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="breakdown">Wealth Breakdown</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-6">
          {/* Wealth Composition */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Wealth Composition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {owner.wealthBreakdown.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{category.category}</span>
                        {getTrendIcon(category.trend)}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(category.value)}</div>
                        <div className="text-sm text-gray-600">{category.percentage}%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={category.percentage} className="flex-1" />
                      <span className={`text-sm font-medium ${getConfidenceColor(category.confidence)}`}>
                        {category.confidence}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Business Interests */}
          {owner.businessInterests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Business Interests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {owner.businessInterests.map((business, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{business.name}</h4>
                          <p className="text-sm text-gray-600">{business.industry}</p>
                          <Badge variant="outline" className="mt-1">
                            {business.role}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(business.estimatedValue)}</div>
                          <div className="text-sm text-gray-600">Estimated Value</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          {/* Property Portfolio Summary */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPropertyValue)}</div>
                <div className="text-sm text-gray-600">Total Property Value</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalEquity)}</div>
                <div className="text-sm text-gray-600">Total Equity</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalAppreciation)}</div>
                <div className="text-sm text-gray-600">Total Appreciation</div>
              </CardContent>
            </Card>
          </div>

          {/* Property Holdings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Property Holdings ({owner.properties.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {owner.properties.map((property, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold">{property.address}</h4>
                        <p className="text-sm text-gray-600">
                          {property.city}, {property.state}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {property.propertyType}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{formatCurrency(property.value)}</div>
                        <div className="text-sm text-gray-600">Current Value</div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Acquired</span>
                        <div className="font-medium">{formatDate(property.acquisitionDate)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Purchase Price</span>
                        <div className="font-medium">{formatCurrency(property.acquisitionPrice)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Current Equity</span>
                        <div className="font-medium text-blue-600">{formatCurrency(property.equity)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Appreciation</span>
                        <div className="font-medium text-green-600">
                          +{formatCurrency(property.value - property.acquisitionPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          {/* Comparison Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Wealth Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                <Button
                  variant={selectedComparison === "region" ? "default" : "outline"}
                  onClick={() => setSelectedComparison("region")}
                >
                  Regional Average
                </Button>
                <Button
                  variant={selectedComparison === "industry" ? "default" : "outline"}
                  onClick={() => setSelectedComparison("industry")}
                >
                  Industry Average
                </Button>
              </div>

              <div className="space-y-6">
                {/* Comparison Chart */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{owner.name}</span>
                    <span className="font-semibold text-green-600">{formatCurrency(owner.netWorth)}</span>
                  </div>
                  <Progress value={100} className="h-3" />

                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {selectedComparison === "region" ? "Bay Area Average" : "Technology Industry Average"}
                    </span>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(
                        selectedComparison === "region"
                          ? owner.comparisonMetrics.averageForRegion
                          : owner.comparisonMetrics.averageForIndustry || 0,
                      )}
                    </span>
                  </div>
                  <Progress
                    value={
                      selectedComparison === "region"
                        ? (owner.comparisonMetrics.averageForRegion / owner.netWorth) * 100
                        : ((owner.comparisonMetrics.averageForIndustry || 0) / owner.netWorth) * 100
                    }
                    className="h-3"
                  />
                </div>

                <Separator />

                {/* Percentile Information */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{owner.comparisonMetrics.percentile}th</div>
                  <div className="text-sm text-gray-600 mb-2">Wealth Percentile</div>
                  <p className="text-sm text-gray-700">
                    {owner.name} has higher net worth than {owner.comparisonMetrics.percentile}% of individuals in the
                    {selectedComparison === "region" ? " Bay Area region" : " technology industry"}.
                  </p>
                </div>

                {/* Multiplier */}
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold">
                    {(
                      owner.netWorth /
                      (selectedComparison === "region"
                        ? owner.comparisonMetrics.averageForRegion
                        : owner.comparisonMetrics.averageForIndustry || 1)
                    ).toFixed(1)}
                    x
                  </div>
                  <div className="text-sm text-gray-600">
                    Above {selectedComparison === "region" ? "regional" : "industry"} average
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {owner.riskFactors.map((risk, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    {risk.type === "low" ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : risk.type === "medium" ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <Badge
                        className={
                          risk.type === "low"
                            ? "bg-green-100 text-green-800"
                            : risk.type === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {risk.type.toUpperCase()} RISK
                      </Badge>
                      <p className="mt-1 text-sm">{risk.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Sources & Confidence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Data Sources & Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Overall Confidence Level</span>
                  <div className="flex items-center gap-2">
                    <Progress value={owner.confidence} className="w-24" />
                    <span className={`font-semibold ${getConfidenceColor(owner.confidence)}`}>{owner.confidence}%</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Data Sources</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {owner.dataSources.map((source, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{source}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Methodology Note</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        Net worth estimates are calculated using proprietary algorithms that analyze public records,
                        property assessments, business filings, and other verified data sources. Confidence levels
                        reflect the availability and reliability of source data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
