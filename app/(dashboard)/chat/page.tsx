import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ChatPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chat</h1>
        <p className="text-muted-foreground mt-2">
          Ask questions about your analytics data in plain English
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chat Interface</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Chat interface coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
