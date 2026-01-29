import { requireAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ReleaseOverview } from "@/components/dashboard/ReleaseOverview";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { CoverageByFeature } from "@/components/dashboard/CoverageByFeature";
import { RiskSummary } from "@/components/dashboard/RiskSummary";

export const metadata = {
  title: "Dashboard - Zuranis",
  description: "Release Confidence Intelligence Dashboard",
};

export default async function DashboardPage() {
  // Require authentication - will redirect to sign-in if not authenticated
  const user = await requireAuth("/dashboard");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name || user.login || "User"}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Here&apos;s your release confidence overview
          </p>
        </div>

        {/* Release Overview - Large Hero Section */}
        <ReleaseOverview />

        {/* Metrics Grid - 4 Cards */}
        <MetricsGrid />

        {/* Two Column Layout for Coverage and Risk */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Coverage by Feature Table */}
          <CoverageByFeature />

          {/* Risk Summary */}
          <RiskSummary />
        </div>
      </div>
    </DashboardLayout>
  );
}
