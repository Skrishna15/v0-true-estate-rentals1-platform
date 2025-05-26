import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { ownerName, companyName } = await request.json()

  try {
    // People Data Labs API for owner verification
    const pdlResponse = await fetch("https://api.peopledatalabs.com/v5/person/enrich", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.PEOPLE_DATA_LABS!,
      },
      body: JSON.stringify({
        name: ownerName,
        company: companyName,
      }),
    })

    const pdlData = await pdlResponse.json()

    // Global Company Data API for business verification
    let companyData = null
    if (companyName) {
      const companyResponse = await fetch(
        `https://api.globalcompanydata.com/v1/companies/search?name=${encodeURIComponent(companyName)}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GLOBAL_COMPANY_DATA!}`,
          },
        },
      )
      companyData = await companyResponse.json()
    }

    // Calculate trust score based on verification data
    let trustScore = 50 // Base score

    if (pdlData.status === 200) {
      trustScore += 20 // Person found
      if (pdlData.data?.emails?.length > 0) trustScore += 10
      if (pdlData.data?.phone_numbers?.length > 0) trustScore += 10
      if (pdlData.data?.linkedin_url) trustScore += 10
    }

    if (companyData?.companies?.length > 0) {
      trustScore += 15 // Company verified
    }

    return NextResponse.json({
      person: pdlData,
      company: companyData,
      trustScore: Math.min(trustScore, 100),
      verified: trustScore >= 80,
    })
  } catch (error) {
    console.error("Owner verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
