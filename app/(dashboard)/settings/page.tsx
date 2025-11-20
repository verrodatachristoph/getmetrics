'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  adobeAnalyticsSchema,
  ga4Schema,
  llmProviderSchema,
  type AdobeAnalyticsSettings,
  type GA4Settings,
  type LLMSettings,
} from '@/lib/validations/settings'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [settings, setSettings] = useState<any>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<'adobe_analytics' | 'google_analytics_4'>('adobe_analytics')

  // Fetch existing settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings')
        const data = await response.json()
        if (data.settings) {
          setSettings(data.settings)
          if (data.settings.analytics_platform) {
            setSelectedPlatform(data.settings.analytics_platform)
          }
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err)
      }
    }
    fetchSettings()
  }, [])

  // Adobe Analytics Form
  const adobeForm = useForm<AdobeAnalyticsSettings>({
    resolver: zodResolver(adobeAnalyticsSchema),
    defaultValues: {
      analytics_platform: 'adobe_analytics',
      adobe_client_id: settings?.adobe_client_id || '',
      adobe_client_secret: '',
      adobe_org_id: settings?.adobe_org_id || '',
      adobe_company_id: settings?.adobe_company_id || '',
      adobe_report_suite_id: settings?.adobe_report_suite_id || '',
    },
  })

  // Update form when settings load
  useEffect(() => {
    if (settings && settings.analytics_platform === 'adobe_analytics') {
      adobeForm.reset({
        analytics_platform: 'adobe_analytics',
        adobe_client_id: settings.adobe_client_id || '',
        adobe_client_secret: '',
        adobe_org_id: settings.adobe_org_id || '',
        adobe_company_id: settings.adobe_company_id || '',
        adobe_report_suite_id: settings.adobe_report_suite_id || '',
      })
    }
  }, [settings])

  // GA4 Form
  const ga4Form = useForm<GA4Settings>({
    resolver: zodResolver(ga4Schema),
    defaultValues: {
      analytics_platform: 'google_analytics_4',
      ga4_property_id: settings?.ga4_property_id || '',
      ga4_credentials: '',
    },
  })

  useEffect(() => {
    if (settings && settings.analytics_platform === 'google_analytics_4') {
      ga4Form.reset({
        analytics_platform: 'google_analytics_4',
        ga4_property_id: settings.ga4_property_id || '',
        ga4_credentials: '',
      })
    }
  }, [settings])

  // LLM Form
  const llmForm = useForm<LLMSettings>({
    resolver: zodResolver(llmProviderSchema),
    defaultValues: {
      selected_llm: settings?.selected_llm || 'claude',
      llm_api_key: '',
    },
  })

  useEffect(() => {
    if (settings) {
      llmForm.reset({
        selected_llm: settings.selected_llm || 'claude',
        llm_api_key: '',
      })
    }
  }, [settings])

  async function handleAdobeSubmit(data: AdobeAnalyticsSettings) {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'analytics',
          data,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save settings')
      }

      setSuccess('Adobe Analytics settings saved successfully!')
      // Refresh settings
      const settingsResponse = await fetch('/api/settings')
      const settingsData = await settingsResponse.json()
      setSettings(settingsData.settings)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGA4Submit(data: GA4Settings) {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'analytics',
          data,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save settings')
      }

      setSuccess('Google Analytics 4 settings saved successfully!')
      // Refresh settings
      const settingsResponse = await fetch('/api/settings')
      const settingsData = await settingsResponse.json()
      setSettings(settingsData.settings)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleLLMSubmit(data: LLMSettings) {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'llm',
          data,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save settings')
      }

      setSuccess('LLM settings saved successfully!')
      // Refresh settings
      const settingsResponse = await fetch('/api/settings')
      const settingsData = await settingsResponse.json()
      setSettings(settingsData.settings)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your analytics platform and LLM preferences
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-md bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400">
          {success}
        </div>
      )}

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics">Analytics Platform</TabsTrigger>
          <TabsTrigger value="llm">LLM Provider</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Platform</CardTitle>
              <CardDescription>
                Choose and configure your analytics data source
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Platform Selection */}
              <div className="space-y-4">
                <Label>Select Platform</Label>
                <RadioGroup
                  value={selectedPlatform}
                  onValueChange={(value: any) => setSelectedPlatform(value)}
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-md hover:bg-accent transition-colors">
                    <RadioGroupItem value="adobe_analytics" id="adobe" />
                    <Label htmlFor="adobe" className="flex-1 cursor-pointer">
                      <div className="font-medium">Adobe Analytics</div>
                      <div className="text-sm text-muted-foreground">
                        Connect using Analytics 2.0 API
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-md hover:bg-accent transition-colors">
                    <RadioGroupItem value="google_analytics_4" id="ga4" />
                    <Label htmlFor="ga4" className="flex-1 cursor-pointer">
                      <div className="font-medium">Google Analytics 4</div>
                      <div className="text-sm text-muted-foreground">
                        Connect using GA4 Data API
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Adobe Analytics Form */}
              {selectedPlatform === 'adobe_analytics' && (
                <form onSubmit={adobeForm.handleSubmit(handleAdobeSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adobe_client_id">Client ID</Label>
                    <Input
                      id="adobe_client_id"
                      {...adobeForm.register('adobe_client_id')}
                      placeholder="abc123xyz456..."
                      disabled={loading}
                    />
                    {adobeForm.formState.errors.adobe_client_id && (
                      <p className="text-sm text-destructive">
                        {adobeForm.formState.errors.adobe_client_id.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adobe_client_secret">
                      Client Secret
                      {settings?.has_adobe_client_secret && (
                        <span className="text-xs text-green-600 dark:text-green-400 ml-2">
                          (Already set)
                        </span>
                      )}
                    </Label>
                    <Input
                      id="adobe_client_secret"
                      type="password"
                      {...adobeForm.register('adobe_client_secret')}
                      placeholder={settings?.has_adobe_client_secret ? '••••••••' : 'Enter client secret'}
                      disabled={loading}
                    />
                    {adobeForm.formState.errors.adobe_client_secret && (
                      <p className="text-sm text-destructive">
                        {adobeForm.formState.errors.adobe_client_secret.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adobe_org_id">Organization ID</Label>
                    <Input
                      id="adobe_org_id"
                      {...adobeForm.register('adobe_org_id')}
                      placeholder="12345678@AdobeOrg"
                      disabled={loading}
                    />
                    {adobeForm.formState.errors.adobe_org_id && (
                      <p className="text-sm text-destructive">
                        {adobeForm.formState.errors.adobe_org_id.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adobe_company_id">Company ID</Label>
                    <Input
                      id="adobe_company_id"
                      {...adobeForm.register('adobe_company_id')}
                      placeholder="companyname"
                      disabled={loading}
                    />
                    {adobeForm.formState.errors.adobe_company_id && (
                      <p className="text-sm text-destructive">
                        {adobeForm.formState.errors.adobe_company_id.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adobe_report_suite_id">Report Suite ID</Label>
                    <Input
                      id="adobe_report_suite_id"
                      {...adobeForm.register('adobe_report_suite_id')}
                      placeholder="prod.company.com"
                      disabled={loading}
                    />
                    {adobeForm.formState.errors.adobe_report_suite_id && (
                      <p className="text-sm text-destructive">
                        {adobeForm.formState.errors.adobe_report_suite_id.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Adobe Analytics Settings'}
                  </Button>
                </form>
              )}

              {/* GA4 Form */}
              {selectedPlatform === 'google_analytics_4' && (
                <form onSubmit={ga4Form.handleSubmit(handleGA4Submit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ga4_property_id">Property ID</Label>
                    <Input
                      id="ga4_property_id"
                      {...ga4Form.register('ga4_property_id')}
                      placeholder="123456789"
                      disabled={loading}
                    />
                    {ga4Form.formState.errors.ga4_property_id && (
                      <p className="text-sm text-destructive">
                        {ga4Form.formState.errors.ga4_property_id.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ga4_credentials">
                      Service Account JSON
                      {settings?.has_ga4_credentials && (
                        <span className="text-xs text-green-600 dark:text-green-400 ml-2">
                          (Already set)
                        </span>
                      )}
                    </Label>
                    <Textarea
                      id="ga4_credentials"
                      {...ga4Form.register('ga4_credentials')}
                      placeholder='{"type": "service_account", "project_id": "...", ...}'
                      rows={8}
                      disabled={loading}
                      className="font-mono text-xs"
                    />
                    <p className="text-xs text-muted-foreground">
                      Paste the complete JSON from your Google Cloud service account
                    </p>
                    {ga4Form.formState.errors.ga4_credentials && (
                      <p className="text-sm text-destructive">
                        {ga4Form.formState.errors.ga4_credentials.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Google Analytics 4 Settings'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="llm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>LLM Provider</CardTitle>
              <CardDescription>
                Select your preferred AI model for query interpretation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={llmForm.handleSubmit(handleLLMSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <Label>Select Provider</Label>
                  <RadioGroup
                    value={llmForm.watch('selected_llm')}
                    onValueChange={(value: any) => llmForm.setValue('selected_llm', value)}
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-md hover:bg-accent transition-colors">
                      <RadioGroupItem value="claude" id="claude" />
                      <Label htmlFor="claude" className="flex-1 cursor-pointer">
                        <div className="font-medium">Anthropic Claude</div>
                        <div className="text-sm text-muted-foreground">
                          Claude Sonnet 4 - Best for complex analytics queries
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-md hover:bg-accent transition-colors">
                      <RadioGroupItem value="openai" id="openai" />
                      <Label htmlFor="openai" className="flex-1 cursor-pointer">
                        <div className="font-medium">OpenAI</div>
                        <div className="text-sm text-muted-foreground">
                          GPT-4o - Fast and reliable
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-md hover:bg-accent transition-colors">
                      <RadioGroupItem value="gemini" id="gemini" />
                      <Label htmlFor="gemini" className="flex-1 cursor-pointer">
                        <div className="font-medium">Google Gemini</div>
                        <div className="text-sm text-muted-foreground">
                          Gemini 1.5 Pro - Generous free tier
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                  {llmForm.formState.errors.selected_llm && (
                    <p className="text-sm text-destructive">
                      {llmForm.formState.errors.selected_llm.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="llm_api_key">
                    API Key
                    {settings?.has_llm_api_key && (
                      <span className="text-xs text-green-600 dark:text-green-400 ml-2">
                        (Already set)
                      </span>
                    )}
                  </Label>
                  <Input
                    id="llm_api_key"
                    type="password"
                    {...llmForm.register('llm_api_key')}
                    placeholder={settings?.has_llm_api_key ? '••••••••' : 'Enter API key'}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your API key is encrypted and stored securely
                  </p>
                  {llmForm.formState.errors.llm_api_key && (
                    <p className="text-sm text-destructive">
                      {llmForm.formState.errors.llm_api_key.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save LLM Settings'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
