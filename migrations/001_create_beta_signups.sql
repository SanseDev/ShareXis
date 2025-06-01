-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public inserts" ON beta_signups;
DROP POLICY IF EXISTS "Allow admin select" ON beta_signups;

-- Create beta_signups table
CREATE TABLE IF NOT EXISTS beta_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  referral_code TEXT UNIQUE,
  referred_by TEXT REFERENCES beta_signups(referral_code),
  referral_count INTEGER DEFAULT 0,
  pro_months_earned INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email and referral_code
CREATE INDEX IF NOT EXISTS idx_beta_signups_email ON beta_signups(email);
CREATE INDEX IF NOT EXISTS idx_beta_signups_referral_code ON beta_signups(referral_code);
CREATE INDEX IF NOT EXISTS idx_beta_signups_referred_by ON beta_signups(referred_by);

-- Add RLS (Row Level Security) policies
ALTER TABLE beta_signups ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anonymous users (no authentication required)
CREATE POLICY "Allow public inserts" ON beta_signups
  FOR INSERT
  WITH CHECK (true);

-- Allow updates for verified status
CREATE POLICY "Allow email verification" ON beta_signups
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Only allow admins to view all data
CREATE POLICY "Allow admin select" ON beta_signups
  FOR SELECT
  USING (auth.role() = 'admin');

-- Allow users to view their own data
CREATE POLICY "Allow own data select" ON beta_signups
  FOR SELECT
  USING (auth.jwt() ->> 'email' = email); 