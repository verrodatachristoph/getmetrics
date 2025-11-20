import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import {
  getAdobeAccessToken,
  isTokenExpired,
  calculateTokenExpiration,
  makeAdobeRequest
} from './auth'
import type {
  AdobeAuthConfig,
  AdobeCompany,
  AdobeReportSuite,
  AdobeDimension,
  AdobeMetric,
  AdobeReportRequest,
  AdobeReportResponse
} from '@/types/adobe-analytics'

/**
 * Get Adobe Analytics configuration for the current user
 */
export async function getAdobeConfig(userId: string): Promise<AdobeAuthConfig | null> {
  const supabase = await createClient()

  const { data: settings, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .eq('analytics_platform', 'adobe_analytics')
    .single()

  if (error || !settings) {
    return null
  }

  // Decrypt the client secret
  const clientSecret = decrypt(settings.adobe_client_secret_encrypted)

  return {
    client_id: settings.adobe_client_id,
    client_secret: clientSecret,
    org_id: settings.adobe_org_id,
    company_id: settings.adobe_company_id,
    report_suite_id: settings.adobe_report_suite_id,
  }
}

/**
 * Get valid access token (refresh if needed)
 */
export async function getValidAccessToken(userId: string): Promise<string> {
  const supabase = await createClient()

  // Get current settings
  const { data: settings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!settings) {
    throw new Error('Adobe Analytics not configured')
  }

  // Check if token is valid
  if (settings.adobe_access_token && !isTokenExpired(settings.adobe_token_expires_at)) {
    return settings.adobe_access_token
  }

  // Token expired or missing, get new one
  const config = await getAdobeConfig(userId)
  if (!config) {
    throw new Error('Adobe Analytics configuration not found')
  }

  const tokenResponse = await getAdobeAccessToken({
    client_id: config.client_id,
    client_secret: config.client_secret,
    org_id: config.org_id,
  })

  // Save new token
  const expiresAt = calculateTokenExpiration(tokenResponse.expires_in)

  await supabase
    .from('user_settings')
    .update({
      adobe_access_token: tokenResponse.access_token,
      adobe_token_expires_at: expiresAt,
    })
    .eq('user_id', userId)

  return tokenResponse.access_token
}

/**
 * Adobe Analytics Client Class
 */
export class AdobeAnalyticsClient {
  private userId: string
  private config: AdobeAuthConfig | null = null
  private accessToken: string | null = null

  constructor(userId: string) {
    this.userId = userId
  }

  /**
   * Initialize the client (load config and token)
   */
  async initialize(): Promise<void> {
    this.config = await getAdobeConfig(this.userId)
    if (!this.config) {
      throw new Error('Adobe Analytics not configured')
    }
    this.accessToken = await getValidAccessToken(this.userId)
  }

  /**
   * Get company information
   */
  async getCompany(): Promise<AdobeCompany> {
    if (!this.config || !this.accessToken) {
      await this.initialize()
    }

    const response = await makeAdobeRequest<{ imsOrgs: Array<{ companies: AdobeCompany[] }> }>(
      '/discovery/me',
      this.config!,
      this.accessToken!
    )

    const company = response.imsOrgs[0]?.companies?.find(
      c => c.globalCompanyId === this.config!.company_id
    )

    if (!company) {
      throw new Error('Company not found')
    }

    return company
  }

  /**
   * Get report suites
   */
  async getReportSuites(): Promise<AdobeReportSuite[]> {
    if (!this.config || !this.accessToken) {
      await this.initialize()
    }

    const response = await makeAdobeRequest<{ content: AdobeReportSuite[] }>(
      `/${this.config!.company_id}/reportsuites`,
      this.config!,
      this.accessToken!
    )

    return response.content
  }

  /**
   * Get dimensions for a report suite
   */
  async getDimensions(rsid?: string): Promise<AdobeDimension[]> {
    if (!this.config || !this.accessToken) {
      await this.initialize()
    }

    const reportSuiteId = rsid || this.config!.report_suite_id
    const response = await makeAdobeRequest<AdobeDimension[]>(
      `/${this.config!.company_id}/dimensions?rsid=${reportSuiteId}`,
      this.config!,
      this.accessToken!
    )

    return response
  }

  /**
   * Get metrics for a report suite
   */
  async getMetrics(rsid?: string): Promise<AdobeMetric[]> {
    if (!this.config || !this.accessToken) {
      await this.initialize()
    }

    const reportSuiteId = rsid || this.config!.report_suite_id
    const response = await makeAdobeRequest<AdobeMetric[]>(
      `/${this.config!.company_id}/metrics?rsid=${reportSuiteId}`,
      this.config!,
      this.accessToken!
    )

    return response
  }

  /**
   * Run a report
   */
  async runReport(request: AdobeReportRequest): Promise<AdobeReportResponse> {
    if (!this.config || !this.accessToken) {
      await this.initialize()
    }

    const response = await makeAdobeRequest<AdobeReportResponse>(
      `/${this.config!.company_id}/reports`,
      this.config!,
      this.accessToken!,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    )

    return response
  }
}

/**
 * Create an Adobe Analytics client for a user
 */
export async function createAdobeClient(userId: string): Promise<AdobeAnalyticsClient> {
  const client = new AdobeAnalyticsClient(userId)
  await client.initialize()
  return client
}
