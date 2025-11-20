import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check if user has settings configured
  const { data: settings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  const hasAnalyticsPlatform = settings?.analytics_platform
  const hasLLM = settings?.selected_llm

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to getmetrics. Get your analytics insights in plain English.
        </p>
      </div>

      {/* Setup Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Analytics Platform
              {hasAnalyticsPlatform ? (
                <span className="text-sm font-normal text-green-600 dark:text-green-400">
                  ✓ Configured
                </span>
              ) : (
                <span className="text-sm font-normal text-amber-600 dark:text-amber-400">
                  Setup Required
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {hasAnalyticsPlatform
                ? `Connected to ${settings.analytics_platform === 'adobe_analytics' ? 'Adobe Analytics' : 'Google Analytics 4'}`
                : 'Connect your analytics platform to get started'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/settings">
              <Button variant={hasAnalyticsPlatform ? 'outline' : 'default'}>
                {hasAnalyticsPlatform ? 'Update Settings' : 'Configure Platform'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              LLM Provider
              {hasLLM ? (
                <span className="text-sm font-normal text-green-600 dark:text-green-400">
                  ✓ Configured
                </span>
              ) : (
                <span className="text-sm font-normal text-amber-600 dark:text-amber-400">
                  Setup Required
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {hasLLM
                ? `Using ${settings.selected_llm === 'claude' ? 'Anthropic Claude' : settings.selected_llm === 'openai' ? 'OpenAI GPT' : 'Google Gemini'}`
                : 'Choose your AI provider to interpret queries'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/settings">
              <Button variant={hasLLM ? 'outline' : 'default'}>
                {hasLLM ? 'Update Settings' : 'Configure LLM'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start */}
      {hasAnalyticsPlatform && hasLLM ? (
        <Card>
          <CardHeader>
            <CardTitle>Ready to Go!</CardTitle>
            <CardDescription>
              Your setup is complete. Start asking questions about your analytics data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/chat">
              <Button size="lg" className="w-full md:w-auto">
                Start Chat
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>
              Complete your setup to start querying your analytics data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">1. Connect Analytics Platform</h3>
              <p className="text-sm text-muted-foreground">
                Choose Adobe Analytics or Google Analytics 4 and provide your API credentials
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">2. Select LLM Provider</h3>
              <p className="text-sm text-muted-foreground">
                Choose Claude, OpenAI, or Gemini and add your API key
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">3. Start Chatting</h3>
              <p className="text-sm text-muted-foreground">
                Ask questions in plain English and get insights with visualizations
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Features */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Multi-Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Support for Adobe Analytics and Google Analytics 4
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Natural Language</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ask questions in plain English, no SQL needed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Auto Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Smart charts generated based on your data
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
