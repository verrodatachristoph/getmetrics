import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { encrypt, decrypt, safeDecrypt } from '@/lib/encryption'

// GET - Fetch user settings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch settings
    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Settings fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    // If no settings exist, return null
    if (!settings) {
      return NextResponse.json({ settings: null })
    }

    // Decrypt sensitive fields for client (don't send encrypted secrets)
    const decryptedSettings = {
      ...settings,
      // Don't send encrypted secrets to client
      adobe_client_secret_encrypted: undefined,
      llm_api_key_encrypted: undefined,
      ga4_credentials_encrypted: undefined,
      // Add flags to indicate if secrets are set
      has_adobe_client_secret: !!settings.adobe_client_secret_encrypted,
      has_llm_api_key: !!settings.llm_api_key_encrypted,
      has_ga4_credentials: !!settings.ga4_credentials_encrypted,
    }

    return NextResponse.json({ settings: decryptedSettings })
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create or update settings
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, data: settingsData } = body

    // Check if settings already exist
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (type === 'analytics') {
      const { analytics_platform } = settingsData

      if (analytics_platform === 'adobe_analytics') {
        const {
          adobe_client_id,
          adobe_client_secret,
          adobe_org_id,
          adobe_company_id,
          adobe_report_suite_id,
        } = settingsData

        // Encrypt the client secret
        const encryptedSecret = encrypt(adobe_client_secret)

        const payload = {
          user_id: user.id,
          analytics_platform: 'adobe_analytics',
          adobe_client_id,
          adobe_client_secret_encrypted: encryptedSecret,
          adobe_org_id,
          adobe_company_id,
          adobe_report_suite_id,
          // Clear GA4 fields
          ga4_property_id: null,
          ga4_credentials_encrypted: null,
        }

        if (existingSettings) {
          // Update
          const { error } = await supabase
            .from('user_settings')
            .update(payload)
            .eq('user_id', user.id)

          if (error) {
            console.error('Settings update error:', error)
            return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
          }
        } else {
          // Insert
          const { error } = await supabase
            .from('user_settings')
            .insert(payload)

          if (error) {
            console.error('Settings insert error:', error)
            return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
          }
        }

        return NextResponse.json({ success: true })
      } else if (analytics_platform === 'google_analytics_4') {
        const { ga4_property_id, ga4_credentials } = settingsData

        // Encrypt the credentials JSON
        const encryptedCredentials = encrypt(ga4_credentials)

        const payload = {
          user_id: user.id,
          analytics_platform: 'google_analytics_4',
          ga4_property_id,
          ga4_credentials_encrypted: encryptedCredentials,
          // Clear Adobe fields
          adobe_client_id: null,
          adobe_client_secret_encrypted: null,
          adobe_org_id: null,
          adobe_company_id: null,
          adobe_report_suite_id: null,
          adobe_access_token: null,
          adobe_token_expires_at: null,
        }

        if (existingSettings) {
          // Update
          const { error } = await supabase
            .from('user_settings')
            .update(payload)
            .eq('user_id', user.id)

          if (error) {
            console.error('Settings update error:', error)
            return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
          }
        } else {
          // Insert
          const { error } = await supabase
            .from('user_settings')
            .insert(payload)

          if (error) {
            console.error('Settings insert error:', error)
            return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
          }
        }

        return NextResponse.json({ success: true })
      }
    } else if (type === 'llm') {
      const { selected_llm, llm_api_key } = settingsData

      // Encrypt the API key
      const encryptedKey = encrypt(llm_api_key)

      const payload = {
        user_id: user.id,
        selected_llm,
        llm_api_key_encrypted: encryptedKey,
      }

      if (existingSettings) {
        // Update
        const { error } = await supabase
          .from('user_settings')
          .update(payload)
          .eq('user_id', user.id)

        if (error) {
          console.error('Settings update error:', error)
          return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
        }
      } else {
        // Insert
        const { error } = await supabase
          .from('user_settings')
          .insert(payload)

        if (error) {
          console.error('Settings insert error:', error)
          return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
        }
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid settings type' }, { status: 400 })
  } catch (error) {
    console.error('Settings POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Clear settings
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('user_settings')
      .delete()
      .eq('user_id', user.id)

    if (error) {
      console.error('Settings delete error:', error)
      return NextResponse.json({ error: 'Failed to delete settings' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
