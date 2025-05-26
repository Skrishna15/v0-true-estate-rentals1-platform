export async function GET() {
  // Enhanced demo API endpoint for market analytics
  const demoData = {
    marketOverview: {
      totalMarketValue: "$2.4T",
      averageRent: 3250,
      priceAppreciation: 12.5,
      inventoryLevels: "Low",
      demandIndex: 85,
      lastUpdated: new Date().toISOString(),
    },
    topMarkets: [
      {
        city: "San Francisco",
        avgPrice: 4500,
        growth: 15.2,
        trustScore: 92,
        totalProperties: 12847,
        verifiedOwners: 11963,
      },
      {
        city: "New York",
        avgPrice: 4200,
        growth: 8.7,
        trustScore: 89,
        totalProperties: 23156,
        verifiedOwners: 20640,
      },
      {
        city: "Los Angeles",
        avgPrice: 3800,
        growth: 12.1,
        trustScore: 87,
        totalProperties: 18934,
        verifiedOwners: 16456,
      },
      {
        city: "Seattle",
        avgPrice: 3200,
        growth: 18.3,
        trustScore: 94,
        totalProperties: 8765,
        verifiedOwners: 8241,
      },
      {
        city: "Miami",
        avgPrice: 2900,
        growth: 22.1,
        trustScore: 85,
        totalProperties: 7432,
        verifiedOwners: 6318,
      },
    ],
    riskMetrics: {
      scamRate: 0.02,
      verificationRate: 98.5,
      trustScoreDistribution: {
        high: 65,
        medium: 30,
        low: 5,
      },
      fraudPrevention: {
        scamsBlocked: 1247,
        suspiciousListings: 89,
        verificationsPending: 156,
      },
    },
    realTimeStats: {
      activeUsers: 12847,
      propertiesTracked: 150234,
      verificationsToday: 1247,
      apiCallsLast24h: 487000,
      dataSourcesOnline: 8,
      systemUptime: "99.97%",
    },
    trends: {
      rentalDemand: "+23%",
      newListings: "+15%",
      priceVolatility: "Low",
      marketSentiment: "Bullish",
      investorActivity: "High",
    },
  }

  // Return as HTML page instead of JSON for better user experience
  const htmlResponse = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TrueEstate Market Analytics - Live Demo</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; }
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
      </style>
    </head>
    <body class="bg-gray-50">
      <div class="gradient-bg text-white py-8">
        <div class="container mx-auto px-4">
          <div class="text-center">
            <h1 class="text-4xl font-bold mb-2">TrueEstate Market Analytics</h1>
            <p class="text-xl opacity-90">Real-time market intelligence and property insights</p>
            <div class="mt-4 text-sm opacity-75">
              Last Updated: ${new Date().toLocaleString()} | Live Data Feed Active
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-8">
        <!-- Market Overview -->
        <div class="grid md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg p-6 shadow-lg card-hover">
            <div class="text-3xl font-bold text-green-600">${demoData.marketOverview.totalMarketValue}</div>
            <div class="text-gray-600">Total Market Value</div>
          </div>
          <div class="bg-white rounded-lg p-6 shadow-lg card-hover">
            <div class="text-3xl font-bold text-blue-600">$${demoData.marketOverview.averageRent}</div>
            <div class="text-gray-600">Average Rent</div>
          </div>
          <div class="bg-white rounded-lg p-6 shadow-lg card-hover">
            <div class="text-3xl font-bold text-purple-600">${demoData.marketOverview.priceAppreciation}%</div>
            <div class="text-gray-600">Price Appreciation</div>
          </div>
          <div class="bg-white rounded-lg p-6 shadow-lg card-hover">
            <div class="text-3xl font-bold text-orange-600">${demoData.marketOverview.demandIndex}</div>
            <div class="text-gray-600">Demand Index</div>
          </div>
        </div>

        <!-- Top Markets -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 class="text-2xl font-bold mb-6">Top Performing Markets</h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3">City</th>
                  <th class="text-left py-3">Avg Price</th>
                  <th class="text-left py-3">Growth</th>
                  <th class="text-left py-3">Trust Score</th>
                  <th class="text-left py-3">Properties</th>
                  <th class="text-left py-3">Verified Owners</th>
                </tr>
              </thead>
              <tbody>
                ${demoData.topMarkets
                  .map(
                    (market) => `
                  <tr class="border-b hover:bg-gray-50">
                    <td class="py-3 font-semibold">${market.city}</td>
                    <td class="py-3">$${market.avgPrice}</td>
                    <td class="py-3 text-green-600">+${market.growth}%</td>
                    <td class="py-3">
                      <span class="px-2 py-1 rounded-full text-xs ${market.trustScore >= 90 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}">
                        ${market.trustScore}%
                      </span>
                    </td>
                    <td class="py-3">${market.totalProperties.toLocaleString()}</td>
                    <td class="py-3">${market.verifiedOwners.toLocaleString()}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Risk Metrics & Real-time Stats -->
        <div class="grid md:grid-cols-2 gap-8 mb-8">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold mb-4">Risk & Security Metrics</h3>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span>Scam Rate</span>
                <span class="text-green-600 font-semibold">${demoData.riskMetrics.scamRate}%</span>
              </div>
              <div class="flex justify-between">
                <span>Verification Rate</span>
                <span class="text-green-600 font-semibold">${demoData.riskMetrics.verificationRate}%</span>
              </div>
              <div class="flex justify-between">
                <span>Scams Blocked</span>
                <span class="text-red-600 font-semibold">${demoData.riskMetrics.fraudPrevention.scamsBlocked}</span>
              </div>
              <div class="flex justify-between">
                <span>Pending Verifications</span>
                <span class="text-yellow-600 font-semibold">${demoData.riskMetrics.fraudPrevention.verificationsPending}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold mb-4">Real-time Platform Stats</h3>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span>Active Users</span>
                <span class="font-semibold">${demoData.realTimeStats.activeUsers.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span>Properties Tracked</span>
                <span class="font-semibold">${demoData.realTimeStats.propertiesTracked.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span>API Calls (24h)</span>
                <span class="font-semibold">${demoData.realTimeStats.apiCallsLast24h.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span>System Uptime</span>
                <span class="text-green-600 font-semibold">${demoData.realTimeStats.systemUptime}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Market Trends -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4">Market Trends</h3>
          <div class="grid md:grid-cols-5 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">${demoData.trends.rentalDemand}</div>
              <div class="text-sm text-gray-600">Rental Demand</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">${demoData.trends.newListings}</div>
              <div class="text-sm text-gray-600">New Listings</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600">${demoData.trends.priceVolatility}</div>
              <div class="text-sm text-gray-600">Price Volatility</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-orange-600">${demoData.trends.marketSentiment}</div>
              <div class="text-sm text-gray-600">Market Sentiment</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-red-600">${demoData.trends.investorActivity}</div>
              <div class="text-sm text-gray-600">Investor Activity</div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8 py-6 border-t">
          <p class="text-gray-600 mb-4">This is a live demonstration of TrueEstate's market analytics capabilities.</p>
          <div class="space-x-4">
            <button onclick="window.close()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Close Window
            </button>
            <button onclick="window.location.href='/'" class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
              Back to Platform
            </button>
          </div>
        </div>
      </div>

      <script>
        // Auto-refresh data every 30 seconds
        setInterval(() => {
          const elements = document.querySelectorAll('[data-live]');
          elements.forEach(el => {
            if (el.textContent.includes('%')) {
              const currentValue = parseFloat(el.textContent);
              const newValue = currentValue + (Math.random() - 0.5) * 0.2;
              el.textContent = newValue.toFixed(1) + '%';
            }
          });
        }, 30000);

        // Add live indicator
        const liveIndicator = document.createElement('div');
        liveIndicator.className = 'fixed top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm z-50';
        liveIndicator.innerHTML = '🟢 LIVE DATA';
        document.body.appendChild(liveIndicator);
      </script>
    </body>
    </html>
  `

  return new Response(htmlResponse, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}
