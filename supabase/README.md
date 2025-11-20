# Supabase Database Setup

This directory contains the database schema and migrations for getmetrics.

## Setup Instructions

### 1. Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/wptbhhldtolxtfmfscfx)
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**

### 2. Run Schema

Copy and paste the contents of `schema.sql` into the SQL Editor and click **Run**.

This will create:
- `user_settings` table - Stores analytics platform and LLM credentials
- `chat_history` table - Stores chat conversations
- `api_usage` table - Tracks API usage for billing
- Row Level Security (RLS) policies for all tables
- Indexes for efficient querying
- Triggers for automatic timestamp updates

### 3. Verify Setup

After running the schema:

1. Go to **Table Editor** in Supabase
2. Verify you see these tables:
   - user_settings
   - chat_history
   - api_usage

3. Check RLS is enabled:
   - Each table should show "RLS enabled" badge

## Database Structure

### user_settings
Stores per-user configuration for:
- Analytics platform choice (Adobe Analytics or GA4)
- Platform-specific credentials (encrypted)
- LLM provider choice (Claude, OpenAI, or Gemini)
- LLM API key (encrypted)

### chat_history
Stores chat conversations with:
- User messages
- Assistant responses
- Generated API queries
- Chart configurations

### api_usage
Tracks usage metrics:
- API calls per platform
- LLM token usage
- Timestamps for billing

## Security

All tables have Row Level Security (RLS) enabled. Users can only:
- View their own data
- Insert their own data
- Update their own data
- Delete their own data

Credentials are stored encrypted using Supabase Vault (to be implemented in API routes).

## Environment Variables

Make sure your `.env.local` contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wptbhhldtolxtfmfscfx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

These are already configured in the project.
