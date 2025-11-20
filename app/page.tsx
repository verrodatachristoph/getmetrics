export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-primary-50 to-white dark:from-primary-900 dark:to-background">
      <main className="max-w-4xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight">
            <span className="text-primary-700 dark:text-primary-400">&gt;</span>
            <span className="text-foreground">metrics</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Analytics in plain English
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Talk to your data. Get insights. Visualize naturally.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Coming soon...
          </p>
        </div>

        <div className="flex gap-4 justify-center pt-8">
          <div className="px-6 py-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
              Adobe Analytics
            </p>
          </div>
          <div className="px-6 py-3 bg-secondary-100 dark:bg-secondary-900 rounded-lg">
            <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Google Analytics 4
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
