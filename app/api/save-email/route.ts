import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Initialisation lazy du client Supabase
let supabaseClient: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('🔧 Supabase URL:', supabaseUrl ? 'configuré' : 'manquant')
  console.log('🔧 Supabase Key:', supabaseKey ? 'configuré' : 'manquant')
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase non configuré - vérifiez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local')
    return null
  }
  
  supabaseClient = createClient(supabaseUrl, supabaseKey)
  return supabaseClient
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    // Récupérer le client Supabase
    const supabase = getSupabaseClient()

    // Si Supabase est configuré, sauvegarder dans la base
    if (supabase) {
      console.log('📤 Tentative d\'insertion dans Supabase...')
      
      const { data, error: insertError } = await supabase
        .from('emails')
        .insert([
          {
            email,
            created_at: new Date().toISOString()
          }
        ])
        .select()

      if (insertError) {
        console.error('❌ Erreur Supabase:', insertError.message, insertError.code)
        
        // Messages d'erreur plus clairs
        if (insertError.code === '42P01') {
          console.error('❌ La table "emails" n\'existe pas. Exécutez le script SQL dans Supabase.')
        } else if (insertError.code === '42501') {
          console.error('❌ Permissions insuffisantes. Vérifiez les RLS policies.')
        } else if (insertError.message?.includes('JWT')) {
          console.error('❌ Problème d\'authentification. Vérifiez SUPABASE_SERVICE_ROLE_KEY.')
        }
      } else {
        console.log('✅ Email enregistré dans Supabase:', email)
        console.log('📊 Données insérées:', data)
      }
    } else {
      // Fallback : log l'email
      console.log('📧 Email reçu (non stocké):', email)
      console.log('💡 Pour stocker les emails, configurez Supabase dans .env.local:')
      console.log('   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co')
      console.log('   SUPABASE_SERVICE_ROLE_KEY=eyJhbG...')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Erreur générale:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
