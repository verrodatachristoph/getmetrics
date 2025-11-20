import { AdobeAuthConfig, AdobeAccessToken } from '@/types/adobe-analytics'

const ADOBE_IMS_URL = 'https://ims-na1.adobelogin.com'
const ADOBE_API_URL = 'https://analytics.adobe.io/api'

/**
 * Get Adobe Analytics access token using OAuth Server-to-Server
 */
export async function getAdobeAccessToken(
  config: Pick<AdobeAuthConfig, 'client_id' | 'client_secret' | 'org_id'>
): Promise<AdobeAccessToken> {
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: config.client_id,
    client_secret: config.client_secret,
    scope: 'openid,AdobeID,read_organizations,additional_info.projectedProductContext,additional_info.roles'
  })

  const response = await fetch(`${ADOBE_IMS_URL}/ims/token/v3`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Adobe Auth failed: ${error.error_description || error.error || 'Unknown error'}`)
  }

  return response.json()
}

/**
 * Check if access token is expired or will expire soon (within 5 minutes)
 */
export function isTokenExpired(expiresAt: number | null): boolean {
  if (!expiresAt) return true
  const now = Date.now()
  const fiveMinutes = 5 * 60 * 1000
  return expiresAt - now < fiveMinutes
}

/**
 * Calculate token expiration timestamp
 */
export function calculateTokenExpiration(expiresIn: number): number {
  return Date.now() + (expiresIn * 1000)
}

/**
 * Build Adobe API request headers
 */
export function buildAdobeHeaders(
  accessToken: string,
  orgId: string,
  companyId: string
): HeadersInit {
  return {
    'Authorization': `Bearer ${accessToken}`,
    'x-api-key': accessToken,
    'x-gw-ims-org-id': orgId,
    'x-proxy-global-company-id': companyId,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

/**
 * Make authenticated request to Adobe Analytics API
 */
export async function makeAdobeRequest<T>(
  endpoint: string,
  config: AdobeAuthConfig,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${ADOBE_API_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      ...buildAdobeHeaders(accessToken, config.org_id, config.company_id),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(`Adobe API error: ${error.message || response.statusText}`)
  }

  return response.json()
}
