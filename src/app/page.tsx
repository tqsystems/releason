import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="flex flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Headline - WHITE like LaunchDarkly */}
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Releason
          </h1>

          {/* Tagline - White, prominent */}
          <p className="mt-6 text-xl font-medium text-white sm:text-2xl">
            Ship confident. Ship informed.
          </p>

          {/* Value prop - Light gray with green accent */}
          <p className="mt-4 text-lg text-slate-400 sm:text-xl">
            Not zero risk.{" "}
            <span className="font-semibold text-green-400">Acceptable risk.</span>{" "}
            Know the difference before you deploy.
          </p>

          {/* Social proof - like LaunchDarkly */}
          <p className="mt-8 text-sm text-slate-500">
            Trusted by engineering teams who ship with confidence
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-sm transition-all hover:bg-slate-100"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/blog/release-confidence"
                  className="inline-flex items-center justify-center text-base font-medium text-white transition-colors hover:text-slate-300"
                >
                  Read the blog
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-sm transition-all hover:bg-slate-100"
                >
                  Get a Demo
                </Link>
                <Link
                  href="/blog/release-confidence"
                  className="inline-flex items-center justify-center text-base font-medium text-white transition-colors hover:text-slate-300"
                >
                  Learn more
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature Cards - Cleaner, more contrast */}
        <div className="mx-auto mt-24 max-w-5xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 - Test Coverage */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <svg
                  className="h-6 w-6 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Test Coverage
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Track coverage across features and identify gaps before they
                become issues.
              </p>
            </div>

            {/* Card 2 - Risk Analysis */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
                <svg
                  className="h-6 w-6 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Risk Analysis
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Get real-time insights into potential risks and their impact on
                your release.
              </p>
            </div>

            {/* Card 3 - Ship Faster */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 sm:col-span-2 lg:col-span-1">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                <svg
                  className="h-6 w-6 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Ship Faster
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Make confident decisions and reduce time to production with
                data-driven insights.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA - Like LaunchDarkly */}
        <div className="mx-auto mt-24 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Start shipping with confidence.
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-sm transition-all hover:bg-slate-100"
            >
              Get a Demo
            </Link>
            <a
              href="https://github.com/tqsystems/releason"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-base font-medium text-white transition-colors hover:text-slate-300"
            >
              View on GitHub
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm text-slate-500">
            © 2026 Releason. Built by TQ Systems.
          </p>
        </div>
      </footer>
    </div>
  );
}