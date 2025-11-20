import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdobeClient } from '@/lib/adobe/client'

/**
 * Get Adobe Analytics schema (dimensions and metrics)
 * GET /api/adobe/schema
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Adobe client
    const client = await createAdobeClient(user.id)

    // Get dimensions and metrics
    const [dimensions, metrics] = await Promise.all([
      client.getDimensions(),
      client.getMetrics(),
    ])

    // Group by category
    const dimensionsByCategory = dimensions.reduce((acc, dim) => {
      if (!acc[dim.category]) {
        acc[dim.category] = []
      }
      acc[dim.category].push({
        id: dim.id,
        title: dim.title,
        name: dim.name,
        type: dim.type,
      })
      return acc
    }, {} as Record<string, any[]>)

    const metricsByCategory = metrics.reduce((acc, metric) => {
      if (!acc[metric.category]) {
        acc[metric.category] = []
      }
      acc[metric.category].push({
        id: metric.id,
        title: metric.title,
        name: metric.name,
        type: metric.type,
      })
      return acc
    }, {} as Record<string, any[]>)

    return NextResponse.json({
      dimensions: {
        total: dimensions.length,
        byCategory: dimensionsByCategory,
        all: dimensions.map(d => ({
          id: d.id,
          title: d.title,
          name: d.name,
          category: d.category,
          type: d.type,
        })),
      },
      metrics: {
        total: metrics.length,
        byCategory: metricsByCategory,
        all: metrics.map(m => ({
          id: m.id,
          title: m.title,
          name: m.name,
          category: m.category,
          type: m.type,
        })),
      },
    })
  } catch (error: any) {
    console.error('Adobe schema error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Adobe Analytics schema' },
      { status: 500 }
    )
  }
}
