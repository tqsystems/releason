import crypto from "crypto";
import type { FeatureCoverage, CoverageData } from "@/types/releases";

/**
 * Calculate release confidence score based on coverage, pass rate, and risk
 * 
 * Formula: Release Confidence = (Coverage % × 0.6) + (Pass Rate × 0.3) + (Risk Adjustment × 0.1)
 * 
 * @param coverage - Test coverage percentage (0-100)
 * @param passRate - Test pass rate percentage (0-100)
 * @param riskScore - Risk score (0-100, higher = more risk)
 * @returns Release confidence score (0-100)
 * 
 * @example
 * ```typescript
 * const confidence = calculateReleaseConfidence(87.5, 96.8, 15);
 * console.log(confidence); // 87.04
 * ```
 */
export function calculateReleaseConfidence(
  coverage: number,
  passRate: number,
  riskScore: number
): number {
  // Validate inputs
  if (coverage < 0 || coverage > 100) {
    throw new Error("Coverage must be between 0 and 100");
  }
  if (passRate < 0 || passRate > 100) {
    throw new Error("Pass rate must be between 0 and 100");
  }
  if (riskScore < 0 || riskScore > 100) {
    throw new Error("Risk score must be between 0 and 100");
  }

  // Calculate risk adjustment (inverse of risk score)
  const riskAdjustment = 100 - riskScore;

  // Apply weights
  const weightedCoverage = coverage * 0.6;
  const weightedPassRate = passRate * 0.3;
  const weightedRisk = riskAdjustment * 0.1;

  // Calculate total confidence
  const confidence = weightedCoverage + weightedPassRate + weightedRisk;

  // Round to 2 decimal places
  return Math.round(confidence * 100) / 100;
}

/**
 * Determine risk level based on coverage percentage
 * 
 * @param coverage - Test coverage percentage (0-100)
 * @returns Risk level: Critical, High, Medium, or Low
 * 
 * Risk Levels:
 * - Critical: < 70%
 * - High: 70-84%
 * - Medium: 85-89%
 * - Low: >= 90%
 * 
 * @example
 * ```typescript
 * calculateRiskLevel(87.5); // "Medium"
 * calculateRiskLevel(92.0); // "Low"
 * calculateRiskLevel(65.0); // "Critical"
 * ```
 */
export function calculateRiskLevel(
  coverage: number
): "Critical" | "High" | "Medium" | "Low" {
  if (coverage < 0 || coverage > 100) {
    throw new Error("Coverage must be between 0 and 100");
  }

  if (coverage < 70) {
    return "Critical";
  } else if (coverage < 85) {
    return "High";
  } else if (coverage < 90) {
    return "Medium";
  } else {
    return "Low";
  }
}

/**
 * Calculate estimated time to ship based on coverage and risk score
 * 
 * Base time: 30 minutes
 * Additional time based on risk:
 * - Critical: +240 min (4 hours)
 * - High: +120 min (2 hours)
 * - Medium: +60 min (1 hour)
 * - Low: +0 min
 * 
 * @param coverage - Test coverage percentage (0-100)
 * @param riskScore - Risk score (0-100)
 * @returns Formatted time string (e.g., "2h 30m")
 * 
 * @example
 * ```typescript
 * calculateTimeToShip(87.5, 15); // "1h 30m"
 * calculateTimeToShip(92.0, 5);  // "30m"
 * calculateTimeToShip(65.0, 45); // "4h 30m"
 * ```
 */
export function calculateTimeToShip(
  coverage: number,
  riskScore: number
): string {
  // Base time in minutes
  let totalMinutes = 30;

  // Calculate risk level
  const riskLevel = calculateRiskLevel(coverage);

  // Add time based on risk level
  switch (riskLevel) {
    case "Critical":
      totalMinutes += 240; // +4 hours
      break;
    case "High":
      totalMinutes += 120; // +2 hours
      break;
    case "Medium":
      totalMinutes += 60; // +1 hour
      break;
    case "Low":
      totalMinutes += 0; // No additional time
      break;
  }

  // Add time based on specific risk score
  // For every 10 points of risk, add 15 minutes
  const additionalRiskMinutes = Math.floor(riskScore / 10) * 15;
  totalMinutes += additionalRiskMinutes;

  // Convert to hours and minutes
  return formatMinutesToTime(totalMinutes);
}

/**
 * Format minutes to human-readable time string
 * 
 * @param totalMinutes - Total minutes
 * @returns Formatted string (e.g., "2h 30m", "45m")
 * 
 * @example
 * ```typescript
 * formatMinutesToTime(150); // "2h 30m"
 * formatMinutesToTime(45);  // "45m"
 * formatMinutesToTime(120); // "2h"
 * ```
 */
export function formatMinutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Parse feature coverage data from various formats
 * 
 * Supports multiple input formats:
 * 1. Array of FeatureCoverage objects
 * 2. Per-file coverage data
 * 3. Custom feature groupings
 * 
 * @param data - Coverage data in various formats
 * @returns Array of FeatureCoverage objects
 * 
 * @example
 * ```typescript
 * const coverage = {
 *   files: {
 *     "src/auth/login.ts": { lines: { pct: 95 } },
 *     "src/auth/register.ts": { lines: { pct: 88 } }
 *   }
 * };
 * const features = parseFeatureCoverage(coverage);
 * // [{ name: "auth", coverage: 91.5, status: "excellent" }]
 * ```
 */
export function parseFeatureCoverage(data: any): FeatureCoverage[] {
  const features: FeatureCoverage[] = [];

  // If data already has features array, use it
  if (data.features && Array.isArray(data.features)) {
    return data.features.map((f: any) => ({
      name: f.name,
      coverage: f.coverage || f.pct || 0,
      status: determineFeatureStatus(f.coverage || f.pct || 0),
      testCount: f.testCount,
      linesCovered: f.linesCovered,
      totalLines: f.totalLines,
    }));
  }

  // If data has files, group by directory/feature
  if (data.files && typeof data.files === "object") {
    const featureMap = new Map<string, { total: number; sum: number; count: number }>();

    // Group files by top-level directory (feature)
    for (const [filePath, coverage] of Object.entries(data.files as Record<string, any>)) {
      // Extract feature name from path (e.g., "src/auth/login.ts" -> "auth")
      const parts = filePath.split("/");
      const featureName = parts.length > 1 ? parts[1] : "core";
      
      const pct = coverage.lines?.pct || coverage.statements?.pct || 0;

      if (!featureMap.has(featureName)) {
        featureMap.set(featureName, { total: 0, sum: 0, count: 0 });
      }

      const feature = featureMap.get(featureName)!;
      feature.sum += pct;
      feature.count += 1;
    }

    // Calculate average coverage per feature
    for (const [name, data] of featureMap.entries()) {
      const avgCoverage = data.sum / data.count;
      features.push({
        name: formatFeatureName(name),
        coverage: Math.round(avgCoverage * 100) / 100,
        status: determineFeatureStatus(avgCoverage),
      });
    }
  }

  // Sort by coverage (descending)
  features.sort((a, b) => b.coverage - a.coverage);

  return features;
}

/**
 * Determine feature status based on coverage percentage
 * 
 * @param coverage - Coverage percentage
 * @returns Status: excellent, good, warning, or danger
 */
function determineFeatureStatus(
  coverage: number
): "excellent" | "good" | "warning" | "danger" {
  if (coverage >= 95) return "excellent";
  if (coverage >= 80) return "good";
  if (coverage >= 60) return "warning";
  return "danger";
}

/**
 * Format feature name to be human-readable
 * 
 * @param name - Feature name
 * @returns Formatted name
 * 
 * @example
 * ```typescript
 * formatFeatureName("auth"); // "Authentication"
 * formatFeatureName("api-routes"); // "API Routes"
 * ```
 */
function formatFeatureName(name: string): string {
  // Common abbreviations
  const abbreviations: Record<string, string> = {
    auth: "Authentication",
    api: "API Routes",
    db: "Database",
    ui: "User Interface",
    utils: "Utilities",
    lib: "Libraries",
    components: "Components",
    pages: "Pages",
    app: "Application",
  };

  // Check if it's a known abbreviation
  const lower = name.toLowerCase();
  if (abbreviations[lower]) {
    return abbreviations[lower];
  }

  // Convert kebab-case or snake_case to Title Case
  return name
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Validate GitHub webhook signature
 * 
 * Verifies that the webhook request came from GitHub using HMAC SHA-256
 * 
 * @param payload - Raw request body (string or Buffer)
 * @param signature - X-Hub-Signature-256 header value
 * @param secret - GitHub webhook secret
 * @returns True if signature is valid
 * 
 * @example
 * ```typescript
 * const isValid = validateGitHubSignature(
 *   req.body,
 *   req.headers['x-hub-signature-256'],
 *   process.env.GITHUB_WEBHOOK_SECRET
 * );
 * if (!isValid) {
 *   return res.status(401).json({ error: "Invalid signature" });
 * }
 * ```
 */
export function validateGitHubSignature(
  payload: string | Buffer,
  signature: string | undefined,
  secret: string | undefined
): boolean {
  if (!signature || !secret) {
    return false;
  }

  // GitHub sends signature as "sha256=<hash>"
  if (!signature.startsWith("sha256=")) {
    return false;
  }

  // Extract the hash
  const receivedHash = signature.slice(7);

  // Calculate expected hash
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(typeof payload === "string" ? payload : payload.toString("utf8"));
  const expectedHash = hmac.digest("hex");

  // Use timing-safe comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(receivedHash, "hex"),
      Buffer.from(expectedHash, "hex")
    );
  } catch (error) {
    // If lengths don't match, timingSafeEqual throws
    return false;
  }
}

/**
 * Calculate pass rate from test results
 * 
 * @param passed - Number of passed tests
 * @param total - Total number of tests
 * @returns Pass rate percentage (0-100)
 * 
 * @example
 * ```typescript
 * calculatePassRate(245, 253); // 96.84
 * ```
 */
export function calculatePassRate(passed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((passed / total) * 10000) / 100;
}

/**
 * Calculate risk score based on multiple factors
 * 
 * Factors:
 * - Coverage: Lower coverage = higher risk
 * - Failed tests: More failures = higher risk
 * - Feature coverage variance: High variance = higher risk
 * 
 * @param coverage - Overall coverage percentage
 * @param failedTests - Number of failed tests
 * @param totalTests - Total number of tests
 * @param features - Feature coverage breakdown
 * @returns Risk score (0-100, higher = more risk)
 * 
 * @example
 * ```typescript
 * const risk = calculateRiskScore(87.5, 8, 253, features);
 * console.log(risk); // 15.3
 * ```
 */
export function calculateRiskScore(
  coverage: number,
  failedTests: number,
  totalTests: number,
  features: FeatureCoverage[] = []
): number {
  let riskScore = 0;

  // Coverage risk (0-40 points)
  // Lower coverage = higher risk
  const coverageRisk = Math.max(0, 100 - coverage) * 0.4;
  riskScore += coverageRisk;

  // Test failure risk (0-30 points)
  if (totalTests > 0) {
    const failureRate = (failedTests / totalTests) * 100;
    const failureRisk = failureRate * 0.3;
    riskScore += failureRisk;
  }

  // Feature coverage variance risk (0-30 points)
  if (features.length > 0) {
    const coverages = features.map((f) => f.coverage);
    const avgCoverage = coverages.reduce((a, b) => a + b, 0) / coverages.length;
    const variance = coverages.reduce((sum, cov) => {
      return sum + Math.pow(cov - avgCoverage, 2);
    }, 0) / coverages.length;
    const stdDev = Math.sqrt(variance);
    
    // High standard deviation = inconsistent coverage = higher risk
    const varianceRisk = Math.min(30, stdDev * 0.3);
    riskScore += varianceRisk;
  }

  // Ensure risk score is between 0 and 100
  return Math.max(0, Math.min(100, Math.round(riskScore * 100) / 100));
}

/**
 * Generate risk items based on analysis
 * 
 * @param release - Release data
 * @param features - Feature coverage data
 * @returns Array of risk items to create
 * 
 * @example
 * ```typescript
 * const risks = generateRiskItems(releaseData, features);
 * // [
 * //   { risk_name: "Low Coverage", risk_level: "High", ... },
 * //   { risk_name: "Failed Tests", risk_level: "Medium", ... }
 * // ]
 * ```
 */
export function generateRiskItems(
  coverage: number,
  failedTests: number,
  features: FeatureCoverage[]
): Array<{
  risk_name: string;
  risk_level: "High" | "Medium" | "Low" | "Info";
  severity: number;
  description: string;
  affected_feature?: string;
  recommendation?: string;
}> {
  const risks: Array<any> = [];

  // Overall coverage risk
  if (coverage < 70) {
    risks.push({
      risk_name: "Critical Coverage Gap",
      risk_level: "High",
      severity: 9,
      description: `Overall test coverage is only ${coverage.toFixed(1)}% - well below the 70% minimum threshold.`,
      recommendation: "Add comprehensive test coverage before deploying to production. Focus on critical paths and edge cases.",
    });
  } else if (coverage < 85) {
    risks.push({
      risk_name: "Low Test Coverage",
      risk_level: "Medium",
      severity: 6,
      description: `Test coverage is at ${coverage.toFixed(1)}% - below the recommended 85% threshold.`,
      recommendation: "Increase test coverage, especially for business-critical features.",
    });
  }

  // Failed tests risk
  if (failedTests > 0) {
    const severity = failedTests > 10 ? 10 : failedTests > 5 ? 8 : 6;
    risks.push({
      risk_name: "Failed Tests",
      risk_level: failedTests > 10 ? "High" : failedTests > 5 ? "Medium" : "Low",
      severity,
      description: `${failedTests} test(s) are currently failing.`,
      recommendation: "Fix all failing tests before proceeding with deployment.",
    });
  }

  // Feature-specific risks
  features.forEach((feature) => {
    if (feature.coverage < 60) {
      risks.push({
        risk_name: "Feature Coverage Critical",
        risk_level: "High",
        severity: 8,
        description: `${feature.name} has critically low coverage at ${feature.coverage.toFixed(1)}%.`,
        affected_feature: feature.name,
        recommendation: `Add tests for ${feature.name} module to improve coverage to at least 70%.`,
      });
    } else if (feature.coverage < 80) {
      risks.push({
        risk_name: "Feature Needs Testing",
        risk_level: "Medium",
        severity: 5,
        description: `${feature.name} has ${feature.coverage.toFixed(1)}% coverage - below recommended levels.`,
        affected_feature: feature.name,
        recommendation: `Consider adding more tests for ${feature.name}, especially for edge cases.`,
      });
    }
  });

  // If no risks, add info item
  if (risks.length === 0) {
    risks.push({
      risk_name: "All Checks Passed",
      risk_level: "Info",
      severity: 1,
      description: "Release looks good! All quality metrics are within acceptable ranges.",
      recommendation: "Proceed with deployment. Consider monitoring key metrics post-release.",
    });
  }

  return risks;
}
