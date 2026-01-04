import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Initialisation lazy du client Supabase
let supabaseClient: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return null
  }
  
  supabaseClient = createClient(supabaseUrl, supabaseKey)
  return supabaseClient
}

export async function POST(request: NextRequest) {
  try {
    const { rating, comment, email } = await request.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Note invalide (1-5)' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()

    if (supabase) {
      const { error: insertError } = await supabase
        .from('feedback')
        .insert([
          {
            rating,
            comment: comment || '',
            email: email || '',
            created_at: new Date().toISOString()
          }
        ])

      if (insertError) {
        console.error('❌ Erreur Supabase feedback:', insertError.message)
        
        if (insertError.code === '42P01') {
          console.error('❌ La table "feedback" n\'existe pas. Exécutez le script SQL.')
        }
      } else {
        console.log('✅ Feedback enregistré:', { rating, comment: comment?.substring(0, 50) })
      }
    } else {
      console.log('📝 Feedback reçu (non stocké):', { rating, comment })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Erreur feedback:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

