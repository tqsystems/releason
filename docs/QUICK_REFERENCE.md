# Quick Reference Guide

A quick reference for common tasks and patterns in this Next.js 14 project.

## Project Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000
npm run build            # Create production build
npm run start            # Start production server
npm run lint             # Run ESLint

# Dependencies
npm install              # Install all dependencies
npm install <package>    # Add new package
```

## File Structure Quick Reference

```
src/
├── app/                 # Pages and routing (App Router)
│   ├── layout.tsx       # Root layout (wraps all pages)
│   ├── page.tsx         # Home page (/)
│   ├── api/             # API routes
│   │   └── auth/        # NextAuth API endpoints
│   └── auth/            # Auth pages
│       └── signin/      # Sign-in page
├── components/          # React components
│   ├── AuthProvider.tsx # NextAuth session provider
│   └── Header.tsx       # Header with auth status
└── lib/                 # Utilities and configurations
    ├── auth-options.ts  # NextAuth configuration
    ├── auth.ts          # Auth helper functions
    ├── supabase.ts      # Supabase client (client-side)
    ├── supabase-server.ts # Supabase client (server-side)
    └── utils.ts         # Utility functions
```

## Authentication

### Check if user is signed in (Client Component)

```tsx
"use client";
import { useSession } from "next-auth/react";

export function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not signed in</div>;
  
  return <div>Hello {session.user?.name}!</div>;
}
```

### Check if user is signed in (Server Component)

```tsx
import { getCurrentUser } from "@/lib/auth";

export default async function MyPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return <div>Not signed in</div>;
  }
  
  return <div>Hello {user.name}!</div>;
}
```

### Sign In / Sign Out

```tsx
"use client";
import { signIn, signOut } from "next-auth/react";

// Sign in
<button onClick={() => signIn("github")}>Sign in with GitHub</button>

// Sign out
<button onClick={() => signOut()}>Sign out</button>
```

## Routing

### Creating Pages

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return <div>About Page</div>;
}
// Route: /about
```

### Dynamic Routes

```tsx
// src/app/posts/[id]/page.tsx
export default function PostPage({ params }: { params: { id: string } }) {
  return <div>Post ID: {params.id}</div>;
}
// Routes: /posts/1, /posts/2, etc.
```

### API Routes

```tsx
// src/app/api/hello/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello World" });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

## Supabase

### Client-Side Query

```tsx
"use client";
import { supabase } from "@/lib/supabase";

const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .eq("column", "value");
```

### Server-Side Query

```tsx
import { supabaseServer } from "@/lib/supabase-server";

const { data, error } = await supabaseServer
  .from("table_name")
  .select("*");
```

## Styling with Tailwind

### Common Classes

```tsx
// Layout
<div className="flex items-center justify-center">
<div className="grid grid-cols-3 gap-4">

// Spacing
<div className="p-4 m-2">        // padding: 1rem, margin: 0.5rem
<div className="px-8 py-4">      // horizontal & vertical padding

// Colors
<div className="bg-blue-500 text-white">
<div className="bg-gray-100 text-gray-900">

// Typography
<h1 className="text-4xl font-bold">
<p className="text-sm text-gray-600">

// Responsive
<div className="w-full md:w-1/2 lg:w-1/3">
```

## Environment Variables

### Access in Client Components

```tsx
// Must start with NEXT_PUBLIC_
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

### Access in Server Components/API Routes

```tsx
// Any environment variable
const secret = process.env.NEXTAUTH_SECRET;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
```

## Common Patterns

### Protected Page (Server Component)

```tsx
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/signin");
  }
  
  return <div>Protected Content</div>;
}
```

### Protected API Route

```tsx
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  return NextResponse.json({ data: "Protected data" });
}
```

### Loading State

```tsx
// app/loading.tsx (shown while page loads)
export default function Loading() {
  return <div>Loading...</div>;
}
```

### Error Handling

```tsx
// app/error.tsx (shown when error occurs)
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## TypeScript Tips

### Type Props

```tsx
interface MyComponentProps {
  title: string;
  count?: number;  // optional
}

export function MyComponent({ title, count = 0 }: MyComponentProps) {
  return <div>{title}: {count}</div>;
}
```

### Type State

```tsx
import { useState } from "react";

interface User {
  id: string;
  name: string;
}

const [user, setUser] = useState<User | null>(null);
```

## Helpful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
