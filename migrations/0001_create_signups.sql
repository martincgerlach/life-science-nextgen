CREATE TABLE IF NOT EXISTS signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (
    role IN (
      'Student',
      'PhD',
      'Early-career professional',
      'Mid-stage professional',
      'Other'
    )
  ),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_signups_created_at ON signups (created_at);
