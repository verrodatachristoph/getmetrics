import { z } from 'zod'

// Adobe Analytics validation schema
export const adobeAnalyticsSchema = z.object({
  analytics_platform: z.literal('adobe_analytics'),
  adobe_client_id: z.string().min(1, 'Client ID is required'),
  adobe_client_secret: z.string().min(1, 'Client Secret is required'),
  adobe_org_id: z.string().min(1, 'Organization ID is required').regex(
    /@AdobeOrg$/,
    'Organization ID must end with @AdobeOrg'
  ),
  adobe_company_id: z.string().min(1, 'Company ID is required'),
  adobe_report_suite_id: z.string().min(1, 'Report Suite ID is required'),
})

// Google Analytics 4 validation schema
export const ga4Schema = z.object({
  analytics_platform: z.literal('google_analytics_4'),
  ga4_property_id: z.string().min(1, 'Property ID is required').regex(
    /^\d+$/,
    'Property ID must be numeric'
  ),
  ga4_credentials: z.string().min(1, 'Service Account JSON is required').refine(
    (val) => {
      try {
        const parsed = JSON.parse(val)
        return (
          parsed.type === 'service_account' &&
          parsed.project_id &&
          parsed.private_key &&
          parsed.client_email
        )
      } catch {
        return false
      }
    },
    {
      message: 'Invalid Service Account JSON format',
    }
  ),
})

// LLM Provider validation schema
export const llmProviderSchema = z.object({
  selected_llm: z.enum(['claude', 'openai', 'gemini'], {
    message: 'Please select an LLM provider',
  }),
  llm_api_key: z.string().min(1, 'API Key is required'),
})

// Combined settings schema (analytics OR llm)
export const settingsSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('analytics'),
    data: z.discriminatedUnion('analytics_platform', [
      adobeAnalyticsSchema,
      ga4Schema,
    ]),
  }),
  z.object({
    type: z.literal('llm'),
    data: llmProviderSchema,
  }),
])

// Type exports
export type AdobeAnalyticsSettings = z.infer<typeof adobeAnalyticsSchema>
export type GA4Settings = z.infer<typeof ga4Schema>
export type LLMSettings = z.infer<typeof llmProviderSchema>
export type SettingsPayload = z.infer<typeof settingsSchema>
