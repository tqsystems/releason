"use client";

import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-gray-900 px-4 py-3 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <FaGithub className="h-5 w-5" />
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
