import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
}

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error('NEXT_PUBLIC_SITE_URL is required')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      flowType: 'pkce',
      detectSessionInUrl: true
    }
  }
)

function generateReferralCode(email: string): string {
  // Prend les 6 premiers caractères de l'email (sans le domaine) et ajoute 4 caractères aléatoires
  const username = email.split('@')[0];
  const prefix = username.slice(0, 6).toLowerCase();
  const randomChars = Math.random().toString(36).substring(2, 6);
  return `${prefix}${randomChars}`;
}

export async function saveBetaSignup(email: string, referrerCode?: string) {
  try {
    console.log('Attempting to save email:', email)
    
    // Vérifier si l'email existe déjà
    const { data: existingUser } = await supabase
      .from('beta_signups')
      .select('email, is_verified')
      .eq('email', email)
      .single()

    if (existingUser) {
      if (existingUser.is_verified) {
        return {
          success: false,
          error: {
            message: 'Cet email est déjà inscrit à la bêta',
            code: 'EMAIL_EXISTS'
          }
        }
      } else {
        // Si l'email existe mais n'est pas vérifié, on renvoie un Magic Link
        const { error: signInError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/verify`,
            data: {
              referrerCode,
              type: 'verification'
            }
          }
        })

        if (signInError) {
          console.error('Magic Link error:', signInError)
          throw signInError
        }

        return {
          success: true,
          data: {
            message: 'Un nouveau lien de vérification a été envoyé à votre email'
          }
        }
      }
    }
    
    console.log('Creating new user signup')
    // Générer un code de parrainage unique pour le nouvel utilisateur
    const referralCode = generateReferralCode(email);
    
    // Préparer les données d'insertion
    const signupData = {
      email,
      referral_code: referralCode,
      is_verified: false,
      ...(referrerCode ? { referred_by: referrerCode } : {})
    };
    
    // Insérer le nouvel utilisateur non vérifié
    const { error: insertError } = await supabase
      .from('beta_signups')
      .insert([signupData])
      .select()
      .single()
    
    if (insertError) {
      console.error('Supabase insert error:', insertError)
      return {
        success: false,
        error: {
          message: 'Erreur lors de l\'inscription',
          code: insertError.code,
          details: insertError.message
        }
      }
    }

    // Envoyer le Magic Link
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/verify`,
        data: {
          referralCode,
          type: 'initial'
        }
      }
    })

    if (signInError) {
      console.error('Magic Link error:', signInError)
      throw signInError
    }

    return { 
      success: true,
      data: {
        message: 'Un email de vérification a été envoyé à votre adresse'
      }
    }
  } catch (error: unknown) {
    console.error('Detailed error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Détails non disponibles';
    const errorCode = (error as { code?: string }).code || 'UNKNOWN_ERROR';
    return { 
      success: false, 
      error: {
        message: 'Une erreur inattendue est survenue',
        code: errorCode,
        details: errorMessage
      }
    }
  }
}

export async function verifyEmail(email: string) {
  try {
    // Mettre à jour le statut de vérification
    const { error: updateError } = await supabase
      .from('beta_signups')
      .update({ is_verified: true })
      .eq('email', email)

    if (updateError) {
      throw updateError
    }

    // Récupérer les informations de l'utilisateur
    const { data: user } = await supabase
      .from('beta_signups')
      .select('referral_code, referred_by')
      .eq('email', email)
      .single()

    // Si l'utilisateur a été parrainé, mettre à jour le compteur du parrain
    if (user?.referred_by) {
      const { data: referrer } = await supabase
        .from('beta_signups')
        .select('referral_count, pro_months_earned')
        .eq('referral_code', user.referred_by)
        .single()

      if (referrer) {
        const newReferralCount = (referrer.referral_count || 0) + 1
        const newProMonths = newReferralCount >= 3 ? 
          (referrer.pro_months_earned || 0) + 1 : 
          (referrer.pro_months_earned || 0)

        await supabase
          .from('beta_signups')
          .update({ 
            referral_count: newReferralCount,
            pro_months_earned: newProMonths
          })
          .eq('referral_code', user.referred_by)
      }
    }

    // Retourner le lien de parrainage pour l'afficher à l'utilisateur
    return {
      success: true,
      data: {
        referralCode: user?.referral_code,
        referralLink: user?.referral_code ? 
          `${process.env.NEXT_PUBLIC_SITE_URL}/?ref=${user.referral_code}` : 
          undefined
      }
    }
  } catch (error: unknown) {
    console.error('Verification error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    const errorCode = (error as { code?: string }).code || 'VERIFICATION_ERROR';
    return {
      success: false,
      error: {
        message: 'Erreur lors de la vérification de l\'email',
        code: errorCode,
        details: errorMessage
      }
    }
  }
} 