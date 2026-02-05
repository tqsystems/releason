"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-white">
            Releason
          </span>
          <svg
            className="h-5 w-5 text-purple-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>

        {/* Right side - Single CTA */}
        <div className="flex items-center space-x-4">
          {session ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="hidden text-sm text-slate-300 sm:block">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-all hover:bg-slate-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition-all hover:bg-slate-100"
            >
              Get a Demo
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}