# Architecture Overview

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js (GitHub OAuth)
- **Database**: Supabase
- **Deployment**: Vercel (recommended)

## Authentication Flow

1. User clicks "Sign in with GitHub" on `/auth/signin`
2. NextAuth redirects to GitHub OAuth
3. User authorizes the application
4. GitHub redirects back to `/api/auth/callback/github`
5. NextAuth creates a session and redirects to the home page
6. Session is stored in cookies and managed by NextAuth

## Database Integration

The application uses Supabase as the backend database. Two clients are configured:

- **Client-side** (`src/lib/supabase.ts`): Uses the anonymous key for client-side operations
- **Server-side** (`src/lib/supabase-server.ts`): Uses the service role key for server-side operations with elevated permissions

## Key Directories

### `/src/app`
Contains all pages and API routes using Next.js App Router:
- `layout.tsx`: Root layout with metadata and global providers
- `page.tsx`: Home page
- `api/auth/[...nextauth]/`: NextAuth API routes
- `auth/signin/`: Custom sign-in page

### `/src/components`
Reusable React components:
- `AuthProvider.tsx`: Client-side session provider

### `/src/lib`
Utility functions and configurations:
- `auth.ts`: Server-side authentication helpers
- `supabase.ts`: Client-side Supabase client
- `supabase-server.ts`: Server-side Supabase client

### `/public`
Static assets (images, fonts, etc.)

### `/docs`
Project documentation

## Environment Variables

All environment variables are documented in `.env.local.example`. Critical variables:

- `NEXTAUTH_SECRET`: Used to encrypt JWT tokens
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: GitHub OAuth credentials
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public Supabase credentials
- `SUPABASE_SERVICE_ROLE_KEY`: Server-only Supabase credential with elevated permissions

## Security Considerations

1. Never commit `.env.local` or `.env` files
2. The service role key should only be used server-side
3. NextAuth secret should be strong and unique
4. Row Level Security (RLS) should be enabled in Supabase
5. Always validate user input on the server side
