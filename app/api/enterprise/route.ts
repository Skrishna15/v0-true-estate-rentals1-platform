import { NextResponse } from "next/server"

export async function GET() {
  // Enterprise solutions endpoint
  const enterpriseInfo = {
    solutions: [
      {
        name: "Enterprise API",
        description: "Full access to property and owner verification APIs",
        features: ["Real-time data", "Bulk verification", "Custom integrations"],
      },
      {
        name: "White Label Platform",
        description: "Branded version of TrueEstate for your organization",
        features: ["Custom branding", "Dedicated support", "Advanced analytics"],
      },
      {
        name: "Data Intelligence Suite",
        description: "Advanced market analytics and predictive modeling",
        features: ["Market forecasting", "Risk assessment", "Portfolio optimization"],
      },
    ],
    pricing: {
      api: "Starting at $500/month",
      whiteLabel: "Starting at $2,500/month",
      enterprise: "Custom pricing",
    },
  }

  return NextResponse.json(enterpriseInfo)
}
