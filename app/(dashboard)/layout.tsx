import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">
                <span className="text-primary">&gt;</span>
                <span>metrics</span>
              </h1>
              <div className="hidden md:flex space-x-4">
                <a
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="/chat"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Chat
                </a>
                <a
                  href="/settings"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Settings
                </a>
                <a
                  href="/test-adobe"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Test Adobe
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <form action={signout}>
                <Button variant="outline" size="sm">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
