"use client"

import { useState, useEffect } from "react"
import { Calculator, BarChart3, DollarSign, Percent } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InvestmentAnalysisProps {
  property: any
  onAnalysisComplete?: (analysis: any) => void
}

export function InvestmentAnalysis({ property, onAnalysisComplete }: InvestmentAnalysisProps) {
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [inputs, setInputs] = useState({
    purchasePrice: property?.marketValue || 500000,
    downPayment: 20,
    interestRate: 7.5,
    loanTerm: 30,
    monthlyRent: property?.rentEstimate || 2500,
    vacancy: 5,
    maintenance: 1,
    insurance: 0.5,
    taxes: 1.2,
    management: 8,
  })

  useEffect(() => {
    if (property) {
      calculateAnalysis()
    }
  }, [property, inputs])

  const calculateAnalysis = () => {
    setLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      const purchasePrice = inputs.purchasePrice
      const downPaymentAmount = (purchasePrice * inputs.downPayment) / 100
      const loanAmount = purchasePrice - downPaymentAmount

      // Monthly mortgage payment calculation
      const monthlyRate = inputs.interestRate / 100 / 12
      const numPayments = inputs.loanTerm * 12
      const monthlyMortgage =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)

      // Monthly expenses
      const monthlyRent = inputs.monthlyRent
      const effectiveRent = monthlyRent * (1 - inputs.vacancy / 100)
      const monthlyMaintenance = (purchasePrice * inputs.maintenance) / 100 / 12
      const monthlyInsurance = (purchasePrice * inputs.insurance) / 100 / 12
      const monthlyTaxes = (purchasePrice * inputs.taxes) / 100 / 12
      const monthlyManagement = effectiveRent * (inputs.management / 100)

      const totalMonthlyExpenses =
        monthlyMortgage + monthlyMaintenance + monthlyInsurance + monthlyTaxes + monthlyManagement
      const monthlyCashFlow = effectiveRent - totalMonthlyExpenses
      const annualCashFlow = monthlyCashFlow * 12

      // ROI calculations
      const cashOnCash = (annualCashFlow / downPaymentAmount) * 100
      const capRate =
        ((effectiveRent * 12 - (monthlyMaintenance + monthlyInsurance + monthlyTaxes + monthlyManagement) * 12) /
          purchasePrice) *
        100
      const totalROI =
        ((annualCashFlow + ((property?.appreciation || 5) * purchasePrice) / 100) / downPaymentAmount) * 100

      // Break-even analysis
      const breakEvenRent = totalMonthlyExpenses / (1 - inputs.vacancy / 100)

      const analysisResult = {
        investment: {
          purchasePrice,
          downPaymentAmount,
          loanAmount,
          monthlyMortgage,
        },
        cashFlow: {
          monthlyRent: effectiveRent,
          monthlyExpenses: totalMonthlyExpenses,
          monthlyCashFlow,
          annualCashFlow,
        },
        returns: {
          cashOnCash,
          capRate,
          totalROI,
        },
        breakEven: {
          breakEvenRent,
          rentGap: monthlyRent - breakEvenRent,
        },
        risk: {
          score: calculateRiskScore(),
          factors: getRiskFactors(),
        },
      }

      setAnalysis(analysisResult)
      onAnalysisComplete?.(analysisResult)
      setLoading(false)
    }, 1000)
  }

  const calculateRiskScore = () => {
    let score = 50 // Base score

    // Trust score impact
    score += (property?.trustScore - 75) * 0.5

    // Market trend impact
    if (property?.marketTrend === "up") score += 10
    if (property?.marketTrend === "down") score -= 15

    // Crime rate impact
    if (property?.crimeRate === "Low") score += 10
    if (property?.crimeRate === "High") score -= 15

    // Walk score impact
    if (property?.walkScore > 80) score += 5
    if (property?.walkScore < 50) score -= 5

    return Math.max(0, Math.min(100, score))
  }

  const getRiskFactors = () => {
    const factors = []

    if (property?.trustScore < 80) factors.push("Low owner trust score")
    if (property?.marketTrend === "down") factors.push("Declining market trend")
    if (property?.crimeRate === "High") factors.push("High crime area")
    if (property?.walkScore < 50) factors.push("Low walkability")
    if (inputs.vacancy > 10) factors.push("High vacancy assumption")
    if (analysis?.returns?.cashOnCash < 5) factors.push("Low cash-on-cash return")

    return factors
  }

  const getROIColor = (value: number) => {
    if (value >= 15) return "text-green-600"
    if (value >= 8) return "text-yellow-600"
    return "text-red-600"
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-green-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Investment Analysis
          </CardTitle>
          <CardDescription>Comprehensive financial analysis for {property?.address}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Input Parameters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input
                id="purchasePrice"
                type="number"
                value={inputs.purchasePrice}
                onChange={(e) => setInputs({ ...inputs, purchasePrice: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="downPayment">Down Payment (%)</Label>
              <Input
                id="downPayment"
                type="number"
                value={inputs.downPayment}
                onChange={(e) => setInputs({ ...inputs, downPayment: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={inputs.interestRate}
                onChange={(e) => setInputs({ ...inputs, interestRate: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="monthlyRent">Monthly Rent</Label>
              <Input
                id="monthlyRent"
                type="number"
                value={inputs.monthlyRent}
                onChange={(e) => setInputs({ ...inputs, monthlyRent: Number(e.target.value) })}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Monthly Cash Flow</span>
                    </div>
                    <div
                      className={`text-2xl font-bold ${analysis.cashFlow.monthlyCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      ${analysis.cashFlow.monthlyCashFlow.toFixed(0)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Percent className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Cash-on-Cash ROI</span>
                    </div>
                    <div className={`text-2xl font-bold ${getROIColor(analysis.returns.cashOnCash)}`}>
                      {analysis.returns.cashOnCash.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Cap Rate</span>
                    </div>
                    <div className={`text-2xl font-bold ${getROIColor(analysis.returns.capRate)}`}>
                      {analysis.returns.capRate.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Investment Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Purchase Price:</span>
                        <span className="font-semibold">${analysis.investment.purchasePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Down Payment:</span>
                        <span className="font-semibold">${analysis.investment.downPaymentAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Loan Amount:</span>
                        <span className="font-semibold">${analysis.investment.loanAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Mortgage:</span>
                        <span className="font-semibold">${analysis.investment.monthlyMortgage.toFixed(0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span>Risk Score:</span>
                        <Badge className={`${getRiskColor(analysis.risk.score)} bg-transparent border`}>
                          {analysis.risk.score.toFixed(0)}/100
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            analysis.risk.score >= 70
                              ? "bg-green-500"
                              : analysis.risk.score >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${analysis.risk.score}%` }}
                        />
                      </div>
                    </div>

                    {analysis.risk.factors.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Risk Factors:</h4>
                        <ul className="text-sm space-y-1">
                          {analysis.risk.factors.map((factor: string, index: number) => (
                            <li key={index} className="text-red-600">
                              • {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Break-even Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Break-even Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Break-even Rent:</span>
                      <div className="text-xl font-bold">${analysis.breakEven.breakEvenRent.toFixed(0)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Current Rent Gap:</span>
                      <div
                        className={`text-xl font-bold ${analysis.breakEven.rentGap >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        ${analysis.breakEven.rentGap.toFixed(0)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
