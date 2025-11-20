export type AnalyticsPlatform = 'adobe_analytics' | 'google_analytics_4'
export type LLMProvider = 'claude' | 'openai' | 'gemini'

export interface UserSettings {
  id: string
  user_id: string
  created_at: string
  updated_at: string

  // Analytics Platform
  analytics_platform: AnalyticsPlatform | null

  // Adobe Analytics
  adobe_client_id: string | null
  adobe_client_secret_encrypted: string | null
  adobe_org_id: string | null
  adobe_company_id: string | null
  adobe_report_suite_id: string | null
  adobe_access_token: string | null
  adobe_token_expires_at: number | null

  // Google Analytics 4
  ga4_property_id: string | null
  ga4_credentials_encrypted: Record<string, any> | null

  // LLM Settings
  selected_llm: LLMProvider | null
  llm_api_key_encrypted: string | null
}

export interface ChatMessage {
  id: string
  user_id: string
  created_at: string
  analytics_platform: AnalyticsPlatform
  user_message: string
  assistant_response: string
  chart_config: ChartConfig | null
  api_query: Record<string, any> | null
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'table'
  title: string
  data: any[]
  options?: Record<string, any>
}

export interface ApiUsage {
  id: string
  user_id: string
  created_at: string
  analytics_platform: AnalyticsPlatform
  llm_provider: LLMProvider
  llm_tokens_used: number
  analytics_api_calls: number
}

// Adobe Analytics Types
export interface AdobeAnalyticsQuery {
  rsid: string
  globalFilters: Array<{
    type: 'dateRange'
    dateRange: string
  }>
  metricContainer: {
    metrics: Array<{
      columnId: string
      id: string
    }>
  }
  dimension: string
  settings: {
    countRepeatInstances: boolean
    limit: number
    page?: number
  }
}

// Google Analytics 4 Types
export interface GA4Query {
  property: string
  dateRanges: Array<{
    startDate: string
    endDate: string
  }>
  dimensions: Array<{
    name: string
  }>
  metrics: Array<{
    name: string
  }>
  limit?: number
  orderBys?: Array<{
    metric?: { metricName: string }
    dimension?: { dimensionName: string }
    desc?: boolean
  }>
}
