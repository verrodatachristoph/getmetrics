import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdobeClient } from '@/lib/adobe/client'

/**
 * Test Adobe Analytics connection
 * GET /api/adobe/test
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if Adobe Analytics is configured
    const { data: settings } = await supabase
      .from('user_settings')
      .select('analytics_platform')
      .eq('user_id', user.id)
      .single()

    if (!settings || settings.analytics_platform !== 'adobe_analytics') {
      return NextResponse.json(
        { error: 'Adobe Analytics not configured' },
        { status: 400 }
      )
    }

    // Create Adobe client and test connection
    const client = await createAdobeClient(user.id)

    // Test 1: Get company info
    const company = await client.getCompany()

    // Test 2: Get report suites
    const reportSuites = await client.getReportSuites()

    // Test 3: Get a few dimensions
    const dimensions = await client.getDimensions()
    const sampleDimensions = dimensions.slice(0, 5)

    // Test 4: Get a few metrics
    const metrics = await client.getMetrics()
    const sampleMetrics = metrics.slice(0, 5)

    return NextResponse.json({
      success: true,
      connection: 'Adobe Analytics connected successfully',
      company: {
        id: company.globalCompanyId,
        name: company.companyName,
      },
      reportSuites: reportSuites.length,
      dimensions: dimensions.length,
      metrics: metrics.length,
      samples: {
        dimensions: sampleDimensions.map(d => ({ id: d.id, title: d.title })),
        metrics: sampleMetrics.map(m => ({ id: m.id, title: m.title })),
      },
    })
  } catch (error: any) {
    console.error('Adobe test error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to connect to Adobe Analytics' },
      { status: 500 }
    )
  }
}
