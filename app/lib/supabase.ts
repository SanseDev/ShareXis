import { createClient } from '@supabase/supabase-js'

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

export async function saveBetaSignup(email: string) {
  try {
    console.log('Attempting to save email:', email)
    
    const { data, error } = await supabase
      .from('beta_signups')
      .insert([{ email }])
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('Success! Data:', data)
    return { success: true }
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