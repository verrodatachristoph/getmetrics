import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdobeClient } from '@/lib/adobe/client'
import type { AdobeReportRequest } from '@/types/adobe-analytics'

/**
 * Run Adobe Analytics report
 * POST /api/adobe/report
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const reportRequest: AdobeReportRequest = body.request

    if (!reportRequest) {
      return NextResponse.json(
        { error: 'Report request is required' },
        { status: 400 }
      )
    }

    // Create Adobe client
    const client = await createAdobeClient(user.id)

    // Run the report
    const response = await client.runReport(reportRequest)

    // Track usage
    await supabase.from('api_usage').insert({
      user_id: user.id,
      analytics_platform: 'adobe_analytics',
      llm_provider: 'none',
      llm_tokens_used: 0,
      analytics_api_calls: 1,
    })

    return NextResponse.json({
      success: true,
      data: response,
    })
  } catch (error: any) {
    console.error('Adobe report error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to run Adobe Analytics report' },
      { status: 500 }
    )
  }
}
