-- Create beta_signups table
CREATE TABLE IF NOT EXISTS beta_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email
CREATE INDEX IF NOT EXISTS idx_beta_signups_email ON beta_signups(email);

-- Add RLS (Row Level Security) policies
ALTER TABLE beta_signups ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anonymous users (no authentication required)
CREATE POLICY "Allow public inserts" ON beta_signups
  FOR INSERT
  WITH CHECK (true);

-- Only allow admins to view the data
CREATE POLICY "Allow admin select" ON beta_signups
  FOR SELECT
  USING (auth.role() = 'admin'); 