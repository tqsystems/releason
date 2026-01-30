-- ============================================================================
-- Zuranis Database Schema
-- Release Confidence Intelligence Platform
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- Stores GitHub authenticated users
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  github_id TEXT UNIQUE NOT NULL,
  github_username TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast GitHub ID lookups
CREATE INDEX idx_users_github_id ON users(github_id);
CREATE INDEX idx_users_github_username ON users(github_username);

-- ============================================================================
-- REPOSITORIES TABLE
-- Tracks repositories being monitored
-- ============================================================================
CREATE TABLE IF NOT EXISTS repositories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  repo_id TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  owner TEXT NOT NULL,
  full_name TEXT NOT NULL, -- e.g., "owner/repo"
  default_branch TEXT DEFAULT 'main',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(repo_id)
);

-- Indexes for fast queries
CREATE INDEX idx_repositories_user_id ON repositories(user_id);
CREATE INDEX idx_repositories_repo_id ON repositories(repo_id);
CREATE INDEX idx_repositories_owner ON repositories(owner);
CREATE INDEX idx_repositories_is_active ON repositories(is_active);

-- ============================================================================
-- RELEASES TABLE
-- Stores release data and metrics from GitHub Actions
-- ============================================================================
CREATE TABLE IF NOT EXISTS releases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repo_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  
  -- Release Information
  release_number TEXT NOT NULL,
  commit_sha TEXT,
  branch TEXT,
  workflow_run_id TEXT,
  
  -- Coverage Metrics
  coverage_percent DECIMAL(5,2) NOT NULL CHECK (coverage_percent >= 0 AND coverage_percent <= 100),
  pass_count INTEGER NOT NULL DEFAULT 0,
  fail_count INTEGER NOT NULL DEFAULT 0,
  total_tests INTEGER GENERATED ALWAYS AS (pass_count + fail_count) STORED,
  
  -- Calculated Metrics
  risk_score DECIMAL(5,2) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  release_confidence DECIMAL(5,2) NOT NULL CHECK (release_confidence >= 0 AND release_confidence <= 100),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Critical', 'High', 'Medium', 'Low')),
  time_to_ship_minutes INTEGER NOT NULL DEFAULT 30,
  
  -- Feature Coverage (JSONB for flexible schema)
  features JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  raw_data JSONB, -- Store raw webhook/coverage data for debugging
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_releases_repo_id ON releases(repo_id);
CREATE INDEX idx_releases_created_at ON releases(created_at DESC);
CREATE INDEX idx_releases_release_number ON releases(release_number);
CREATE INDEX idx_releases_risk_level ON releases(risk_level);
CREATE INDEX idx_releases_workflow_run_id ON releases(workflow_run_id);

-- Composite index for common queries
CREATE INDEX idx_releases_repo_created ON releases(repo_id, created_at DESC);

-- ============================================================================
-- RISK_ITEMS TABLE
-- Stores individual risk items identified for each release
-- ============================================================================
CREATE TABLE IF NOT EXISTS risk_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  
  -- Risk Information
  risk_name TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('High', 'Medium', 'Low', 'Info')),
  severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 10),
  description TEXT NOT NULL,
  
  -- Optional fields
  affected_feature TEXT,
  recommendation TEXT,
  auto_generated BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_risk_items_release_id ON risk_items(release_id);
CREATE INDEX idx_risk_items_risk_level ON risk_items(risk_level);
CREATE INDEX idx_risk_items_severity ON risk_items(severity DESC);

-- Composite index for common queries
CREATE INDEX idx_risk_items_release_severity ON risk_items(release_id, severity DESC);

-- ============================================================================
-- WEBHOOK_LOGS TABLE (Optional but recommended for debugging)
-- Tracks webhook deliveries for troubleshooting
-- ============================================================================
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Webhook Information
  event_type TEXT NOT NULL,
  delivery_id TEXT,
  signature TEXT,
  
  -- Request Data
  payload JSONB NOT NULL,
  headers JSONB,
  
  -- Processing
  processed BOOLEAN DEFAULT false,
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  release_id UUID REFERENCES releases(id) ON DELETE SET NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at DESC);
CREATE INDEX idx_webhook_logs_event_type ON webhook_logs(event_type);
CREATE INDEX idx_webhook_logs_processed ON webhook_logs(processed);
CREATE INDEX idx_webhook_logs_delivery_id ON webhook_logs(delivery_id);

-- ============================================================================
-- FUNCTIONS
-- Automatically update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_repositories_updated_at
  BEFORE UPDATE ON repositories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_releases_updated_at
  BEFORE UPDATE ON releases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risk_items_updated_at
  BEFORE UPDATE ON risk_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS for all tables
-- ============================================================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY users_read_own
  ON users FOR SELECT
  USING (auth.uid()::text = github_id);

-- Users can update their own data
CREATE POLICY users_update_own
  ON users FOR UPDATE
  USING (auth.uid()::text = github_id);

-- Users can read their own repositories
CREATE POLICY repositories_read_own
  ON repositories FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE github_id = auth.uid()::text));

-- Users can manage their own repositories
CREATE POLICY repositories_manage_own
  ON repositories FOR ALL
  USING (user_id IN (SELECT id FROM users WHERE github_id = auth.uid()::text));

-- Users can read releases for their repositories
CREATE POLICY releases_read_own
  ON releases FOR SELECT
  USING (repo_id IN (
    SELECT r.id FROM repositories r
    JOIN users u ON r.user_id = u.id
    WHERE u.github_id = auth.uid()::text
  ));

-- Users can read risk items for their releases
CREATE POLICY risk_items_read_own
  ON risk_items FOR SELECT
  USING (release_id IN (
    SELECT rel.id FROM releases rel
    JOIN repositories repo ON rel.repo_id = repo.id
    JOIN users u ON repo.user_id = u.id
    WHERE u.github_id = auth.uid()::text
  ));

-- Service role can do everything (for webhook endpoint)
CREATE POLICY service_role_all_users
  ON users FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY service_role_all_repositories
  ON repositories FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY service_role_all_releases
  ON releases FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY service_role_all_risk_items
  ON risk_items FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY service_role_all_webhook_logs
  ON webhook_logs FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- VIEWS
-- Convenient views for common queries
-- ============================================================================

-- Latest release per repository
CREATE OR REPLACE VIEW latest_releases AS
SELECT DISTINCT ON (repo_id)
  r.*,
  repo.repo_name,
  repo.owner,
  repo.full_name
FROM releases r
JOIN repositories repo ON r.repo_id = repo.id
ORDER BY repo_id, created_at DESC;

-- Release history with repository info
CREATE OR REPLACE VIEW releases_with_repo AS
SELECT 
  r.*,
  repo.repo_name,
  repo.owner,
  repo.full_name,
  repo.user_id
FROM releases r
JOIN repositories repo ON r.repo_id = repo.id;

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- Uncomment to insert sample data
-- ============================================================================

/*
-- Sample user
INSERT INTO users (github_id, github_username, email, avatar_url)
VALUES 
  ('123456', 'testuser', 'test@example.com', 'https://avatars.githubusercontent.com/u/123456')
ON CONFLICT (github_id) DO NOTHING;

-- Sample repository
INSERT INTO repositories (user_id, repo_id, repo_name, owner, full_name)
SELECT 
  id, 
  '789012', 
  'test-repo', 
  'testuser', 
  'testuser/test-repo'
FROM users WHERE github_username = 'testuser'
ON CONFLICT (repo_id) DO NOTHING;

-- Sample release
INSERT INTO releases (
  repo_id, 
  release_number, 
  coverage_percent, 
  pass_count, 
  fail_count, 
  risk_score, 
  release_confidence,
  risk_level,
  time_to_ship_minutes,
  features
)
SELECT 
  id,
  'v1.0.0',
  87.5,
  245,
  8,
  15.0,
  87.0,
  'Medium',
  150,
  '[
    {"name": "Authentication", "coverage": 98.5, "status": "excellent"},
    {"name": "API Routes", "coverage": 92.0, "status": "good"},
    {"name": "Dashboard", "coverage": 73.0, "status": "warning"}
  ]'::jsonb
FROM repositories WHERE repo_name = 'test-repo'
ON CONFLICT DO NOTHING;
*/

-- ============================================================================
-- INDEXES FOR FULL-TEXT SEARCH (Optional)
-- Uncomment if you need search functionality
-- ============================================================================

/*
CREATE INDEX idx_releases_features_gin ON releases USING GIN (features);
CREATE INDEX idx_releases_raw_data_gin ON releases USING GIN (raw_data);
*/

-- ============================================================================
-- GRANTS
-- Grant necessary permissions
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant access to tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Grant access to sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;

-- ============================================================================
-- COMPLETED
-- Schema creation complete
-- ============================================================================

-- Verify installation
SELECT 
  'Users: ' || COUNT(*) AS users_count
FROM users
UNION ALL
SELECT 
  'Repositories: ' || COUNT(*) AS repositories_count
FROM repositories
UNION ALL
SELECT 
  'Releases: ' || COUNT(*) AS releases_count
FROM releases
UNION ALL
SELECT 
  'Risk Items: ' || COUNT(*) AS risk_items_count
FROM risk_items;
