// Server-side environment configuration
export const serverConfig = {
  mapbox: {
    accessToken: process.env.MAPBOX_ACCESS_TOKEN,
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL,
  },
  apis: {
    rapidApi: process.env.RAPIDAPI_KEY,
    attom: process.env.ATTOM_API_KEY,
    rentcast: process.env.RENTCAST_API,
    census: process.env.CENSUS_API_KEY,
    dataGov: process.env.DATA_GOV_API_KEY,
    hunterIo: process.env.HUNTER_IO_API_KEY,
    zillow: process.env.ZILLOW_API_KEY,
    googleMaps: process.env.GOOGLE_MAPS_API_KEY,
    peopleDataLabs: process.env.PEOPLE_DATA_LABS,
    globalCompanyData: process.env.GLOBAL_COMPANY_DATA,
  },
  azure: {
    tenantId: process.env.AZURE_AD_TENANT_ID,
    clientId: process.env.AZURE_AD_CLIENT_ID,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
  },
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  redis: {
    url: process.env.REDIS_URL,
    kvUrl: process.env.KV_URL,
    kvToken: process.env.KV_REST_API_TOKEN,
    kvReadOnlyToken: process.env.KV_REST_API_READ_ONLY_TOKEN,
    kvRestUrl: process.env.KV_REST_API_URL,
  },
}

// Client-side public configuration (safe to expose)
export const publicConfig = {
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
  // Note: Mapbox token is fetched securely via API route, not exposed here
}

// Validation function to ensure required environment variables are set
export function validateServerConfig() {
  const required = ["MAPBOX_ACCESS_TOKEN", "MONGODB_URI", "NEXTAUTH_SECRET"]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}
