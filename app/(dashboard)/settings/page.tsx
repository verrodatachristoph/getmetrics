import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your analytics platform and LLM preferences
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Analytics Platform</CardTitle>
            <CardDescription>
              Choose and configure your analytics data source
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Analytics platform configuration coming soon...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>LLM Provider</CardTitle>
            <CardDescription>
              Select your preferred AI model for query interpretation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              LLM configuration coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
