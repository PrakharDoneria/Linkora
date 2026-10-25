# Linkora

Linkora is a polished URL shortener built with React, Vite, Tailwind CSS, shadcn/ui, and Supabase. Create short links, manage them from a dashboard, track clicks, and redirect visitors reliably.

## Features

- Supabase email/password authentication
- Short URL creation with collision-safe database constraints
- Personal link dashboard with search, copy, delete, and click totals
- Public short-link redirects with click tracking
- Row Level Security so users can only manage their own links
- Responsive dark glassmorphism UI with reduced-motion support

## Requirements

- Node.js 18+
- A Supabase project

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   copy .env.example .env
   ```

3. Add your Supabase project URL and publishable key to `.env`:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-publishable-key
   ```

4. Run the database setup in the Supabase Dashboard:

   - Open **SQL Editor**.
   - Paste and run [`supabase/schema.sql`](./supabase/schema.sql).
   - Confirm that the `links` table and `resolve_link` / `increment_link_click` functions were created.

5. Start the development server:

   ```bash
   npm run dev
   ```

## Scripts

```bash
npm run dev       # Start Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build
npm run lint      # Run ESLint
```

## Project structure

```text
src/
  components/     Shared layout and UI components
  db/             Supabase client
  layouts/        Application shell
  lib/            Supabase data helpers
  pages/          Landing, auth, dashboard, detail, and redirect pages
supabase/
  schema.sql      Tables, RLS policies, and database functions
```

## Security notes

- `.env` is ignored and must never be committed.
- Only the publishable Supabase key belongs in the frontend.
- Never expose a Supabase service-role key in Vite client code.
- RLS policies protect dashboard reads, inserts, and deletes.
- Public redirects use the restricted `resolve_link` database function instead of exposing the whole table.