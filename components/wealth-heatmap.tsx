"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Info, TrendingUp, DollarSign } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Property {
  id: string
  coordinates: [number, number]
  owner: string
  totalValue: string
  trustScore: number
  address: string
  marketValue?: number
  appreciation?: number
  properties?: number
}

interface WealthHeatmapProps {
  properties: Property[]
}

export function WealthHeatmap({ properties }: WealthHeatmapProps) {
  const heatmapContainer = useRef<HTMLDivElement>(null)
  const [selectedZone, setSelectedZone] = useState<Property | null>(null)
  const [heatmapStyle, setHeatmapStyle] = useState<"wealth" | "trust" | "growth">("wealth")

  useEffect(() => {
    if (heatmapContainer.current) {
      const container = heatmapContainer.current
      container.innerHTML = ""

      // Create main heatmap container
      const heatmapDiv = document.createElement("div")
      heatmapDiv.className = "relative w-full h-full min-h-[400px] bg-gray-900 rounded-lg overflow-hidden"

      // Create base gradient background
      heatmapDiv.style.background = `
        radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
        radial-gradient(circle at 75% 25%, rgba(16, 185, 129, 0.4) 0%, transparent 50%),
        radial-gradient(circle at 25% 75%, rgba(245, 158, 11, 0.4) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(239, 68, 68, 0.4) 0%, transparent 50%),
        linear-gradient(135deg, #1f2937 0%, #111827 100%)
      `

      // Create wealth concentration zones
      properties.forEach((property, index) => {
        const value = Number.parseFloat(property.totalValue.replace(/[$M]/g, "")) || 1
        const trustScore = property.trustScore || 50
        const appreciation = property.appreciation || 0

        // Calculate intensity based on selected style
        let intensity, color
        switch (heatmapStyle) {
          case "trust":
            intensity = trustScore / 100
            color = trustScore >= 90 ? "16, 185, 129" : trustScore >= 80 ? "245, 158, 11" : "239, 68, 68"
            break
          case "growth":
            intensity = Math.min(appreciation / 20, 1)
            color = appreciation >= 15 ? "16, 185, 129" : appreciation >= 10 ? "245, 158, 11" : "59, 130, 246"
            break
          default: // wealth
            intensity = Math.min(value / 25, 1)
            color =
              value >= 20 ? "239, 68, 68" : value >= 10 ? "245, 158, 11" : value >= 5 ? "16, 185, 129" : "59, 130, 246"
        }

        // Create wealth zone with better positioning
        const zone = document.createElement("div")
        zone.className =
          "absolute rounded-full opacity-80 animate-pulse cursor-pointer transition-all duration-300 hover:opacity-100 hover:scale-110"

        const baseSize = 40
        const size = baseSize + intensity * 120 // Size between 40-160px
        zone.style.width = `${size}px`
        zone.style.height = `${size}px`

        // Better distribution across the map
        const cols = Math.ceil(Math.sqrt(properties.length))
        const rows = Math.ceil(properties.length / cols)
        const col = index % cols
        const row = Math.floor(index / cols)

        const x = 10 + col * (80 / cols) + (Math.random() - 0.5) * 8
        const y = 10 + row * (80 / rows) + (Math.random() - 0.5) * 8

        zone.style.left = `${x}%`
        zone.style.top = `${y}%`
        zone.style.transform = "translate(-50%, -50%)"

        // Enhanced gradient with better visibility
        zone.style.background = `
          radial-gradient(circle, 
            rgba(${color}, ${0.9 * intensity}) 0%, 
            rgba(${color}, ${0.6 * intensity}) 30%, 
            rgba(${color}, ${0.3 * intensity}) 60%, 
            rgba(${color}, 0.1) 80%, 
            transparent 100%
          )
        `

        // Add inner glow effect
        zone.style.boxShadow = `
          0 0 ${size / 2}px rgba(${color}, ${0.4 * intensity}),
          inset 0 0 ${size / 4}px rgba(255, 255, 255, 0.1)
        `

        // Add value indicator
        const indicator = document.createElement("div")
        indicator.className =
          "absolute inset-0 flex items-center justify-center text-white font-bold text-xs pointer-events-none"
        indicator.style.textShadow = "0 1px 3px rgba(0,0,0,0.8)"

        if (heatmapStyle === "wealth") {
          indicator.textContent = property.totalValue
        } else if (heatmapStyle === "trust") {
          indicator.textContent = `${trustScore}%`
        } else {
          indicator.textContent = `+${appreciation?.toFixed(1)}%`
        }

        zone.appendChild(indicator)

        // Enhanced click handler
        zone.addEventListener("click", () => {
          setSelectedZone(property)

          // Remove existing popups
          container.querySelectorAll(".wealth-popup").forEach((p) => p.remove())

          // Create detailed popup
          const popup = document.createElement("div")
          popup.className =
            "wealth-popup absolute bg-black/90 text-white p-4 rounded-xl z-20 min-w-64 backdrop-blur-sm border border-white/20"
          popup.style.left = `${Math.min(x, 60)}%`
          popup.style.top = `${Math.max(y - 15, 5)}%`
          popup.innerHTML = `
            <div class="space-y-3">
              <div class="flex items-start justify-between">
                <h3 class="font-bold text-yellow-400 text-lg">${property.owner}</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        class="text-white/60 hover:text-white text-xl leading-none">&times;</button>
              </div>
              <p class="text-gray-300 text-sm">${property.address}</p>
              
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-white/10 rounded-lg p-2">
                  <div class="text-green-400 font-semibold">Portfolio Value</div>
                  <div class="text-white font-bold">${property.totalValue}</div>
                </div>
                <div class="bg-white/10 rounded-lg p-2">
                  <div class="text-blue-400 font-semibold">Trust Score</div>
                  <div class="text-white font-bold">${property.trustScore}%</div>
                </div>
                <div class="bg-white/10 rounded-lg p-2">
                  <div class="text-purple-400 font-semibold">Properties</div>
                  <div class="text-white font-bold">${property.properties || 1}</div>
                </div>
                <div class="bg-white/10 rounded-lg p-2">
                  <div class="text-orange-400 font-semibold">Growth</div>
                  <div class="text-white font-bold">+${(property.appreciation || 0).toFixed(1)}%</div>
                </div>
              </div>
              
              <button onclick="window.location.href='/property/${property.id}'" 
                      class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                View Full Portfolio
              </button>
            </div>
          `

          heatmapDiv.appendChild(popup)
          setTimeout(() => popup.remove(), 8000)
        })

        heatmapDiv.appendChild(zone)
      })

      // Enhanced legend with better visibility
      const legend = document.createElement("div")
      legend.className =
        "absolute bottom-4 left-4 bg-black/80 text-white p-4 rounded-xl text-sm backdrop-blur-sm border border-white/20"

      const legendContent = {
        wealth: `
          <div class="font-bold mb-3 text-yellow-400 flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
            </svg>
            Wealth Concentration
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded-full bg-red-500 shadow-lg"></div>
              <span>Ultra High ($20M+)</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded-full bg-yellow-500 shadow-lg"></div>
              <span>High ($10M - $20M)</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded-full bg-green-500 shadow-lg"></div>
              <span>Medium ($5M - $10M)</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded-full bg-blue-500 shadow-lg"></div>
              <span>Standard ($1M - $5M)</span>
            </div>
          </div>
        `,
        trust: `
          <div class="font-bold mb-3 text-yellow-400 flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Trust Score Distribution
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded-full bg-green-500 shadow-lg"></div>
              <span>90%+ (Highly Trusted)</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded-full bg-yellow-500 shadow-lg"></div>
              <span>80-89% (Trusted)</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded-full bg-red-500 shadow-lg"></div>
              <span>Below 80% (Caution)</span>
            </div>
          </div>
        `,
        growth: `
          <div class="font-bold mb-3 text-yellow-400 flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/>
            </svg>
            Market Appreciation
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded-full bg-green-500 shadow-lg"></div>
              <span>15%+ Growth</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded-full bg-yellow-500 shadow-lg"></div>
              <span>10-15% Growth</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded-full bg-blue-500 shadow-lg"></div>
              <span>5-10% Growth</span>
            </div>
          </div>
        `,
      }

      legend.innerHTML =
        legendContent[heatmapStyle] +
        `
        <div class="mt-3 pt-2 border-t border-gray-600 text-gray-400 text-xs">
          Click zones for detailed analysis
        </div>
      `
      heatmapDiv.appendChild(legend)

      // Enhanced controls
      const controls = document.createElement("div")
      controls.className =
        "absolute top-4 right-4 bg-black/80 text-white p-3 rounded-xl text-sm backdrop-blur-sm border border-white/20"
      controls.innerHTML = `
        <div class="font-bold text-yellow-400 mb-2">Live Wealth Intelligence</div>
        <div class="text-xs text-gray-300 space-y-1">
          <div>Total Tracked: $${properties.reduce((sum, p) => sum + Number.parseFloat(p.totalValue.replace(/[$M]/g, "")), 0).toFixed(1)}M</div>
          <div>Properties: ${properties.length}</div>
          <div>Avg Trust: ${Math.round(properties.reduce((sum, p) => sum + p.trustScore, 0) / properties.length)}%</div>
        </div>
      `
      heatmapDiv.appendChild(controls)

      container.appendChild(heatmapDiv)
    }
  }, [properties, heatmapStyle])

  return (
    <div className="relative w-full h-full">
      {/* Heatmap Style Controls */}
      <div className="absolute top-4 left-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white/95 backdrop-blur-sm shadow-lg">
              <TrendingUp className="w-4 h-4 mr-2" />
              {heatmapStyle === "wealth" ? "Wealth View" : heatmapStyle === "trust" ? "Trust View" : "Growth View"}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setHeatmapStyle("wealth")}>
              <DollarSign className="w-4 h-4 mr-2" />
              Wealth Concentration
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setHeatmapStyle("trust")}>
              <Info className="w-4 h-4 mr-2" />
              Trust Score Distribution
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setHeatmapStyle("growth")}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Market Appreciation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div ref={heatmapContainer} className="w-full h-full min-h-[400px] rounded-lg" />
    </div>
  )
}
