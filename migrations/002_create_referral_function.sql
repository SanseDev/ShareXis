-- Function to increment referral count and handle rewards
CREATE OR REPLACE FUNCTION increment_referral_count(referrer_code TEXT)
RETURNS VOID AS $$
BEGIN
  -- Update referral count and earned PRO months
  UPDATE beta_signups
  SET 
    referral_count = referral_count + 1,
    pro_months_earned = CASE 
      WHEN (referral_count + 1) >= 3 AND (referral_count) < 3 THEN pro_months_earned + 1
      ELSE pro_months_earned
    END,
    updated_at = CURRENT_TIMESTAMP
  WHERE referral_code = referrer_code;
END;
$$ LANGUAGE plpgsql; 