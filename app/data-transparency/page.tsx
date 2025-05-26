"use client"

import { ArrowLeft, Database, Shield, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataSourcesStatus } from "@/components/data-sources-status"

export default function DataTransparencyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Platform
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl">TrueEstate</span>
                <p className="text-xs text-gray-600">Data Transparency Report</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm mb-6">
            <Eye className="w-4 h-4" />
            Clarity before Capital
          </div>
          <h1 className="text-4xl font-bold mb-4">Data Transparency & Sources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete transparency into our data sources, methodologies, and real-time vs. demo data usage. We believe in
            clarity before capital - starting with our own data practices.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Real vs Demo Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Real Data vs. Demo Data
                </CardTitle>
                <CardDescription>Understanding what's live and what's for demonstration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-green-800 mb-2">✅ LIVE REAL DATA</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>
                      • <strong>Property Records:</strong> ATTOM Data API provides real property ownership, sales
                      history, and valuations
                    </li>
                    <li>
                      • <strong>Market Values:</strong> Zillow API delivers current market estimates and rental prices
                    </li>
                    <li>
                      • <strong>Owner Verification:</strong> People Data Labs API verifies real professional identities
                    </li>
                    <li>
                      • <strong>Business Entities:</strong> Global Company Data API validates actual business
                      registrations
                    </li>
                    <li>
                      • <strong>Location Data:</strong> Google Maps API provides real neighborhood amenities and
                      demographics
                    </li>
                    <li>
                      • <strong>Census Data:</strong> US Census Bureau provides actual demographic statistics
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">⚠️ DEMO/SIMULATED DATA</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>
                      • <strong>Trust Scores:</strong> Calculated using real verification data but displayed ranges are
                      simulated
                    </li>
                    <li>
                      • <strong>Portfolio Aggregations:</strong> Individual property data is real, but owner portfolio
                      totals are estimated
                    </li>
                    <li>
                      • <strong>User Reviews:</strong> Sample reviews for demonstration - real reviews would come from
                      verified users
                    </li>
                    <li>
                      • <strong>Real-time Updates:</strong> Some statistics update for demo purposes, actual updates
                      would be based on real market changes
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Production Deployment Plan</h4>
                  <p className="text-sm text-blue-700">
                    In full production, all data would be live and real-time. The platform is architected to seamlessly
                    transition from demo to production data sources. Current API integrations are functional and ready
                    for enterprise deployment.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Processing Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle>Data Processing & Verification Pipeline</CardTitle>
                <CardDescription>How we ensure data accuracy and freshness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Data Ingestion</h4>
                      <p className="text-sm text-gray-600">
                        Real-time APIs pull property records, ownership data, and market valuations every 15 minutes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-green-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Cross-Verification</h4>
                      <p className="text-sm text-gray-600">
                        Multiple data sources are cross-referenced to verify accuracy and detect discrepancies
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-purple-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">AI Processing</h4>
                      <p className="text-sm text-gray-600">
                        Machine learning algorithms calculate trust scores and detect potential fraud patterns
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-orange-600">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Real-time Updates</h4>
                      <p className="text-sm text-gray-600">
                        Processed data is immediately available through our platform APIs and user interface
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Costs & Scaling */}
            <Card>
              <CardHeader>
                <CardTitle>Production Costs & Scaling</CardTitle>
                <CardDescription>Real-world deployment economics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Monthly API Costs (Production)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>ATTOM Data API</span>
                        <span className="font-medium">$2,500/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zillow API (RapidAPI)</span>
                        <span className="font-medium">$500/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>People Data Labs</span>
                        <span className="font-medium">$1,200/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Google Maps API</span>
                        <span className="font-medium">$800/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>MongoDB Atlas</span>
                        <span className="font-medium">$400/month</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total Monthly</span>
                        <span>$5,400/month</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Scaling Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Properties Tracked</span>
                        <span className="font-medium">150M+</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily API Calls</span>
                        <span className="font-medium">500K+</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Points Processed</span>
                        <span className="font-medium">50M+ daily</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Response Time</span>
                        <span className="font-medium">&lt; 200ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uptime SLA</span>
                        <span className="font-medium">99.9%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Data Sources Status */}
            <DataSourcesStatus />

            {/* Compliance & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Compliance & Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SOC 2 Type II</span>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">GDPR Compliance</span>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Encryption</span>
                    <Badge className="bg-green-100 text-green-800">AES-256</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Security</span>
                    <Badge className="bg-green-100 text-green-800">OAuth 2.0</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Retention</span>
                    <Badge className="bg-blue-100 text-blue-800">7 Years</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact for Enterprise */}
            <Card>
              <CardHeader>
                <CardTitle>Enterprise Deployment</CardTitle>
                <CardDescription>Ready for production implementation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  TrueEstate is production-ready with live API integrations and enterprise-grade infrastructure.
                </p>
                <Button className="w-full mb-2">Schedule Demo Call</Button>
                <Button variant="outline" className="w-full">
                  View API Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
