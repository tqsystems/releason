/**
 * Type definitions for Release Confidence Intelligence Platform
 */

/**
 * Feature coverage data structure
 */
export interface FeatureCoverage {
  /** Feature or module name */
  name: string;
  /** Coverage percentage (0-100) */
  coverage: number;
  /** Status indicator */
  status: "excellent" | "good" | "warning" | "danger";
  /** Number of tests */
  testCount?: number;
  /** Lines covered */
  linesCovered?: number;
  /** Total lines */
  totalLines?: number;
}

/**
 * Release data from database
 */
export interface Release {
  /** Unique release ID */
  id: string;
  /** Repository ID (FK) */
  repo_id: string;
  
  /** Release information */
  release_number: string;
  commit_sha?: string;
  branch?: string;
  workflow_run_id?: string;
  
  /** Coverage metrics */
  coverage_percent: number;
  pass_count: number;
  fail_count: number;
  total_tests?: number;
  
  /** Calculated metrics */
  risk_score: number;
  release_confidence: number;
  risk_level: "Critical" | "High" | "Medium" | "Low";
  time_to_ship_minutes: number;
  
  /** Feature breakdown */
  features: FeatureCoverage[];
  
  /** Raw data for debugging */
  raw_data?: Record<string, any>;
  
  /** Timestamps */
  created_at: string;
  updated_at: string;
  
  /** Optional repository info (from joins) */
  repo_name?: string;
  owner?: string;
  full_name?: string;
}

/**
 * Risk item associated with a release
 */
export interface RiskItem {
  /** Unique risk ID */
  id: string;
  /** Release ID (FK) */
  release_id: string;
  
  /** Risk details */
  risk_name: string;
  risk_level: "High" | "Medium" | "Low" | "Info";
  severity: number; // 1-10
  description: string;
  
  /** Optional fields */
  affected_feature?: string;
  recommendation?: string;
  auto_generated: boolean;
  
  /** Timestamps */
  created_at: string;
  updated_at: string;
}

/**
 * Release metrics for dashboard display
 */
export interface ReleaseMetrics {
  /** Release confidence score (0-100) */
  releaseConfidence: number;
  /** Test coverage percentage (0-100) */
  testCoverage: number;
  /** Risk level */
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  /** Time to ship (formatted string) */
  timeToShip: string;
  /** Pass rate percentage */
  passRate?: number;
  /** Total tests */
  totalTests?: number;
  /** Failed tests */
  failedTests?: number;
}

/**
 * Coverage data from GitHub Actions artifact
 */
export interface CoverageData {
  /** Overall coverage percentage */
  total: number;
  /** Lines coverage */
  lines?: {
    total: number;
    covered: number;
    skipped: number;
    pct: number;
  };
  /** Statements coverage */
  statements?: {
    total: number;
    covered: number;
    skipped: number;
    pct: number;
  };
  /** Functions coverage */
  functions?: {
    total: number;
    covered: number;
    skipped: number;
    pct: number;
  };
  /** Branches coverage */
  branches?: {
    total: number;
    covered: number;
    skipped: number;
    pct: number;
  };
  /** Per-file coverage */
  files?: Record<string, {
    lines: { pct: number };
    statements: { pct: number };
    functions: { pct: number };
    branches: { pct: number };
  }>;
  /** Feature-level coverage */
  features?: FeatureCoverage[];
}

/**
 * Test results from GitHub Actions
 */
export interface TestResults {
  /** Total tests run */
  total: number;
  /** Passed tests */
  passed: number;
  /** Failed tests */
  failed: number;
  /** Skipped tests */
  skipped: number;
  /** Duration in milliseconds */
  duration?: number;
  /** Per-suite results */
  suites?: Array<{
    name: string;
    tests: number;
    passed: number;
    failed: number;
  }>;
}

/**
 * GitHub Actions workflow run
 */
export interface WorkflowRun {
  /** Workflow run ID */
  id: number;
  /** Run number */
  run_number: number;
  /** Status */
  status: "queued" | "in_progress" | "completed";
  /** Conclusion */
  conclusion: "success" | "failure" | "cancelled" | "skipped" | null;
  /** Workflow ID */
  workflow_id: number;
  /** Head branch */
  head_branch: string;
  /** Head SHA */
  head_sha: string;
  /** Created at */
  created_at: string;
  /** Updated at */
  updated_at: string;
  /** Repository */
  repository: {
    id: number;
    name: string;
    full_name: string;
    owner: {
      login: string;
    };
  };
}

/**
 * GitHub webhook payload for workflow_run event
 */
export interface GitHubWebhookPayload {
  /** Event action */
  action: "requested" | "completed" | "in_progress";
  /** Workflow run data */
  workflow_run: WorkflowRun;
  /** Repository data */
  repository: {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    owner: {
      login: string;
      id: number;
    };
    private: boolean;
  };
  /** Sender */
  sender: {
    login: string;
    id: number;
  };
}

/**
 * Custom webhook payload with coverage data
 * This is what your GitHub Action should send
 */
export interface CoverageWebhookPayload {
  /** Repository information */
  repository: {
    id: number;
    name: string;
    owner: string;
    full_name: string;
  };
  /** Release information */
  release: {
    number: string;
    commit_sha: string;
    branch: string;
    workflow_run_id: string;
  };
  /** Coverage data */
  coverage: CoverageData;
  /** Test results */
  tests: TestResults;
  /** Optional features breakdown */
  features?: FeatureCoverage[];
  /** Timestamp */
  timestamp: string;
}

/**
 * Repository data
 */
export interface Repository {
  /** Unique repository ID */
  id: string;
  /** User ID (owner) */
  user_id: string;
  /** GitHub repository ID */
  repo_id: string;
  /** Repository name */
  repo_name: string;
  /** Owner username */
  owner: string;
  /** Full repository name (owner/repo) */
  full_name: string;
  /** Default branch */
  default_branch: string;
  /** Is repository active */
  is_active: boolean;
  /** Timestamps */
  created_at: string;
  updated_at: string;
}

/**
 * User data
 */
export interface User {
  /** Unique user ID */
  id: string;
  /** GitHub user ID */
  github_id: string;
  /** GitHub username */
  github_username: string;
  /** Email address */
  email?: string;
  /** Avatar URL */
  avatar_url?: string;
  /** Timestamps */
  created_at: string;
  updated_at: string;
}

/**
 * API response for latest release
 */
export interface LatestReleaseResponse {
  /** Release data */
  release: Release;
  /** Associated risk items */
  risks: RiskItem[];
  /** Formatted metrics */
  metrics: ReleaseMetrics;
}

/**
 * API response for release list
 */
export interface ReleasesListResponse {
  /** List of releases */
  releases: Release[];
  /** Pagination info */
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
  /** Coverage trend */
  trend: {
    direction: "up" | "down" | "stable";
    change: number; // percentage change
  };
}

/**
 * API response for single release with details
 */
export interface ReleaseDetailResponse {
  /** Release data */
  release: Release;
  /** Associated risk items */
  risks: RiskItem[];
  /** Repository information */
  repository: Repository;
  /** Formatted metrics */
  metrics: ReleaseMetrics;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  /** Error message */
  error: string;
  /** Error code */
  code?: string;
  /** Additional details */
  details?: any;
}

/**
 * Webhook log entry
 */
export interface WebhookLog {
  /** Unique log ID */
  id: string;
  /** Event type */
  event_type: string;
  /** Delivery ID from GitHub */
  delivery_id?: string;
  /** Webhook signature */
  signature?: string;
  /** Request payload */
  payload: Record<string, any>;
  /** Request headers */
  headers?: Record<string, any>;
  /** Was processed */
  processed: boolean;
  /** Was successful */
  success: boolean;
  /** Error message if failed */
  error_message?: string;
  /** Created release ID */
  release_id?: string;
  /** Timestamp */
  created_at: string;
}
