-- ============================================
-- getmetrics - Supabase Database Schema
-- ============================================
-- Run this in Supabase SQL Editor
-- https://supabase.com/dashboard/project/wptbhhldtolxtfmfscfx/sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER SETTINGS TABLE
-- ============================================
-- Stores user analytics platform credentials and LLM preferences
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Analytics Platform Selection
  analytics_platform VARCHAR(50), -- 'adobe_analytics', 'google_analytics_4'

  -- Adobe Analytics Settings (nullable when GA4 is chosen)
  adobe_client_id TEXT,
  adobe_client_secret_encrypted TEXT,
  adobe_org_id TEXT,
  adobe_company_id TEXT,
  adobe_report_suite_id TEXT,
  adobe_access_token TEXT,
  adobe_token_expires_at BIGINT,

  -- Google Analytics 4 Settings (nullable when Adobe is chosen)
  ga4_property_id TEXT,
  ga4_credentials_encrypted JSONB, -- Service Account JSON encrypted

  -- LLM Settings
  selected_llm VARCHAR(50), -- 'claude', 'openai', 'gemini'
  llm_api_key_encrypted TEXT,

  UNIQUE(user_id)
);

-- ============================================
-- CHAT HISTORY TABLE
-- ============================================
-- Platform-agnostic chat message storage
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  analytics_platform VARCHAR(50), -- Which platform was used
  user_message TEXT NOT NULL,
  assistant_response TEXT NOT NULL,
  chart_config JSONB, -- Chart configuration (type, data, etc.)
  api_query JSONB -- Generated API query (platform-specific)
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_chat_history_user_created
  ON chat_history(user_id, created_at DESC);

-- ============================================
-- API USAGE TRACKING TABLE
-- ============================================
-- Track API usage for billing and analytics
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  analytics_platform VARCHAR(50),
  llm_provider VARCHAR(50),
  llm_tokens_used INTEGER,
  analytics_api_calls INTEGER DEFAULT 1
);

-- Create index for usage queries
CREATE INDEX IF NOT EXISTS idx_api_usage_user_month
  ON api_usage(user_id, created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USER SETTINGS POLICIES
-- ============================================

-- Users can view their own settings
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own settings
CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own settings
CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own settings
CREATE POLICY "Users can delete own settings" ON user_settings
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CHAT HISTORY POLICIES
-- ============================================

-- Users can view their own chat history
CREATE POLICY "Users can view own chat history" ON chat_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own chat messages
CREATE POLICY "Users can insert own chat messages" ON chat_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own chat history
CREATE POLICY "Users can delete own chat history" ON chat_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- API USAGE POLICIES
-- ============================================

-- Users can view their own usage
CREATE POLICY "Users can view own usage" ON api_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert usage records
CREATE POLICY "Service role can insert usage" ON api_usage
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMPLETED
-- ============================================
-- Schema created successfully!
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Verify tables are created in Table Editor
-- 3. Test RLS policies
