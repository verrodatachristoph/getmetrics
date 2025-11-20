# getmetrics - Vision Document

## Produktname & Philosophie

### Der Name: getmetrics

**getmetrics** (alles kleingeschrieben) ist bewusst als ein Wort konzipiert und folgt der Tradition erfolgreicher Developer-Tools wie `getbootstrap`, `github`, oder `stackoverflow`.

#### Namensherkunft & Bedeutung

**"get"** steht für:
- **Einfachheit**: "Get your metrics" - so simpel wie ein API-Call
- **Aktion**: Imperative Form - direkt, ohne Umwege
- **Developer-Kultur**: Erinnert an `git`, `npm install`, `get request` - vertraut für Tech-affine User
- **Sofortigkeit**: Keine komplexen Prozesse, einfach "get" und loslegen

**"metrics"** steht für:
- **Klarheit**: Jeder weiß sofort, worum es geht - Analytics, Daten, KPIs
- **Professionalität**: Metrics sind das Herzstück jeder Datenanalyse
- **Universalität**: Funktioniert für alle Analytics-Plattformen (Adobe, GA4, etc.)
- **Messbarkeit**: Der Kern dessen, was die Plattform liefert

#### Zusammensetzung

`get + metrics = getmetrics`

Ein Wort, keine Leerzeichen, keine Bindestriche - clean und modern. Die Kleinschreibung ist bewusst gewählt:
- Wirkt zugänglich und nicht-corporate
- Passt zur Developer-Tool-Ästhetik
- Besser lesbar in URLs: `getmetrics.io` statt `GetMetrics.io`
- Modern und zeitgemäß (siehe: stripe, vercel, supabase)

#### Tagline-Optionen

- *"Get your metrics, naturally"*
- *"Analytics in plain English"*
- *"Ask. Get. Visualize."*
- *"Your metrics, on demand"*
- *"Talk to your data"*

#### Logo-Konzept

Das "get" könnte visuell als Prompt-Symbol (>) dargestellt werden:
```
>metrics
```
Dies unterstreicht den Chat/Command-Charakter der Plattform.

### Brand Identity

#### Farbpalette (Vorschlag)
- **Primary**: Deep Blue `#1E3A8A` - Vertrauen, Professionalität, Analytics
- **Secondary**: Electric Cyan `#06B6D4` - Modern, Tech, Interaktivität
- **Accent**: Amber `#F59E0B` - Insights, Highlights, Aha-Momente
- **Neutral**: Slate Gray `#475569` - Text, UI-Elemente
- **Background**: White `#FFFFFF` / Dark `#0F172A` - Light/Dark Mode

#### Typografie
- **Headings**: Inter, SF Pro, oder System UI (modern, clean)
- **Body**: Inter, SF Pro, oder System UI
- **Code/Metrics**: JetBrains Mono, Fira Code (monospace für Daten)

#### Tone of Voice
- **Freundlich**: "Hey, lass uns deine Daten anschauen"
- **Direkt**: Keine Marketing-Floskeln, straight to the point
- **Kompetent**: Wir verstehen Analytics
- **Zugänglich**: Keine Gatekeeping, jeder kann Analytics machen

---

## Produktbeschreibung

Eine universelle SaaS-Plattform, die es Analytics-Nutzern ermöglicht, durch natürliche Sprache mit ihren Daten zu interagieren. User können in einem Chat-Interface Fragen in Klartext stellen, die von einem LLM ihrer Wahl interpretiert und in Analytics-API-Abfragen übersetzt werden. Die Antworten werden als Text und bei Bedarf als interaktive Visualisierungen dargestellt.

### Unterstützte Analytics-Plattformen (Initial Launch)

1. **Adobe Analytics** (Analytics 2.0 API)
2. **Google Analytics 4** (GA4 Data API)

### Unterstützte LLMs

1. **Anthropic Claude** (Claude Sonnet 4)
2. **OpenAI** (GPT-4o, GPT-4 Turbo)
3. **Google Gemini** (Gemini 1.5 Pro)

### Kernfunktionen

1. **Multi-Platform Support**: Einheitliches Interface für verschiedene Analytics-Tools
2. **Multi-LLM Support**: User können zwischen verschiedenen LLMs wählen
3. **Einfache Integration**: One-Time Setup der Analytics-API Credentials
4. **Natürliche Sprachverarbeitung**: Fragen in Klartext ohne SQL- oder API-Kenntnisse
5. **Automatische Visualisierung**: LLM entscheidet, welche Chart-Typen am besten geeignet sind
6. **Sichere Credential-Speicherung**: Verschlüsselte Speicherung aller API Keys

### User Journey

1. User registriert sich auf der Plattform
2. User wählt Analytics-Plattform (Adobe Analytics oder Google Analytics 4)
3. User hinterlegt entsprechende API Credentials
4. User wählt bevorzugtes LLM (Claude, OpenAI oder Gemini) und hinterlegt API Key
5. User stellt Fragen im Chat: "Zeig mir die Top 10 Seiten nach Pageviews für die letzten 7 Tage"
6. System übersetzt Anfrage → Analytics API Call → Daten-Retrieval → LLM-Interpretation → Visualisierung
7. User erhält Antwort mit Text und interaktiver Grafik

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Hosting**: Vercel
- **UI Components**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts oder Chart.js
- **State Management**: React Context / Zustand
- **Forms**: React Hook Form + Zod Validation

### Backend
- **Runtime**: Next.js API Routes (Serverless Functions auf Vercel)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase für verschlüsselte Credentials
- **Email**: Resend für Transactional Emails

### Externe APIs

#### Analytics Platforms
- **Adobe Analytics API 2.0**
- **Google Analytics 4 Data API (GA4)**

#### LLM APIs
- **Anthropic Claude API**
- **OpenAI API**
- **Google Gemini API**

### Security & Encryption
- **Credential Encryption**: Supabase Vault für API Keys
- **Environment Variables**: Vercel Environment Variables
- **HTTPS**: Standardmäßig über Vercel
- **Rate Limiting**: Vercel Edge Config oder Upstash Redis

---

## Datenbankschema (Supabase)

```sql
-- Users Tabelle (wird von Supabase Auth verwaltet)

-- User Settings Tabelle
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Analytics Platform Selection
  analytics_platform VARCHAR(50), -- 'adobe_analytics', 'google_analytics_4'
  
  -- Adobe Analytics Settings (nullable wenn GA4 gewählt)
  adobe_client_id TEXT,
  adobe_client_secret_encrypted TEXT,
  adobe_org_id TEXT,
  adobe_company_id TEXT,
  adobe_report_suite_id TEXT,
  adobe_access_token TEXT,
  adobe_token_expires_at BIGINT,
  
  -- Google Analytics 4 Settings (nullable wenn Adobe gewählt)
  ga4_property_id TEXT,
  ga4_credentials_encrypted JSONB, -- Service Account JSON verschlüsselt
  
  -- LLM Settings
  selected_llm VARCHAR(50), -- 'claude', 'openai', 'gemini'
  llm_api_key_encrypted TEXT,
  
  UNIQUE(user_id)
);

-- Chat History Tabelle (plattform-agnostisch)
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  analytics_platform VARCHAR(50), -- Welche Platform wurde verwendet
  user_message TEXT NOT NULL,
  assistant_response TEXT NOT NULL,
  chart_config JSONB,
  api_query JSONB, -- Generierte API Query (Platform-spezifisch)
  
  INDEX idx_user_created (user_id, created_at DESC)
);

-- Usage Tracking (für Billing)
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  analytics_platform VARCHAR(50),
  llm_provider VARCHAR(50),
  llm_tokens_used INTEGER,
  analytics_api_calls INTEGER DEFAULT 1,
  
  INDEX idx_user_month (user_id, created_at)
);

-- Row Level Security (RLS) Policies
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users können nur ihre eigenen Daten sehen/bearbeiten
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ähnliche Policies für chat_history und api_usage
```

---

## Systemarchitektur

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Login/     │  │   Settings   │  │  Chat        │      │
│  │   Register   │  │   Page       │  │  Interface   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js API Routes (Backend)                    │
│                                                               │
│  /api/auth/*          - Supabase Auth                        │
│  /api/settings/*      - CRUD für User Settings               │
│  /api/chat            - Chat Endpoint (Hauptlogik)           │
│  /api/analytics/*     - Analytics Platform Router            │
│    ├─ /adobe/*        - Adobe Analytics Proxy                │
│    └─ /ga4/*          - Google Analytics 4 Proxy             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  Supabase    │   │  LLM APIs    │   │  Analytics   │
│  Database    │   │  - Claude    │   │  APIs        │
│  + Auth      │   │  - OpenAI    │   │  - Adobe     │
│              │   │  - Gemini    │   │  - GA4       │
└──────────────┘   └──────────────┘   └──────────────┘
```

### Chat Flow (Platform-Agnostic)

```
User Input: "Zeig mir die Top 10 Seiten nach Pageviews letzte 7 Tage"
                              │
                              ▼
                    /api/chat Endpoint
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
        Load User Settings          Decrypt API Keys
        (Platform + LLM)                    │
                │                           │
                └─────────────┬─────────────┘
                              ▼
                    Detect Analytics Platform
                    (Adobe Analytics oder GA4)
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
        Adobe Analytics           Google Analytics 4
        Schema Context            Schema Context
                │                           │
                └─────────────┬─────────────┘
                              ▼
                    LLM API Call mit Prompt:
                    - User Question
                    - Platform-specific Schema
                    - Available Dimensions/Metrics
                              │
                              ▼
                LLM generiert strukturierte Response:
                {
                  "platform": "adobe_analytics",
                  "query": {...},
                  "explanation": "...",
                  "suggested_chart": "bar"
                }
                              │
                              ▼
                    Platform-specific API Call
                    (Adobe oder GA4)
                              │
                              ▼
                    Data Processing & Response
                              │
                              ▼
                    Frontend: Text + Chart Rendering
```

---

## Implementierungsplan

### Phase 1: Setup & Auth (Woche 1)
- [ ] Next.js Projekt mit Vercel initialisieren
- [ ] Supabase Projekt aufsetzen
- [ ] Supabase Auth Integration (Email/Password)
- [ ] Basic UI mit shadcn/ui aufbauen
- [ ] Login/Register Flow

### Phase 2: Settings Management (Woche 1-2)
- [ ] Settings Page UI mit Platform-Auswahl
- [ ] Adobe Analytics Credentials Form
- [ ] Google Analytics 4 Credentials Form
- [ ] LLM Selection (Claude, OpenAI, Gemini) & API Key Input
- [ ] Credential Encryption mit Supabase Vault
- [ ] Settings API Endpoints

### Phase 3: Adobe Analytics Integration (Woche 2-3)
- [ ] Adobe Analytics OAuth Server-to-Server implementieren
- [ ] Token Management (Access Token Refresh)
- [ ] Discovery API Integration (Company ID, Report Suites)
- [ ] Reporting API Integration
- [ ] Test Queries gegen Adobe API
- [ ] Schema Context Builder (Metriken/Dimensionen)

### Phase 4: Google Analytics 4 Integration (Woche 3-4)
- [ ] GA4 Service Account Authentication
- [ ] GA4 Data API Integration
- [ ] Property Discovery
- [ ] RunReport API Implementation
- [ ] Test Queries gegen GA4 API
- [ ] Schema Context Builder (Dimensionen/Metriken)

### Phase 5: LLM Integration (Woche 4-5)
- [ ] Claude API Integration
- [ ] OpenAI API Integration
- [ ] Gemini API Integration
- [ ] Platform-agnostic Prompt Engineering
- [ ] Platform-specific Query Generation
- [ ] Response Parsing & Validation

### Phase 6: Chat Interface (Woche 5-6)
- [ ] Chat UI mit Message History
- [ ] Chat API Endpoint mit Platform Router
- [ ] Loading States & Error Handling
- [ ] Chat History Speicherung

### Phase 7: Visualisierung (Woche 6-7)
- [ ] Chart.js oder Recharts Integration
- [ ] Chart Type Selection Logic
- [ ] Dynamic Chart Rendering basierend auf Datentyp
- [ ] Export-Funktionen (PNG, CSV)

### Phase 8: Polish & Launch (Woche 7-8)
- [ ] Usage Tracking für Billing
- [ ] Rate Limiting
- [ ] Error Messages & User Feedback
- [ ] Responsive Design
- [ ] Testing & Bug Fixes
- [ ] Deployment auf Vercel

---

## Wichtige Ressourcen

### Adobe Analytics API 2.0

#### Offizielle Dokumentation
- **Main Documentation**: https://github.com/AdobeDocs/analytics-2.0-apis
- **Getting Started Guide**: https://developer.adobe.com/analytics-apis/docs/2.0/guides/
- **Reporting API Guide**: https://github.com/AdobeDocs/analytics-2.0-apis/blob/master/reporting-guide.md
- **Swagger/API Explorer**: https://adobedocs.github.io/analytics-2.0-apis/

#### Authentication
- **OAuth Server-to-Server**: https://developer.adobe.com/developer-console/docs/guides/authentication/ServerToServerAuthentication/
- **OAuth Postman Guide**: https://github.com/AdobeDocs/analytics-2.0-apis/blob/master/oauth-postman.md

#### Key Endpoints
```
Base URL: https://analytics.adobe.io

GET  /discovery/me                    - Get Company ID
GET  /companies/{companyId}/reportsuites - List Report Suites
POST /companies/{companyId}/reports   - Run Reports
GET  /companies/{companyId}/dimensions - List Dimensions
GET  /companies/{companyId}/metrics    - List Metrics
```

### Google Analytics 4 (GA4)

#### Offizielle Dokumentation
- **GA4 Data API Overview**: https://developers.google.com/analytics/devguides/reporting/data/v1
- **API Reference**: https://developers.google.com/analytics/devguides/reporting/data/v1/rest
- **Quickstart Guide**: https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries
- **Dimensions & Metrics**: https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema

#### Authentication
- **Service Account Setup**: https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries#set_up_authentication_and_authorization
- **Google Cloud Console**: https://console.cloud.google.com

#### Key Endpoints
```
Base URL: https://analyticsdata.googleapis.com/v1beta

POST /properties/{propertyId}:runReport           - Run Report
POST /properties/{propertyId}:batchRunReports     - Batch Reports
GET  /properties/{propertyId}/metadata            - Get Metadata
POST /properties/{propertyId}:runRealtimeReport   - Realtime Report
```

#### Python Client Library
```bash
pip install google-analytics-data
```

#### Node.js Client Library
```bash
npm install @google-analytics/data
```

### LLM APIs

#### Anthropic Claude
- **Console**: https://console.anthropic.com
- **API Documentation**: https://docs.anthropic.com
- **API Keys**: https://console.anthropic.com/settings/keys
- **Pricing**: https://www.anthropic.com/pricing

**Model**: `claude-sonnet-4-20250514`

#### OpenAI
- **Platform**: https://platform.openai.com
- **API Documentation**: https://platform.openai.com/docs
- **API Keys**: https://platform.openai.com/api-keys
- **Pricing**: https://openai.com/pricing

**Model**: `gpt-4o` oder `gpt-4-turbo`

#### Google Gemini
- **AI Studio**: https://aistudio.google.com
- **API Documentation**: https://ai.google.dev/docs
- **Get API Key**: https://aistudio.google.com/app/apikey
- **Pricing**: https://ai.google.dev/pricing

**Model**: `gemini-1.5-pro`

### Supabase
- **Dashboard**: https://supabase.com/dashboard
- **Documentation**: https://supabase.com/docs
- **Vault (Encryption)**: https://supabase.com/docs/guides/database/vault
- **Auth Guide**: https://supabase.com/docs/guides/auth

### Vercel
- **Dashboard**: https://vercel.com/dashboard
- **Next.js Documentation**: https://nextjs.org/docs
- **Environment Variables**: https://vercel.com/docs/environment-variables

---

## User Onboarding Guides

### 1. Analytics Platform Setup

#### Option A: Adobe Analytics API Credentials

**Voraussetzungen:**
- Adobe Analytics Zugang
- Admin-Rechte oder Developer-Permissions in Adobe Admin Console

**Schritt-für-Schritt Anleitung:**

1. **Adobe Developer Console öffnen**
   - Navigiere zu: https://console.adobe.io
   - Logge dich mit deinem Adobe Account ein

2. **Neues Projekt erstellen**
   - Klicke auf "Create new project"
   - Gib deinem Projekt einen Namen (z.B. "Analytics AI Platform")

3. **API hinzufügen**
   - Klicke auf "Add API"
   - Wähle "Adobe Analytics" unter Experience Cloud
   - Klicke "Next"

4. **OAuth Server-to-Server wählen**
   - Wähle "OAuth Server-to-Server" als Authentication-Methode
   - ⚠️ NICHT JWT wählen (deprecated seit Jan 2025)
   - Klicke "Next"

5. **Product Profile zuweisen**
   - Wähle das entsprechende Product Profile für Adobe Analytics
   - Klicke "Save configured API"

6. **Credentials kopieren**
   Du benötigst folgende Informationen:
   - **Client ID** (z.B. `abc123xyz456...`)
   - **Client Secret** (klicke "Retrieve client secret")
   - **Organization ID** (z.B. `12345678@AdobeOrg`)
   - **Technical Account Email** (z.B. `abc@techacct.adobe.com`)

7. **Company ID ermitteln**
   - Navigiere zu: https://adobedocs.github.io/analytics-2.0-apis/
   - Klicke "Authorize" und logge dich ein
   - Rufe den Endpoint `/discovery/me` auf
   - Kopiere die `globalCompanyId` aus der Response

8. **Report Suite ID ermitteln**
   - In Adobe Analytics UI: Admin → Report Suites
   - Kopiere die Report Suite ID (z.B. `prod.company.com`)

**Was du in der Plattform eingeben musst:**
- Client ID
- Client Secret
- Organization ID
- Company ID
- Report Suite ID

---

#### Option B: Google Analytics 4 (GA4) Credentials

**Voraussetzungen:**
- Google Analytics 4 Property
- Admin-Zugriff auf GA4 Property
- Google Cloud Console Zugang

**Schritt-für-Schritt Anleitung:**

1. **Google Cloud Console öffnen**
   - Navigiere zu: https://console.cloud.google.com
   - Logge dich mit deinem Google Account ein

2. **Neues Projekt erstellen (oder bestehendes wählen)**
   - Klicke oben links auf "Select a project"
   - Klicke "New Project"
   - Gib einen Namen ein (z.B. "Analytics AI Platform")
   - Klicke "Create"

3. **Google Analytics Data API aktivieren**
   - Im Cloud Console: Navigation Menu → "APIs & Services" → "Library"
   - Suche nach "Google Analytics Data API"
   - Klicke auf "Google Analytics Data API"
   - Klicke "Enable"

4. **Service Account erstellen**
   - Navigation Menu → "APIs & Services" → "Credentials"
   - Klicke "+ CREATE CREDENTIALS"
   - Wähle "Service account"
   - Gib einen Namen ein (z.B. "analytics-ai-bot")
   - Klicke "Create and Continue"
   - Role: "Viewer" (oder spezifischer)
   - Klicke "Continue" → "Done"

5. **Service Account Key generieren**
   - Klicke auf den neu erstellten Service Account
   - Tab "Keys" → "Add Key" → "Create new key"
   - Wähle "JSON"
   - Klicke "Create"
   - ⚠️ **WICHTIG**: JSON-Datei wird heruntergeladen - sicher speichern!

6. **Service Account Zugriff auf GA4 Property geben**
   - Öffne Google Analytics 4: https://analytics.google.com
   - Wähle deine Property
   - Admin (unten links) → Property → Property Access Management
   - Klicke "+"
   - Gib die Service Account Email ein (aus JSON: `client_email`)
   - Role: "Viewer" minimum
   - Klicke "Add"

7. **Property ID ermitteln**
   - In GA4: Admin → Property Settings
   - Kopiere die "Property ID" (Format: 123456789)

**Was du in der Plattform eingeben musst:**
- Property ID (z.B. `123456789`)
- Komplette JSON-Datei hochladen oder Inhalt einfügen

**JSON-Struktur (wird verschlüsselt gespeichert):**
```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "analytics-ai-bot@project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

---

### 2. LLM Setup

#### Option A: Claude API Key erstellen

**Voraussetzungen:**
- Anthropic Account
- Zahlungsmethode hinterlegt (nach Free Credits)

**Schritt-für-Schritt Anleitung:**

1. **Anthropic Console öffnen**
   - Navigiere zu: https://console.anthropic.com
   - Klicke "Sign Up" oder logge dich ein
   - Verifiziere deine Email-Adresse

2. **Billing einrichten** (wenn Free Credits aufgebraucht)
   - Klicke links auf "Billing"
   - Klicke "Add payment method"
   - Füge eine Kreditkarte hinzu
   - Optional: Setze Usage Limits

3. **API Key generieren**
   - Klicke links auf "API Keys"
   - Klicke "+ Create Key"
   - Gib einen Namen ein (z.B. "Analytics Platform")
   - Wähle den Workspace (falls mehrere vorhanden)
   - Klicke "Create Key"

4. **API Key kopieren**
   - ⚠️ **WICHTIG**: Der Key wird nur EINMAL angezeigt!
   - Kopiere den Key (beginnt mit `sk-ant-api03-...`)
   - Speichere ihn sicher

5. **Key in Plattform eingeben**
   - Wähle "Claude" als LLM
   - Füge deinen API Key ein

**Kosten (Stand 2024):**
- Sonnet 4: ~$3 pro 1M Input Tokens, ~$15 pro 1M Output Tokens
- Free Credits: $5 bei Anmeldung

---

#### Option B: OpenAI API Key erstellen

**Voraussetzungen:**
- OpenAI Account
- Telefonnummer zur Verifizierung
- Zahlungsmethode (nach Free Trial)

**Schritt-für-Schritt Anleitung:**

1. **OpenAI Platform öffnen**
   - Navigiere zu: https://platform.openai.com
   - Klicke "Sign up" oder logge dich ein
   - Verifiziere deine Email-Adresse

2. **Account verifizieren**
   - Füge eine Telefonnummer hinzu
   - Bestätige den SMS-Code

3. **Billing einrichten**
   - Klicke oben rechts auf deinen Namen → "Billing"
   - Klicke "Add payment method"
   - Füge eine Kreditkarte hinzu
   - Optional: Setze monatliche Limits unter "Usage limits"

4. **API Key generieren**
   - Klicke links auf "API keys" oder gehe zu: https://platform.openai.com/api-keys
   - Klicke "+ Create new secret key"
   - Gib einen Namen ein (z.B. "Analytics Platform")
   - Optional: Wähle Permissions
   - Klicke "Create secret key"

5. **API Key kopieren**
   - ⚠️ **WICHTIG**: Der Key wird nur EINMAL angezeigt!
   - Kopiere den Key (beginnt mit `sk-proj-...` oder `sk-...`)
   - Speichere ihn sicher

6. **Key in Plattform eingeben**
   - Wähle "OpenAI" als LLM
   - Füge deinen API Key ein

**Kosten (Stand 2024):**
- GPT-4o: ~$2.50 pro 1M Input Tokens, ~$10 pro 1M Output Tokens
- Free Trial: $5 Credits

---

#### Option C: Google Gemini API Key erstellen

**Voraussetzungen:**
- Google Account
- Zugriff auf Google AI Studio

**Schritt-für-Schritt Anleitung:**

1. **Google AI Studio öffnen**
   - Navigiere zu: https://aistudio.google.com
   - Logge dich mit deinem Google Account ein

2. **API Key erstellen**
   - Klicke links auf "Get API key"
   - Oder direkt: https://aistudio.google.com/app/apikey
   - Klicke "Create API key"

3. **Google Cloud Project wählen**
   - Wähle ein bestehendes Project ODER
   - Klicke "Create API key in new project"
   - Projekt wird automatisch erstellt

4. **API Key kopieren**
   - Kopiere den generierten Key
   - Speichere ihn sicher
   - Du kannst den Key später jederzeit wieder einsehen

5. **Key in Plattform eingeben**
   - Wähle "Gemini" als LLM
   - Füge deinen API Key ein

**Kosten (Stand 2024):**
- Gemini 1.5 Pro: Free tier verfügbar
- Nach Free tier: ~$1.25 pro 1M Input Tokens, ~$5 pro 1M Output Tokens
- Großzügige Free Quota: 15 RPM (Requests per Minute)

**Hinweis:** Gemini hat aktuell die großzügigsten Free Limits aller drei LLM-Anbieter!

---

## Platform-Specific Implementation Details

### Adobe Analytics Query Structure

```typescript
interface AdobeAnalyticsQuery {
  rsid: string
  globalFilters: Array<{
    type: 'dateRange'
    dateRange: string // Format: YYYY-MM-DD/YYYY-MM-DD
  }>
  metricContainer: {
    metrics: Array<{
      columnId: string
      id: string // Format: metrics/pageviews
    }>
  }
  dimension: string // Format: variables/page
  settings: {
    countRepeatInstances: boolean
    limit: number
    page?: number
  }
}
```

### Google Analytics 4 Query Structure

```typescript
interface GA4Query {
  property: string // Format: properties/123456789
  dateRanges: Array<{
    startDate: string // Format: YYYY-MM-DD or 'today', '7daysAgo'
    endDate: string   // Format: YYYY-MM-DD or 'today', 'yesterday'
  }>
  dimensions: Array<{
    name: string // Format: pagePath, country, deviceCategory
  }>
  metrics: Array<{
    name: string // Format: screenPageViews, sessions, activeUsers
  }>
  limit?: number
  orderBys?: Array<{
    metric?: { metricName: string }
    dimension?: { dimensionName: string }
    desc?: boolean
  }>
}
```

---

## Prompt Engineering (Platform-Agnostic)

### System Prompt Template

```typescript
const buildSystemPrompt = (platform: 'adobe_analytics' | 'google_analytics_4', context: any) => {
  const basePrompt = `Du bist ein ${platform === 'adobe_analytics' ? 'Adobe Analytics' : 'Google Analytics 4'} Experte, der natürliche Sprache in API Queries übersetzt.

ANALYTICS PLATFORM: ${platform}

VERFÜGBARE METRIKEN:
${context.metrics.map(m => `- ${m.id}: ${m.name} (${m.type})`).join('\n')}

VERFÜGBARE DIMENSIONEN:
${context.dimensions.map(d => `- ${d.id}: ${d.name}`).join('\n')}

${platform === 'adobe_analytics' ? `REPORT SUITE: ${context.reportSuiteId}` : `PROPERTY ID: ${context.propertyId}`}

DEINE AUFGABE:
1. Interpretiere die User-Anfrage
2. Generiere eine valide ${platform === 'adobe_analytics' ? 'Adobe Analytics' : 'GA4'} API Query
3. Schlage einen passenden Chart-Typ vor
4. Gib eine kurze Erklärung
`

  if (platform === 'adobe_analytics') {
    return basePrompt + `
RESPONSE FORMAT (JSON):
{
  "platform": "adobe_analytics",
  "adobe_query": {
    "rsid": "report_suite_id",
    "globalFilters": [
      {
        "type": "dateRange",
        "dateRange": "YYYY-MM-DD/YYYY-MM-DD"
      }
    ],
    "metricContainer": {
      "metrics": [
        {
          "columnId": "0",
          "id": "metrics/pageviews"
        }
      ]
    },
    "dimension": "variables/page",
    "settings": {
      "countRepeatInstances": true,
      "limit": 10
    }
  },
  "explanation": "Kurze Erklärung der Query",
  "suggested_chart": "bar|line|pie|table",
  "chart_title": "Titel für Chart"
}

WICHTIG:
- Verwende nur Metriken/Dimensionen aus der Liste oben
- Dateformat: YYYY-MM-DD
- Limit maximal 400 Zeilen
`
  } else {
    return basePrompt + `
RESPONSE FORMAT (JSON):
{
  "platform": "google_analytics_4",
  "ga4_query": {
    "dateRanges": [
      {
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD"
      }
    ],
    "dimensions": [
      {
        "name": "pagePath"
      }
    ],
    "metrics": [
      {
        "name": "screenPageViews"
      }
    ],
    "limit": 10,
    "orderBys": [
      {
        "metric": {
          "metricName": "screenPageViews"
        },
        "desc": true
      }
    ]
  },
  "explanation": "Kurze Erklärung der Query",
  "suggested_chart": "bar|line|pie|table",
  "chart_title": "Titel für Chart"
}

WICHTIG:
- Verwende nur Dimensionen/Metriken aus der Liste oben
- Dateformat: YYYY-MM-DD oder relative Werte: 'today', 'yesterday', '7daysAgo'
- Limit maximal 100000 Zeilen (GA4 Default)
`
  }
}
```

---

## Security Best Practices

### Credential Storage

```typescript
// Adobe Analytics Credentials
const encryptedAdobeCreds = {
  adobe_client_id: clientId,
  adobe_client_secret_encrypted: await encryptWithVault(clientSecret),
  adobe_org_id: orgId,
  adobe_company_id: companyId,
  adobe_report_suite_id: rsid
}

// GA4 Credentials (komplettes JSON verschlüsselt)
const encryptedGA4Creds = {
  ga4_property_id: propertyId,
  ga4_credentials_encrypted: await encryptWithVault(JSON.stringify(serviceAccountJson))
}
```

### Platform-Specific Token Management

```typescript
// Adobe: OAuth Token mit Refresh
async function getAdobeAccessToken(userId: string) {
  const settings = await getUserSettings(userId)
  
  if (settings.adobe_token_expires_at > Date.now()) {
    return settings.adobe_access_token
  }
  
  // Refresh token logic...
}

// GA4: Service Account Token (automatisch von Library verwaltet)
async function getGA4Client(userId: string) {
  const settings = await getUserSettings(userId)
  const credentials = JSON.parse(
    await decryptWithVault(settings.ga4_credentials_encrypted)
  )
  
  // Google Analytics Data API Client
  const { BetaAnalyticsDataClient } = require('@google-analytics/data')
  return new BetaAnalyticsDataClient({ credentials })
}
```

---

## Error Handling

### Platform-Specific Errors

```typescript
function handleAnalyticsError(error: any, platform: string) {
  if (platform === 'adobe_analytics') {
    // Adobe-spezifische Fehler
    if (error.status === 401) {
      return "Adobe Analytics Authentication fehlgeschlagen. Bitte überprüfe deine Credentials."
    }
    if (error.status === 429) {
      return "Adobe Analytics Rate Limit erreicht. Bitte warte einen Moment."
    }
  } else if (platform === 'google_analytics_4') {
    // GA4-spezifische Fehler
    if (error.code === 401 || error.code === 403) {
      return "Google Analytics 4 Zugriff verweigert. Überprüfe Service Account Permissions."
    }
    if (error.code === 429) {
      return "GA4 API Quota erreicht. Bitte warte einen Moment."
    }
  }
  
  return "Ein Fehler ist aufgetreten. Bitte versuche es erneut."
}
```

---

## Testing Strategy

### Platform-Agnostic Tests

```typescript
describe('Chat API with Adobe Analytics', () => {
  it('should generate valid Adobe Analytics query', async () => {
    const response = await chatEndpoint({
      message: "Top 10 pages",
      platform: "adobe_analytics"
    })
    
    expect(response.query).toHaveProperty('rsid')
    expect(response.platform).toBe('adobe_analytics')
  })
})

describe('Chat API with Google Analytics 4', () => {
  it('should generate valid GA4 query', async () => {
    const response = await chatEndpoint({
      message: "Top 10 pages",
      platform: "google_analytics_4"
    })
    
    expect(response.query).toHaveProperty('dateRanges')
    expect(response.platform).toBe('google_analytics_4')
  })
})
```

---

## Deployment Checklist

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=

# Encryption
ENCRYPTION_SECRET=

# Optional: Eigene LLM Keys für Plattform (falls Managed Offering)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GOOGLE_AI_API_KEY=
```

---

## Monetarisierungs-Optionen

### Empfohlenes Modell: Freemium (User bringt eigene Keys)

**Free Tier**
- 25 Queries/Monat
- 1 Analytics Platform
- 1 LLM
- Community Support

**Pro** ($29/Monat)
- 500 Queries/Monat
- Beide Analytics Platforms
- Alle 3 LLMs
- Email Support
- Export Funktionen

**Enterprise** ($199/Monat)
- Unlimited Queries
- Beide Analytics Platforms
- Alle 3 LLMs
- Priority Support
- White-Label Option
- Custom Integrations

---

## Roadmap / Erweiterungen

### Phase 2 (nach Launch)
- [ ] Weitere Analytics Platforms (Matomo, Mixpanel)
- [ ] Weitere LLMs (Mistral, Llama)
- [ ] Scheduled Reports
- [ ] Team Collaboration
- [ ] Dashboard Builder
- [ ] API für Drittanbieter

### Phase 3 (Langfristig)
- [ ] Mobile Apps (iOS, Android)
- [ ] Slack/Teams Integration
- [ ] Custom Connectors
- [ ] Data Warehouse Support (Snowflake, BigQuery)

---

## Nächste Schritte

### 1. Domain & Branding sichern
- [ ] Domain registrieren: `getmetrics.io` oder `getmetrics.ai`
- [ ] Social Media Handles sichern (@getmetrics)
- [ ] GitHub Repository erstellen: `github.com/yourusername/getmetrics`

### 2. Repository aufsetzen
```bash
npx create-next-app@latest getmetrics
cd getmetrics
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install recharts zod react-hook-form @tanstack/react-query
npm install -D @types/node typescript
```

### 3. Dieses Dokument in Claude Code laden
- Kopiere den gesamten Inhalt dieser VISION.md
- Starte Claude Code
- Sage: "Baue getmetrics basierend auf dieser Spezifikation"

### 4. Erste Features implementieren
- Start mit Auth & Settings
- Dann Adobe Analytics Integration testen
- Dann GA4 Integration
- Dann LLM Integration (Claude zuerst)
- Zuletzt Chat UI & Visualisierung

### 5. MVP Launch Vorbereitung
- [ ] Landing Page mit Waitlist
- [ ] Beta User Rekrutierung (LinkedIn, Twitter)
- [ ] Product Hunt Submission vorbereiten
- [ ] Feedback-Loop etablieren

---

**Viel Erfolg mit getmetrics! 🚀**

*"Get your metrics, naturally."*
