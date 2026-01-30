import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getLatestRelease, getRisks, getOrCreateUser } from "@/lib/supabase-server";
import type { LatestReleaseResponse, ReleaseMetrics } from "@/types/releases";
import { formatMinutesToTime } from "@/lib/github-utils";

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60; // seconds

/**
 * GET /api/releases/latest
 * 
 * Fetch the latest release for the authenticated user's repositories
 * 
 * Returns:
 * - release: Full release data
 * - risks: Array of risk items
 * - metrics: Formatted metrics for dashboard display
 * 
 * Auth: Required
 * Cache: 5 minutes
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log(`[API] Fetching latest release for user: ${session.user.email}`);

    // Get or create user in database
    const user = await getOrCreateUser(
      session.user.id,
      session.user.login || session.user.name || "unknown",
      session.user.email || undefined,
      session.user.image || undefined
    );

    // Fetch latest release
    const release = await getLatestRelease(user.id);

    if (!release) {
      console.log(`[API] No releases found for user: ${user.github_username}`);
      return NextResponse.json(
        {
          error: "No releases found",
          message: "No releases have been recorded yet. Push code with GitHub Actions to create your first release.",
        },
        { status: 404 }
      );
    }

    // Fetch associated risks
    const risks = await getRisks(release.id);

    // Format metrics
    const metrics: ReleaseMetrics = {
      releaseConfidence: release.release_confidence,
      testCoverage: release.coverage_percent,
      riskLevel: release.risk_level,
      timeToShip: formatMinutesToTime(release.time_to_ship_minutes),
      passRate: release.total_tests
        ? Math.round((release.pass_count / release.total_tests) * 100 * 100) / 100
        : 0,
      totalTests: release.total_tests || release.pass_count + release.fail_count,
      failedTests: release.fail_count,
    };

    const response: LatestReleaseResponse = {
      release,
      risks,
      metrics,
    };

    console.log(`[API] Returning release ${release.release_number} with ${risks.length} risks`);

    // Return with cache headers
    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate`,
      },
    });

  } catch (error) {
    console.error("[API] Error fetching latest release:", error);
    
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
