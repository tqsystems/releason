"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <h1 className="text-xl font-bold">Zuranis</h1>
        
        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
          ) : session ? (
            <>
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="text-sm">{session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
