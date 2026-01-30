import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAllReleases, getOrCreateUser, countUserReleases } from "@/lib/supabase-server";
import type { ReleasesListResponse } from "@/types/releases";

// Default pagination
const DEFAULT_LIMIT = 20;
const DEFAULT_PAGE = 1;

/**
 * GET /api/releases
 * 
 * Fetch paginated list of releases for authenticated user
 * 
 * Query params:
 * - limit: Number of releases per page (default: 20, max: 100)
 * - page: Page number (default: 1)
 * 
 * Returns:
 * - releases: Array of release objects
 * - pagination: Pagination info
 * - trend: Coverage trend analysis
 * 
 * Auth: Required
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      parseInt(searchParams.get("limit") || DEFAULT_LIMIT.toString()),
      100 // Max 100 items per page
    );
    const page = Math.max(
      parseInt(searchParams.get("page") || DEFAULT_PAGE.toString()),
      1
    );
    const offset = (page - 1) * limit;

    console.log(`[API] Fetching releases for user ${session.user.email} (page ${page}, limit ${limit})`);

    // Get or create user
    const user = await getOrCreateUser(
      session.user.id,
      session.user.login || session.user.name || "unknown",
      session.user.email || undefined,
      session.user.image || undefined
    );

    // Fetch releases
    const releases = await getAllReleases(user.id, limit, offset);
    
    // Get total count
    const total = await countUserReleases(user.id);

    // Calculate if there are more pages
    const hasMore = offset + releases.length < total;

    // Calculate coverage trend
    let trend: ReleasesListResponse["trend"] = {
      direction: "stable",
      change: 0,
    };

    if (releases.length >= 2) {
      const latest = releases[0].coverage_percent;
      const previous = releases[1].coverage_percent;
      const change = latest - previous;

      if (Math.abs(change) < 1) {
        trend.direction = "stable";
      } else if (change > 0) {
        trend.direction = "up";
      } else {
        trend.direction = "down";
      }

      trend.change = Math.round(change * 100) / 100;
    }

    const response: ReleasesListResponse = {
      releases,
      pagination: {
        total,
        page,
        limit,
        hasMore,
      },
      trend,
    };

    console.log(`[API] Returning ${releases.length} releases (total: ${total})`);

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate", // 5 minutes
      },
    });

  } catch (error) {
    console.error("[API] Error fetching releases:", error);
    
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
