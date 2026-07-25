# Humanize AI - Free Natural Writing Assistant

Humanize AI is a modern full-stack web application designed to rewrite AI-generated text to make it sound completely natural, fluent, and human-like. 

It is designed with a **100% free-to-use** mindset. To offset costs, ads/sponsor slots are strategically placed on non-editing views (e.g. landing page, user dashboard, history tab) while keeping the editor interface completely ad-free and distraction-free.

---

## Tech Stack

- **Framework**: Next.js 14/15/16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Credentials, extensible to Google OAuth)
- **AI Engine**: OpenAI API (GPT-4o) with full Streaming Token Response
- **File Parser**: Mammoth (.docx) & PDF-Parse (.pdf)
- **Styling**: Tailwind CSS & Lucide Icons

---

## Key Features

- **Ad-Free Writing Mode**: Clean side-by-side editing dashboard with absolutely zero distracting ads.
- **Multiple Writing Modes**: Natural, Professional, Academic, Simple English, and Creative.
- **File Upload Parsing**: Directly upload PDF, Word (.docx), or Text (.txt) documents.
- **Side-by-Side Comparison**: Highlight differences between original and humanized outputs.
- **Paragraph Selection Rewrites**: Click any single paragraph to re-target and rewrite it separately.
- **User Dashboard & History**: Save, search, filter, download, or copy previous translations easily.

---

## Getting Started

### 1. Requirements

- Node.js 18+ or Docker installed.
- PostgreSQL database.
- OpenAI API Key.

### 2. Environment Setup

Create a `.env` file in the root of the project:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/humanize_ai"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="use-any-random-long-string-key"

# OpenAI Configuration
OPENAI_API_KEY="your-openai-api-key-here"
OPENAI_BASE_URL="https://api.openai.com/v1"
OPENAI_MODEL="gpt-4o"

# Optional: Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Optional: AdSense ID
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_ADSENSE_ID=""
```

### 3. Local Development

Install dependencies and run database migrations:

```bash
# Install packages
npm install

# Run database migration
npx prisma db push

# Generate client
npx prisma generate

# Run local development server
npm run dev
```

The app will start at `http://localhost:3000`.

---

## Docker Deployment (Recommended)

To run the application with database using Docker, run:

```bash
docker-compose up --build -d
```

This launches:
- **PostgreSQL Database** running on port `5432`
- **Next.js App** running on port `3000`

---

## Deployment Guide (Production)

### Railway / Render / Vercel

1. **Database**: Spin up a managed PostgreSQL database.
2. **Environment Variables**: Add all `.env` parameters in the deployment service config.
3. **Build Command**: Set the build command to:
   ```bash
   npx prisma generate && npx prisma db push && npm run build
   ```
4. **Start Command**:
   ```bash
   npm start
   ```
