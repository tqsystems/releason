# ZURANIS Database Schema

## Tables

### users
- id (UUID, primary)
- email (string)
- github_id (integer)
- github_username (string)
- created_at (timestamp)

### repositories
- id (UUID, primary)
- user_id (UUID, foreign)
- repo_name (string)
- owner (string)
- created_at (timestamp)

### releases
- id (UUID, primary)
- repo_id (UUID, foreign)
- release_number (string)
- coverage_percent (float)
- pass_count (integer)
- fail_count (integer)
- created_at (timestamp)

### features
- id (UUID, primary)
- release_id (UUID, foreign)
- feature_name (string)
- coverage_percent (float)
