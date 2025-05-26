import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { format, properties, userId, reportType } = await request.json()

    if (!properties || properties.length === 0) {
      return NextResponse.json({ error: "No properties selected for export" }, { status: 400 })
    }

    // Generate export data
    const exportData = {
      generatedAt: new Date().toISOString(),
      reportType: reportType || "property_report",
      totalProperties: properties.length,
      properties: properties.map((prop: any) => ({
        address: prop.address,
        owner: prop.owner,
        company: prop.company || "",
        value: prop.value,
        trustScore: prop.trustScore,
        verified: prop.verified,
        propertyType: prop.propertyType,
        yearBuilt: prop.yearBuilt,
        sqft: prop.sqft,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        neighborhood: prop.neighborhood,
        walkScore: prop.walkScore,
        crimeRate: prop.crimeRate,
        appreciation: prop.appreciation,
        marketTrend: prop.marketTrend,
      })),
      summary: {
        totalValue: properties.reduce((sum: number, prop: any) => {
          const value = Number.parseFloat(prop.value.replace(/[$,]/g, ""))
          return sum + (isNaN(value) ? 0 : value)
        }, 0),
        averageTrustScore: Math.round(
          properties.reduce((sum: number, prop: any) => sum + prop.trustScore, 0) / properties.length,
        ),
        verifiedProperties: properties.filter((prop: any) => prop.verified).length,
        propertyTypes: [...new Set(properties.map((prop: any) => prop.propertyType))],
      },
    }

    if (format === "csv") {
      // Generate CSV
      const headers = [
        "Address",
        "Owner",
        "Company",
        "Value",
        "Trust Score",
        "Verified",
        "Property Type",
        "Year Built",
        "Sq Ft",
        "Bedrooms",
        "Bathrooms",
        "Neighborhood",
        "Walk Score",
        "Crime Rate",
        "Appreciation %",
        "Market Trend",
      ]

      const csvRows = [
        headers.join(","),
        ...exportData.properties.map((prop) =>
          [
            `"${prop.address}"`,
            `"${prop.owner}"`,
            `"${prop.company}"`,
            `"${prop.value}"`,
            prop.trustScore,
            prop.verified,
            `"${prop.propertyType}"`,
            prop.yearBuilt,
            prop.sqft,
            prop.bedrooms,
            prop.bathrooms,
            `"${prop.neighborhood}"`,
            prop.walkScore,
            `"${prop.crimeRate}"`,
            prop.appreciation,
            `"${prop.marketTrend}"`,
          ].join(","),
        ),
      ]

      const csvContent = csvRows.join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="trueestate_report_${Date.now()}.csv"`,
        },
      })
    } else {
      // Return JSON for PDF generation on frontend
      return NextResponse.json({
        success: true,
        data: exportData,
        downloadUrl: `/api/export/pdf?data=${encodeURIComponent(JSON.stringify(exportData))}`,
      })
    }
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to generate export" }, { status: 500 })
  }
}
