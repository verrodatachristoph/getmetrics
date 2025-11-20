'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function TestAdobePage() {
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const [reportTesting, setReportTesting] = useState(false)
  const [reportResult, setReportResult] = useState<any>(null)
  const [reportError, setReportError] = useState<string | null>(null)

  async function testConnection() {
    setTesting(true)
    setError(null)
    setTestResult(null)

    try {
      const response = await fetch('/api/adobe/test')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Test failed')
      }

      setTestResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setTesting(false)
    }
  }

  async function runSampleReport() {
    setReportTesting(true)
    setReportError(null)
    setReportResult(null)

    try {
      // Sample report: Top 10 pages by page views for last 7 days
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      const reportRequest = {
        request: {
          rsid: 'YOUR_RSID', // This will be filled from settings
          globalFilters: [
            {
              type: 'dateRange',
              dateRange: `${startDate}/${endDate}`,
            },
          ],
          metricContainer: {
            metrics: [
              {
                columnId: '0',
                id: 'metrics/pageviews',
              },
            ],
          },
          dimension: 'variables/page',
          settings: {
            countRepeatInstances: true,
            limit: 10,
          },
        },
      }

      const response = await fetch('/api/adobe/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportRequest),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Report failed')
      }

      setReportResult(data)
    } catch (err: any) {
      setReportError(err.message)
    } finally {
      setReportTesting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Test Adobe Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Verify your Adobe Analytics connection and test API calls
        </p>
      </div>

      {/* Connection Test */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Test</CardTitle>
          <CardDescription>
            Test your Adobe Analytics credentials and API access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testConnection} disabled={testing}>
            {testing ? 'Testing...' : 'Test Connection'}
          </Button>

          {error && (
            <div className="p-4 rounded-md bg-destructive/10 text-destructive">
              <p className="font-semibold">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {testResult && (
            <div className="p-4 rounded-md bg-green-50 dark:bg-green-900/10 border">
              <p className="font-semibold text-green-600 dark:text-green-400 mb-2">
                ✓ {testResult.connection}
              </p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Company:</span>{' '}
                  {testResult.company?.name} ({testResult.company?.id})
                </div>
                <div>
                  <span className="font-medium">Report Suites:</span> {testResult.reportSuites}
                </div>
                <div>
                  <span className="font-medium">Dimensions:</span> {testResult.dimensions}
                </div>
                <div>
                  <span className="font-medium">Metrics:</span> {testResult.metrics}
                </div>

                {testResult.samples && (
                  <div className="mt-4">
                    <p className="font-medium mb-2">Sample Dimensions:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      {testResult.samples.dimensions.map((d: any) => (
                        <li key={d.id}>
                          <code>{d.id}</code> - {d.title}
                        </li>
                      ))}
                    </ul>

                    <p className="font-medium mt-4 mb-2">Sample Metrics:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      {testResult.samples.metrics.map((m: any) => (
                        <li key={m.id}>
                          <code>{m.id}</code> - {m.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample Report Test */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Report</CardTitle>
          <CardDescription>
            Run a sample report to test the Reporting API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will run a report for the top 10 pages by page views over the last 7 days.
          </p>

          <Button onClick={runSampleReport} disabled={reportTesting}>
            {reportTesting ? 'Running Report...' : 'Run Sample Report'}
          </Button>

          {reportError && (
            <div className="p-4 rounded-md bg-destructive/10 text-destructive">
              <p className="font-semibold">Error:</p>
              <p className="text-sm">{reportError}</p>
            </div>
          )}

          {reportResult && (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-green-50 dark:bg-green-900/10 border">
                <p className="font-semibold text-green-600 dark:text-green-400">
                  ✓ Report completed successfully
                </p>
              </div>

              <div>
                <p className="font-medium mb-2">Results:</p>
                <Textarea
                  value={JSON.stringify(reportResult, null, 2)}
                  readOnly
                  rows={15}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
