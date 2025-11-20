# getmetrics

> Get your metrics, naturally.

Analytics in plain English - talk to your Adobe Analytics or Google Analytics 4 data using AI.

## Features

- **Multi-Platform Support**: Adobe Analytics & Google Analytics 4
- **Multi-LLM Support**: Claude, OpenAI GPT, or Google Gemini
- **Natural Language**: Ask questions in plain English
- **Auto Visualization**: Smart chart generation based on your data
- **Secure**: Encrypted credential storage

## Tech Stack

- **Frontend**: Next.js 14+, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Analytics platform access (Adobe Analytics or GA4)
- LLM API key (Claude, OpenAI, or Gemini)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/verrodatachristoph/getmetrics.git
cd getmetrics
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
getmetrics/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── (auth)/          # Auth pages (login, register)
│   ├── (dashboard)/     # Protected dashboard pages
│   └── layout.tsx       # Root layout
├── components/          # React components
├── lib/                 # Utility functions & configurations
├── types/              # TypeScript type definitions
└── .claude/            # Claude Code configuration
```

## Documentation

See the [VISION.md](.claude/VISION.md) file for comprehensive documentation.

## License

MIT

## Links

- **GitHub**: https://github.com/verrodatachristoph/getmetrics
- **Documentation**: Coming soon
