import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
)

function generateReferralCode(email: string): string {
  const hash = createHash('sha256')
    .update(email + process.env.NEXT_PUBLIC_REFERRAL_SALT)
    .digest('hex')
  return hash.slice(0, 8)
}

export async function saveBetaSignup(email: string, referredBy?: string) {
  try {
    console.log('Attempting to save email:', email)
    
    // Generate unique referral code
    const referralCode = generateReferralCode(email)
    
    // Insert new user
    const { data: newSignup, error: insertError } = await supabase
      .from('beta_signups')
      .insert([{ 
        email,
        referral_code: referralCode,
        referred_by: referredBy
      }])
      .select()
    
    if (insertError) {
      console.error('Supabase insert error:', insertError)
      throw insertError
    }

    // If user was referred, update referrer's counter
    if (referredBy) {
      const { data: referrer, error: referrerError } = await supabase
        .rpc('increment_referral_count', {
          referrer_code: referredBy
        })

      if (referrerError) {
        console.error('Error updating referrer:', referrerError)
        // Don't block registration if referrer update fails
      }
    }

    console.log('Success! Data:', newSignup)
    return { 
      success: true,
      referralCode,
      isReferred: !!referredBy
    }
  } catch (error: any) {
    console.error('Detailed error:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      error
    })
    return { 
      success: false, 
      error: {
        message: error.message || 'An error occurred while saving your registration',
        code: error.code,
        details: error.details
      }
    }
  }
} 